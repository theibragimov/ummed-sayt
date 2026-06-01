import { NextResponse } from 'next/server'
import { updateTugma, deleteTugma } from '@/lib/db'

export async function PUT(request, { params }) {
  const { id } = await params
  const data = await request.json()
  const tugma = await updateTugma(id, data)
  return NextResponse.json(tugma)
}

export async function DELETE(_, { params }) {
  const { id } = await params
  await deleteTugma(id)
  return NextResponse.json({ success: true })
}
