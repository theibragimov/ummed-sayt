'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import RasmYuklash from '@/components/admin/RasmYuklash'
import { A } from '@/components/admin/AdminStyles'

const INIT = { nom: '', tavsif: '', tartibRaqami: 100, parentId: '', rasmUrl: '' }

export default function KategoriyalarPage() {
  const [kategoriyalar, setKategoriyalar] = useState([])
  const [form, setForm] = useState(INIT)
  const [tahrirlash, setTahrirlash] = useState(null)
  const [modal, setModal] = useState(false)

  useEffect(() => { yuklash() }, [])
  async function yuklash() { const r = await fetch('/api/kategoriyalar'); setKategoriyalar(await r.json()) }

  function ochModal(k = null) {
    setTahrirlash(k)
    setForm(k ? { nom: k.nom, tavsif: k.tavsif || '', tartibRaqami: k.tartibRaqami, parentId: k.parentId || '', rasmUrl: k.rasmUrl || '' } : INIT)
    setModal(true)
  }

  async function saqlash() {
    const p = { ...form, tartibRaqami: parseInt(form.tartibRaqami) || 100, parentId: form.parentId ? parseInt(form.parentId) : null }
    if (tahrirlash) await fetch(`/api/kategoriyalar/${tahrirlash.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) })
    else await fetch('/api/kategoriyalar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) })
    setModal(false); yuklash()
  }

  async function ochir(id, nom) {
    if (!confirm(`"${nom}" ni o'chirmoqchimisiz?`)) return
    await fetch(`/api/kategoriyalar/${id}`, { method: 'DELETE' }); yuklash()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={A.h1}>Kategoriyalar</h1>
          <p style={{ ...A.sub, marginTop: '4px' }}>Jami {kategoriyalar.length} ta kategoriya</p>
        </div>
        <button onClick={() => ochModal()} style={A.btnPrimary}>+ Yangi kategoriya</button>
      </div>

      <div style={A.card}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 80px 80px 100px', gap: '12px', padding: '10px 20px', background: '#f9faf8', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          {['Kategoriya', 'Asosiy', 'Tartib', 'Mahsulot', 'Amallar'].map(h => <span key={h} style={A.th}>{h}</span>)}
        </div>
        {kategoriyalar.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#d1d5db', fontSize: '14px' }}>Kategoriyalar yo'q</div>
        ) : kategoriyalar.map((k, i) => (
          <div key={k.id} style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr 80px 80px 100px', gap: '12px',
            padding: '12px 20px', borderBottom: i < kategoriyalar.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
            alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '9px', overflow: 'hidden', background: '#f5f5f0', flexShrink: 0, position: 'relative' }}>
                {k.rasmUrl
                  ? <Image src={k.rasmUrl} alt={k.nom} fill style={{ objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>📁</div>
                }
              </div>
              <span style={{ fontWeight: 600, fontSize: '14px', color: '#0a0a0a' }}>{k.nom}</span>
            </div>
            <span style={{ fontSize: '13px', color: '#9ca3af' }}>{k.parent?.nom || '—'}</span>
            <span style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center' }}>{k.tartibRaqami}</span>
            <div style={{ textAlign: 'center' }}>
              <span style={A.badge('rgba(99,102,241,0.08)', '#6366f1')}>{k._count?.mahsulotlar ?? 0}</span>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => ochModal(k)} style={{ fontSize: '12px', color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0, fontWeight: 500 }}>Tahrirlash</button>
              <button onClick={() => ochir(k.id, k.nom)} style={{ fontSize: '12px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>O'chirish</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div style={A.overlay}>
          <div style={A.modal}>
            <h3 style={{ ...A.h2, marginBottom: '20px' }}>{tahrirlash ? 'Tahrirlash' : 'Yangi kategoriya'}</h3>
            <div style={{ marginBottom: '14px' }}>
              <label style={A.label}>Nom *</label>
              <input value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} style={A.input} required />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={A.label}>Asosiy kategoriya</label>
              <select value={form.parentId} onChange={e => setForm({ ...form, parentId: e.target.value })} style={A.select}>
                <option value="">— Yo'q (asosiy) —</option>
                {kategoriyalar.filter(k => k.id !== tahrirlash?.id).map(k => <option key={k.id} value={k.id}>{k.nom}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={A.label}>Tartib raqami</label>
                <input type="number" value={form.tartibRaqami} onChange={e => setForm({ ...form, tartibRaqami: e.target.value })} style={A.input} />
              </div>
              <div>
                <label style={A.label}>Tavsif</label>
                <input value={form.tavsif} onChange={e => setForm({ ...form, tavsif: e.target.value })} style={A.input} />
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <RasmYuklash label="Rasm" qiymat={form.rasmUrl} onChange={v => setForm({ ...form, rasmUrl: v })} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={saqlash} style={{ ...A.btnPrimary, flex: 1 }}>Saqlash</button>
              <button onClick={() => setModal(false)} style={{ ...A.btnGhost, flex: 1 }}>Bekor</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
