export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { updateKategoriya, deleteKategoriya } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-auth'

export async function PUT(request, { params }) {
  const authError = await requireAdmin()
  if (authError) return authError
  const { id } = await params
  const data = await request.json()
  const kategoriya = await updateKategoriya(id, data)
  return NextResponse.json(kategoriya)
}

export async function DELETE(_, { params }) {
  const authError = await requireAdmin()
  if (authError) return authError
  const { id } = await params
  await deleteKategoriya(id)
  return NextResponse.json({ success: true })
}
