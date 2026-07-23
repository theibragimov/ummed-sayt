export const revalidate = 600
import { NextResponse } from 'next/server'
import { getAllPostlar, getPostlar, createPost } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-auth'

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
  const authError = await requireAdmin()
  if (authError) return authError
  const data = await request.json()
  const post = await createPost(data)
  return NextResponse.json(post, { status: 201 })
}
