export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getPostById, getPostBySlug, updatePost, deletePost } from '@/lib/db'

export async function GET(_, { params }) {
  const { id } = await params
  const post = isNaN(id) ? await getPostBySlug(id) : await getPostById(id)
  if (!post) return NextResponse.json({ xato: 'Topilmadi' }, { status: 404 })
  return NextResponse.json(post)
}

export async function PUT(request, { params }) {
  const { id } = await params
  const data = await request.json()
  const post = await updatePost(id, data)
  return NextResponse.json(post)
}

export async function DELETE(_, { params }) {
  const { id } = await params
  await deletePost(id)
  return NextResponse.json({ success: true })
}
