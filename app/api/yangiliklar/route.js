export const revalidate = 600
import { NextResponse } from 'next/server'
import { getAllPostlar, getPostlar, createPost } from '@/lib/db'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const holat = searchParams.get('holat')

  let data
  if (holat === 'published') {
    data = await getPostlar()
  } else {
    data = await getAllPostlar()
  }
  return NextResponse.json(data)
}

export async function POST(request) {
  const data = await request.json()
  const post = await createPost(data)
  return NextResponse.json(post, { status: 201 })
}
