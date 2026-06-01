'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { A } from '@/components/admin/AdminStyles'

export default function MahsulotlarPage() {
  const [mahsulotlar, setMahsulotlar] = useState([])
  const [qidiruv, setQidiruv] = useState('')

  useEffect(() => { yuklash() }, [])

  async function yuklash() {
    const res = await fetch('/api/mahsulotlar?hammasi=true')
    setMahsulotlar(await res.json())
  }

  async function ochir(id, nom) {
    if (!confirm(`"${nom}" ni o'chirmoqchimisiz?`)) return
    await fetch(`/api/mahsulotlar/${id}`, { method: 'DELETE' })
    yuklash()
  }

  async function mavjudlikToggle(id, hozirgi) {
    await fetch(`/api/mahsulotlar/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mavjudligi: !hozirgi }),
    })
    yuklash()
  }

  const filtrlangan = mahsulotlar.filter(m =>
    m.nom.toLowerCase().includes(qidiruv.toLowerCase()) ||
    (m.brend || '').toLowerCase().includes(qidiruv.toLowerCase())
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={A.h1}>Mahsulotlar</h1>
          <p style={{ ...A.sub, marginTop: '4px' }}>Jami {mahsulotlar.length} ta mahsulot</p>
        </div>
        <Link href="/admin/mahsulotlar/yangi" style={{ ...A.btnPrimary, textDecoration: 'none', display: 'inline-block' }}>
          + Yangi mahsulot
        </Link>
      </div>

      {/* Qidiruv */}
      <div style={{ marginBottom: '16px' }}>
        <input
          type="text" value={qidiruv} onChange={e => setQidiruv(e.target.value)}
          placeholder="🔍  Qidirish — nom yoki brend..."
          style={{ ...A.input, maxWidth: '320px' }}
        />
      </div>

      {/* Jadval */}
      <div style={A.card}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 80px 80px 100px', gap: '12px', padding: '10px 20px', background: '#f9faf8', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          {['Mahsulot', 'Kategoriya', 'Narx', 'Mavjud', 'Featured', 'Amallar'].map(h => (
            <span key={h} style={A.th}>{h}</span>
          ))}
        </div>

        {filtrlangan.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#d1d5db', fontSize: '14px' }}>
            {qidiruv ? 'Natija topilmadi' : 'Mahsulotlar yo\'q'}
          </div>
        ) : filtrlangan.map((m, i) => (
          <div key={m.id} style={{
            display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 80px 80px 100px', gap: '12px',
            padding: '12px 20px', borderBottom: i < filtrlangan.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
            alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', overflow: 'hidden', background: '#f5f5f0', flexShrink: 0, position: 'relative' }}>
                {m.asosiyRasmUrl
                  ? <Image src={m.asosiyRasmUrl} alt={m.nom} fill style={{ objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>📷</div>
                }
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontWeight: 600, fontSize: '13px', color: '#0a0a0a' }}>{m.nom}</span>
                  {m.turi && m.turi !== 'katalog' && (
                    <span style={{
                      fontSize: '10px', fontWeight: 600, padding: '1px 6px', borderRadius: '4px',
                      background: m.turi === 'ummed-brend' ? 'rgba(245,158,11,0.12)' : 'rgba(99,102,241,0.1)',
                      color: m.turi === 'ummed-brend' ? '#b45309' : '#6366f1',
                    }}>
                      {m.turi === 'ummed-brend' ? '⭐ Brend' : '🤝 Dist.'}
                    </span>
                  )}
                </div>
                {m.brend && <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '1px' }}>{m.brend}</div>}
              </div>
            </div>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>{m.kategoriya?.nom || '—'}</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0a' }}>
              {m.narx ? `${Number(m.narx).toLocaleString()} ${m.narxBirligi}` : '—'}
            </span>
            <div>
              <button onClick={() => mavjudlikToggle(m.id, m.mavjudligi)}
                style={A.badge(m.mavjudligi ? 'rgba(61,184,81,0.1)' : 'rgba(239,68,68,0.08)', m.mavjudligi ? '#16a34a' : '#dc2626')}>
                {m.mavjudligi ? '✓ Bor' : '✗ Yo\'q'}
              </button>
            </div>
            <div style={{ textAlign: 'center' }}>
              {m.featured ? <span style={{ color: '#f59e0b', fontSize: '16px' }}>★</span> : <span style={{ color: '#e5e7eb' }}>★</span>}
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <Link href={`/admin/mahsulotlar/${m.id}`} style={{ fontSize: '12px', color: '#6366f1', textDecoration: 'none', fontWeight: 500 }}>Tahrirlash</Link>
              <button onClick={() => ochir(m.id, m.nom)} style={{ fontSize: '12px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>O'chirish</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
