export const revalidate = 600
import { NextResponse } from 'next/server'
import { getKategoriyalar, createKategoriya } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET() {
  const data = await getKategoriyalar()
  return NextResponse.json(data)
}

export async function POST(request) {
  const authError = await requireAdmin()
  if (authError) return authError
  const data = await request.json()
  const kategoriya = await createKategoriya(data)
  return NextResponse.json(kategoriya, { status: 201 })
}
