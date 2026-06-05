'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import * as XLSX from 'xlsx'
import { A } from '@/components/admin/AdminStyles'

export default function ImportPage() {
  const [qadam, setQadam] = useState(1)
  const [qatorlar, setQatorlar] = useState([])
  const [xato, setXato] = useState('')
  const [yuklanmoqda, setYuklanmoqda] = useState(false)
  const [natija, setNatija] = useState(null)
  const [kategoriyalar, setKategoriyalar] = useState([])
  const faylRef = useRef()

  // Namuna Excel yuklab olish
  function namunaYukla() {
    const wb = XLSX.utils.book_new()
    const data = [
      ['nom', 'nom_ru', 'kategoriya', 'narx', 'tavsif', 'tavsif_ru', 'brend', 'mavjud'],
      ['Tonometr avtomatik', 'Автоматический тонометр', 'Diagnostika', 320000, 'Bilak tipidagi qon bosimi o\'lchagich', 'Измеритель давления на запястье', 'Beurer', 'ha'],
      ['Glukometr to\'plami', 'Комплект глюкометра', 'Diagnostika', 180000, 'Qand darajasini o\'lchash uchun', 'Для измерения уровня сахара', 'Accu-Chek', 'ha'],
      ['Kompressor nebulayzer', 'Компрессорный небулайзер', 'Nafas jihozlari', 450000, 'Nafas kasalliklari uchun', 'Для лечения органов дыхания', 'Omron', 'ha'],
      ['UV sterilizator', 'УФ стерилизатор', 'Sterilizatsiya', 180000, 'Ultrabinafsha sterilizator', 'Ультрафиолетовый стерилизатор', '', 'ha'],
      ['Tibbiy krovat', 'Медицинская кровать', 'Tibbiy mebel', 1200000, 'Statsionar, balandligi sozlanadi', 'Стационарная, регулируемая высота', '', 'ha'],
    ]
    const ws = XLSX.utils.aoa_to_sheet(data)
    ws['!cols'] = [{ wch: 30 }, { wch: 30 }, { wch: 20 }, { wch: 12 }, { wch: 35 }, { wch: 35 }, { wch: 15 }, { wch: 8 }]
    XLSX.utils.book_append_sheet(wb, ws, 'Mahsulotlar')
    XLSX.writeFile(wb, 'mahsulotlar-namuna.xlsx')
  }

  async function faylTanlash(e) {
    const fayl = e.target.files[0]
    if (!fayl) return
    setXato('')

    try {
      // Kategoriyalarni yuklash
      const kRes = await fetch('/api/kategoriyalar')
      if (!kRes.ok) throw new Error('Kategoriyalarni yuklashda xatolik: ' + kRes.status)
      const kData = await kRes.json()
      if (!Array.isArray(kData)) throw new Error('Kategoriyalar ro\'yxati noto\'g\'ri formatda')
      setKategoriyalar(kData)

      const buf = await fayl.arrayBuffer()
      const wb = XLSX.read(buf, { type: 'array' })
      const ws = wb.Sheets[wb.SheetNames[0]]
      const rows = XLSX.utils.sheet_to_json(ws, { defval: '' })

      if (rows.length === 0) { setXato('Excel fayl bo\'sh'); return }

      // Ustun nomlarini normallashtirish (kichik harf, bo'shliqlarni olib tashlash)
      const parse = rows.map((row) => {
        const r = {}
        for (const k in row) r[k.toLowerCase().trim()] = String(row[k]).trim()
        return r
      }).filter(r => r.nom || r['mahsulot nomi'] || r['name'])

      if (parse.length === 0) { setXato('"nom" ustuni topilmadi — birinchi ustun "nom" bo\'lishi kerak'); return }

      // Kategoriya slugga mapping
      const katNomMap = {}
      for (const k of kData) {
        katNomMap[k.nom.toLowerCase()] = k.slug
        katNomMap[k.slug.toLowerCase()] = k.slug
      }

      const tayyor = parse.map(r => {
        const nom = r.nom || r['mahsulot nomi'] || r.name || ''
        const nomRu = r.nom_ru || r['nom ru'] || r['название'] || ''
        const katRaw = (r.kategoriya || r.category || r.kat || '').toLowerCase()
        const katSlug = katNomMap[katRaw] || null
        const narx = parseFloat(r.narx || r.price || r['narx (so\'m)'] || 0) || null
        const tavsif = r.tavsif || r.description || r['qisqa tavsif'] || ''
        const tavsifRu = r.tavsif_ru || r['tavsif ru'] || r['описание'] || ''
        const brend = r.brend || r.brand || ''
        const mavjud = !['yoq', "yo'q", 'false', '0', 'no'].includes((r.mavjud || r.available || 'ha').toLowerCase())

        return { nom, nomRu, kategoriya_slug: katSlug, kategoriya_nomi: r.kategoriya || r.category || '', narx, qisqaTavsif: tavsif, qisqaTavsifRu: tavsifRu, brend, mavjudligi: mavjud }
      }).filter(r => r.nom)

      setQatorlar(tayyor)
      if (tayyor.length > 0) setQadam(2)
      else setXato('Hech qanday mahsulot topilmadi')
    } catch (e) {
      setXato('Xatolik: ' + e.message)
    }
  }

  async function import_() {
    setYuklanmoqda(true)
    try {
      const res = await fetch('/api/mahsulotlar/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mahsulotlar: qatorlar }),
      })
      setNatija(await res.json())
      setQadam(3)
    } catch (e) {
      setNatija({ xato: e.message })
      setQadam(3)
    }
    setYuklanmoqda(false)
  }

  function reset() {
    setQadam(1); setQatorlar([]); setXato(''); setNatija(null)
    if (faylRef.current) faylRef.current.value = ''
  }

  const xatolar = qatorlar.filter(r => !r.kategoriya_slug)

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
        <Link href="/admin/mahsulotlar" style={{ color: '#9ca3af', fontSize: '13px', textDecoration: 'none' }}>← Orqaga</Link>
        <h1 style={A.h1}>Excel Import</h1>
      </div>

      {/* Qadam */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '32px' }}>
        {[['1', 'Excel yuklash'], ['2', 'Tekshirish'], ['3', 'Natija']].map(([n, l], i) => (
          <div key={n} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : undefined }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, background: +n <= qadam ? '#E8491D' : '#f0f0f0', color: +n <= qadam ? '#fff' : '#9ca3af' }}>{n}</div>
              <span style={{ fontSize: 13, fontWeight: 500, color: +n <= qadam ? '#0a0a0a' : '#9ca3af', whiteSpace: 'nowrap' }}>{l}</span>
            </div>
            {i < 2 && <div style={{ flex: 1, height: 1, background: '#e5e5e5', margin: '0 12px' }} />}
          </div>
        ))}
      </div>

      {/* 1-qadam */}
      {qadam === 1 && (
        <div style={A.card}>
          <div style={{ padding: 32 }}>

            {/* Ko'rsatma */}
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0a0a0a', marginBottom: 16 }}>Qanday ishlaydi?</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  ['1️⃣', 'Namuna Excel ni yuklab oling', 'Tayyor shablon — to\'g\'ri formatda'],
                  ['2️⃣', 'Mahsulotlarni to\'ldiring', 'Nom, kategoriya, narx, tavsif, brend kiriting'],
                  ['3️⃣', 'Faylni yuklang', 'Shu yerga qaytib .xlsx faylni yuklang'],
                  ['4️⃣', 'Import bosing', 'Hammasi avtomatik saqlanadi'],
                ].map(([icon, title, desc]) => (
                  <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0a0a0a' }}>{title}</div>
                      <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Excel preview */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0a0a0a', marginBottom: 10 }}>
                Excel faylda quyidagicha bo'lishi kerak:
              </div>
              <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid #d1d5db' }}>
                <table style={{ borderCollapse: 'collapse', fontSize: 12, minWidth: '100%' }}>
                  {/* Ustun harflari (A, B, C...) */}
                  <thead>
                    <tr style={{ background: '#e8e8e8' }}>
                      <td style={{ width: 32, padding: '5px 8px', borderRight: '1px solid #d1d5db', color: '#9ca3af', fontSize: 11, textAlign: 'center' }}></td>
                      {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(h => (
                        <td key={h} style={{ padding: '5px 14px', borderRight: '1px solid #d1d5db', fontWeight: 700, color: '#374151', textAlign: 'center', fontSize: 11 }}>{h}</td>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* 1-qator — sarlavha */}
                    <tr style={{ background: '#217346' }}>
                      <td style={{ padding: '6px 8px', borderRight: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)', fontSize: 11, textAlign: 'center', fontWeight: 600 }}>1</td>
                      {[
                        ['nom', true],
                        ['nom_ru', false],
                        ['kategoriya', true],
                        ['narx', false],
                        ['tavsif', false],
                        ['tavsif_ru', false],
                        ['brend', false],
                        ['mavjud', false],
                      ].map(([h, req]) => (
                        <td key={h} style={{ padding: '6px 12px', borderRight: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontWeight: 700, whiteSpace: 'nowrap' }}>
                          {h}
                          {req && <span style={{ marginLeft: 4, fontSize: 9, background: 'rgba(255,255,255,0.25)', padding: '1px 4px', borderRadius: 3 }}>*</span>}
                        </td>
                      ))}
                    </tr>
                    {/* 2-qator — misol 1 */}
                    <tr style={{ background: '#fff' }}>
                      <td style={{ padding: '5px 8px', borderRight: '1px solid #e5e7eb', color: '#9ca3af', fontSize: 11, textAlign: 'center' }}>2</td>
                      {['Tonometr avtomatik', 'Автоматический тонометр', 'Diagnostika', '320000', 'Bilak tipidagi...', 'На запястье...', 'Beurer', 'ha'].map((v, i) => (
                        <td key={i} style={{ padding: '5px 12px', borderRight: '1px solid #e5e7eb', color: '#374151', whiteSpace: 'nowrap' }}>{v}</td>
                      ))}
                    </tr>
                    {/* 3-qator — misol 2 */}
                    <tr style={{ background: '#f9fafb' }}>
                      <td style={{ padding: '5px 8px', borderRight: '1px solid #e5e7eb', color: '#9ca3af', fontSize: 11, textAlign: 'center' }}>3</td>
                      {['Glukometr to\'plami', 'Комплект глюкометра', 'Diagnostika', '180000', 'Qand o\'lchagich', 'Для измерения сахара', 'Accu-Chek', 'ha'].map((v, i) => (
                        <td key={i} style={{ padding: '5px 12px', borderRight: '1px solid #e5e7eb', color: '#374151', whiteSpace: 'nowrap' }}>{v}</td>
                      ))}
                    </tr>
                    {/* 4-qator — misol 3 */}
                    <tr style={{ background: '#fff' }}>
                      <td style={{ padding: '5px 8px', borderRight: '1px solid #e5e7eb', color: '#9ca3af', fontSize: 11, textAlign: 'center' }}>4</td>
                      {['UV sterilizator', 'УФ стерилизатор', 'Sterilizatsiya', '180000', '', '', '', 'ha'].map((v, i) => (
                        <td key={i} style={{ padding: '5px 12px', borderRight: '1px solid #e5e7eb', color: v ? '#374151' : '#d1d5db', whiteSpace: 'nowrap' }}>{v || '—'}</td>
                      ))}
                    </tr>
                    <tr style={{ background: '#f9fafb' }}>
                      <td style={{ padding: '5px 8px', borderRight: '1px solid #e5e7eb', color: '#d1d5db', fontSize: 11, textAlign: 'center' }}>5</td>
                      {['...', '...', '...', '', '', ''].map((v, i) => (
                        <td key={i} style={{ padding: '5px 16px', borderRight: '1px solid #e5e7eb', color: '#d1d5db' }}>{v}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: 8, fontSize: 11, color: '#6b7280' }}>
                <span style={{ background: 'rgba(33,115,70,0.1)', color: '#217346', fontWeight: 600, padding: '1px 6px', borderRadius: 3, marginRight: 6 }}>* majburiy</span>
                Qolgan ustunlar ixtiyoriy — bo'sh qoldirsa ham bo'ladi
              </div>
            </div>

            {/* Kategoriya nomlari */}
            <div style={{ marginBottom: 28, padding: 14, background: 'rgba(99,102,241,0.05)', borderRadius: 8, border: '1px solid rgba(99,102,241,0.15)' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#6366f1', marginBottom: 8 }}>✓ Kategoriya ustuniga shu nomlardan birini yozing:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {['Diagnostika', 'Nafas jihozlari', 'Yurak jihozlari', 'Tibbiy mebel', 'Sterilizatsiya'].map(s => (
                  <span key={s} style={{ fontSize: 12, background: 'rgba(99,102,241,0.1)', color: '#6366f1', padding: '3px 10px', borderRadius: 20, fontWeight: 500 }}>{s}</span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={namunaYukla} style={{ ...A.btnGhost, fontSize: 13 }}>
                ⬇ Namuna Excel (.xlsx) yuklab olish
              </button>
              <label style={{ ...A.btnPrimary, cursor: 'pointer', fontSize: 13 }}>
                📊 Excel faylni tanlash (.xlsx)
                <input ref={faylRef} type="file" accept=".xlsx,.xls,.csv" onChange={faylTanlash} style={{ display: 'none' }} />
              </label>
            </div>

            {xato && (
              <div style={{ marginTop: 16, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: 14, fontSize: 13, color: '#ef4444' }}>
                ⚠ {xato}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2-qadam: Preview */}
      {qadam === 2 && (
        <div style={A.card}>
          <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.06)', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>{qatorlar.length} ta mahsulot</span>
              {xatolar.length > 0 && (
                <span style={{ fontSize: 12, color: '#f59e0b', fontWeight: 500 }}>
                  ⚠ {xatolar.length} ta kategoriya topilmadi
                </span>
              )}
              {qatorlar.length - xatolar.length > 0 && (
                <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 500 }}>
                  ✓ {qatorlar.length - xatolar.length} ta tayyor
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={reset} style={A.btnGhost}>Boshqatdan</button>
              <button onClick={import_} disabled={yuklanmoqda || qatorlar.length - xatolar.length === 0}
                style={{ ...A.btnPrimary, opacity: yuklanmoqda ? 0.6 : 1, minWidth: 160 }}>
                {yuklanmoqda ? 'Saqlanmoqda...' : `Import (${qatorlar.length - xatolar.length} ta)`}
              </button>
            </div>
          </div>

          {xatolar.length > 0 && (
            <div style={{ padding: '10px 24px', background: 'rgba(245,158,11,0.07)', borderBottom: '1px solid rgba(245,158,11,0.15)', fontSize: 12, color: '#92400e' }}>
              Quyidagi mahsulotlar kategoriyasi topilmadi — import qilinmaydi:
              <strong> {xatolar.slice(0, 5).map(r => r.nom).join(', ')}{xatolar.length > 5 ? `... (${xatolar.length} ta)` : ''}</strong>
            </div>
          )}

          <div style={{ overflowX: 'auto', maxHeight: 500, overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead style={{ position: 'sticky', top: 0, background: '#fafaf8', zIndex: 1 }}>
                <tr>
                  {['#', 'Nom', 'Kategoriya', 'Narx', 'Brend', 'Mavjud'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#6b7280', borderBottom: '1px solid rgba(0,0,0,0.06)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {qatorlar.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', background: !r.kategoriya_slug ? 'rgba(245,158,11,0.04)' : 'transparent' }}>
                    <td style={{ padding: '9px 14px', color: '#9ca3af' }}>{i + 1}</td>
                    <td style={{ padding: '9px 14px', fontWeight: 500, color: '#0a0a0a', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.nom}</td>
                    <td style={{ padding: '9px 14px' }}>
                      {r.kategoriya_slug
                        ? <span style={{ fontSize: 11, background: 'rgba(61,184,81,0.1)', color: '#16a34a', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>{r.kategoriya_nomi}</span>
                        : <span style={{ fontSize: 11, background: 'rgba(245,158,11,0.1)', color: '#d97706', padding: '2px 8px', borderRadius: 4 }}>⚠ {r.kategoriya_nomi || '?'}</span>
                      }
                    </td>
                    <td style={{ padding: '9px 14px', color: '#0a0a0a' }}>{r.narx ? r.narx.toLocaleString('uz-UZ') + " so'm" : '—'}</td>
                    <td style={{ padding: '9px 14px', color: '#6b7280' }}>{r.brend || '—'}</td>
                    <td style={{ padding: '9px 14px' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: r.mavjudligi ? '#16a34a' : '#9ca3af' }}>{r.mavjudligi ? '✓' : '✗'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3-qadam: Natija */}
      {qadam === 3 && natija && (
        <div style={A.card}>
          <div style={{ padding: 48, textAlign: 'center' }}>
            {natija.xato ? (
              <>
                <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#ef4444', marginBottom: 8 }}>Xatolik</h3>
                <p style={{ fontSize: 13, color: '#6b7280' }}>{natija.xato}</p>
                <button onClick={reset} style={{ ...A.btnGhost, marginTop: 20 }}>Qayta urinish</button>
              </>
            ) : (
              <>
                <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0a0a0a', marginBottom: 12 }}>Muvaffaqiyatli!</h3>
                <p style={{ fontSize: 15, color: '#16a34a', fontWeight: 600, marginBottom: 24 }}>
                  {natija.qoshildi} ta mahsulot saqlandi
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <Link href="/admin/mahsulotlar" style={{ ...A.btnPrimary, textDecoration: 'none' }}>
                    Mahsulotlarni ko'rish →
                  </Link>
                  <button onClick={reset} style={A.btnGhost}>Yana import</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
