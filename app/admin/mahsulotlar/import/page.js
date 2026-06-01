'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { A } from '@/components/admin/AdminStyles'

// Nuqtali vergul (;) ishlatiladi — Excel avtomatik ustunlarga bo'ladi
const NAMUNA_CSV = `nom;kategoriya_slug;narx;narx_birligi;qisqa_tavsif;mavjud;featured;brend;model
Tonometr avtomatik;diagnostika;320000;so'm;Bilak tipidagi raqamli qon bosimi o'lchagich;true;false;Beurer;BM44
Glukometr to'plami;diagnostika;180000;so'm;Qand darajasini o'lchash uchun;true;false;Accu-Chek;Active
Kompressor nebulayzer;nafas-jihozlari;450000;so'm;Nafas kasalliklari uchun;true;false;Omron;C28P
UV sterilizator;sterilizatsiya;180000;so'm;Qurilmalar uchun ultrabinafsha sterilizator;true;false;;
Tibbiy krovat;tibbiy-mebel;1200000;so'm;Statsionar balandligi sozlanadi;true;false;;`

export default function ImportPage() {
  const [qadam, setQadam] = useState(1) // 1=yuklash, 2=preview, 3=natija
  const [qatorlar, setQatorlar] = useState([])
  const [xatolar, setXatolar] = useState([])
  const [yuklanmoqda, setYuklanmoqda] = useState(false)
  const [natija, setNatija] = useState(null)
  const [kategoriyalar, setKategoriyalar] = useState([])
  const faylRef = useRef()

  async function faylTanlash(e) {
    const fayl = e.target.files[0]
    if (!fayl) return

    // Kategoriyalarni yuklash
    const kRes = await fetch('/api/kategoriyalar')
    const kData = await kRes.json()
    setKategoriyalar(kData)
    const katSluglar = kData.map(k => k.slug)

    const matn = await fayl.text()
    // BOM ni olib tashlaymiz
    const tozaMatn = matn.replace(/^﻿/, '')
    const satrlar = tozaMatn.trim().split('\n').map(s => s.trim().replace(/\r$/, '')).filter(Boolean)
    if (satrlar.length < 2) { setXatolar(['Fayl bo\'sh yoki noto\'g\'ri format']); return }

    const delimiter = detectDelimiter(satrlar[0])
    const boshlar = satrlar[0].split(delimiter).map(b => b.trim().toLowerCase().replace(/['"]/g, ''))
    const kerakli = ['nom', 'kategoriya_slug']
    const yetishmaydi = kerakli.filter(k => !boshlar.includes(k))
    if (yetishmaydi.length) { setXatolar([`Ustunlar yetishmaydi: ${yetishmaydi.join(', ')}`]); return }

    const parse = []
    const err = []

    for (let i = 1; i < satrlar.length; i++) {
      // CSV parse (qo'shtirnoqli qiymatlarni ham hisobga olish)
      const qiymatlar = parseCsvLine(satrlar[i], delimiter)
      if (qiymatlar.length < 2) continue

      const row = {}
      boshlar.forEach((b, idx) => { row[b] = (qiymatlar[idx] || '').trim().replace(/^"|"$/g, '') })

      if (!row.nom) { err.push(`${i + 1}-qator: nom bo'sh`); continue }
      if (!row.kategoriya_slug) { err.push(`${i + 1}-qator: kategoriya_slug bo'sh`); continue }
      if (!katSluglar.includes(row.kategoriya_slug)) {
        err.push(`${i + 1}-qator: kategoriya topilmadi — "${row.kategoriya_slug}"`)
      }

      parse.push({
        nom: row.nom,
        kategoriya_slug: row.kategoriya_slug,
        narx: row.narx ? parseFloat(row.narx) : null,
        narxBirligi: row.narx_birligi || "so'm",
        qisqaTavsif: row.qisqa_tavsif || '',
        mavjudligi: row.mavjud !== 'false',
        featured: row.featured === 'true',
        brend: row.brend || '',
        modelRaqami: row.model || '',
      })
    }

    setQatorlar(parse)
    setXatolar(err)
    if (parse.length > 0) setQadam(2)
  }

  async function import_() {
    setYuklanmoqda(true)
    try {
      const res = await fetch('/api/mahsulotlar/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mahsulotlar: qatorlar }),
      })
      const data = await res.json()
      setNatija(data)
      setQadam(3)
    } catch (e) {
      setNatija({ xato: e.message })
    }
    setYuklanmoqda(false)
  }

  function namunaTuklash() {
    // UTF-8 BOM qo'shiladi — Excel avtomatik ustunlarga ajratadi
    const BOM = '﻿'
    const blob = new Blob([BOM + NAMUNA_CSV], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'mahsulotlar-namuna.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
        <Link href="/admin/mahsulotlar" style={{ color: '#9ca3af', fontSize: '13px', textDecoration: 'none' }}>← Orqaga</Link>
        <h1 style={A.h1}>CSV Import</h1>
      </div>

      {/* Qadam ko'rsatkichi */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '32px' }}>
        {[['1', 'Fayl yuklash'], ['2', 'Tekshirish'], ['3', 'Natija']].map(([n, l], i) => (
          <div key={n} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? '1' : undefined }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: 700, flexShrink: 0,
                background: parseInt(n) <= qadam ? '#E8491D' : '#f0f0f0',
                color: parseInt(n) <= qadam ? '#fff' : '#9ca3af',
              }}>{n}</div>
              <span style={{ fontSize: '13px', fontWeight: 500, color: parseInt(n) <= qadam ? '#0a0a0a' : '#9ca3af', whiteSpace: 'nowrap' }}>{l}</span>
            </div>
            {i < 2 && <div style={{ flex: 1, height: '1px', background: '#e5e5e5', margin: '0 12px' }} />}
          </div>
        ))}
      </div>

      {/* 1-qadam */}
      {qadam === 1 && (
        <div style={A.card}>
          <div style={{ padding: '32px' }}>
            {/* Format */}
            <div style={{ marginBottom: '28px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0a0a0a', marginBottom: '12px' }}>CSV fayl formati</h3>
              <div style={{ background: '#f8f8f6', borderRadius: '8px', padding: '16px', fontSize: '12px', fontFamily: 'monospace', color: '#374151', overflowX: 'auto', lineHeight: 1.8 }}>
                <div style={{ color: '#E8491D', fontWeight: 700 }}>nom ; kategoriya_slug ; narx ; narx_birligi ; qisqa_tavsif ; mavjud ; featured ; brend ; model</div>
                <div>Tonometr avtomatik ; diagnostika ; 320000 ; so'm ; Tavsif matni ; true ; false ; Beurer ; BM44</div>
              </div>
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ background: '#3DB851', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '4px' }}>✓</span>
                Vergul (,) va nuqtali vergul (;) ikkalasi ham qabul qilinadi — Excel avtomatik aniqlanadi
              </div>

              <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {[
                  ['nom', '* Majburiy. Mahsulot nomi'],
                  ['kategoriya_slug', '* Majburiy. Kategoriya slug'],
                  ['narx', 'Ixtiyoriy. Raqam (masalan: 320000)'],
                  ['narx_birligi', 'Ixtiyoriy. Default: so\'m'],
                  ['qisqa_tavsif', 'Ixtiyoriy. Qisqa tavsif matni'],
                  ['mavjud', 'Ixtiyoriy. true yoki false'],
                  ['featured', 'Ixtiyoriy. true yoki false'],
                  ['brend', 'Ixtiyoriy. Brend nomi'],
                  ['model', 'Ixtiyoriy. Model raqami'],
                ].map(([key, desc]) => (
                  <div key={key} style={{ fontSize: '12px', color: '#6b7280', display: 'flex', gap: '6px' }}>
                    <code style={{ color: '#E8491D', fontWeight: 600, minWidth: '120px' }}>{key}</code>
                    <span>{desc}</span>
                  </div>
                ))}
              </div>

              {/* Kategoriya sluglar */}
              <div style={{ marginTop: '20px', padding: '14px', background: 'rgba(99,102,241,0.05)', borderRadius: '8px', border: '1px solid rgba(99,102,241,0.15)' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#6366f1', marginBottom: '8px' }}>Mavjud kategoriya sluglar:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {['diagnostika', 'nafas-jihozlari', 'yurak-jihozlari', 'tibbiy-mebel', 'sterilizatsiya'].map(s => (
                    <code key={s} style={{ fontSize: '11px', background: 'rgba(99,102,241,0.1)', color: '#6366f1', padding: '2px 8px', borderRadius: '4px' }}>{s}</code>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button onClick={namunaTuklash} style={{ ...A.btnGhost, fontSize: '13px' }}>
                ⬇ Namuna CSV yuklab olish
              </button>
              <label style={{ ...A.btnPrimary, cursor: 'pointer', fontSize: '13px' }}>
                📂 CSV fayl tanlash
                <input ref={faylRef} type="file" accept=".csv,.txt" onChange={faylTanlash} style={{ display: 'none' }} />
              </label>
            </div>

            {xatolar.length > 0 && (
              <div style={{ marginTop: '16px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '14px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#ef4444', marginBottom: '8px' }}>Xatoliklar:</div>
                {xatolar.map((x, i) => <div key={i} style={{ fontSize: '12px', color: '#ef4444' }}>• {x}</div>)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2-qadam: Preview */}
      {qadam === 2 && (
        <div>
          <div style={{ ...A.card, marginBottom: '16px' }}>
            <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <div>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#0a0a0a' }}>Jami {qatorlar.length} ta mahsulot</span>
                {xatolar.length > 0 && <span style={{ marginLeft: '12px', fontSize: '12px', color: '#f59e0b' }}>⚠ {xatolar.length} ta ogohlantirish</span>}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => { setQadam(1); setQatorlar([]); if (faylRef.current) faylRef.current.value = '' }} style={A.btnGhost}>
                  Bekor
                </button>
                <button onClick={import_} disabled={yuklanmoqda} style={{ ...A.btnPrimary, opacity: yuklanmoqda ? 0.6 : 1 }}>
                  {yuklanmoqda ? `Yuklanmoqda...` : `✓ ${qatorlar.length} ta mahsulot qo'shish`}
                </button>
              </div>
            </div>

            {xatolar.length > 0 && (
              <div style={{ padding: '12px 24px', background: 'rgba(245,158,11,0.06)', borderBottom: '1px solid rgba(245,158,11,0.15)' }}>
                {xatolar.map((x, i) => <div key={i} style={{ fontSize: '12px', color: '#92400e' }}>⚠ {x}</div>)}
              </div>
            )}

            {/* Jadval */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ background: '#fafaf8' }}>
                    {['#', 'Nom', 'Kategoriya', 'Narx', 'Mavjud', 'Brend'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', borderBottom: '1px solid rgba(0,0,0,0.06)', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {qatorlar.slice(0, 50).map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                      <td style={{ padding: '10px 16px', color: '#9ca3af' }}>{i + 1}</td>
                      <td style={{ padding: '10px 16px', fontWeight: 500, color: '#0a0a0a', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.nom}</td>
                      <td style={{ padding: '10px 16px', color: '#6b7280' }}><code style={{ fontSize: '11px', background: '#f0f0f0', padding: '2px 6px', borderRadius: '4px' }}>{r.kategoriya_slug}</code></td>
                      <td style={{ padding: '10px 16px', color: '#0a0a0a' }}>{r.narx ? r.narx.toLocaleString('uz-UZ') + " so'm" : '—'}</td>
                      <td style={{ padding: '10px 16px' }}><span style={{ fontSize: '11px', fontWeight: 600, color: r.mavjudligi ? '#16a34a' : '#9ca3af' }}>{r.mavjudligi ? '✓ Bor' : '✗ Yo\'q'}</span></td>
                      <td style={{ padding: '10px 16px', color: '#6b7280' }}>{r.brend || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {qatorlar.length > 50 && (
                <div style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', color: '#9ca3af' }}>
                  ... va yana {qatorlar.length - 50} ta mahsulot
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3-qadam: Natija */}
      {qadam === 3 && natija && (
        <div style={A.card}>
          <div style={{ padding: '40px', textAlign: 'center' }}>
            {natija.xato ? (
              <>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ef4444', marginBottom: '8px' }}>Xatolik yuz berdi</h3>
                <p style={{ fontSize: '13px', color: '#6b7280' }}>{natija.xato}</p>
              </>
            ) : (
              <>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0a0a0a', marginBottom: '8px' }}>Muvaffaqiyatli!</h3>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
                  <strong style={{ color: '#16a34a' }}>{natija.qoshildi}</strong> ta mahsulot qo'shildi
                  {natija.ozgartirildi > 0 && <>, <strong style={{ color: '#6366f1' }}>{natija.ozgartirildi}</strong> ta yangilandi</>}
                  {natija.xatolar > 0 && <>, <strong style={{ color: '#ef4444' }}>{natija.xatolar}</strong> ta xatolik</>}
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <Link href="/admin/mahsulotlar" style={{ ...A.btnPrimary, textDecoration: 'none' }}>Mahsulotlarni ko'rish</Link>
                  <button onClick={() => { setQadam(1); setQatorlar([]); setNatija(null); if (faylRef.current) faylRef.current.value = '' }} style={A.btnGhost}>
                    Yana import
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function parseCsvLine(line, delimiter = ',') {
  const result = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') { inQuotes = !inQuotes }
    else if (ch === delimiter && !inQuotes) { result.push(current); current = '' }
    else { current += ch }
  }
  result.push(current)
  return result
}

function detectDelimiter(headerLine) {
  // Birinchi satrda qaysi belgi ko'proq bo'lsa o'sha delimiter
  const semicolons = (headerLine.match(/;/g) || []).length
  const commas = (headerLine.match(/,/g) || []).length
  return semicolons >= commas ? ';' : ','
}
