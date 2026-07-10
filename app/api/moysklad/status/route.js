export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const sozlama = await prisma.saytSozlamalari.findUnique({
      where: { kalit: 'moysklad_last_sync' },
    })

    const [mahsulotlar, kategoriyalar] = await Promise.all([
      prisma.mahsulot.count({ where: { moyskladId: { not: null } } }),
      prisma.kategoriya.count({ where: { moyskladId: { not: null } } }),
    ])

    return NextResponse.json({
      oxirgiSync: sozlama?.qiymat || null,
      moyskladMahsulotlar: mahsulotlar,
      moyskladKategoriyalar: kategoriyalar,
    })
  } catch (e) {
    console.error('moysklad/status xato:', e)
    return NextResponse.json({ xato: 'Status olishda xatolik' }, { status: 500 })
  }
}
