export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { updateKategoriya, deleteKategoriya } from '@/lib/db'

export async function PUT(request, { params }) {
  const { id } = await params
  const data = await request.json()
  const kategoriya = await updateKategoriya(id, data)
  return NextResponse.json(kategoriya)
}

export async function DELETE(_, { params }) {
  const { id } = await params
  await deleteKategoriya(id)
  return NextResponse.json({ success: true })
}
