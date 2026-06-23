const BASE = 'https://api.moysklad.ru/api/remap/1.2'

function authHeader() {
  return {
    Authorization: `Bearer ${process.env.MOYSKLAD_TOKEN}`,
    'Content-Type': 'application/json;charset=utf-8',
  }
}

async function msGet(path) {
  const res = await fetch(`${BASE}${path}`, {
    headers: authHeader(),
    cache: 'no-store',
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`MoySklad [${res.status}] ${path}: ${text.slice(0, 200)}`)
  }
  return res.json()
}

async function msGetAll(path, params = '') {
  const limit = 1000
  let offset = 0
  const rows = []
  while (true) {
    const sep = path.includes('?') ? '&' : '?'
    const data = await msGet(`${path}${sep}limit=${limit}&offset=${offset}${params ? '&' + params : ''}`)
    rows.push(...(data.rows || []))
    if (rows.length >= data.meta.size) break
    offset += limit
  }
  return rows
}

export async function msKategoriyalarOl() {
  return msGetAll('/entity/productfolder')
}

// Barcha mahsulotlar (to'liq sync)
export async function msMahsulotlarOl() {
  return msGetAll('/entity/product', 'expand=productFolder')
}

// Faqat yangilangan mahsulotlar (incremental sync)
// lastSyncAt — ISO string, masalan "2024-01-01 12:00:00"
export async function msYangilanganMahsulotlarOl(lastSyncAt) {
  const encoded = encodeURIComponent(lastSyncAt.replace('T', ' ').replace('Z', '').slice(0, 19))
  return msGetAll('/entity/product', `expand=productFolder&filter=updated%3E${encoded}`)
}

// Barcha mahsulot ID larini olish (o'chirilganlarni aniqlash uchun)
export async function msMahsulotIdlarOl() {
  const rows = await msGetAll('/entity/product', 'fields=id,archived,updated')
  return rows.map(p => ({
    id: msIdOl(p.meta.href),
    archived: p.archived || false,
  }))
}

export function msIdOl(href) {
  return href?.split('/').pop()
}

// Bitta mahsulot rasmlarini olish
export async function msMahsulotRasmlariOl(mahsulotId) {
  try {
    const data = await msGet(`/entity/product/${mahsulotId}/images?limit=10`)
    return data.rows || []
  } catch {
    return []
  }
}

// Mahsulot variantlarini (modifikatsiyalarini) olish
export async function msMahsulotVariantlarOl(mahsulotId) {
  try {
    const rows = await msGetAll(`/entity/variant`, `filter=productId%3D${mahsulotId}`)
    return rows
      .filter(v => !v.archived)
      .map(v => ({
        msId: msIdOl(v.meta.href),
        xususiyatlar: (v.characteristics || []).map(x => ({
          nom: x.name,
          qiymat: x.value,
        })),
        mavjudligi: true,
      }))
  } catch {
    return []
  }
}

// Barcha mahsulotlar ostatkasini olish: Map<msProductId, quantity>
export async function msStokOl() {
  const rows = await msGetAll('/report/stock/all', 'type=product&stockMode=all')
  const map = new Map()
  for (const row of rows) {
    const href = row.assortment?.meta?.href || row.meta?.href
    if (!href) continue
    const id = msIdOl(href)
    if (id) map.set(id, (row.quantity ?? row.stock ?? 0))
  }
  return map
}

// Rasmni yuklab Supabase'ga saqlash
export async function msRasmniYuklash(downloadHref, supabase, fileName) {
  const res = await fetch(downloadHref, { headers: authHeader() })
  if (!res.ok) throw new Error(`Rasm yuklanmadi: ${res.status}`)

  const contentType = res.headers.get('content-type') || 'image/jpeg'
  const ext = contentType.split('/')[1]?.split(';')[0] || 'jpg'
  const filePath = `moysklad/${fileName}.${ext}`
  const buffer = Buffer.from(await res.arrayBuffer())

  const { error } = await supabase.storage
    .from('ummed')
    .upload(filePath, buffer, { contentType, upsert: true })

  if (error) throw new Error(`Supabase upload: ${error.message}`)

  const { data } = supabase.storage.from('ummed').getPublicUrl(filePath)
  return data.publicUrl
}
