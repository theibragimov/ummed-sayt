export const dynamic = 'force-dynamic'
export const maxDuration = 120

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hisoblaTopSotuvlar, topSotuvlarniSaqlash } from '@/lib/topsales'

function ruxsatBormi(request) {
  const url = new URL(request.url)
  const secret = url.searchParams.get('secret')
    || request.headers.get('x-cron-secret')
    || (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '')
  return secret === process.env.CRON_SECRET
}

export async function GET(request) {
  if (!ruxsatBormi(request)) {
    return NextResponse.json({ xato: 'Ruxsat yo\'q' }, { status: 401 })
  }
  return qaytaHisobla()
}

export async function POST(request) {
  if (!ruxsatBormi(request)) {
    return NextResponse.json({ xato: 'Ruxsat yo\'q' }, { status: 401 })
  }
  return qaytaHisobla()
}

async function qaytaHisobla() {
  try {
    const natija = await hisoblaTopSotuvlar()
    await topSotuvlarniSaqlash(prisma, natija)
    return NextResponse.json({
      ok: true,
      top10Soni: natija.top10.length,
      top50Soni: natija.top50.length,
      hisoblanganVaqt: natija.hisoblanganVaqt,
    })
  } catch (e) {
    return NextResponse.json({ xato: e.message }, { status: 500 })
  }
}
