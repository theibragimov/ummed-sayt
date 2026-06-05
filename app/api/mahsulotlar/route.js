export const revalidate = 60 // 60 soniyada bir yangilanadi
import { NextResponse } from 'next/server'
import { getAllMahsulotlar, getMahsulotlar, createMahsulot } from '@/lib/db'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const kategoriya = searchParams.get('kategoriya')
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : undefined
  const featured = searchParams.get('featured') === 'true'
  const turi = searchParams.get('turi')
  const hammasi = searchParams.get('hammasi') === 'true'

  let mahsulotlar
  if (hammasi) {
    mahsulotlar = await getAllMahsulotlar()
  } else if (turi) {
    mahsulotlar = await getAllMahsulotlar({ turi })
  } else if (kategoriya || limit || featured) {
    mahsulotlar = await getMahsulotlar({ kategoriyaSlug: kategoriya || undefined, limit, featured: featured || undefined })
  } else {
    mahsulotlar = await getMahsulotlar()
  }
  return NextResponse.json(mahsulotlar)
}

export async function POST(request) {
  const data = await request.json()
  const mahsulot = await createMahsulot(data)
  return NextResponse.json(mahsulot, { status: 201 })
}
