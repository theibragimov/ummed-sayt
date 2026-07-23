export const revalidate = 600
import { NextResponse } from 'next/server'
import { getAllTugmalar, createTugma } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET() {
  const data = await getAllTugmalar()
  return NextResponse.json(data)
}

export async function POST(request) {
  const authError = await requireAdmin()
  if (authError) return authError
  const data = await request.json()
  const tugma = await createTugma(data)
  return NextResponse.json(tugma, { status: 201 })
}
