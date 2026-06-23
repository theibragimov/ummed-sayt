export const dynamic = 'force-dynamic'
export const maxDuration = 300

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { prisma } from '@/lib/prisma'
import { msMahsulotRasmlariOl, msRasmniYuklash } from '@/lib/moysklad'

export async function GET(request) {
  const secret = new URL(request.url).searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ xato: 'Ruxsat yo\'q' }, { status: 401 })
  }
  const limit = parseInt(new URL(request.url).searchParams.get('limit') || '80')
  return rasmlarniYuklash(limit)
}

export async function POST(request) {
  const secret = request.headers.get('x-cron-secret')
    || new URL(request.url).searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ xato: 'Ruxsat yo\'q' }, { status: 401 })
  }
  const limit = parseInt(new URL(request.url).searchParams.get('limit') || '80')
  return rasmlarniYuklash(limit)
}

async function rasmlarniYuklash(limit = 80) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  )

  // Rasmsiz katalog mahsulotlarini toping
  const rasmsizlar = await prisma.mahsulot.findMany({
    where: { asosiyRasmUrl: null, moyskladId: { not: null } },
    select: { id: true, moyskladId: true },
    take: limit,
    orderBy: { id: 'asc' },
  })

  const jami = await prisma.mahsulot.count({
    where: { asosiyRasmUrl: null, moyskladId: { not: null } },
  })

  const natija = { yuklandi: 0, xato: 0, qolgan: jami - rasmsizlar.length }

  for (const m of rasmsizlar) {
    try {
      const rasmlar = await msMahsulotRasmlariOl(m.moyskladId)
      if (!rasmlar.length) { natija.xato++; continue }

      const downloadHref = rasmlar[0].meta?.downloadHref
      if (!downloadHref) { natija.xato++; continue }

      const url = await msRasmniYuklash(downloadHref, supabase, `${m.moyskladId}-0`)
      await prisma.mahsulotRasm.deleteMany({ where: { mahsulotId: m.id } })
      await prisma.mahsulotRasm.create({ data: { mahsulotId: m.id, rasmUrl: url, tartib: 0 } })
      await prisma.mahsulot.update({ where: { id: m.id }, data: { asosiyRasmUrl: url } })
      natija.yuklandi++
    } catch (e) {
      console.error(`Rasm xato (${m.moyskladId}):`, e.message)
      natija.xato++
    }
  }

  return NextResponse.json({ ...natija, jami_rasmsiz: jami })
}
