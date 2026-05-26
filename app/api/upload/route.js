import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export async function POST(request) {
  const formData = await request.formData()
  const file = formData.get('fayl')

  if (!file) {
    return NextResponse.json({ xato: 'Fayl topilmadi' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
  const filePath = `rasmlar/${fileName}`

  const { error } = await supabase.storage
    .from('ummed')
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: false,
    })

  if (error) {
    console.error('Upload xatosi:', error)
    return NextResponse.json({ xato: error.message }, { status: 500 })
  }

  const { data } = supabase.storage.from('ummed').getPublicUrl(filePath)

  return NextResponse.json({ url: data.publicUrl })
}
