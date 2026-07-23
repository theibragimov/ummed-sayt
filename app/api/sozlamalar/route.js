export const revalidate = 3600
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET() {
  const rows = await prisma.saytSozlamalari.findMany()
  const obj = {}
  for (const r of rows) obj[r.kalit] = r.qiymat
  return NextResponse.json(obj)
}

export async function POST(request) {
  const authError = await requireAdmin()
  if (authError) return authError
  const data = await request.json()
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
