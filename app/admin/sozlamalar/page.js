'use client'
import { useState, useEffect } from 'react'
import { A } from '@/components/admin/AdminStyles'

const FIELDS = [
  { kalit: 'hero_badge_uz',  label: "Badge (O'zbek)",        ph: "Tibbiyot buyumlari" },
  { kalit: 'hero_badge_ru',  label: "Badge (Русский)",        ph: "Медицинские изделия" },
  { kalit: 'hero_title1_uz', label: "1-qator sarlavha (O'zbek)", ph: "Butun O'zbekiston bo'ylab" },
  { kalit: 'hero_title1_ru', label: "1-я строка заголовка (RU)", ph: "Надёжно поставляем" },
  { kalit: 'hero_title2_uz', label: "2-qator sarlavha (O'zbek)", ph: "tibbiyot buyumlarini ulgurji" },
  { kalit: 'hero_title2_ru', label: "2-я строка заголовка (RU)", ph: "медицинские изделия оптом" },
  { kalit: 'hero_title3_uz', label: "3-qator sarlavha (O'zbek)", ph: "yetkazib beramiz" },
  { kalit: 'hero_title3_ru', label: "3-я строка заголовка (RU)", ph: "по всему Узбекистану." },
  { kalit: 'hero_desc_uz',   label: "Tavsif (O'zbek)",        ph: "Dorixona va klinikalar uchun..." },
  { kalit: 'hero_desc_ru',   label: "Описание (Русский)",     ph: "Современные медицинские изделия..." },
]

export default function SozlamalarPage() {
  const [form, setForm] = useState({})
  const [saqlash, setSaqlash] = useState(false)
  const [xabar, setXabar] = useState('')
  const [til, setTil] = useState('uz')

  useEffect(() => {
    fetch('/api/sozlamalar').then(r => r.json()).then(data => setForm(data))
  }, [])

  async function yuborish(e) {
    e.preventDefault()
    setSaqlash(true)
    setXabar('')
    const res = await fetch('/api/sozlamalar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) setXabar('✅ Saqlandi!')
    else setXabar('❌ Xatolik yuz berdi')
    setSaqlash(false)
    setTimeout(() => setXabar(''), 3000)
  }

  const uzFields = FIELDS.filter(f => f.kalit.endsWith('_uz'))
  const ruFields = FIELDS.filter(f => f.kalit.endsWith('_ru'))
  const curFields = til === 'uz' ? uzFields : ruFields

  return (
    <div style={{ maxWidth: '720px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={A.h1}>Bosh sahifa sozlamalari</h1>
        <p style={{ ...A.sub, marginTop: '4px' }}>Hero qismidagi sarlavha va matnlarni tahrirlang</p>
      </div>

      {/* Ko'rinish */}
      <div style={{ ...A.cardPad, marginBottom: '16px', background: 'rgba(232,73,29,0.03)', border: '1px solid rgba(232,73,29,0.12)' }}>
        <div style={{ fontSize: '12px', color: '#E8491D', fontWeight: 600, marginBottom: '12px' }}>👁 Hozirgi ko'rinish (bosh sahifa hero)</div>
        <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>{form['hero_badge_' + til] || '—'}</div>
        <div style={{ fontWeight: 700, fontSize: '22px', color: '#0a0a0a', lineHeight: 1.2 }}>
          {form['hero_title1_' + til] || '—'}<br />
          {form['hero_title2_' + til] || ''}<br />
          {form['hero_title3_' + til] || ''}
        </div>
        <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '8px' }}>{form['hero_desc_' + til] || '—'}</div>
      </div>

      <form onSubmit={yuborish}>
        <div style={A.cardPad}>
          {/* Til tablar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#0a0a0a' }}>Matnlar</div>
            <div style={{ display: 'flex', gap: '4px', background: '#f0f0ee', borderRadius: '8px', padding: '3px' }}>
              {['uz', 'ru'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTil(t)}
                  style={{
                    padding: '5px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
                    border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                    background: til === t ? '#fff' : 'transparent',
                    color: til === t ? '#0a0a0a' : '#9ca3af',
                    boxShadow: til === t ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  {t === 'uz' ? "🇺🇿 O'zbek" : '🇷🇺 Русский'}
                </button>
              ))}
            </div>
          </div>

          {curFields.map(f => (
            <div key={f.kalit} style={{ marginBottom: '16px' }}>
              <label style={A.label}>{f.label}</label>
              {f.kalit.includes('desc') ? (
                <textarea
                  value={form[f.kalit] || ''}
                  onChange={e => setForm(p => ({ ...p, [f.kalit]: e.target.value }))}
                  rows={2}
                  placeholder={f.ph}
                  style={A.textarea}
                />
              ) : (
                <input
                  value={form[f.kalit] || ''}
                  onChange={e => setForm(p => ({ ...p, [f.kalit]: e.target.value }))}
                  placeholder={f.ph}
                  style={A.input}
                />
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
          <button type="submit" disabled={saqlash} style={{ ...A.btnPrimary, padding: '11px 32px', opacity: saqlash ? 0.6 : 1 }}>
            {saqlash ? 'Saqlanmoqda...' : '💾 Saqlash'}
          </button>
          {xabar && <span style={{ fontSize: '13px', fontWeight: 500, color: xabar.startsWith('✅') ? '#16a34a' : '#ef4444' }}>{xabar}</span>}
        </div>
      </form>
    </div>
  )
}
