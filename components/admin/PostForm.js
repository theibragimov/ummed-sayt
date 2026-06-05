'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import RasmYuklash from './RasmYuklash'
import { A } from './AdminStyles'

export default function PostForm({ boshlangich = {}, postId }) {
  const router = useRouter()
  const [form, setForm] = useState({
    sarlavha: '', sarlavhaRu: '', slug: '', muallif: '',
    qisqaTavsif: '', qisqaTavsifRu: '',
    toliqMatn: '', toliqMatnRu: '',
    holat: 'draft', kategoriyaId: '',
    muqovaRasmUrl: '', sana: new Date().toISOString().slice(0, 16),
    ...boshlangich,
  })
  const [kategoriyalar, setKategoriyalar] = useState([])
  const [saqlash, setSaqlash] = useState(false)
  const [til, setTil] = useState('uz') // 'uz' | 'ru'

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

  return (
    <form onSubmit={yuborish} style={{ maxWidth: '720px' }}>
      {/* Asosiy */}
      <div style={{ ...A.cardPad, marginBottom: '16px' }}>
        <div style={{ fontWeight: 700, fontSize: '14px', color: '#0a0a0a', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          Asosiy ma'lumotlar
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={A.label}>Sarlavha (O'zbek) *</label>
          <input required value={form.sarlavha} onChange={e => oz('sarlavha', e.target.value)} style={A.input} placeholder="O'zbekcha sarlavha" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={A.label}>Muallif</label>
            <input value={form.muallif} onChange={e => oz('muallif', e.target.value)} style={A.input} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={A.label}>Sana</label>
            <input type="datetime-local" value={form.sana} onChange={e => oz('sana', e.target.value)} style={A.input} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={A.label}>Kategoriya</label>
            <select value={form.kategoriyaId} onChange={e => oz('kategoriyaId', e.target.value)} style={A.select}>
              <option value="">— Tanlang —</option>
              {kategoriyalar.map(k => <option key={k.id} value={k.id}>{k.nom}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={A.label}>Holat</label>
            <select value={form.holat} onChange={e => oz('holat', e.target.value)} style={A.select}>
              <option value="draft">📝 Qoralama</option>
              <option value="published">✅ Nashr</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rasm */}
      <div style={{ ...A.cardPad, marginBottom: '16px' }}>
        <div style={{ fontWeight: 700, fontSize: '14px', color: '#0a0a0a', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          Muqova rasm
        </div>
        <RasmYuklash label="" qiymat={form.muqovaRasmUrl} onChange={v => oz('muqovaRasmUrl', v)} />
      </div>

      {/* Matn — Til tanlov tablar */}
      <div style={{ ...A.cardPad, marginBottom: '24px' }}>
        {/* Tab sarlavhasi */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ fontWeight: 700, fontSize: '14px', color: '#0a0a0a' }}>Matn</div>
          <div style={{ display: 'flex', gap: '4px', background: '#f0f0ee', borderRadius: '8px', padding: '3px' }}>
            {['uz', 'ru'].map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTil(t)}
                style={{
                  padding: '5px 16px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
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

        {/* O'zbek matnlari */}
        {til === 'uz' && (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={A.label}>Qisqa tavsif (300 belgigacha)</label>
              <textarea value={form.qisqaTavsif} onChange={e => oz('qisqaTavsif', e.target.value)} rows={2} maxLength={300} style={A.textarea} placeholder="O'zbekcha qisqa tavsif..." />
            </div>
            <div style={{ marginBottom: '0' }}>
              <label style={A.label}>To'liq matn (HTML)</label>
              <textarea value={form.toliqMatn} onChange={e => oz('toliqMatn', e.target.value)} rows={12} style={{ ...A.textarea, fontFamily: 'monospace', fontSize: '13px' }} placeholder="<h2>Sarlavha</h2><p>Matn...</p>" />
            </div>
          </>
        )}

        {/* Rus matnlari */}
        {til === 'ru' && (
          <>
            <div style={{ marginBottom: '8px', padding: '10px 14px', background: 'rgba(99,102,241,0.05)', borderRadius: '8px', border: '1px solid rgba(99,102,241,0.12)', fontSize: '12px', color: '#6366f1' }}>
              🇷🇺 Rus tilidagi kontentni to'ldiring — sayt rus tiliga o'zgarganda shu ma'lumotlar ko'rsatiladi
            </div>
            <div style={{ marginBottom: '16px', marginTop: '12px' }}>
              <label style={A.label}>Sarlavha (Русский)</label>
              <input value={form.sarlavhaRu} onChange={e => oz('sarlavhaRu', e.target.value)} style={A.input} placeholder="Заголовок на русском..." />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={A.label}>Краткое описание (до 300 символов)</label>
              <textarea value={form.qisqaTavsifRu} onChange={e => oz('qisqaTavsifRu', e.target.value)} rows={2} maxLength={300} style={A.textarea} placeholder="Краткое описание на русском..." />
            </div>
            <div style={{ marginBottom: '0' }}>
              <label style={A.label}>Полный текст (HTML)</label>
              <textarea value={form.toliqMatnRu} onChange={e => oz('toliqMatnRu', e.target.value)} rows={12} style={{ ...A.textarea, fontFamily: 'monospace', fontSize: '13px' }} placeholder="<h2>Заголовок</h2><p>Текст...</p>" />
            </div>
          </>
        )}
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
