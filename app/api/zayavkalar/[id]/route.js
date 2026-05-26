import { NextResponse } from 'next/server'
import { updateZayavka, deleteZayavka } from '@/lib/db'

export async function PUT(request, { params }) {
  const data = await request.json()
  const zayavka = await updateZayavka(params.id, data)
  return NextResponse.json(zayavka)
}

export async function DELETE(_, { params }) {
  await deleteZayavka(params.id)
  return NextResponse.json({ success: true })
}
