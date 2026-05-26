import { NextResponse } from 'next/server'
import { parolTekshir, sessionTokenYarat } from '@/lib/auth'

export async function POST(request) {
  const { parol } = await request.json()

  if (!parolTekshir(parol)) {
    return NextResponse.json({ xato: 'Parol noto\'g\'ri' }, { status: 401 })
  }

  const token = sessionTokenYarat()
  const response = NextResponse.json({ success: true })

  response.cookies.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 kun
    path: '/',
  })

  return response
}
