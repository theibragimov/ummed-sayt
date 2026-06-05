export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { createZayavka } from '@/lib/db'

export async function POST(request) {
  try {
    const body = await request.json()
    const { ism, telefon, email, xabar, mahsulot } = body

    if (!ism || !telefon) {
      return NextResponse.json(
        { success: false, xato: 'Ism va telefon majburiy' },
        { status: 400 }
      )
    }

    await createZayavka({ ism, telefon, email: email || '', xabar: xabar || '', mahsulot: mahsulot || '' })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Zayavka xatosi:', err)
    return NextResponse.json({ success: false, xato: 'Server xatosi' }, { status: 500 })
  }
}
