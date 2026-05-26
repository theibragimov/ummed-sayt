'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import RasmYuklash from './RasmYuklash'

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

  useEffect(() => {
    fetch('/api/post-kategoriyalar').then((r) => r.json()).then(setKategoriyalar)
  }, [])

  function ozgartir(key, val) {
    setForm((f) => ({ ...f, [key]: val }))
    if (key === 'sarlavha' && !postId) {
      setForm((f) => ({ ...f, sarlavha: val, slug: val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }))
    }
  }

  async function yuborish(e) {
    e.preventDefault()
    setSaqlash(true)
    const payload = { ...form, kategoriyaId: form.kategoriyaId ? parseInt(form.kategoriyaId) : null }
    const url = postId ? `/api/yangiliklar/${postId}` : '/api/yangiliklar'
    const method = postId ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) { router.push('/admin/yangiliklar'); router.refresh() }
    setSaqlash(false)
  }

  return (
    <form onSubmit={yuborish} className="space-y-6 max-w-2xl">
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <h3 className="font-semibold text-gray-700 border-b pb-3">Asosiy ma'lumotlar</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sarlavha *</label>
          <input required value={form.sarlavha} onChange={(e) => ozgartir('sarlavha', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Muallif</label>
            <input value={form.muallif} onChange={(e) => ozgartir('muallif', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sana</label>
            <input type="datetime-local" value={form.sana} onChange={(e) => ozgartir('sana', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategoriya</label>
            <select value={form.kategoriyaId} onChange={(e) => ozgartir('kategoriyaId', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400">
              <option value="">— Tanlang —</option>
              {kategoriyalar.map((k) => <option key={k.id} value={k.id}>{k.nom}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Holat</label>
            <select value={form.holat} onChange={(e) => ozgartir('holat', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400">
              <option value="draft">📝 Qoralama</option>
              <option value="published">✅ Nashr</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <h3 className="font-semibold text-gray-700 border-b pb-3">Rasm</h3>
        <RasmYuklash label="Muqova rasm" qiymat={form.muqovaRasmUrl} onChange={(v) => ozgartir('muqovaRasmUrl', v)} />
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <h3 className="font-semibold text-gray-700 border-b pb-3">Matn</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Qisqa tavsif (300 belgigacha)</label>
          <textarea value={form.qisqaTavsif} onChange={(e) => ozgartir('qisqaTavsif', e.target.value)} rows={2} maxLength={300}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">To'liq matn (HTML qabul qilinadi)</label>
          <textarea value={form.toliqMatn} onChange={(e) => ozgartir('toliqMatn', e.target.value)} rows={12}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-400"
            placeholder="<h2>Sarlavha</h2><p>Matn...</p><ul><li>Ro'yxat</li></ul>" />
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={saqlash}
          className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-8 py-3 rounded-xl font-medium">
          {saqlash ? 'Saqlanmoqda...' : '💾 Saqlash'}
        </button>
        <button type="button" onClick={() => router.back()}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium">
          Bekor
        </button>
      </div>
    </form>
  )
}
