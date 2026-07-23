export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { updateZayavka, deleteZayavka } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-auth'

export async function PUT(request, { params }) {
  const authError = await requireAdmin()
  if (authError) return authError
  const { id } = await params
  const data = await request.json()
  const zayavka = await updateZayavka(id, data)
  return NextResponse.json(zayavka)
}

export async function DELETE(_, { params }) {
  const authError = await requireAdmin()
  if (authError) return authError
  const { id } = await params
  await deleteZayavka(id)
  return NextResponse.json({ success: true })
}
