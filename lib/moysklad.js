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
    signal: AbortSignal.timeout(30_000),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    console.error(`MoySklad [${res.status}] ${path}: ${text.slice(0, 200)}`)
    throw new Error(`MoySklad [${res.status}] ${path}`)
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
  // href may contain "?expand=supplier" or other query params — strip them
  return href?.split('/').pop()?.split('?')[0]
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
// variantStokMap: Map<variantId, quantity> — stock bo'lsa, mavjudligi=true
export async function msMahsulotVariantlarOl(mahsulotId, variantStokMap = null) {
  try {
    const rows = await msGetAll(`/entity/variant`, `filter=productid=${mahsulotId}`)
    return rows
      .filter(v => !v.archived)
      .map(v => {
        const variantId = v.id || msIdOl(v.meta.href)
        // Reportda yo'q → mavjud deb hisobla. Reportda bor va <= 0 → yashir.
        const mavjudligi = !variantStokMap || !variantStokMap.has(variantId)
          ? true
          : variantStokMap.get(variantId) > 0
        return {
          msId: variantId,
          xususiyatlar: (v.characteristics || []).map(x => ({
            nom: x.name,
            qiymat: x.value,
          })),
          mavjudligi,
        }
      })
  } catch {
    return []
  }
}

// Barcha mahsulotlar va variantlar ostatkasini olish
// Returns: { productMap: Map<productId, qty>, variantMap: Map<variantId, qty> }
// - Varianti yo'q mahsulotlar → productMap da "product" type
// - Varianti bor mahsulotlar → variantMap da "variant" type (parent productda yo'q)
export async function msStokOl() {
  const rows = await msGetAll('/report/stock/all', 'groupBy=variant&stockMode=all')
  const productMap = new Map()
  const variantMap = new Map()
  for (const row of rows) {
    const id = msIdOl(row.meta?.href)
    if (!id) continue
    const qty = row.quantity ?? 0  // quantity = stock - reserve (haqiqiy dostupniy miqdor, rezervsiz)
    if (row.meta?.type === 'variant') {
      variantMap.set(id, qty)
    } else {
      productMap.set(id, qty)
    }
  }
  return { productMap, variantMap }
}

// Rasmni yuklab Supabase'ga saqlash
export async function msRasmniYuklash(downloadHref, supabase, fileName) {
  const res = await fetch(downloadHref, { headers: authHeader(), signal: AbortSignal.timeout(30_000) })
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
