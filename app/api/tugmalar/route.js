import { NextResponse } from 'next/server'
import { getAllTugmalar, createTugma } from '@/lib/db'

export async function GET() {
  const data = await getAllTugmalar()
  return NextResponse.json(data)
}

export async function POST(request) {
  const data = await request.json()
  const tugma = await createTugma(data)
  return NextResponse.json(tugma, { status: 201 })
}
