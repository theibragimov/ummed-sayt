async function googleTranslate(text, from = 'uz', to = 'ru') {
  if (!text?.trim()) return ''
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, cache: 'no-store' })
    const data = await res.json()
    return data[0]?.map(item => item[0]).filter(Boolean).join('') || ''
  } catch {
    return ''
  }
}

/**
 * Ob'ekt maydonlarini o'zbekchadan ruscha tarjima qiladi
 * @param {Object} matnlar - tarjima qilinadigan maydonlar
 * @returns {Object} - tarjima qilingan maydonlar
 */
export async function tarjimaQil(matnlar = {}) {
  const natija = {}
  for (const [kalit, matn] of Object.entries(matnlar)) {
    natija[kalit] = matn ? await googleTranslate(matn) : ''
  }
  return natija
}
