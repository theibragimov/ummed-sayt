import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { prisma } from '@/lib/prisma'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export async function POST(request) {
  try {
    const formData = await request.formData()
    const fayl = formData.get('fayl')
    const slugHint = formData.get('slug') // fayl nomidan olingan slug

    if (!fayl) return NextResponse.json({ xato: 'Fayl yo\'q' }, { status: 400 })

    // Fayl nomidan slug yasash: "tonometr-omron.jpg" → "tonometr-omron"
    const slug = slugHint || fayl.name
      .replace(/\.[^.]+$/, '')          // kengaytmani olib tashlash
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')

    // Mahsulotni topish
    const mahsulot = await prisma.mahsulot.findUnique({ where: { slug } })
    if (!mahsulot) {
      return NextResponse.json({ xato: `Mahsulot topilmadi: "${slug}"`, slug }, { status: 404 })
    }

    // Supabase ga yuklash
    const bytes = await fayl.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const ext = fayl.name.split('.').pop()
    const filePath = `rasmlar/${slug}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('ummed')
      .upload(filePath, buffer, { contentType: fayl.type, upsert: true })

    if (uploadError) {
      return NextResponse.json({ xato: uploadError.message, slug }, { status: 500 })
    }

    const { data } = supabase.storage.from('ummed').getPublicUrl(filePath)
    const url = data.publicUrl

    // Mahsulotga rasmni biriktirish
    await prisma.mahsulot.update({
      where: { slug },
      data: { asosiyRasmUrl: url },
    })

    return NextResponse.json({ ok: true, slug, url, nom: mahsulot.nom })
  } catch (e) {
    console.error('Bulk rasm xatosi:', e)
    return NextResponse.json({ xato: e.message }, { status: 500 })
  }
}
