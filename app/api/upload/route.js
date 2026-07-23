export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from '@/lib/admin-auth'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
const MAX_SIZE = 5 * 1024 * 1024 // 5 MB

export async function POST(request) {
  const authError = await requireAdmin()
  if (authError) return authError

  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      return NextResponse.json({ xato: 'Supabase sozlanmagan' }, { status: 500 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    )

    const formData = await request.formData()
    const file = formData.get('fayl')

    if (!file) {
      return NextResponse.json({ xato: 'Fayl topilmadi' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ xato: 'Faqat rasm fayllari ruxsat etiladi (JPEG, PNG, WebP, GIF, AVIF)' }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ xato: 'Fayl hajmi 5MB dan oshmasligi kerak' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const extMap = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'image/avif': 'avif' }
    const fileExt = extMap[file.type] || 'jpg'
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
    const filePath = `rasmlar/${fileName}`

    const { error } = await supabase.storage
      .from('ummed')
      .upload(filePath, buffer, { contentType: file.type, upsert: false })

    if (error) {
      console.error('Upload xatosi:', error)
      return NextResponse.json({ xato: error.message }, { status: 500 })
    }

    const { data } = supabase.storage.from('ummed').getPublicUrl(filePath)
    return NextResponse.json({ url: data.publicUrl })
  } catch (err) {
    console.error('Upload kutilmagan xato:', err)
    return NextResponse.json({ xato: 'Server xatosi' }, { status: 500 })
  }
}
