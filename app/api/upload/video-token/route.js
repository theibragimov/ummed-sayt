import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from '@/lib/admin-auth'

// Video fayl Vercel funksiyasi orqali emas, to'g'ridan-to'g'ri Supabase Storage'ga
// (imzolangan URL orqali) yuklanadi — shu bilan Vercel so'rov hajmi va bandwidth
// limitlariga ta'sir qilmaydi.
const ALLOWED_EXT = { 'video/mp4': 'mp4', 'video/webm': 'webm', 'video/quicktime': 'mov' }

export async function POST(request) {
  const authError = await requireAdmin()
  if (authError) return authError

  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      return NextResponse.json({ xato: 'Supabase sozlanmagan' }, { status: 500 })
    }

    const { contentType } = await request.json()
    const fileExt = ALLOWED_EXT[contentType]
    if (!fileExt) {
      return NextResponse.json({ xato: 'Faqat video fayllari ruxsat etiladi (MP4, WebM, MOV)' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    )

    const filePath = `videolar/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
    const { data, error } = await supabase.storage.from('ummed').createSignedUploadUrl(filePath)
    if (error) {
      console.error('Video token xatosi:', error)
      return NextResponse.json({ xato: error.message }, { status: 500 })
    }

    const { data: publicData } = supabase.storage.from('ummed').getPublicUrl(filePath)
    return NextResponse.json({ token: data.token, path: data.path, publicUrl: publicData.publicUrl })
  } catch (err) {
    console.error('Video token kutilmagan xato:', err)
    return NextResponse.json({ xato: 'Server xatosi' }, { status: 500 })
  }
}
