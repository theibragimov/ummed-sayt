export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sessionTokenTekshir } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  if (!sessionTokenTekshir(token)) {
    return NextResponse.json({ xato: 'Ruxsat yo\'q' }, { status: 401 })
  }

  const [mahsulotlar, kategoriyalar, postlar, yangiZayavkalar, jamiZayavkalar, oxirgiZayavkalar] =
    await Promise.all([
      prisma.mahsulot.count(),
      prisma.kategoriya.count(),
      prisma.post.count({ where: { holat: 'published' } }),
      prisma.zayavka.count({ where: { holat: 'new' } }),
      prisma.zayavka.count(),
      prisma.zayavka.findMany({ orderBy: { sana: 'desc' }, take: 6 }),
    ])

  return NextResponse.json({ mahsulotlar, kategoriyalar, postlar, yangiZayavkalar, jamiZayavkalar, oxirgiZayavkalar })
}
