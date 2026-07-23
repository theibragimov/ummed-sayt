import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { sessionTokenTekshir } from './auth'

export async function requireAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  if (!sessionTokenTekshir(token)) {
    return NextResponse.json({ xato: 'Ruxsat yo\'q' }, { status: 401 })
  }
  return null
}
