import { NextResponse } from 'next/server'
import { updateKategoriya, deleteKategoriya } from '@/lib/db'

export async function PUT(request, { params }) {
  const data = await request.json()
  const kategoriya = await updateKategoriya(params.id, data)
  return NextResponse.json(kategoriya)
}

export async function DELETE(_, { params }) {
  await deleteKategoriya(params.id)
  return NextResponse.json({ success: true })
}
