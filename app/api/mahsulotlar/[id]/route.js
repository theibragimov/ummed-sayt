import { NextResponse } from 'next/server'
import { getMahsulotById, updateMahsulot, deleteMahsulot } from '@/lib/db'

export async function GET(_, { params }) {
  const mahsulot = await getMahsulotById(params.id)
  if (!mahsulot) return NextResponse.json({ xato: 'Topilmadi' }, { status: 404 })
  return NextResponse.json(mahsulot)
}

export async function PUT(request, { params }) {
  const data = await request.json()
  const mahsulot = await updateMahsulot(params.id, data)
  return NextResponse.json(mahsulot)
}

export async function DELETE(_, { params }) {
  await deleteMahsulot(params.id)
  return NextResponse.json({ success: true })
}
