import { NextResponse } from 'next/server'
import { updatePostKategoriya, deletePostKategoriya } from '@/lib/db'

export async function PUT(request, { params }) {
  const { id } = await params
  const data = await request.json()
  const k = await updatePostKategoriya(id, data)
  return NextResponse.json(k)
}

export async function DELETE(_, { params }) {
  const { id } = await params
  await deletePostKategoriya(id)
  return NextResponse.json({ success: true })
}
