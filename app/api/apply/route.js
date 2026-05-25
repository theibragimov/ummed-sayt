import { createClient } from 'next-sanity'
import { NextResponse } from 'next/server'

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

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

    await writeClient.create({
      _type: 'application',
      ism,
      telefon,
      email: email || '',
      xabar: xabar || '',
      mahsulot: mahsulot || '',
      holat: 'new',
      sana: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Zayavka saqlashda xato:', err)
    return NextResponse.json(
      { success: false, xato: 'Server xatosi' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
