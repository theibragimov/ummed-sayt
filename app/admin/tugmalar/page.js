'use client'
import { useState, useEffect } from 'react'

const BOSHLANGICH = { nom: '', matn: '', havola: '', yangiTabda: false, faol: true }

export default function TugmalarPage() {
  const [tugmalar, setTugmalar] = useState([])
  const [form, setForm] = useState(BOSHLANGICH)
  const [tahrirlash, setTahrirlash] = useState(null)
  const [modal, setModal] = useState(false)

  useEffect(() => { yuklash() }, [])

  async function yuklash() {
    const res = await fetch('/api/tugmalar')
    setTugmalar(await res.json())
  }

  function ochModal(tugma = null) {
    setTahrirlash(tugma)
    setForm(tugma ? { nom: tugma.nom, matn: tugma.matn, havola: tugma.havola, yangiTabda: tugma.yangiTabda, faol: tugma.faol } : BOSHLANGICH)
    setModal(true)
  }

  async function saqlash() {
    if (tahrirlash) {
      await fetch(`/api/tugmalar/${tahrirlash.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    } else {
      await fetch('/api/tugmalar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    }
    setModal(false)
    yuklash()
  }

  async function ochir(id, nom) {
    if (!confirm(`"${nom}" ni o'chirmoqchimisiz?`)) return
    await fetch(`/api/tugmalar/${id}`, { method: 'DELETE' })
    yuklash()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tugmalar va Havolalar</h1>
          <p className="text-gray-500 text-sm mt-1">Saytdagi CTA tugmalarini boshqarish</p>
        </div>
        <button onClick={() => ochModal()} className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm">
          + Yangi tugma
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-50">
          {tugmalar.map((t) => (
            <div key={t.id} className="p-5 hover:bg-gray-50 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{t.matn}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${t.faol ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {t.faol ? '✅ Faol' : '⛔ Nofaol'}
                  </span>
                  {t.yangiTabda && <span className="text-xs text-gray-400">↗ Yangi tab</span>}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">📌 {t.nom}</div>
                <div className="text-xs text-blue-500 mt-0.5">🔗 {t.havola}</div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => ochModal(t)} className="text-blue-500 hover:underline text-xs">✏️ Tahrirlash</button>
                <button onClick={() => ochir(t.id, t.nom)} className="text-red-500 hover:underline text-xs">🗑</button>
              </div>
            </div>
          ))}
        </div>
        {tugmalar.length === 0 && <div className="text-center py-16 text-gray-400">Tugmalar yo'q</div>}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold mb-5">{tahrirlash ? 'Tugmani tahrirlash' : 'Yangi tugma'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ichki nom *</label>
                <input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  placeholder="Masalan: Bosh sahifa hero tugmasi"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tugma matni *</label>
                <input value={form.matn} onChange={(e) => setForm({ ...form, matn: e.target.value })}
                  placeholder="Masalan: Buyurtma bering"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Havola (URL)</label>
                <input value={form.havola} onChange={(e) => setForm({ ...form, havola: e.target.value })}
                  placeholder="/boglanish yoki https://..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.yangiTabda} onChange={(e) => setForm({ ...form, yangiTabda: e.target.checked })} className="w-4 h-4 accent-blue-500" />
                  <span className="text-sm text-gray-700">Yangi tabda ochish</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.faol} onChange={(e) => setForm({ ...form, faol: e.target.checked })} className="w-4 h-4 accent-green-500" />
                  <span className="text-sm text-gray-700">Faol</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={saqlash} className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-medium hover:bg-red-600">Saqlash</button>
              <button onClick={() => setModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-200">Bekor</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
