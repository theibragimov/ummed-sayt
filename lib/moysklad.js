const BASE = 'https://api.moysklad.ru/api/remap/1.2'

function authHeader() {
  return { Authorization: `Bearer ${process.env.MOYSKLAD_TOKEN}` }
}

async function msGet(path) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { ...authHeader(), 'Content-Type': 'application/json;charset=utf-8' },
    cache: 'no-store',
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`MoySklad [${res.status}] ${path}: ${text.slice(0, 200)}`)
  }
  return res.json()
}

// Barcha sahifalarni yuklab olish (pagination)
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

// Kategoriyalar (product folders)
export async function msKategoriyalarOl() {
  return msGetAll('/entity/productfolder')
}

// Mahsulotlar (productlar + productFolder expand)
export async function msMahsulotlarOl() {
  return msGetAll('/entity/product', 'expand=productFolder')
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

// Rasmni yuklab Supabase'ga saqlash
export async function msRasmniYuklash(downloadHref, supabase, fileName) {
  const res = await fetch(downloadHref, {
    headers: authHeader(),
  })
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
