export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { updateZayavka, deleteZayavka } from '@/lib/db'

export async function PUT(request, { params }) {
  const { id } = await params
  const data = await request.json()
  const zayavka = await updateZayavka(id, data)
  return NextResponse.json(zayavka)
}

export async function DELETE(_, { params }) {
  const { id } = await params
  await deleteZayavka(id)
  return NextResponse.json({ success: true })
}
