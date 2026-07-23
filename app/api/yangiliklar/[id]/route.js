export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getPostById, getPostBySlug, updatePost, deletePost } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET(_, { params }) {
  const { id } = await params
  const post = isNaN(id) ? await getPostBySlug(id) : await getPostById(id)
  if (!post) return NextResponse.json({ xato: 'Topilmadi' }, { status: 404 })
  return NextResponse.json(post)
}

export async function PUT(request, { params }) {
  const authError = await requireAdmin()
  if (authError) return authError
  const { id } = await params
  const data = await request.json()
  const post = await updatePost(id, data)
  return NextResponse.json(post)
}

export async function DELETE(_, { params }) {
  const authError = await requireAdmin()
  if (authError) return authError
  const { id } = await params
  await deletePost(id)
  return NextResponse.json({ success: true })
}
