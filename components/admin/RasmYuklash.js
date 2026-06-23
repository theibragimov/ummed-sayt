'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { A } from './AdminStyles'

export default function RasmYuklash({ qiymat, onChange, label = 'Rasm' }) {
  const [holat, setHolat] = useState('') // 'yuklanmoqda' | 'xato' | ''
  const [xato, setXato] = useState('')
  const [drag, setDrag] = useState(false)
  const inputRef = useRef()

  async function yuklash(fayl) {
    if (!fayl) return
    if (!fayl.type.startsWith('image/')) {
      setXato('Faqat rasm fayli (JPG, PNG, WEBP)')
      setHolat('xato')
      return
    }
    if (fayl.size > 10 * 1024 * 1024) {
      setXato('Fayl hajmi 10MB dan oshmasin')
      setHolat('xato')
      return
    }

    setHolat('yuklanmoqda')
    setXato('')
    try {
      const fd = new FormData()
      fd.append('fayl', fayl)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      let data
      try {
        data = await res.json()
      } catch {
        setXato(`Server xatosi (${res.status})`)
        setHolat('xato')
        return
      }
      if (data.url) {
        onChange(data.url)
        setHolat('')
      } else {
        setXato(data.xato || 'Yuklab bo\'lmadi')
        setHolat('xato')
      }
    } catch (e) {
      setXato('Tarmoq xatosi: ' + e.message)
      setHolat('xato')
    }
  }

  function onDrop(e) {
    e.preventDefault()
    setDrag(false)
    const fayl = e.dataTransfer.files[0]
    if (fayl) yuklash(fayl)
  }

  return (
    <div>
      {label && <label style={A.label}>{label}</label>}

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        {/* Preview yoki placeholder */}
        <div
          onClick={() => !holat && inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          style={{
            width: 100, height: 100, borderRadius: 10, flexShrink: 0,
            border: drag ? '2px dashed #E8491D' : qiymat ? '1px solid rgba(0,0,0,0.08)' : '2px dashed rgba(0,0,0,0.15)',
            background: drag ? 'rgba(232,73,29,0.04)' : qiymat ? 'transparent' : '#fafafa',
            position: 'relative', overflow: 'hidden',
            cursor: holat === 'yuklanmoqda' ? 'wait' : 'pointer',
            transition: 'all 0.15s',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
          {holat === 'yuklanmoqda' ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>⏳</div>
              <div style={{ fontSize: 10, color: '#E8491D', fontWeight: 600 }}>Yuklanmoqda</div>
            </div>
          ) : qiymat ? (
            <>
              <Image src={qiymat} alt="rasm" fill style={{ objectFit: 'cover' }} unoptimized={false} />
              <button type="button" onClick={e => { e.stopPropagation(); onChange('') }}
                style={{
                  position: 'absolute', top: 4, right: 4,
                  background: '#E8491D', color: '#fff', border: 'none',
                  borderRadius: '50%', width: 22, height: 22, fontSize: 13,
                  cursor: 'pointer', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', zIndex: 2, lineHeight: 1,
                }}>×</button>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: 8 }}>
              <div style={{ fontSize: 22, marginBottom: 4, color: '#d1d5db' }}>📷</div>
              <div style={{ fontSize: 9, color: '#9ca3af', lineHeight: 1.4 }}>
                Bosing yoki<br />tashlang
              </div>
            </div>
          )}
        </div>

        {/* Tugma va URL input */}
        <div style={{ flex: 1 }}>
          <input ref={inputRef} type="file" accept="image/*"
            onChange={e => yuklash(e.target.files[0])}
            style={{ display: 'none' }} />

          <button type="button" onClick={() => inputRef.current?.click()}
            disabled={holat === 'yuklanmoqda'}
            style={{
              ...A.btnGhost, fontSize: 12, padding: '7px 14px',
              marginBottom: 8, display: 'block', width: '100%',
              opacity: holat === 'yuklanmoqda' ? 0.6 : 1,
            }}>
            {holat === 'yuklanmoqda' ? '⏳ Yuklanmoqda...' : '📁 Rasm tanlash'}
          </button>

          <input type="text" value={qiymat || ''} onChange={e => onChange(e.target.value)}
            placeholder="Yoki URL kiriting..."
            style={{ ...A.input, fontSize: 12 }} />

          {xato && (
            <div style={{ fontSize: 11, color: '#ef4444', marginTop: 5, fontWeight: 500 }}>
              ⚠ {xato}
            </div>
          )}
          {qiymat && holat === '' && (
            <div style={{ fontSize: 11, color: '#16a34a', marginTop: 5 }}>
              ✓ Rasm tayyor
            </div>
          )}
          <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 4 }}>
            JPG, PNG, WEBP · max 10MB
          </div>
        </div>
      </div>
    </div>
  )
}
