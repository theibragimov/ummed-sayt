'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { A } from '@/components/admin/AdminStyles'

export default function YangilikPage() {
  const [postlar, setPostlar] = useState([])
  const [filtr, setFiltr] = useState('all')

  useEffect(() => { yuklash() }, [])
  async function yuklash() { const r = await fetch('/api/yangiliklar'); setPostlar(await r.json()) }

  async function ochir(id, sarlavha) {
    if (!confirm(`"${sarlavha}" ni o'chirmoqchimisiz?`)) return
    await fetch(`/api/yangiliklar/${id}`, { method: 'DELETE' }); yuklash()
  }

  async function holatToggle(id, holat) {
    await fetch(`/api/yangiliklar/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ holat: holat === 'published' ? 'draft' : 'published' }) })
    yuklash()
  }

  const filtrlar = [{ val: 'all', label: 'Barchasi' }, { val: 'published', label: '✅ Nashr' }, { val: 'draft', label: '📝 Qoralama' }]
  const korsatilgan = filtr === 'all' ? postlar : postlar.filter(p => p.holat === filtr)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={A.h1}>Yangiliklar</h1>
          <p style={{ ...A.sub, marginTop: '4px' }}>Jami {postlar.length} ta maqola</p>
        </div>
        <Link href="/admin/yangiliklar/yangi" style={{ ...A.btnPrimary, textDecoration: 'none', display: 'inline-block' }}>
          + Yangi maqola
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {filtrlar.map(f => {
          const count = f.val === 'all' ? postlar.length : postlar.filter(p => p.holat === f.val).length
          const active = filtr === f.val
          return (
            <button key={f.val} onClick={() => setFiltr(f.val)} style={{
              padding: '7px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 500,
              border: active ? '1px solid #E8491D' : '1px solid rgba(0,0,0,0.08)',
              background: active ? 'rgba(232,73,29,0.07)' : '#fff',
              color: active ? '#E8491D' : '#6b7280',
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
            }}>
              {f.label} <span style={{ fontSize: '11px', fontWeight: 700, opacity: 0.8, marginLeft: '4px' }}>{count}</span>
            </button>
          )
        })}
      </div>

      <div style={A.card}>
        {korsatilgan.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#d1d5db', fontSize: '14px' }}>Maqolalar yo'q</div>
        ) : korsatilgan.map((p, i) => (
          <div key={p.id} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
            padding: '14px 20px', borderBottom: i < korsatilgan.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={A.badge(p.holat === 'published' ? 'rgba(61,184,81,0.1)' : '#f5f5f0', p.holat === 'published' ? '#16a34a' : '#9ca3af')}>
                  {p.holat === 'published' ? '✅ Nashr' : '📝 Qoralama'}
                </span>
                {p.kategoriya && <span style={{ fontSize: '11px', color: '#9ca3af' }}>{p.kategoriya.nom}</span>}
              </div>
              <div style={{ fontWeight: 600, fontSize: '14px', color: '#0a0a0a' }}>{p.sarlavha}</div>
              {p.muallif && <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>✍ {p.muallif}</div>}
              <div style={{ fontSize: '11px', color: '#d1d5db', marginTop: '4px' }}>{new Date(p.sana).toLocaleDateString('uz-UZ')}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
              <button onClick={() => holatToggle(p.id, p.holat)} style={{ fontSize: '12px', color: '#3DB851', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>
                {p.holat === 'published' ? 'Qoralamaga' : 'Nashr qil'}
              </button>
              <Link href={`/admin/yangiliklar/${p.id}`} style={{ fontSize: '12px', color: '#6366f1', textDecoration: 'none', fontWeight: 500 }}>Tahrirlash</Link>
              <button onClick={() => ochir(p.id, p.sarlavha)} style={{ fontSize: '12px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>O'chirish</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
