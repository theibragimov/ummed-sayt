import { NextResponse } from 'next/server'
import { getAllMahsulotlar, createMahsulot } from '@/lib/db'

export async function GET() {
  const mahsulotlar = await getAllMahsulotlar()
  return NextResponse.json(mahsulotlar)
}

export async function POST(request) {
  const data = await request.json()
  const mahsulot = await createMahsulot(data)
  return NextResponse.json(mahsulot, { status: 201 })
}
