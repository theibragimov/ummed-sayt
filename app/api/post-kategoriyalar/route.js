export const revalidate = 60
import { NextResponse } from 'next/server'
import { getPostKategoriyalar, createPostKategoriya } from '@/lib/db'

export async function GET() {
  const data = await getPostKategoriyalar()
  return NextResponse.json(data)
}

export async function POST(request) {
  const data = await request.json()
  const kategoriya = await createPostKategoriya(data)
  return NextResponse.json(kategoriya, { status: 201 })
}
