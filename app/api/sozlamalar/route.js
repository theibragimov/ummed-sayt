export const revalidate = 120 // 2 daqiqada bir yangilanadi
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const rows = await prisma.saytSozlamalari.findMany()
  const obj = {}
  for (const r of rows) obj[r.kalit] = r.qiymat
  return NextResponse.json(obj)
}

export async function POST(request) {
  const data = await request.json() // { kalit: qiymat, ... }
  const updates = []
  for (const [kalit, qiymat] of Object.entries(data)) {
    updates.push(
      prisma.saytSozlamalari.upsert({
        where: { kalit },
        update: { qiymat: String(qiymat) },
        create: { kalit, qiymat: String(qiymat) },
      })
    )
  }
  await Promise.all(updates)
  return NextResponse.json({ ok: true })
}
