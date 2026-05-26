'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function MahsulotlarPage() {
  const [mahsulotlar, setMahsulotlar] = useState([])
  const [qidiruv, setQidiruv] = useState('')

  useEffect(() => { yuklash() }, [])

  async function yuklash() {
    const res = await fetch('/api/mahsulotlar')
    setMahsulotlar(await res.json())
  }

  async function ochir(id, nom) {
    if (!confirm(`"${nom}" ni o'chirmoqchimisiz?`)) return
    await fetch(`/api/mahsulotlar/${id}`, { method: 'DELETE' })
    yuklash()
  }

  async function mavjudlikToggle(id, hozirgi) {
    await fetch(`/api/mahsulotlar/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mavjudligi: !hozirgi }),
    })
    yuklash()
  }

  const filtrlangan = mahsulotlar.filter(
    (m) =>
      m.nom.toLowerCase().includes(qidiruv.toLowerCase()) ||
      (m.brend || '').toLowerCase().includes(qidiruv.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mahsulotlar</h1>
          <p className="text-gray-500 text-sm mt-1">Jami: {mahsulotlar.length} ta</p>
        </div>
        <Link
          href="/admin/mahsulotlar/yangi"
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-colors"
        >
          + Yangi mahsulot
        </Link>
      </div>

      <div className="mb-5">
        <input
          type="text"
          placeholder="🔍 Qidirish (nom yoki brend)..."
          value={qidiruv}
          onChange={(e) => setQidiruv(e.target.value)}
          className="w-full max-w-sm border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Mahsulot</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Kategoriya</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Narx</th>
              <th className="text-center px-4 py-3 text-gray-500 font-medium">Mavjud</th>
              <th className="text-center px-4 py-3 text-gray-500 font-medium">Featured</th>
              <th className="text-right px-5 py-3 text-gray-500 font-medium">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtrlangan.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    {m.asosiyRasmUrl ? (
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative">
                        <Image src={m.asosiyRasmUrl} alt={m.nom} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">📷</div>
                    )}
                    <div>
                      <div className="font-medium text-gray-900">{m.nom}</div>
                      {m.brend && <div className="text-xs text-gray-400">{m.brend}</div>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{m.kategoriya?.nom || '—'}</td>
                <td className="px-4 py-3 text-gray-900 font-medium">
                  {m.narx ? `${m.narx.toLocaleString()} ${m.narxBirligi}` : '—'}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => mavjudlikToggle(m.id, m.mavjudligi)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      m.mavjudligi ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {m.mavjudligi ? '✅ Bor' : '❌ Yo\'q'}
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  {m.featured ? <span className="text-yellow-500">⭐</span> : <span className="text-gray-300">—</span>}
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/mahsulotlar/${m.id}`}
                      className="text-blue-500 hover:underline text-xs"
                    >
                      ✏️ Tahrirlash
                    </Link>
                    <button
                      onClick={() => ochir(m.id, m.nom)}
                      className="text-red-500 hover:underline text-xs"
                    >
                      🗑
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtrlangan.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            {qidiruv ? 'Natija topilmadi' : 'Hozircha mahsulotlar yo\'q'}
          </div>
        )}
      </div>
    </div>
  )
}
