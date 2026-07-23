export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { updatePostKategoriya, deletePostKategoriya } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-auth'

export async function PUT(request, { params }) {
  const authError = await requireAdmin()
  if (authError) return authError
  const { id } = await params
  const data = await request.json()
  const k = await updatePostKategoriya(id, data)
  return NextResponse.json(k)
}

export async function DELETE(_, { params }) {
  const authError = await requireAdmin()
  if (authError) return authError
  const { id } = await params
  await deletePostKategoriya(id)
  return NextResponse.json({ success: true })
}
