export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { updateTugma, deleteTugma } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-auth'

export async function PUT(request, { params }) {
  const authError = await requireAdmin()
  if (authError) return authError
  const { id } = await params
  const data = await request.json()
  const tugma = await updateTugma(id, data)
  return NextResponse.json(tugma)
}

export async function DELETE(_, { params }) {
  const authError = await requireAdmin()
  if (authError) return authError
  const { id } = await params
  await deleteTugma(id)
  return NextResponse.json({ success: true })
}
