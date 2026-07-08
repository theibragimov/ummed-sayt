// Google Translate (norasmiy, bepul endpoint) orqali matn tarjimasi.
// MoySklad'dagi mahsulot/kategoriya nomlari ruscha keladi — shu yerda uz/en'ga tarjima qilinadi.

const cache = new Map()

export async function tarjimaQil(matn, maqsadTil, manbaTil = 'ru') {
  const toza = (matn || '').trim()
  if (!toza || maqsadTil === manbaTil) return matn

  const key = `${manbaTil}:${maqsadTil}:${toza}`
  if (cache.has(key)) return cache.get(key)

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${manbaTil}&tl=${maqsadTil}&dt=t&q=${encodeURIComponent(toza)}`
    const res = await fetch(url)
    if (!res.ok) return matn
    const data = await res.json()
    const natija = (data?.[0] || []).map(chunk => chunk?.[0] || '').join('')
    const result = natija || matn
    cache.set(key, result)
    return result
  } catch {
    return matn
  }
}
