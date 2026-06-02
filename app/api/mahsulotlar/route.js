import { NextResponse } from 'next/server'
import { getAllMahsulotlar, getMahsulotlar, createMahsulot } from '@/lib/db'
import { tarjimaQil } from '@/lib/tarjima'

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

  // Avtomatik rus tarjimasi
  if (!data.nomRu) {
    try {
      const t = await tarjimaQil({ nom: data.nom, qisqaTavsif: data.qisqaTavsif, toliqTavsif: data.toliqTavsif })
      data.nomRu = t.nom || null
      data.qisqaTavsifRu = t.qisqaTavsif || null
      data.toliqTavsifRu = t.toliqTavsif || null
    } catch (_) {}
  }

  const mahsulot = await createMahsulot(data)
  return NextResponse.json(mahsulot, { status: 201 })
}
