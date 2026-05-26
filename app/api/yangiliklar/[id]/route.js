import { NextResponse } from 'next/server'
import { getPostById, updatePost, deletePost } from '@/lib/db'

export async function GET(_, { params }) {
  const post = await getPostById(params.id)
  if (!post) return NextResponse.json({ xato: 'Topilmadi' }, { status: 404 })
  return NextResponse.json(post)
}

export async function PUT(request, { params }) {
  const data = await request.json()
  const post = await updatePost(params.id, data)
  return NextResponse.json(post)
}

export async function DELETE(_, { params }) {
  await deletePost(params.id)
  return NextResponse.json({ success: true })
}
