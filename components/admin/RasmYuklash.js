'use client'
import { useState } from 'react'
import Image from 'next/image'
import { A } from './AdminStyles'

export default function RasmYuklash({ qiymat, onChange, label = 'Rasm' }) {
  const [yuklanmoqda, setYuklanmoqda] = useState(false)

  async function faylTanlash(e) {
    const fayl = e.target.files[0]
    if (!fayl) return
    setYuklanmoqda(true)
    const formData = new FormData()
    formData.append('fayl', fayl)
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const data = await res.json()
    if (data.url) onChange(data.url)
    setYuklanmoqda(false)
  }

  return (
    <div>
      {label && <label style={A.label}>{label}</label>}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        {/* Preview */}
        {qiymat ? (
          <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)', flexShrink: 0 }}>
            <Image src={qiymat} alt="rasm" fill style={{ objectFit: 'cover' }} />
            <button type="button" onClick={() => onChange('')} style={{
              position: 'absolute', top: '4px', right: '4px',
              background: '#E8491D', color: '#fff', border: 'none',
              borderRadius: '50%', width: '20px', height: '20px',
              fontSize: '11px', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', lineHeight: 1,
            }}>×</button>
          </div>
        ) : (
          <div style={{
            width: '80px', height: '80px', borderRadius: '10px',
            border: '1.5px dashed rgba(0,0,0,0.15)', background: '#fafafa',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', color: '#d1d5db', flexShrink: 0,
          }}>📷</div>
        )}

        {/* Upload */}
        <div style={{ flex: 1 }}>
          <input type="file" accept="image/*" onChange={faylTanlash}
            style={{ display: 'block', fontSize: '13px', color: '#6b7280', marginBottom: '8px', fontFamily: 'inherit' }} />
          <input type="text" value={qiymat || ''} onChange={e => onChange(e.target.value)}
            placeholder="Yoki rasm URL manzilini kiriting..."
            style={{ ...A.input, fontSize: '13px' }} />
          {yuklanmoqda && (
            <div style={{ fontSize: '12px', color: '#E8491D', marginTop: '6px', fontWeight: 500 }}>
              ⏳ Yuklanmoqda...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
