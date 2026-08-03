import { NextResponse } from 'next/server'
import { getKategoriyalar, createKategoriya } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-auth'
import { checkRateLimit } from '@/lib/rate-limit'

// Diqqat: bu route endi so'rov sarlavhalarini (IP) o'qiydi, shuning uchun
// `revalidate` orqali statik keshlanmaydi — buning o'rniga explicit
// Cache-Control header CDN darajasida keshlashni ta'minlaydi (boshqa
// route'lardagi kabi), keshlash xatti-harakati o'zgarmaydi.
const CACHE = 'public, s-maxage=600, stale-while-revalidate=1200'

export async function GET(request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (!checkRateLimit(`kategoriyalar:${ip}`, 60, 60_000)) {
    return NextResponse.json({ error: 'Juda ko\'p so\'rov. Biroz kuting.' }, { status: 429 })
  }

  const data = await getKategoriyalar()
  return NextResponse.json(data, { headers: { 'Cache-Control': CACHE } })
}

export async function POST(request) {
  const authError = await requireAdmin()
  if (authError) return authError
  const data = await request.json()
  const kategoriya = await createKategoriya(data)
  return NextResponse.json(kategoriya, { status: 201 })
}
