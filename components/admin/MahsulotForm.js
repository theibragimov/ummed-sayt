'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import RasmYuklash from './RasmYuklash'
import VideoYuklash from './VideoYuklash'
import { A } from './AdminStyles'

export default function MahsulotForm({ boshlangich = {}, mahsulotId }) {
  const router = useRouter()
  const [form, setForm] = useState({
    nom: '', nomRu: '', nomEn: '', slug: '', narx: '', narxBirligi: "so'm",
    brend: '', modelRaqami: '', qisqaTavsif: '', qisqaTavsifRu: '', qisqaTavsifEn: '',
    toliqTavsif: '', toliqTavsifRu: '', toliqTavsifEn: '',
    mavjudligi: true, featured: false, belgi: '', kategoriyaId: '',
    asosiyRasmUrl: '', rasmlar: [], videoUrl: '', turi: 'katalog', ...boshlangich,
  })
  const [kategoriyalar, setKategoriyalar] = useState([])
  const [saqlash, setSaqlash] = useState(false)
  const [xato, setXato] = useState('')
  const [tavsifRasmYuklanmoqda, setTavsifRasmYuklanmoqda] = useState('')
  const tavsifInputRef = useRef()
  const tavsifMaqsadKey = useRef('')
  const [galereyaYuklanmoqda, setGalereyaYuklanmoqda] = useState(false)
  const galereyaInputRef = useRef()

  useEffect(() => {
    fetch('/api/kategoriyalar').then(r => r.json()).then(setKategoriyalar)
  }, [])

  function oz(key, val) {
    setForm(f => ({ ...f, [key]: val }))
    if (key === 'nom' && !mahsulotId) {
      setForm(f => ({ ...f, nom: val, slug: val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }))
    }
  }

  function tavsifgaRasmQoshish(key) {
    tavsifMaqsadKey.current = key
    tavsifInputRef.current?.click()
  }

  async function tavsifRasmTanlandi(e) {
    const fayl = e.target.files[0]
    e.target.value = ''
    if (!fayl) return
    const key = tavsifMaqsadKey.current
    setTavsifRasmYuklanmoqda(key)
    try {
      const fd = new FormData()
      fd.append('fayl', fayl)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json().catch(() => ({}))
      if (data.url) {
        oz(key, (form[key] || '') + `\n<img src="${data.url}" alt="" />\n`)
      } else {
        setXato('Rasm yuklashda xatolik: ' + (data.xato || res.status))
      }
    } catch (err) {
      setXato('Tarmoq xatosi: ' + err.message)
    }
    setTavsifRasmYuklanmoqda('')
  }

  async function galereyagaRasmlarQoshish(e) {
    const fayllar = Array.from(e.target.files || [])
    e.target.value = ''
    if (!fayllar.length) return
    setGalereyaYuklanmoqda(true)
    for (const fayl of fayllar) {
      try {
        const fd = new FormData()
        fd.append('fayl', fayl)
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const data = await res.json().catch(() => ({}))
        if (data.url) {
          setForm(f => ({ ...f, rasmlar: [...f.rasmlar, data.url] }))
        } else {
          setXato('Rasm yuklashda xatolik: ' + (data.xato || res.status))
        }
      } catch (err) {
        setXato('Tarmoq xatosi: ' + err.message)
      }
    }
    setGalereyaYuklanmoqda(false)
  }

  function galereyadanOlibTashlash(i) {
    setForm(f => ({ ...f, rasmlar: f.rasmlar.filter((_, idx) => idx !== i) }))
  }

  async function yuborish(e) {
    e.preventDefault(); setSaqlash(true); setXato('')
    const payload = { ...form, narx: form.narx ? parseFloat(form.narx) : null, kategoriyaId: form.kategoriyaId ? parseInt(form.kategoriyaId) : null, belgi: form.belgi || null }
    const res = await fetch(mahsulotId ? `/api/mahsulotlar/${mahsulotId}` : '/api/mahsulotlar', {
      method: mahsulotId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) { router.push('/admin/mahsulotlar'); router.refresh() }
    else {
      const errData = await res.json().catch(() => ({}))
      setXato('Saqlashda xatolik: ' + (errData?.error || res.status))
    }
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={A.label}>🇺🇿 Nom (O'zbek) *</label>
            <input required value={form.nom} onChange={e => oz('nom', e.target.value)} style={A.input} placeholder="O'zbekcha nom" />
          </div>
          <div>
            <label style={A.label}>🇷🇺 Название (Русский)</label>
            <input value={form.nomRu} onChange={e => oz('nomRu', e.target.value)} style={A.input} placeholder="Русское название" />
          </div>
          <div>
            <label style={A.label}>🇬🇧 Name (English)</label>
            <input value={form.nomEn || ''} onChange={e => oz('nomEn', e.target.value)} style={A.input} placeholder="English name" />
          </div>
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
          <div style={{ marginBottom: '16px' }}><label style={A.label}>Turi (bo'lim)</label>
            <select value={form.turi} onChange={e => oz('turi', e.target.value)} style={A.select}>
              <option value="katalog">🗂 Katalog (asosiy)</option>
              <option value="distribyutor">🤝 Distribyutor mahsulot</option>
              <option value="ummed-brend">⭐ Ummed brendi</option>
            </select>
          </div>
          <div style={{ marginBottom: '16px' }}><label style={A.label}>Belgi (katalogdagi lentacha)</label>
            <select value={form.belgi || ''} onChange={e => oz('belgi', e.target.value)} style={A.select}>
              <option value="">— Yo'q —</option>
              <option value="yangi">🆕 Yangi</option>
              <option value="tez_orada">⏳ Tez orada</option>
            </select>
          </div>
          <div style={{ paddingTop: '8px', gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', gap: '20px', marginTop: '6px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: '#374151' }}>
                <input type="checkbox" checked={form.mavjudligi} onChange={e => oz('mavjudligi', e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#3DB851' }} />
                Mavjud
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: '#374151' }}>
                <input type="checkbox" checked={form.featured} onChange={e => oz('featured', e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#f59e0b' }} />
                ★ Хит Продаж (bestseller)
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

      {/* Galereya */}
      <div style={{ ...A.cardPad, marginBottom: '16px' }}>
        <div style={{ fontWeight: 700, fontSize: '14px', color: '#0a0a0a', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          Qo'shimcha rasmlar (galereya)
        </div>
        <input ref={galereyaInputRef} type="file" accept="image/*" multiple onChange={galereyagaRasmlarQoshish} style={{ display: 'none' }} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
          {form.rasmlar.map((url, i) => (
            <div key={i} style={{ position: 'relative', width: 84, height: 112, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)' }}>
              <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button type="button" onClick={() => galereyadanOlibTashlash(i)}
                style={{
                  position: 'absolute', top: 4, right: 4,
                  background: '#E8491D', color: '#fff', border: 'none',
                  borderRadius: '50%', width: 22, height: 22, fontSize: 13,
                  cursor: 'pointer', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', lineHeight: 1,
                }}>×</button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => galereyaInputRef.current?.click()} disabled={galereyaYuklanmoqda}
          style={{ ...A.btnGhost, fontSize: 12, padding: '7px 14px', opacity: galereyaYuklanmoqda ? 0.6 : 1 }}>
          {galereyaYuklanmoqda ? '⏳ Yuklanmoqda...' : '📁 Rasmlar qo\'shish'}
        </button>
        <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 6 }}>
          Bir nechta rasmni birga tanlashingiz mumkin · JPG, PNG, WEBP
        </div>
      </div>

      {/* Video */}
      <div style={{ ...A.cardPad, marginBottom: '16px' }}>
        <div style={{ fontWeight: 700, fontSize: '14px', color: '#0a0a0a', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          Video (ixtiyoriy)
        </div>
        <VideoYuklash label="" qiymat={form.videoUrl} onChange={v => oz('videoUrl', v)} />
      </div>

      {/* Tavsif */}
      <div style={{ ...A.cardPad, marginBottom: '24px' }}>
        <div style={{ fontWeight: 700, fontSize: '14px', color: '#0a0a0a', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          Tavsiflar
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={A.label}>🇺🇿 Qisqa tavsif (O'zbek)</label>
            <textarea value={form.qisqaTavsif} onChange={e => oz('qisqaTavsif', e.target.value)} rows={4} style={A.textarea} placeholder="O'zbekcha qisqa tavsif" />
          </div>
          <div>
            <label style={A.label}>🇷🇺 Краткое описание (Рус)</label>
            <textarea value={form.qisqaTavsifRu} onChange={e => oz('qisqaTavsifRu', e.target.value)} rows={4} style={A.textarea} placeholder="Краткое описание на русском" />
          </div>
          <div>
            <label style={A.label}>🇬🇧 Short description (EN)</label>
            <textarea value={form.qisqaTavsifEn || ''} onChange={e => oz('qisqaTavsifEn', e.target.value)} rows={4} style={A.textarea} placeholder="Short description in English" />
          </div>
        </div>
        <input ref={tavsifInputRef} type="file" accept="image/*" onChange={tavsifRasmTanlandi} style={{ display: 'none' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={A.label}>🇺🇿 To'liq tavsif (HTML)</label>
            <textarea value={form.toliqTavsif} onChange={e => oz('toliqTavsif', e.target.value)} rows={7} style={{ ...A.textarea, fontFamily: 'monospace', fontSize: '13px' }} placeholder="<p>Tavsif...</p>" />
            <button type="button" onClick={() => tavsifgaRasmQoshish('toliqTavsif')} disabled={tavsifRasmYuklanmoqda === 'toliqTavsif'}
              style={{ ...A.btnGhost, fontSize: 12, padding: '6px 12px', marginTop: 6, opacity: tavsifRasmYuklanmoqda === 'toliqTavsif' ? 0.6 : 1 }}>
              {tavsifRasmYuklanmoqda === 'toliqTavsif' ? '⏳ Yuklanmoqda...' : '🖼 Rasm qo\'shish'}
            </button>
          </div>
          <div>
            <label style={A.label}>🇷🇺 Полное описание (HTML)</label>
            <textarea value={form.toliqTavsifRu} onChange={e => oz('toliqTavsifRu', e.target.value)} rows={7} style={{ ...A.textarea, fontFamily: 'monospace', fontSize: '13px' }} placeholder="<p>Описание...</p>" />
            <button type="button" onClick={() => tavsifgaRasmQoshish('toliqTavsifRu')} disabled={tavsifRasmYuklanmoqda === 'toliqTavsifRu'}
              style={{ ...A.btnGhost, fontSize: 12, padding: '6px 12px', marginTop: 6, opacity: tavsifRasmYuklanmoqda === 'toliqTavsifRu' ? 0.6 : 1 }}>
              {tavsifRasmYuklanmoqda === 'toliqTavsifRu' ? '⏳ Загрузка...' : '🖼 Добавить фото'}
            </button>
          </div>
          <div>
            <label style={A.label}>🇬🇧 Full description (HTML)</label>
            <textarea value={form.toliqTavsifEn || ''} onChange={e => oz('toliqTavsifEn', e.target.value)} rows={7} style={{ ...A.textarea, fontFamily: 'monospace', fontSize: '13px' }} placeholder="<p>Description...</p>" />
            <button type="button" onClick={() => tavsifgaRasmQoshish('toliqTavsifEn')} disabled={tavsifRasmYuklanmoqda === 'toliqTavsifEn'}
              style={{ ...A.btnGhost, fontSize: 12, padding: '6px 12px', marginTop: 6, opacity: tavsifRasmYuklanmoqda === 'toliqTavsifEn' ? 0.6 : 1 }}>
              {tavsifRasmYuklanmoqda === 'toliqTavsifEn' ? '⏳ Uploading...' : '🖼 Add image'}
            </button>
          </div>
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
