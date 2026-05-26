import { NextResponse } from 'next/server'
import { updateTugma, deleteTugma } from '@/lib/db'

export async function PUT(request, { params }) {
  const data = await request.json()
  const tugma = await updateTugma(params.id, data)
  return NextResponse.json(tugma)
}

export async function DELETE(_, { params }) {
  await deleteTugma(params.id)
  return NextResponse.json({ success: true })
}
