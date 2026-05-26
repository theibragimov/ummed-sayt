'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import RasmYuklash from '@/components/admin/RasmYuklash'

const BOSHLANGICH = { nom: '', tavsif: '', tartibRaqami: 100, parentId: '', rasmUrl: '' }

export default function KategoriyalarPage() {
  const [kategoriyalar, setKategoriyalar] = useState([])
  const [form, setForm] = useState(BOSHLANGICH)
  const [tahrirlash, setTahrirlash] = useState(null)
  const [modal, setModal] = useState(false)

  useEffect(() => { yuklash() }, [])

  async function yuklash() {
    const res = await fetch('/api/kategoriyalar')
    setKategoriyalar(await res.json())
  }

  function ochModal(kategoriya = null) {
    setTahrirlash(kategoriya)
    setForm(kategoriya ? {
      nom: kategoriya.nom, tavsif: kategoriya.tavsif || '',
      tartibRaqami: kategoriya.tartibRaqami, parentId: kategoriya.parentId || '',
      rasmUrl: kategoriya.rasmUrl || '',
    } : BOSHLANGICH)
    setModal(true)
  }

  async function saqlash() {
    const payload = { ...form, tartibRaqami: parseInt(form.tartibRaqami) || 100, parentId: form.parentId ? parseInt(form.parentId) : null }
    if (tahrirlash) {
      await fetch(`/api/kategoriyalar/${tahrirlash.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    } else {
      await fetch('/api/kategoriyalar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    }
    setModal(false)
    yuklash()
  }

  async function ochir(id, nom) {
    if (!confirm(`"${nom}" ni o'chirmoqchimisiz?`)) return
    await fetch(`/api/kategoriyalar/${id}`, { method: 'DELETE' })
    yuklash()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kategoriyalar</h1>
          <p className="text-gray-500 text-sm mt-1">Jami: {kategoriyalar.length} ta</p>
        </div>
        <button onClick={() => ochModal()} className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm">
          + Yangi kategoriya
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Kategoriya</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Asosiy</th>
              <th className="text-center px-4 py-3 text-gray-500 font-medium">Tartib</th>
              <th className="text-center px-4 py-3 text-gray-500 font-medium">Mahsulotlar</th>
              <th className="text-right px-5 py-3 text-gray-500 font-medium">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {kategoriyalar.map((k) => (
              <tr key={k.id} className="hover:bg-gray-50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    {k.rasmUrl ? (
                      <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 relative flex-shrink-0">
                        <Image src={k.rasmUrl} alt={k.nom} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">📁</div>
                    )}
                    <span className="font-medium text-gray-900">{k.nom}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{k.parent?.nom || '—'}</td>
                <td className="px-4 py-3 text-center text-gray-600">{k.tartibRaqami}</td>
                <td className="px-4 py-3 text-center">
                  <span className="bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {k._count?.mahsulotlar ?? 0}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button onClick={() => ochModal(k)} className="text-blue-500 hover:underline text-xs">✏️</button>
                    <button onClick={() => ochir(k.id, k.nom)} className="text-red-500 hover:underline text-xs">🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {kategoriyalar.length === 0 && <div className="text-center py-16 text-gray-400">Kategoriyalar yo'q</div>}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-5">{tahrirlash ? 'Kategoriyani tahrirlash' : 'Yangi kategoriya'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                <input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asosiy kategoriya</label>
                <select value={form.parentId} onChange={(e) => setForm({ ...form, parentId: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400">
                  <option value="">— Yo'q (asosiy) —</option>
                  {kategoriyalar.filter((k) => k.id !== tahrirlash?.id).map((k) => (
                    <option key={k.id} value={k.id}>{k.nom}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tartib raqami</label>
                <input type="number" value={form.tartibRaqami} onChange={(e) => setForm({ ...form, tartibRaqami: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tavsif</label>
                <textarea value={form.tavsif} onChange={(e) => setForm({ ...form, tavsif: e.target.value })} rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
              </div>
              <RasmYuklash label="Rasm" qiymat={form.rasmUrl} onChange={(v) => setForm({ ...form, rasmUrl: v })} />
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
