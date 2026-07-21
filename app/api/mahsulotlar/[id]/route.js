import { NextResponse } from 'next/server'
import { getMahsulotById, getMahsulotBySlug, updateMahsulot, deleteMahsulot } from '@/lib/db'

const CACHE = 'public, s-maxage=300, stale-while-revalidate=600'

export async function GET(_, { params }) {
  const { id } = await params
  const mahsulot = isNaN(id)
    ? await getMahsulotBySlug(id)
    : await getMahsulotById(id)
  if (!mahsulot) return NextResponse.json({ xato: 'Topilmadi' }, { status: 404 })
  return NextResponse.json(mahsulot, { headers: { 'Cache-Control': CACHE } })
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
