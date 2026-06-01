import { NextResponse } from 'next/server'
import { getMahsulotById, getMahsulotBySlug, updateMahsulot, deleteMahsulot } from '@/lib/db'

export async function GET(_, { params }) {
  const { id } = await params
  // Agar raqam bo'lsa ID, aks holda slug sifatida qidirish
  const mahsulot = isNaN(id)
    ? await getMahsulotBySlug(id)
    : await getMahsulotById(id)
  if (!mahsulot) return NextResponse.json({ xato: 'Topilmadi' }, { status: 404 })
  return NextResponse.json(mahsulot)
}

export async function PUT(request, { params }) {
  const { id } = await params
  const data = await request.json()
  const mahsulot = await updateMahsulot(id, data)
  return NextResponse.json(mahsulot)
}

export async function DELETE(_, { params }) {
  const { id } = await params
  await deleteMahsulot(id)
  return NextResponse.json({ success: true })
}
