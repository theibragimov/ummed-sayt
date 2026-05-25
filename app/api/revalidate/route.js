import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

const WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET

export async function POST(request) {
  try {
    // Secret tekshirish (ixtiyoriy lekin tavsiya etiladi)
    if (WEBHOOK_SECRET) {
      const secret = request.headers.get('x-webhook-secret')
      if (secret !== WEBHOOK_SECRET) {
        return NextResponse.json({ xato: 'Ruxsat yo\'q' }, { status: 401 })
      }
    }

    const body = await request.json()
    const { _type } = body

    // Qaysi sahifalar yangilansin
    revalidatePath('/', 'layout')
    revalidatePath('/')

    if (_type === 'product') {
      revalidatePath('/katalog')
      revalidatePath('/katalog/[id]', 'page')
    }

    if (_type === 'post') {
      revalidatePath('/yangiliklar')
      revalidatePath('/yangiliklar/[slug]', 'page')
    }

    if (_type === 'category') {
      revalidatePath('/katalog')
    }

    if (_type === 'banner') {
      revalidatePath('/')
    }

    return NextResponse.json({
      success: true,
      revalidated: true,
      tip: _type || 'noma\'lum',
      vaqt: new Date().toISOString(),
    })
  } catch (err) {
    console.error('Revalidation xatosi:', err)
    return NextResponse.json(
      { success: false, xato: err.message },
      { status: 500 }
    )
  }
}
