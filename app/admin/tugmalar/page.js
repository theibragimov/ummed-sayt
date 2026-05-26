'use client'
import { useState, useEffect } from 'react'
import { A } from '@/components/admin/AdminStyles'

const INIT = { nom: '', matn: '', havola: '', yangiTabda: false, faol: true }

export default function TugmalarPage() {
  const [tugmalar, setTugmalar] = useState([])
  const [form, setForm] = useState(INIT)
  const [tahrirlash, setTahrirlash] = useState(null)
  const [modal, setModal] = useState(false)

  useEffect(() => { yuklash() }, [])
  async function yuklash() { const r = await fetch('/api/tugmalar'); setTugmalar(await r.json()) }

  function ochModal(t = null) {
    setTahrirlash(t)
    setForm(t ? { nom: t.nom, matn: t.matn, havola: t.havola, yangiTabda: t.yangiTabda, faol: t.faol } : INIT)
    setModal(true)
  }

  async function saqlash() {
    if (tahrirlash) await fetch(`/api/tugmalar/${tahrirlash.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    else await fetch('/api/tugmalar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setModal(false); yuklash()
  }

  async function ochir(id, nom) {
    if (!confirm(`"${nom}" ni o'chirmoqchimisiz?`)) return
    await fetch(`/api/tugmalar/${id}`, { method: 'DELETE' }); yuklash()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={A.h1}>Tugmalar va Havolalar</h1>
          <p style={{ ...A.sub, marginTop: '4px' }}>Saytdagi CTA tugmalarini boshqarish</p>
        </div>
        <button onClick={() => ochModal()} style={A.btnPrimary}>+ Yangi tugma</button>
      </div>

      <div style={A.card}>
        {tugmalar.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#d1d5db', fontSize: '14px' }}>Tugmalar yo'q</div>
        ) : tugmalar.map((t, i) => (
          <div key={t.id} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 20px', borderBottom: i < tugmalar.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600, fontSize: '14px', color: '#0a0a0a' }}>{t.matn}</span>
                <span style={A.badge(t.faol ? 'rgba(61,184,81,0.1)' : '#f5f5f0', t.faol ? '#16a34a' : '#9ca3af')}>
                  {t.faol ? 'Faol' : 'Nofaol'}
                </span>
                {t.yangiTabda && <span style={{ fontSize: '11px', color: '#9ca3af' }}>↗ Yangi tab</span>}
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>📌 {t.nom}</div>
              <div style={{ fontSize: '12px', color: '#6366f1', marginTop: '2px' }}>🔗 {t.havola}</div>
            </div>
            <div style={{ display: 'flex', gap: '14px' }}>
              <button onClick={() => ochModal(t)} style={{ fontSize: '12px', color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>Tahrirlash</button>
              <button onClick={() => ochir(t.id, t.nom)} style={{ fontSize: '12px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>O'chirish</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div style={A.overlay}>
          <div style={A.modal}>
            <h3 style={{ ...A.h2, marginBottom: '20px' }}>{tahrirlash ? 'Tahrirlash' : 'Yangi tugma'}</h3>
            {[['nom', 'Ichki nom *', 'Masalan: Hero tugmasi'], ['matn', 'Tugma matni *', 'Masalan: Buyurtma bering'], ['havola', 'Havola (URL)', '/boglanish yoki https://...']].map(([key, label, ph]) => (
              <div key={key} style={{ marginBottom: '14px' }}>
                <label style={A.label}>{label}</label>
                <input value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={ph} style={A.input} />
              </div>
            ))}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: '#374151' }}>
                <input type="checkbox" checked={form.yangiTabda} onChange={e => setForm({ ...form, yangiTabda: e.target.checked })} style={{ width: '16px', height: '16px', accentColor: '#6366f1' }} />
                Yangi tabda ochish
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: '#374151' }}>
                <input type="checkbox" checked={form.faol} onChange={e => setForm({ ...form, faol: e.target.checked })} style={{ width: '16px', height: '16px', accentColor: '#3DB851' }} />
                Faol
              </label>
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
