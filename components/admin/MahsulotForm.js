'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import RasmYuklash from './RasmYuklash'
import { A } from './AdminStyles'

export default function MahsulotForm({ boshlangich = {}, mahsulotId }) {
  const router = useRouter()
  const [form, setForm] = useState({
    nom: '', slug: '', narx: '', narxBirligi: "so'm",
    brend: '', modelRaqami: '', qisqaTavsif: '', toliqTavsif: '',
    mavjudligi: true, featured: false, kategoriyaId: '',
    asosiyRasmUrl: '', ...boshlangich,
  })
  const [kategoriyalar, setKategoriyalar] = useState([])
  const [saqlash, setSaqlash] = useState(false)
  const [xato, setXato] = useState('')

  useEffect(() => {
    fetch('/api/kategoriyalar').then(r => r.json()).then(setKategoriyalar)
  }, [])

  function oz(key, val) {
    setForm(f => ({ ...f, [key]: val }))
    if (key === 'nom' && !mahsulotId) {
      setForm(f => ({ ...f, nom: val, slug: val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }))
    }
  }

  async function yuborish(e) {
    e.preventDefault(); setSaqlash(true); setXato('')
    const payload = { ...form, narx: form.narx ? parseFloat(form.narx) : null, kategoriyaId: form.kategoriyaId ? parseInt(form.kategoriyaId) : null }
    const res = await fetch(mahsulotId ? `/api/mahsulotlar/${mahsulotId}` : '/api/mahsulotlar', {
      method: mahsulotId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) { router.push('/admin/mahsulotlar'); router.refresh() }
    else setXato('Saqlashda xatolik')
    setSaqlash(false)
  }

  return (
    <form onSubmit={yuborish} style={{ maxWidth: '680px' }}>
      {xato && (
        <div style={{ background: 'rgba(232,73,29,0.08)', border: '1px solid rgba(232,73,29,0.2)', color: '#E8491D', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', marginBottom: '20px' }}>
          {xato}
        </div>
      )}

      {/* Asosiy */}
      <div style={{ ...A.cardPad, marginBottom: '16px' }}>
        <div style={{ fontWeight: 700, fontSize: '14px', color: '#0a0a0a', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          Asosiy ma'lumotlar
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={A.label}>Mahsulot nomi *</label>
          <input required value={form.nom} onChange={e => oz('nom', e.target.value)} style={A.input} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{ marginBottom: '16px' }}><label style={A.label}>Brend</label><input value={form.brend} onChange={e => oz('brend', e.target.value)} style={A.input} /></div>
          <div style={{ marginBottom: '16px' }}><label style={A.label}>Model raqami</label><input value={form.modelRaqami} onChange={e => oz('modelRaqami', e.target.value)} style={A.input} /></div>
          <div style={{ marginBottom: '16px' }}><label style={A.label}>Narx</label><input type="number" value={form.narx} onChange={e => oz('narx', e.target.value)} style={A.input} /></div>
          <div style={{ marginBottom: '16px' }}><label style={A.label}>Narx birligi</label><input value={form.narxBirligi} onChange={e => oz('narxBirligi', e.target.value)} style={A.input} /></div>
          <div style={{ marginBottom: '16px' }}><label style={A.label}>Kategoriya</label>
            <select value={form.kategoriyaId} onChange={e => oz('kategoriyaId', e.target.value)} style={A.select}>
              <option value="">— Tanlang —</option>
              {kategoriyalar.map(k => <option key={k.id} value={k.id}>{k.nom}</option>)}
            </select>
          </div>
          <div style={{ paddingTop: '20px' }}>
            <div style={{ display: 'flex', gap: '20px', marginTop: '6px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: '#374151' }}>
                <input type="checkbox" checked={form.mavjudligi} onChange={e => oz('mavjudligi', e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#3DB851' }} />
                Mavjud
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: '#374151' }}>
                <input type="checkbox" checked={form.featured} onChange={e => oz('featured', e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#f59e0b' }} />
                ★ Featured
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Rasm */}
      <div style={{ ...A.cardPad, marginBottom: '16px' }}>
        <div style={{ fontWeight: 700, fontSize: '14px', color: '#0a0a0a', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          Asosiy rasm
        </div>
        <RasmYuklash label="" qiymat={form.asosiyRasmUrl} onChange={v => oz('asosiyRasmUrl', v)} />
      </div>

      {/* Tavsif */}
      <div style={{ ...A.cardPad, marginBottom: '24px' }}>
        <div style={{ fontWeight: 700, fontSize: '14px', color: '#0a0a0a', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          Tavsiflar
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={A.label}>Qisqa tavsif</label>
          <textarea value={form.qisqaTavsif} onChange={e => oz('qisqaTavsif', e.target.value)} rows={2} style={A.textarea} />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={A.label}>To'liq tavsif (HTML qabul qilinadi)</label>
          <textarea value={form.toliqTavsif} onChange={e => oz('toliqTavsif', e.target.value)} rows={7} style={{ ...A.textarea, fontFamily: 'monospace', fontSize: '13px' }} placeholder="<p>Tavsif...</p>" />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button type="submit" disabled={saqlash} style={{ ...A.btnPrimary, padding: '11px 28px', opacity: saqlash ? 0.6 : 1 }}>
          {saqlash ? 'Saqlanmoqda...' : '💾 Saqlash'}
        </button>
        <button type="button" onClick={() => router.back()} style={{ ...A.btnGhost, padding: '11px 20px' }}>
          Bekor
        </button>
      </div>
    </form>
  )
}
