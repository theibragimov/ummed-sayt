import { NextResponse } from 'next/server'
import { getZayavkalar, createZayavka } from '@/lib/db'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const holat = searchParams.get('holat')
  const data = await getZayavkalar(holat ? { holat } : {})
  return NextResponse.json(data)
}

export async function POST(request) {
  const data = await request.json()
  const zayavka = await createZayavka(data)
  return NextResponse.json(zayavka, { status: 201 })
}
