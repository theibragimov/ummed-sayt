'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function YangilikPage() {
  const [postlar, setPostlar] = useState([])
  const [filtr, setFiltr] = useState('all')

  useEffect(() => { yuklash() }, [])

  async function yuklash() {
    const res = await fetch('/api/yangiliklar')
    setPostlar(await res.json())
  }

  async function ochir(id, sarlavha) {
    if (!confirm(`"${sarlavha}" ni o'chirmoqchimisiz?`)) return
    await fetch(`/api/yangiliklar/${id}`, { method: 'DELETE' })
    yuklash()
  }

  async function holatToggle(id, holat) {
    const yangi = holat === 'published' ? 'draft' : 'published'
    await fetch(`/api/yangiliklar/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ holat: yangi }),
    })
    yuklash()
  }

  const korsatilgan = filtr === 'all' ? postlar : postlar.filter((p) => p.holat === filtr)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Yangiliklar</h1>
          <p className="text-gray-500 text-sm mt-1">Jami: {postlar.length} ta</p>
        </div>
        <Link href="/admin/yangiliklar/yangi" className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm">
          + Yangi maqola
        </Link>
      </div>

      <div className="flex gap-2 mb-5">
        {[['all', 'Barchasi'], ['published', '✅ Nashr'], ['draft', '📝 Qoralama']].map(([val, label]) => (
          <button key={val} onClick={() => setFiltr(val)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filtr === val ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
            {label} <span className="ml-1 text-xs bg-gray-200 text-gray-600 rounded-full px-2 py-0.5">{val === 'all' ? postlar.length : postlar.filter(p => p.holat === val).length}</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-50">
          {korsatilgan.map((p) => (
            <div key={p.id} className="p-5 hover:bg-gray-50 flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${p.holat === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {p.holat === 'published' ? '✅ Nashr' : '📝 Qoralama'}
                  </span>
                  {p.kategoriya && (
                    <span className="text-xs text-gray-400">{p.kategoriya.nom}</span>
                  )}
                </div>
                <div className="font-medium text-gray-900">{p.sarlavha}</div>
                {p.muallif && <div className="text-xs text-gray-400 mt-0.5">✍️ {p.muallif}</div>}
                <div className="text-xs text-gray-400 mt-1">{new Date(p.sana).toLocaleDateString('uz-UZ')}</div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => holatToggle(p.id, p.holat)}
                  className="text-xs text-green-600 hover:underline">
                  {p.holat === 'published' ? '📝 Qoralamaga' : '✅ Nashr qil'}
                </button>
                <Link href={`/admin/yangiliklar/${p.id}`} className="text-blue-500 hover:underline text-xs">✏️ Tahrirlash</Link>
                <button onClick={() => ochir(p.id, p.sarlavha)} className="text-red-500 hover:underline text-xs">🗑</button>
              </div>
            </div>
          ))}
        </div>
        {korsatilgan.length === 0 && <div className="text-center py-16 text-gray-400">Maqolalar yo'q</div>}
      </div>
    </div>
  )
}
