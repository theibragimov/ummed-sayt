export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const secret = new URL(request.url).searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ xato: 'Ruxsat yo\'q' }, { status: 401 })
  }

  const BASE = 'https://api.moysklad.ru/api/remap/1.2'
  const headers = {
    Authorization: `Bearer ${process.env.MOYSKLAD_TOKEN}`,
    'Content-Type': 'application/json;charset=utf-8',
  }

  try {
    const [prodRes, folderRes, variantRes] = await Promise.all([
      fetch(`${BASE}/entity/product?limit=1`, { headers }),
      fetch(`${BASE}/entity/productfolder?limit=1`, { headers }),
      fetch(`${BASE}/entity/variant?limit=1`, { headers }),
    ])

    const [prod, folder, variant] = await Promise.all([
      prodRes.json(), folderRes.json(), variantRes.json()
    ])

    return NextResponse.json({
      mahsulotlar: prod.meta?.size ?? 'xato',
      kategoriyalar: folder.meta?.size ?? 'xato',
      variantlar: variant.meta?.size ?? 'xato',
      status: { prod: prodRes.status, folder: folderRes.status, variant: variantRes.status },
    })
  } catch (e) {
    return NextResponse.json({ xato: e.message }, { status: 500 })
  }
}
