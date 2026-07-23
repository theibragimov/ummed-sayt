export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getZayavkalar, createZayavka } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-auth'

// GET — faqat admin (mijozlar ma'lumotlari)
export async function GET(request) {
  const authError = await requireAdmin()
  if (authError) return authError
  const { searchParams } = new URL(request.url)
  const holat = searchParams.get('holat')
  const data = await getZayavkalar(holat ? { holat } : {})
  return NextResponse.json(data)
}

// POST — ommaviy (mijozlar zayavka yuboradi)
export async function POST(request) {
  const data = await request.json()
  const zayavka = await createZayavka(data)
  return NextResponse.json(zayavka, { status: 201 })
}
