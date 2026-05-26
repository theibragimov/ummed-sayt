'use client'
import { useState, useEffect } from 'react'
import { A } from '@/components/admin/AdminStyles'

export default function ZayavkalarPage() {
  const [zayavkalar, setZayavkalar] = useState([])
  const [filtr, setFiltr] = useState('all')
  const [tanlangan, setTanlangan] = useState(null)
  const [izoh, setIzoh] = useState('')

  useEffect(() => { yuklash() }, [])

  async function yuklash() {
    const res = await fetch('/api/zayavkalar')
    setZayavkalar(await res.json())
  }

  async function holatOzgartir(id, holat) {
    await fetch(`/api/zayavkalar/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ holat }),
    })
    yuklash()
  }

  async function izohSaqla(id) {
    await fetch(`/api/zayavkalar/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ izoh }),
    })
    setTanlangan(null)
    yuklash()
  }

  async function ochir(id) {
    if (!confirm('O\'chirmoqchimisiz?')) return
    await fetch(`/api/zayavkalar/${id}`, { method: 'DELETE' })
    yuklash()
  }

  const filtrlar = [
    { val: 'all', label: 'Barchasi' },
    { val: 'new', label: '🆕 Yangi' },
    { val: 'inProgress', label: '⏳ Jarayonda' },
    { val: 'done', label: '✅ Bajarildi' },
    { val: 'rejected', label: '❌ Rad etildi' },
  ]
  const korsatilgan = filtr === 'all' ? zayavkalar : zayavkalar.filter(z => z.holat === filtr)

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={A.h1}>Zayavkalar</h1>
          <p style={{ ...A.sub, marginTop: '4px' }}>Jami {zayavkalar.length} ta buyurtma</p>
        </div>
      </div>

      {/* Filtrlar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {filtrlar.map(f => {
          const count = f.val === 'all' ? zayavkalar.length : zayavkalar.filter(z => z.holat === f.val).length
          const active = filtr === f.val
          return (
            <button key={f.val} onClick={() => setFiltr(f.val)} style={{
              padding: '7px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 500,
              border: active ? '1px solid #E8491D' : '1px solid rgba(0,0,0,0.08)',
              background: active ? 'rgba(232,73,29,0.07)' : '#fff',
              color: active ? '#E8491D' : '#6b7280',
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
            }}>
              {f.label}
              <span style={{ marginLeft: '6px', fontSize: '11px', fontWeight: 700, opacity: 0.8 }}>{count}</span>
            </button>
          )
        })}
      </div>

      {/* Ro'yxat */}
      <div style={A.card}>
        {korsatilgan.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#d1d5db', fontSize: '14px' }}>
            Zayavkalar yo'q
          </div>
        ) : korsatilgan.map((z, i) => {
          const h = A.holat[z.holat] || A.holat.new
          return (
            <div key={z.id} style={{
              padding: '16px 20px',
              borderBottom: i < korsatilgan.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
              display: 'flex', gap: '16px', alignItems: 'flex-start',
            }}>
              {/* Avatar */}
              <div style={{
                width: '38px', height: '38px', borderRadius: '10px',
                background: 'rgba(232,73,29,0.08)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', flexShrink: 0,
                color: '#E8491D', fontWeight: 700,
              }}>
                {(z.ism || 'N')[0].toUpperCase()}
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, fontSize: '14px', color: '#0a0a0a' }}>{z.ism || 'Noma\'lum'}</span>
                  <span style={A.badge(h.bg, h.color)}>{h.label}</span>
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '2px' }}>📞 {z.telefon}</div>
                {z.email && <div style={{ fontSize: '13px', color: '#9ca3af' }}>✉ {z.email}</div>}
                {z.mahsulot && <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>📦 {z.mahsulot}</div>}
                {z.xabar && (
                  <div style={{ fontSize: '13px', color: '#374151', marginTop: '8px', background: '#f9faf8', padding: '8px 12px', borderRadius: '8px', borderLeft: '3px solid rgba(232,73,29,0.3)' }}>
                    {z.xabar}
                  </div>
                )}
                {z.izoh && (
                  <div style={{ fontSize: '12px', color: '#6366f1', marginTop: '6px', fontStyle: 'italic' }}>
                    💬 {z.izoh}
                  </div>
                )}
                <div style={{ fontSize: '11px', color: '#d1d5db', marginTop: '6px' }}>
                  {new Date(z.sana).toLocaleString('uz-UZ')}
                </div>
              </div>

              {/* Amallar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                <select
                  value={z.holat}
                  onChange={e => holatOzgartir(z.id, e.target.value)}
                  style={{ ...A.select, width: 'auto', fontSize: '12px', padding: '6px 10px' }}
                >
                  <option value="new">🆕 Yangi</option>
                  <option value="inProgress">⏳ Jarayonda</option>
                  <option value="done">✅ Bajarildi</option>
                  <option value="rejected">❌ Rad etildi</option>
                </select>
                <button onClick={() => { setTanlangan(z.id); setIzoh(z.izoh || '') }}
                  style={{ fontSize: '12px', color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                  💬 Izoh
                </button>
                <button onClick={() => ochir(z.id)}
                  style={{ fontSize: '12px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                  🗑 O'chirish
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Izoh modal */}
      {tanlangan && (
        <div style={A.overlay}>
          <div style={A.modal}>
            <h3 style={{ ...A.h2, marginBottom: '16px' }}>Admin izohi</h3>
            <textarea value={izoh} onChange={e => setIzoh(e.target.value)} rows={4}
              style={A.textarea} placeholder="Izoh yozing..." />
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button onClick={() => izohSaqla(tanlangan)} style={{ ...A.btnPrimary, flex: 1 }}>Saqlash</button>
              <button onClick={() => setTanlangan(null)} style={{ ...A.btnGhost, flex: 1 }}>Bekor</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
