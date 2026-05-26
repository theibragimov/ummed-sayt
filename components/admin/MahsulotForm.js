'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import RasmYuklash from './RasmYuklash'

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
    fetch('/api/kategoriyalar').then((r) => r.json()).then(setKategoriyalar)
  }, [])

  function ozgartir(key, val) {
    setForm((f) => ({ ...f, [key]: val }))
    if (key === 'nom' && !mahsulotId) {
      setForm((f) => ({ ...f, nom: val, slug: val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }))
    }
  }

  async function yuborish(e) {
    e.preventDefault()
    setSaqlash(true)
    setXato('')
    const payload = {
      ...form,
      narx: form.narx ? parseFloat(form.narx) : null,
      kategoriyaId: form.kategoriyaId ? parseInt(form.kategoriyaId) : null,
    }
    const url = mahsulotId ? `/api/mahsulotlar/${mahsulotId}` : '/api/mahsulotlar'
    const method = mahsulotId ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      router.push('/admin/mahsulotlar')
      router.refresh()
    } else {
      setXato('Saqlashda xatolik yuz berdi')
    }
    setSaqlash(false)
  }

  return (
    <form onSubmit={yuborish} className="space-y-6 max-w-2xl">
      {xato && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">{xato}</div>}

      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <h3 className="font-semibold text-gray-700 border-b pb-3">Asosiy ma'lumotlar</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Mahsulot nomi *</label>
            <input required value={form.nom} onChange={(e) => ozgartir('nom', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brend</label>
            <input value={form.brend} onChange={(e) => ozgartir('brend', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Model raqami</label>
            <input value={form.modelRaqami} onChange={(e) => ozgartir('modelRaqami', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Narx</label>
            <input type="number" value={form.narx} onChange={(e) => ozgartir('narx', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Narx birligi</label>
            <input value={form.narxBirligi} onChange={(e) => ozgartir('narxBirligi', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategoriya</label>
            <select value={form.kategoriyaId} onChange={(e) => ozgartir('kategoriyaId', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400">
              <option value="">— Tanlang —</option>
              {kategoriyalar.map((k) => (
                <option key={k.id} value={k.id}>{k.nom}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-6 pt-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.mavjudligi} onChange={(e) => ozgartir('mavjudligi', e.target.checked)}
                className="w-4 h-4 accent-green-500" />
              <span className="text-sm text-gray-700">Mavjud</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => ozgartir('featured', e.target.checked)}
                className="w-4 h-4 accent-yellow-500" />
              <span className="text-sm text-gray-700">⭐ Featured</span>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <h3 className="font-semibold text-gray-700 border-b pb-3">Rasm</h3>
        <RasmYuklash label="Asosiy rasm" qiymat={form.asosiyRasmUrl} onChange={(v) => ozgartir('asosiyRasmUrl', v)} />
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <h3 className="font-semibold text-gray-700 border-b pb-3">Tavsiflar</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Qisqa tavsif</label>
          <textarea value={form.qisqaTavsif} onChange={(e) => ozgartir('qisqaTavsif', e.target.value)} rows={2}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">To'liq tavsif</label>
          <textarea value={form.toliqTavsif} onChange={(e) => ozgartir('toliqTavsif', e.target.value)} rows={6}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            placeholder="HTML yoki oddiy matn kiriting..." />
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={saqlash}
          className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-8 py-3 rounded-xl font-medium transition-colors">
          {saqlash ? 'Saqlanmoqda...' : '💾 Saqlash'}
        </button>
        <button type="button" onClick={() => router.back()}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-colors">
          Bekor
        </button>
      </div>
    </form>
  )
}
