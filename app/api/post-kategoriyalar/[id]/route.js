import { NextResponse } from 'next/server'
import { updatePostKategoriya, deletePostKategoriya } from '@/lib/db'

export async function PUT(request, { params }) {
  const data = await request.json()
  const k = await updatePostKategoriya(params.id, data)
  return NextResponse.json(k)
}

export async function DELETE(_, { params }) {
  await deletePostKategoriya(params.id)
  return NextResponse.json({ success: true })
}
