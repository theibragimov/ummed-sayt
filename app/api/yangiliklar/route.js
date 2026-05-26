import { NextResponse } from 'next/server'
import { getAllPostlar, createPost } from '@/lib/db'

export async function GET() {
  const data = await getAllPostlar()
  return NextResponse.json(data)
}

export async function POST(request) {
  const data = await request.json()
  const post = await createPost(data)
  return NextResponse.json(post, { status: 201 })
}
