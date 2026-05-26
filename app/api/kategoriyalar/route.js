import { NextResponse } from 'next/server'
import { getKategoriyalar, createKategoriya } from '@/lib/db'

export async function GET() {
  const data = await getKategoriyalar()
  return NextResponse.json(data)
}

export async function POST(request) {
  const data = await request.json()
  const kategoriya = await createKategoriya(data)
  return NextResponse.json(kategoriya, { status: 201 })
}
