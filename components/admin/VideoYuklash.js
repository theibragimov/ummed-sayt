'use client'
import { useState, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import { A } from './AdminStyles'

const MAX_SIZE = 20 * 1024 * 1024 // 20 MB — Vercel funksiyasidan chetlab o'tib, to'g'ridan-to'g'ri Supabase'ga yuklanadi

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function VideoYuklash({ qiymat, onChange, label = 'Video' }) {
  const [holat, setHolat] = useState('') // 'yuklanmoqda' | 'xato' | ''
  const [xato, setXato] = useState('')
  const inputRef = useRef()

  async function yuklash(fayl) {
    if (!fayl) return
    if (!fayl.type.startsWith('video/')) {
      setXato('Faqat video fayli (MP4, WebM, MOV)')
      setHolat('xato')
      return
    }
    if (fayl.size > MAX_SIZE) {
      setXato('Fayl hajmi 20MB dan oshmasin')
      setHolat('xato')
      return
    }

    setHolat('yuklanmoqda')
    setXato('')
    try {
      const tokenRes = await fetch('/api/upload/video-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType: fayl.type }),
      })
      const tokenData = await tokenRes.json().catch(() => ({}))
      if (!tokenData.token) {
        setXato(tokenData.xato || 'Yuklab bo\'lmadi')
        setHolat('xato')
        return
      }

      const { error } = await supabase.storage
        .from('ummed')
        .uploadToSignedUrl(tokenData.path, tokenData.token, fayl)

      if (error) {
        setXato(error.message)
        setHolat('xato')
        return
      }

      onChange(tokenData.publicUrl)
      setHolat('')
    } catch (e) {
      setXato('Tarmoq xatosi: ' + e.message)
      setHolat('xato')
    }
  }

  return (
    <div>
      {label && <label style={A.label}>{label}</label>}
      <input ref={inputRef} type="file" accept="video/mp4,video/webm,video/quicktime"
        onChange={e => yuklash(e.target.files[0])} style={{ display: 'none' }} />

      {qiymat ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <video src={qiymat} style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 8, background: '#000' }} muted />
          <button type="button" onClick={() => onChange('')}
            style={{
              background: '#E8491D', color: '#fff', border: 'none',
              borderRadius: '50%', width: 22, height: 22, fontSize: 13,
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', lineHeight: 1,
            }}>×</button>
        </div>
      ) : null}

      <button type="button" onClick={() => inputRef.current?.click()}
        disabled={holat === 'yuklanmoqda'}
        style={{ ...A.btnGhost, fontSize: 12, padding: '7px 14px', opacity: holat === 'yuklanmoqda' ? 0.6 : 1 }}>
        {holat === 'yuklanmoqda' ? '⏳ Yuklanmoqda...' : qiymat ? '🎬 Videoni almashtirish' : '🎬 Video tanlash'}
      </button>

      {xato && (
        <div style={{ fontSize: 11, color: '#ef4444', marginTop: 5, fontWeight: 500 }}>
          ⚠ {xato}
        </div>
      )}
      <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 4 }}>
        MP4, WebM, MOV · max 20MB
      </div>
    </div>
  )
}
