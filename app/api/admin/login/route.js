export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { parolTekshir, loginTekshir, sessionTokenYarat } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

  // 5 urinish / 15 daqiqa
  if (!checkRateLimit(`login:${ip}`, 5, 15 * 60 * 1000)) {
    return NextResponse.json({ xato: 'Juda ko\'p urinish. 15 daqiqadan so\'ng qayta urining.' }, { status: 429 })
  }

  const { login, parol } = await request.json()

  if (!login || !parol || !loginTekshir(login) || !parolTekshir(parol)) {
    return NextResponse.json({ xato: 'Login yoki parol noto\'g\'ri' }, { status: 401 })
  }

  const token = sessionTokenYarat()
  const response = NextResponse.json({ success: true })

  response.cookies.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 8, // 8 soat
    path: '/',
  })

  return response
}
