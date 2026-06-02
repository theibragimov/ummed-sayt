import { NextResponse } from 'next/server'

async function googleTranslate(text, from = 'uz', to = 'ru') {
  if (!text?.trim()) return ''
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  const data = await res.json()
  // Natijani yig'ish
  return data[0]?.map(item => item[0]).filter(Boolean).join('') || ''
}

export async function POST(request) {
  try {
    const { matnlar } = await request.json()
    // matnlar: { nom, qisqaTavsif, toliqTavsif } yoki { sarlavha, qisqaTavsif, toliqMatn }

    const tarjimalar = {}
    for (const [kalit, matn] of Object.entries(matnlar)) {
      if (matn?.trim()) {
        tarjimalar[kalit] = await googleTranslate(matn)
      } else {
        tarjimalar[kalit] = ''
      }
    }

    return NextResponse.json({ tarjimalar })
  } catch (e) {
    console.error('Tarjima xatosi:', e)
    return NextResponse.json({ xato: e.message }, { status: 500 })
  }
}
