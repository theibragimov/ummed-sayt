import { NextResponse } from 'next/server'
import { getAllPostlar, getPostlar, createPost } from '@/lib/db'
import { tarjimaQil } from '@/lib/tarjima'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const holat = searchParams.get('holat')

  let data
  if (holat === 'published') {
    data = await getPostlar()
  } else {
    data = await getAllPostlar()
  }
  return NextResponse.json(data)
}

export async function POST(request) {
  const data = await request.json()

  // Avtomatik rus tarjimasi
  if (!data.sarlavhaRu) {
    try {
      const t = await tarjimaQil({ sarlavha: data.sarlavha, qisqaTavsif: data.qisqaTavsif, toliqMatn: data.toliqMatn })
      data.sarlavhaRu = t.sarlavha || null
      data.qisqaTavsifRu = t.qisqaTavsif || null
      data.toliqMatnRu = t.toliqMatn || null
    } catch (_) {}
  }

  const post = await createPost(data)
  return NextResponse.json(post, { status: 201 })
}
