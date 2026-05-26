'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import RasmYuklash from './RasmYuklash'
import { A } from './AdminStyles'

export default function PostForm({ boshlangich = {}, postId }) {
  const router = useRouter()
  const [form, setForm] = useState({
    sarlavha: '', slug: '', muallif: '', qisqaTavsif: '',
    toliqMatn: '', holat: 'draft', kategoriyaId: '',
    muqovaRasmUrl: '', sana: new Date().toISOString().slice(0, 16),
    ...boshlangich,
  })
  const [kategoriyalar, setKategoriyalar] = useState([])
  const [saqlash, setSaqlash] = useState(false)

  useEffect(() => { fetch('/api/post-kategoriyalar').then(r => r.json()).then(setKategoriyalar) }, [])

  function oz(key, val) {
    setForm(f => ({ ...f, [key]: val }))
    if (key === 'sarlavha' && !postId)
      setForm(f => ({ ...f, sarlavha: val, slug: val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }))
  }

  async function yuborish(e) {
    e.preventDefault(); setSaqlash(true)
    const payload = { ...form, kategoriyaId: form.kategoriyaId ? parseInt(form.kategoriyaId) : null }
    const res = await fetch(postId ? `/api/yangiliklar/${postId}` : '/api/yangiliklar', {
      method: postId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    })
    if (res.ok) { router.push('/admin/yangiliklar'); router.refresh() }
    setSaqlash(false)
  }

  const F = ({ label, children }) => (
    <div style={{ marginBottom: '16px' }}>
      <label style={A.label}>{label}</label>
      {children}
    </div>
  )

  return (
    <form onSubmit={yuborish} style={{ maxWidth: '720px' }}>
      {/* Asosiy */}
      <div style={{ ...A.cardPad, marginBottom: '16px' }}>
        <div style={{ fontWeight: 700, fontSize: '14px', color: '#0a0a0a', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>Asosiy ma'lumotlar</div>
        <F label="Sarlavha *">
          <input required value={form.sarlavha} onChange={e => oz('sarlavha', e.target.value)} style={A.input} />
        </F>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <F label="Muallif"><input value={form.muallif} onChange={e => oz('muallif', e.target.value)} style={A.input} /></F>
          <F label="Sana"><input type="datetime-local" value={form.sana} onChange={e => oz('sana', e.target.value)} style={A.input} /></F>
          <F label="Kategoriya">
            <select value={form.kategoriyaId} onChange={e => oz('kategoriyaId', e.target.value)} style={A.select}>
              <option value="">— Tanlang —</option>
              {kategoriyalar.map(k => <option key={k.id} value={k.id}>{k.nom}</option>)}
            </select>
          </F>
          <F label="Holat">
            <select value={form.holat} onChange={e => oz('holat', e.target.value)} style={A.select}>
              <option value="draft">📝 Qoralama</option>
              <option value="published">✅ Nashr</option>
            </select>
          </F>
        </div>
      </div>

      {/* Rasm */}
      <div style={{ ...A.cardPad, marginBottom: '16px' }}>
        <div style={{ fontWeight: 700, fontSize: '14px', color: '#0a0a0a', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>Muqova rasm</div>
        <RasmYuklash label="" qiymat={form.muqovaRasmUrl} onChange={v => oz('muqovaRasmUrl', v)} />
      </div>

      {/* Matn */}
      <div style={{ ...A.cardPad, marginBottom: '24px' }}>
        <div style={{ fontWeight: 700, fontSize: '14px', color: '#0a0a0a', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>Matn</div>
        <F label="Qisqa tavsif (300 belgigacha)">
          <textarea value={form.qisqaTavsif} onChange={e => oz('qisqaTavsif', e.target.value)} rows={2} maxLength={300} style={A.textarea} />
        </F>
        <F label="To'liq matn (HTML)">
          <textarea value={form.toliqMatn} onChange={e => oz('toliqMatn', e.target.value)} rows={12} style={{ ...A.textarea, fontFamily: 'monospace', fontSize: '13px' }} placeholder="<h2>Sarlavha</h2><p>Matn...</p>" />
        </F>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button type="submit" disabled={saqlash} style={{ ...A.btnPrimary, padding: '11px 28px', opacity: saqlash ? 0.6 : 1 }}>
          {saqlash ? 'Saqlanmoqda...' : '💾 Saqlash'}
        </button>
        <button type="button" onClick={() => router.back()} style={{ ...A.btnGhost, padding: '11px 20px' }}>Bekor</button>
      </div>
    </form>
  )
}
