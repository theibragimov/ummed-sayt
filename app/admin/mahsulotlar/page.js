'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { A } from '@/components/admin/AdminStyles'

const TURI_OPTIONS = [
  { value: '', label: 'Hammasi' },
  { value: 'katalog', label: '📦 Katalog' },
  { value: 'distribyutor', label: '🤝 Distribyutor' },
  { value: 'ummed-brend', label: '⭐ Ummed brend' },
]

export default function MahsulotlarPage() {
  const [mahsulotlar, setMahsulotlar] = useState([])
  const [kategoriyalar, setKategoriyalar] = useState([])
  const [qidiruv, setQidiruv] = useState('')
  const [turiFilter, setTuriFilter] = useState('')
  const [katFilter, setKatFilter] = useState('')
  const [mavjudFilter, setMavjudFilter] = useState('')

  useEffect(() => { yuklash() }, [])

  async function yuklash() {
    const [mRes, kRes] = await Promise.all([
      fetch('/api/mahsulotlar?hammasi=true'),
      fetch('/api/kategoriyalar'),
    ])
    setMahsulotlar(await mRes.json())
    setKategoriyalar(await kRes.json())
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

  const filtrlangan = mahsulotlar.filter(m => {
    if (qidiruv && !m.nom.toLowerCase().includes(qidiruv.toLowerCase()) &&
        !(m.brend || '').toLowerCase().includes(qidiruv.toLowerCase())) return false
    if (turiFilter && m.turi !== turiFilter) return false
    if (katFilter && String(m.kategoriyaId) !== katFilter) return false
    if (mavjudFilter === 'bor' && !m.mavjudligi) return false
    if (mavjudFilter === 'yoq' && m.mavjudligi) return false
    return true
  })

  const filtrAktiv = turiFilter || katFilter || mavjudFilter || qidiruv

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={A.h1}>Mahsulotlar</h1>
          <p style={{ ...A.sub, marginTop: '4px' }}>
            Jami {mahsulotlar.length} ta •{' '}
            {filtrAktiv ? <span style={{ color: '#E8491D', fontWeight: 600 }}>{filtrlangan.length} ta ko'rsatilmoqda</span> : `${filtrlangan.length} ta ko'rsatilmoqda`}
          </p>
        </div>
        <Link href="/admin/mahsulotlar/yangi" style={{ ...A.btnPrimary, textDecoration: 'none', display: 'inline-block' }}>
          + Yangi mahsulot
        </Link>
      </div>

      {/* Filtrlar */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Qidiruv */}
        <input
          type="text" value={qidiruv} onChange={e => setQidiruv(e.target.value)}
          placeholder="🔍  Nom yoki brend..."
          style={{ ...A.input, width: '220px' }}
        />

        {/* Turi */}
        <select value={turiFilter} onChange={e => setTuriFilter(e.target.value)}
          style={{ ...A.input, width: '170px', cursor: 'pointer' }}>
          {TURI_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        {/* Kategoriya */}
        <select value={katFilter} onChange={e => setKatFilter(e.target.value)}
          style={{ ...A.input, width: '200px', cursor: 'pointer' }}>
          <option value="">Barcha kategoriyalar</option>
          <option value="null">— Kategoriyasiz</option>
          {kategoriyalar.map(k => (
            <option key={k.id} value={String(k.id)}>{k.nom}</option>
          ))}
        </select>

        {/* Mavjudlik */}
        <select value={mavjudFilter} onChange={e => setMavjudFilter(e.target.value)}
          style={{ ...A.input, width: '140px', cursor: 'pointer' }}>
          <option value="">Mavjudligi</option>
          <option value="bor">✓ Mavjud</option>
          <option value="yoq">✗ Tugagan</option>
        </select>

        {/* Filtrni tozalash */}
        {filtrAktiv && (
          <button onClick={() => { setQidiruv(''); setTuriFilter(''); setKatFilter(''); setMavjudFilter('') }}
            style={{ fontSize: '12px', color: '#6b7280', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontFamily: 'inherit' }}>
            ✕ Tozalash
          </button>
        )}
      </div>

      {/* Tez filtr tugmalari */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {TURI_OPTIONS.slice(1).map(o => {
          const soni = mahsulotlar.filter(m => m.turi === o.value).length
          return (
            <button key={o.value} onClick={() => setTuriFilter(turiFilter === o.value ? '' : o.value)}
              style={{
                fontSize: '12px', fontWeight: 600, padding: '5px 12px', borderRadius: '20px', cursor: 'pointer', fontFamily: 'inherit',
                border: turiFilter === o.value ? '1.5px solid #E8491D' : '1.5px solid #e5e7eb',
                background: turiFilter === o.value ? 'rgba(232,73,29,0.07)' : '#fff',
                color: turiFilter === o.value ? '#E8491D' : '#6b7280',
              }}>
              {o.label} <span style={{ fontWeight: 400, opacity: 0.7 }}>({soni})</span>
            </button>
          )
        })}
      </div>

      {/* Jadval */}
      <div style={A.card}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 90px 80px 100px', gap: '12px', padding: '10px 20px', background: '#f9faf8', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          {['Mahsulot', 'Kategoriya', 'Turi', 'Mavjud', 'Featured', 'Amallar'].map(h => (
            <span key={h} style={A.th}>{h}</span>
          ))}
        </div>

        {filtrlangan.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#d1d5db', fontSize: '14px' }}>
            {filtrAktiv ? (
              <div>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔍</div>
                Filtr bo'yicha natija topilmadi
                <div style={{ marginTop: '10px' }}>
                  <button onClick={() => { setQidiruv(''); setTuriFilter(''); setKatFilter(''); setMavjudFilter('') }}
                    style={{ fontSize: '12px', color: '#E8491D', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
                    Filtrni tozalash
                  </button>
                </div>
              </div>
            ) : 'Mahsulotlar yo\'q'}
          </div>
        ) : filtrlangan.map((m, i) => (
          <div key={m.id} style={{
            display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 90px 80px 100px', gap: '12px',
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
                <span style={{ fontWeight: 600, fontSize: '13px', color: '#0a0a0a' }}>
                  {m.belgi === 'yangi' && '🆕 '}
                  {m.belgi === 'tez_orada' && '⏳ '}
                  {m.nom}
                </span>
                {m.brend && <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '1px' }}>{m.brend}</div>}
              </div>
            </div>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>{m.kategoriya?.nom || <span style={{ color: '#d1d5db' }}>—</span>}</span>
            <div>
              {m.turi && m.turi !== 'katalog' ? (
                <span style={{
                  fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px',
                  background: m.turi === 'ummed-brend' ? 'rgba(245,158,11,0.12)' : 'rgba(99,102,241,0.1)',
                  color: m.turi === 'ummed-brend' ? '#b45309' : '#6366f1',
                }}>
                  {m.turi === 'ummed-brend' ? '⭐ Brend' : '🤝 Dist.'}
                </span>
              ) : (
                <span style={{ fontSize: '11px', color: '#d1d5db' }}>katalog</span>
              )}
            </div>
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
