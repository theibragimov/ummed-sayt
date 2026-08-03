import { NextResponse } from 'next/server'
import { getAllMahsulotlar, getMahsulotlar, createMahsulot } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-auth'
import { checkRateLimit } from '@/lib/rate-limit'

const CACHE = 'public, s-maxage=300, stale-while-revalidate=600'

export async function GET(request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (!checkRateLimit(`mahsulotlar:${ip}`, 120, 60_000)) {
    return NextResponse.json({ error: 'Juda ko\'p so\'rov. Biroz kuting.' }, { status: 429 })
  }

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
  return NextResponse.json(mahsulotlar, { headers: { 'Cache-Control': CACHE } })
}

export async function POST(request) {
  const authError = await requireAdmin()
  if (authError) return authError
  try {
    const data = await request.json()
    const mahsulot = await createMahsulot(data)
    return NextResponse.json(mahsulot, { status: 201 })
  } catch (err) {
    console.error('POST /api/mahsulotlar error:', err)
    return NextResponse.json({ error: err?.message || 'Unknown error' }, { status: 500 })
  }
}
