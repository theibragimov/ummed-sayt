'use client'
import { useState, useEffect } from 'react'
import { A } from '@/components/admin/AdminStyles'

export default function MoySkladPage() {
  const [status, setStatus] = useState(null)
  const [jarayon, setJarayon] = useState(false)
  const [natija, setNatija] = useState(null)
  const [xato, setXato] = useState('')

  useEffect(() => {
    statusniYuklash()
  }, [])

  async function statusniYuklash() {
    try {
      const res = await fetch('/api/moysklad/status')
      const data = await res.json()
      setStatus(data)
    } catch {}
  }

  async function syncBoshlash() {
    setJarayon(true)
    setNatija(null)
    setXato('')
    try {
      const res = await fetch('/api/moysklad/sync?secret=ummed-cron-secret-2024', {
        method: 'GET',
      })
      const data = await res.json()
      if (res.ok) {
        setNatija(data)
        statusniYuklash()
      } else {
        setXato(data.xato || 'Xatolik yuz berdi')
      }
    } catch (e) {
      setXato(e.message)
    } finally {
      setJarayon(false)
    }
  }

  const vaqtFormat = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleString('uz-UZ', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  return (
    <div style={{ maxWidth: '720px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={A.h1}>MoySklad sinxronizatsiyasi</h1>
        <p style={{ ...A.sub, marginTop: '4px' }}>
          Mahsulotlar va kategoriyalar MoySkladdan avtomatik yangilanadi (har 1 soatda)
        </p>
      </div>

      {/* Status kartochka */}
      <div style={{ ...A.cardPad, marginBottom: '16px' }}>
        <div style={{ fontWeight: 700, fontSize: '14px', color: '#0a0a0a', marginBottom: '16px' }}>
          Holat
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          <Stat label="Oxirgi sync" value={status ? vaqtFormat(status.oxirgiSync) : '...'} />
          <Stat label="MS mahsulotlar" value={status ? status.moyskladMahsulotlar : '...'} />
          <Stat label="MS kategoriyalar" value={status ? status.moyskladKategoriyalar : '...'} />
        </div>
      </div>

      {/* Qo'lda sinxronizatsiya */}
      <div style={{ ...A.cardPad, marginBottom: '16px' }}>
        <div style={{ fontWeight: 700, fontSize: '14px', color: '#0a0a0a', marginBottom: '8px' }}>
          Qo'lda sinxronlash
        </div>
        <p style={{ ...A.sub, marginBottom: '16px' }}>
          Yangi mahsulot qo'shgan bo'lsangiz yoki 1 soatni kutmasdan yangilash uchun ishlatring.
          Jarayon bir necha daqiqa davom etishi mumkin.
        </p>
        <button
          onClick={syncBoshlash}
          disabled={jarayon}
          style={{ ...A.btnPrimary, opacity: jarayon ? 0.6 : 1, cursor: jarayon ? 'wait' : 'pointer' }}
        >
          {jarayon ? '⏳ Sinxronlanmoqda...' : '🔄 Hozir sinxronlash'}
        </button>
        {xato && (
          <div style={{ marginTop: '12px', padding: '10px 14px', background: '#fef2f2', borderRadius: '8px', color: '#dc2626', fontSize: '13px' }}>
            ❌ {xato}
          </div>
        )}
      </div>

      {/* Natija */}
      {natija && (
        <div style={{ ...A.cardPad, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <div style={{ fontWeight: 700, fontSize: '14px', color: '#16a34a', marginBottom: '12px' }}>
            ✅ Sinxronizatsiya muvaffaqiyatli yakunlandi
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px', color: '#374151' }}>
            <div>Kategoriyalar qo'shildi: <b>{natija.kategoriyalar?.qoshildi}</b></div>
            <div>Kategoriyalar yangilandi: <b>{natija.kategoriyalar?.yangilandi}</b></div>
            <div>Mahsulotlar qo'shildi: <b>{natija.mahsulotlar?.qoshildi}</b></div>
            <div>Mahsulotlar yangilandi: <b>{natija.mahsulotlar?.yangilandi}</b></div>
            <div>Yashirildi (o'chirilgan): <b>{natija.mahsulotlar?.yashirildi}</b></div>
            <div>Rasmlar yuklandi: <b>{natija.rasmlar?.yuklandi}</b></div>
            {natija.rasmlar?.xato > 0 && (
              <div style={{ color: '#dc2626' }}>Rasm xatolari: <b>{natija.rasmlar?.xato}</b></div>
            )}
          </div>
        </div>
      )}

      {/* Qanday ishlaydi */}
      <div style={{ ...A.cardPad, marginTop: '16px', background: 'rgba(232,73,29,0.03)', border: '1px solid rgba(232,73,29,0.12)' }}>
        <div style={{ fontWeight: 700, fontSize: '13px', color: '#E8491D', marginBottom: '10px' }}>
          ℹ️ Qanday ishlaydi?
        </div>
        <ul style={{ fontSize: '13px', color: '#6b7280', paddingLeft: '18px', margin: 0, lineHeight: 1.8 }}>
          <li>Har <b>1 soatda</b> MoySkladdan yangi ma'lumotlar olinadi</li>
          <li>MoySkladga qo'shilgan mahsulotlar 1 soatdan keyin saytda ko'rinadi</li>
          <li>MoySkladda <b>arxivlangan</b> mahsulotlar saytda yashiriladi</li>
          <li>Rasmlar Supabase'ga yuklanadi (MoySklad o'chsa ham rasmlar ishlaydi)</li>
          <li>MoySklad vaqtincha ishlamasa, saytdagi ma'lumotlar o'zgarmaydi</li>
        </ul>
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
      <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px', fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: '15px', fontWeight: 700, color: '#0a0a0a' }}>{value}</div>
    </div>
  )
}
