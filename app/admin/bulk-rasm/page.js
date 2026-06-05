'use client'
import { useState, useRef, useCallback } from 'react'
import { A } from '@/components/admin/AdminStyles'

const HOLAT = { KUTISH: 'kutish', YUKLANMOQDA: 'yuklanmoqda', OK: 'ok', XATO: 'xato' }

function slugYasat(nom) {
  return nom
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

export default function BulkRasmPage() {
  const [fayllar, setFayllar] = useState([]) // { fayl, slug, holat, xato, url, nom }
  const [drag, setDrag] = useState(false)
  const [ishMoqda, setIshMoqda] = useState(false)
  const inputRef = useRef()

  function fayllarQosh(yangilar) {
    const royhat = Array.from(yangilar).map(f => ({
      id: Math.random().toString(36).slice(2),
      fayl: f,
      slug: slugYasat(f.name),
      holat: HOLAT.KUTISH,
      xato: '',
      url: '',
      nom: '',
    }))
    setFayllar(prev => [...prev, ...royhat])
  }

  function onDrop(e) {
    e.preventDefault()
    setDrag(false)
    const files = e.dataTransfer.files
    if (files.length) fayllarQosh(files)
  }

  function birniOchir(id) {
    setFayllar(prev => prev.filter(f => f.id !== id))
  }

  function hammasiniTozala() {
    setFayllar([])
  }

  async function birYukla(item) {
    setFayllar(prev => prev.map(f => f.id === item.id ? { ...f, holat: HOLAT.YUKLANMOQDA } : f))

    const fd = new FormData()
    fd.append('fayl', item.fayl)
    fd.append('slug', item.slug)

    try {
      const res = await fetch('/api/admin/bulk-rasm', { method: 'POST', body: fd })
      const data = await res.json()

      if (data.ok) {
        setFayllar(prev => prev.map(f =>
          f.id === item.id ? { ...f, holat: HOLAT.OK, url: data.url, nom: data.nom } : f
        ))
      } else {
        setFayllar(prev => prev.map(f =>
          f.id === item.id ? { ...f, holat: HOLAT.XATO, xato: data.xato || 'Xato' } : f
        ))
      }
    } catch (e) {
      setFayllar(prev => prev.map(f =>
        f.id === item.id ? { ...f, holat: HOLAT.XATO, xato: e.message } : f
      ))
    }
  }

  async function hammasiniYukla() {
    setIshMoqda(true)
    const kutayotganlar = fayllar.filter(f => f.holat === HOLAT.KUTISH)

    // 3 tadan parallel yuklash
    const PARALLEL = 3
    for (let i = 0; i < kutayotganlar.length; i += PARALLEL) {
      const guruh = kutayotganlar.slice(i, i + PARALLEL)
      await Promise.all(guruh.map(birYukla))
    }
    setIshMoqda(false)
  }

  const jami = fayllar.length
  const tugagan = fayllar.filter(f => f.holat === HOLAT.OK).length
  const xatolar = fayllar.filter(f => f.holat === HOLAT.XATO).length
  const kutish = fayllar.filter(f => f.holat === HOLAT.KUTISH).length
  const foiz = jami > 0 ? Math.round((tugagan / jami) * 100) : 0

  return (
    <div style={{ maxWidth: 860 }}>
      {/* Sarlavha */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0a0a0a', marginBottom: 6 }}>
          📦 Ommaviy rasm yuklash
        </h1>
        <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>
          Rasmlar fayl nomiga qarab mahsulotga avtomatik biriktiriladi.<br />
          <strong style={{ color: '#0a0a0a' }}>Muhim:</strong> Fayl nomi mahsulot slugiga mos bo'lishi kerak.
          Masalan: <code style={{ background: '#f3f4f6', padding: '1px 6px', borderRadius: 4, fontSize: 12 }}>tonometr-omron.jpg</code>
        </p>
      </div>

      {/* Fayl nomi qoidasi */}
      <div style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#1d4ed8' }}>
        💡 <strong>Qoida:</strong> Mahsulot admin panelida slugni ko'rishingiz mumkin. Fayl nomi = slug + kengaytma.
        Masalan slug <code style={{ background: 'rgba(59,130,246,0.1)', padding: '1px 5px', borderRadius: 3 }}>glukometr-accu-chek</code> bo'lsa → fayl nomi{' '}
        <code style={{ background: 'rgba(59,130,246,0.1)', padding: '1px 5px', borderRadius: 3 }}>glukometr-accu-chek.png</code>
      </div>

      {/* Drop zona */}
      <div
        onClick={() => !ishMoqda && inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        style={{
          border: `2px dashed ${drag ? '#E8491D' : '#d1d5db'}`,
          borderRadius: 14,
          padding: '40px 24px',
          textAlign: 'center',
          cursor: ishMoqda ? 'not-allowed' : 'pointer',
          background: drag ? 'rgba(232,73,29,0.04)' : '#fafafa',
          transition: 'all 0.2s',
          marginBottom: 20,
          opacity: ishMoqda ? 0.6 : 1,
        }}
      >
        <div style={{ fontSize: 36, marginBottom: 10 }}>🖼️</div>
        <p style={{ fontSize: 15, fontWeight: 600, color: '#374151', marginBottom: 4 }}>
          Rasmlarni shu yerga tashlang yoki tanlang
        </p>
        <p style={{ fontSize: 13, color: '#9ca3af' }}>
          JPG, PNG, WEBP · Bir vaqtda istalgancha rasm
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          style={{ display: 'none' }}
          onChange={e => { if (e.target.files?.length) fayllarQosh(e.target.files) }}
        />
      </div>

      {/* Boshqaruv */}
      {jami > 0 && (
        <>
          {/* Progress */}
          {ishMoqda && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#6b7280', marginBottom: 6 }}>
                <span>Yuklanmoqda... {tugagan}/{jami}</span>
                <span>{foiz}%</span>
              </div>
              <div style={{ height: 6, background: '#e5e7eb', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${foiz}%`, background: '#E8491D', borderRadius: 99, transition: 'width 0.3s' }} />
              </div>
            </div>
          )}

          {/* Statistika + tugmalar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 10, flex: 1, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, padding: '4px 12px', borderRadius: 99, background: '#f3f4f6', color: '#374151', fontWeight: 600 }}>
                Jami: {jami}
              </span>
              {tugagan > 0 && (
                <span style={{ fontSize: 13, padding: '4px 12px', borderRadius: 99, background: '#dcfce7', color: '#15803d', fontWeight: 600 }}>
                  ✅ {tugagan} ta yuklandi
                </span>
              )}
              {xatolar > 0 && (
                <span style={{ fontSize: 13, padding: '4px 12px', borderRadius: 99, background: '#fee2e2', color: '#b91c1c', fontWeight: 600 }}>
                  ❌ {xatolar} ta xato
                </span>
              )}
              {kutish > 0 && (
                <span style={{ fontSize: 13, padding: '4px 12px', borderRadius: 99, background: '#fef3c7', color: '#92400e', fontWeight: 600 }}>
                  ⏳ {kutish} ta kutmoqda
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              {kutish > 0 && !ishMoqda && (
                <button
                  onClick={hammasiniYukla}
                  style={{ ...A.btnPrimary, padding: '8px 20px', fontSize: 13 }}
                >
                  ⬆️ Hammasini yuklash ({kutish})
                </button>
              )}
              {ishMoqda && (
                <button disabled style={{ ...A.btnPrimary, padding: '8px 20px', fontSize: 13, opacity: 0.6 }}>
                  Yuklanmoqda...
                </button>
              )}
              <button
                onClick={hammasiniTozala}
                disabled={ishMoqda}
                style={{ ...A.btnGhost, padding: '8px 16px', fontSize: 13 }}
              >
                Tozalash
              </button>
            </div>
          </div>

          {/* Fayllar jadvali */}
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
            {/* Jadval boshi */}
            <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 180px 80px 32px', gap: 0, background: '#f9fafb', borderBottom: '1px solid #e5e7eb', padding: '8px 16px', fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <span>#</span>
              <span>Fayl nomi → Slug</span>
              <span>Holat</span>
              <span>Hajm</span>
              <span></span>
            </div>

            <div style={{ maxHeight: 480, overflowY: 'auto' }}>
              {fayllar.map((item, idx) => (
                <div
                  key={item.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '40px 1fr 180px 80px 32px',
                    gap: 0,
                    padding: '10px 16px',
                    borderBottom: '1px solid #f3f4f6',
                    alignItems: 'center',
                    background: item.holat === HOLAT.OK ? 'rgba(220,252,231,0.3)' : item.holat === HOLAT.XATO ? 'rgba(254,226,226,0.3)' : 'white',
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: '#9ca3af', fontWeight: 600 }}>{idx + 1}</span>

                  <div>
                    <div style={{ fontWeight: 500, color: '#111827', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.fayl.name}
                    </div>
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>
                      slug: <code style={{ background: '#f3f4f6', padding: '0 4px', borderRadius: 3 }}>{item.slug}</code>
                      {item.nom && <span style={{ color: '#3DB851', marginLeft: 8, fontWeight: 600 }}>→ {item.nom}</span>}
                    </div>
                    {item.holat === HOLAT.XATO && (
                      <div style={{ fontSize: 11, color: '#ef4444', marginTop: 2 }}>⚠ {item.xato}</div>
                    )}
                  </div>

                  <div>
                    {item.holat === HOLAT.KUTISH && <span style={{ fontSize: 12, color: '#9ca3af' }}>⏳ Kutmoqda</span>}
                    {item.holat === HOLAT.YUKLANMOQDA && (
                      <span style={{ fontSize: 12, color: '#E8491D', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ display: 'inline-block', width: 12, height: 12, border: '2px solid #E8491D', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                        Yuklanmoqda
                      </span>
                    )}
                    {item.holat === HOLAT.OK && <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}>✅ Yuklandi</span>}
                    {item.holat === HOLAT.XATO && <span style={{ fontSize: 12, color: '#ef4444', fontWeight: 600 }}>❌ Xato</span>}
                  </div>

                  <span style={{ fontSize: 12, color: '#9ca3af' }}>
                    {(item.fayl.size / 1024).toFixed(0)} KB
                  </span>

                  <button
                    onClick={() => birniOchir(item.id)}
                    disabled={item.holat === HOLAT.YUKLANMOQDA}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d1d5db', fontSize: 16, padding: 0, lineHeight: 1 }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </>
      )}
    </div>
  )
}
