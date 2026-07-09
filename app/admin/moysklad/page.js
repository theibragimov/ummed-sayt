'use client'
import { useState, useEffect } from 'react'
import { A } from '@/components/admin/AdminStyles'

export default function MoySkladPage() {
  const [status, setStatus] = useState(null)
  const [jarayon, setJarayon] = useState(false)
  const [natija, setNatija] = useState(null)
  const [xato, setXato] = useState('')
  const [rasmNatija, setRasmNatija] = useState(null)
  const [rasmXato, setRasmXato] = useState('')
  const [topStatus, setTopStatus] = useState(null)
  const [topJarayon, setTopJarayon] = useState(false)
  const [topXato, setTopXato] = useState('')

  useEffect(() => { statusniYuklash(); topStatusniYuklash() }, [])

  async function topStatusniYuklash() {
    try {
      const res = await fetch('/api/order/topsales')
      setTopStatus(await res.json())
    } catch {}
  }

  async function topSotuvlarniQaytaHisoblash() {
    setTopJarayon(true)
    setTopXato('')
    try {
      const res = await fetch('/api/moysklad/topsales-sync?secret=ummed-cron-secret-2024')
      const data = await res.json()
      if (res.ok) await topStatusniYuklash()
      else setTopXato(data.xato || 'Xatolik yuz berdi')
    } catch (e) {
      setTopXato(e.message)
    } finally {
      setTopJarayon(false)
    }
  }

  async function statusniYuklash() {
    try {
      const res = await fetch('/api/moysklad/status')
      setStatus(await res.json())
    } catch {}
  }

  async function syncBoshlash(toliq = false) {
    setJarayon(toliq ? 'toliq' : 'incremental')
    setNatija(null)
    setXato('')
    try {
      const url = `/api/moysklad/sync?secret=ummed-cron-secret-2024${toliq ? '&toliq=true' : ''}`
      const res = await fetch(url)
      const data = await res.json()
      if (res.ok) { setNatija(data); statusniYuklash() }
      else setXato(data.xato || 'Xatolik yuz berdi')
    } catch (e) {
      setXato(e.message)
    } finally {
      setJarayon(false)
    }
  }

  async function rasmlarniYukla() {
    setJarayon('rasmlar')
    setRasmNatija(null)
    setRasmXato('')
    try {
      const res = await fetch('/api/moysklad/sync-images?secret=ummed-cron-secret-2024')
      const data = await res.json()
      if (res.ok) setRasmNatija(data)
      else setRasmXato(data.xato || 'Xatolik yuz berdi')
    } catch (e) {
      setRasmXato(e.message)
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
          Mahsulotlar va kategoriyalar MoySkladdan qo'lda yangilanadi
        </p>
      </div>

      {/* Status */}
      <div style={{ ...A.cardPad, marginBottom: '16px' }}>
        <div style={{ fontWeight: 700, fontSize: '14px', color: '#0a0a0a', marginBottom: '16px' }}>Holat</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          <Stat label="Oxirgi sync" value={status ? vaqtFormat(status.oxirgiSync) : '...'} />
          <Stat label="MS mahsulotlar" value={status ? status.moyskladMahsulotlar : '...'} />
          <Stat label="MS kategoriyalar" value={status ? status.moyskladKategoriyalar : '...'} />
        </div>
      </div>

      {/* Sinxronizatsiya tugmalari */}
      <div style={{ ...A.cardPad, marginBottom: '16px' }}>
        <div style={{ fontWeight: 700, fontSize: '14px', color: '#0a0a0a', marginBottom: '8px' }}>
          Sinxronlash
        </div>

        <div style={{ ...A.sub, marginBottom: '16px', padding: '12px', background: '#f9fafb', borderRadius: '8px', fontSize: '13px' }}>
          <div style={{ marginBottom: '6px' }}>
            <strong>Incremental:</strong> Faqat yangi va o'zgargan mahsulotlar yangilanadi. Tez ishlaydi.
          </div>
          <div>
            <strong>To'liq sync:</strong> Hamma mahsulot qayta yuklanadi, rasmlar ham. Sekin, lekin to'liq tozalanadi.
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => syncBoshlash(false)}
            disabled={!!jarayon}
            style={{ ...A.btnPrimary, opacity: jarayon ? 0.6 : 1, cursor: jarayon ? 'wait' : 'pointer' }}>
            {jarayon === 'incremental' ? '⏳ Sinxronlanmoqda...' : '🔄 Incremental sync'}
          </button>
          <button
            onClick={() => syncBoshlash(true)}
            disabled={!!jarayon}
            style={{
              padding: '10px 20px', borderRadius: '8px', fontWeight: 600, fontSize: '14px',
              border: '1px solid #d1d5db', background: '#fff', color: '#374151',
              opacity: jarayon ? 0.6 : 1, cursor: jarayon ? 'wait' : 'pointer',
            }}>
            {jarayon === 'toliq' ? '⏳ To\'liq sync...' : '♻️ To\'liq sync'}
          </button>
        </div>

        {xato && (
          <div style={{ marginTop: '12px', padding: '10px 14px', background: '#fef2f2', borderRadius: '8px', color: '#dc2626', fontSize: '13px' }}>
            ❌ {xato}
          </div>
        )}
      </div>

      {/* Rasmlarni yuklash */}
      <div style={{ ...A.cardPad, marginBottom: '16px' }}>
        <div style={{ fontWeight: 700, fontSize: '14px', color: '#0a0a0a', marginBottom: '8px' }}>
          🖼️ Rasmlarni yuklash
        </div>
        <div style={{ ...A.sub, marginBottom: '16px', fontSize: '13px' }}>
          Rasmi yo'q mahsulotlar uchun MoySkladdan rasm yuklaydi (har safar 80 tagacha). To'liq syncdan keyin ishlatiladi.
        </div>
        <button
          onClick={rasmlarniYukla}
          disabled={!!jarayon}
          style={{ padding: '10px 20px', borderRadius: '8px', fontWeight: 600, fontSize: '14px',
            border: '1px solid #d1d5db', background: '#fff', color: '#374151',
            opacity: jarayon ? 0.6 : 1, cursor: jarayon ? 'wait' : 'pointer' }}>
          {jarayon === 'rasmlar' ? '⏳ Rasmlar yuklanmoqda...' : '🖼️ Rasmsiz mahsulotlarga rasm yuklash'}
        </button>
        {rasmXato && (
          <div style={{ marginTop: '12px', padding: '10px 14px', background: '#fef2f2', borderRadius: '8px', color: '#dc2626', fontSize: '13px' }}>
            ❌ {rasmXato}
          </div>
        )}
        {rasmNatija && (
          <div style={{ marginTop: '12px', padding: '10px 14px', background: '#f0fdf4', borderRadius: '8px', fontSize: '13px', color: '#374151' }}>
            ✅ Yuklandi: <b>{rasmNatija.yuklandi}</b> ta &nbsp;•&nbsp; Xato: <b>{rasmNatija.xato}</b> ta &nbsp;•&nbsp;
            Qolgan rasmsiz: <b>{rasmNatija.qolgan}</b> ta
            {rasmNatija.qolgan > 0 && <span style={{ color: '#E8491D', marginLeft: 8 }}>← Yana bosing</span>}
          </div>
        )}
      </div>

      {/* TOP mahsulotlar */}
      <div style={{ ...A.cardPad, marginBottom: '16px' }}>
        <div style={{ fontWeight: 700, fontSize: '14px', color: '#0a0a0a', marginBottom: '8px' }}>
          🏆 TOP 50 mahsulotlar
        </div>
        <div style={{ ...A.sub, marginBottom: '16px', fontSize: '13px' }}>
          O'tgan TO'LIQ kalendar oyi bo'yicha (masalan hozir iyulda bo'lsak — 1-30 iyun), MoySkladdagi "Прибыльность → По товарам" hisobotidagi kabi har bir aniq mahsulot/modifikatsiya alohida hisoblanadi. Saytda shulardan hozir omborda bor birinchi 50 tasi ko'rsatiladi — tugab qolganlari o'tkazib yuboriladi. Har 2 haftada (1- va 15-sanalarda) avtomatik yangilanadi.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <Stat label="Oxirgi hisoblangan" value={topStatus ? vaqtFormat(topStatus.hisoblanganVaqt) : '...'} />
          <Stat label="Sotilgan mahsulotlar (davr uchun)" value={topStatus ? `${topStatus.top50Ranked?.length ?? 0} ta` : '...'} />
        </div>
        {topStatus?.davrBoshi && topStatus?.davrOxiri && (
          <div style={{ ...A.sub, marginBottom: '16px', fontSize: '12px' }}>
            Hisoblangan davr: <b>{topStatus.davrBoshi.slice(0, 10)}</b> — <b>{topStatus.davrOxiri.slice(0, 10)}</b> (MoySkladda solishtirish uchun shu sanalarni tanlang)
          </div>
        )}
        <button
          onClick={topSotuvlarniQaytaHisoblash}
          disabled={topJarayon}
          style={{ padding: '10px 20px', borderRadius: '8px', fontWeight: 600, fontSize: '14px',
            border: '1px solid #d1d5db', background: '#fff', color: '#374151',
            opacity: topJarayon ? 0.6 : 1, cursor: topJarayon ? 'wait' : 'pointer' }}>
          {topJarayon ? '⏳ Hisoblanmoqda...' : '🔄 Hozir qayta hisoblash'}
        </button>
        {topXato && (
          <div style={{ marginTop: '12px', padding: '10px 14px', background: '#fef2f2', borderRadius: '8px', color: '#dc2626', fontSize: '13px' }}>
            ❌ {topXato}
          </div>
        )}
      </div>

      {/* Natija */}
      {natija && (
        <div style={{ ...A.cardPad, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <div style={{ fontWeight: 700, fontSize: '14px', color: '#16a34a', marginBottom: '12px' }}>
            ✅ {natija.tur === 'incremental' ? 'Incremental' : "To'liq"} sinxronizatsiya yakunlandi
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px', color: '#374151' }}>
            <div>Kategoriyalar qo'shildi: <b>{natija.kategoriyalar?.qoshildi}</b></div>
            <div>Kategoriyalar yangilandi: <b>{natija.kategoriyalar?.yangilandi}</b></div>
            <div>Mahsulotlar qo'shildi: <b>{natija.mahsulotlar?.qoshildi}</b></div>
            <div>Mahsulotlar yangilandi: <b>{natija.mahsulotlar?.yangilandi}</b></div>
            <div>Yashirildi: <b>{natija.mahsulotlar?.yashirildi}</b></div>
            <div>Rasmlar yuklandi: <b>{natija.rasmlar?.yuklandi}</b></div>
            <div>Variantlar: <b>{natija.variantlar?.yuklandi}</b></div>
            {natija.rasmlar?.xato > 0 && (
              <div style={{ color: '#dc2626' }}>Rasm xatolari: <b>{natija.rasmlar?.xato}</b></div>
            )}
          </div>
        </div>
      )}

      {/* Qanday ishlaydi */}
      <div style={{ ...A.cardPad, marginTop: '16px', background: 'rgba(232,73,29,0.03)', border: '1px solid rgba(232,73,29,0.12)' }}>
        <div style={{ fontWeight: 700, fontSize: '13px', color: '#E8491D', marginBottom: '10px' }}>ℹ️ Qanday ishlaydi?</div>
        <ul style={{ fontSize: '13px', color: '#6b7280', paddingLeft: '18px', margin: 0, lineHeight: 1.9 }}>
          <li><b>Incremental:</b> Oxirgi sync dan keyin yangilangan mahsulotlar olinadi</li>
          <li>Yangi mahsulot qo'shilsa — <b>Incremental sync</b> ni bosing (tez)</li>
          <li>Mahsulot MoySkladda o'chirilsa — saytda avtomatik yashiriladi</li>
          <li>Rasmlar Supabase'da saqlanadi (MoySklad o'chsa ham ishlaydi)</li>
          <li>Narx va tavsif ko'rsatilmaydi. Modifikatsiyalar (razmer, rang) ko'rinadi</li>
          <li>Kategoriyaga kiritilmagan mahsulotlar saytda chiqmaydi</li>
        </ul>
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
      <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px', fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: '14px', fontWeight: 700, color: '#0a0a0a' }}>{value}</div>
    </div>
  )
}
