import { NextResponse } from 'next/server'
import { getPostById, getPostBySlug, updatePost, deletePost } from '@/lib/db'
import { tarjimaQil } from '@/lib/tarjima'

export async function GET(_, { params }) {
  const { id } = await params
  const post = isNaN(id) ? await getPostBySlug(id) : await getPostById(id)
  if (!post) return NextResponse.json({ xato: 'Topilmadi' }, { status: 404 })
  return NextResponse.json(post)
}

export async function PUT(request, { params }) {
  const { id } = await params
  const data = await request.json()

  // Sarlavha o'zgargan yoki rus tarjima yo'q bo'lsa — qayta tarjima
  if (data.sarlavha && !data.sarlavhaRu) {
    try {
      const t = await tarjimaQil({ sarlavha: data.sarlavha, qisqaTavsif: data.qisqaTavsif, toliqMatn: data.toliqMatn })
      data.sarlavhaRu = t.sarlavha || null
      data.qisqaTavsifRu = t.qisqaTavsif || null
      data.toliqMatnRu = t.toliqMatn || null
    } catch (_) {}
  }

  const post = await updatePost(id, data)
  return NextResponse.json(post)
}

export async function DELETE(_, { params }) {
  const { id } = await params
  await deletePost(id)
  return NextResponse.json({ success: true })
}
