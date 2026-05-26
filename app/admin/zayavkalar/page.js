'use client'
import { useState, useEffect } from 'react'

const HOLAT_STIL = {
  new: 'bg-blue-100 text-blue-700',
  inProgress: 'bg-yellow-100 text-yellow-700',
  done: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-600',
}
const HOLAT_NOMI = {
  new: '🆕 Yangi',
  inProgress: '⏳ Jarayonda',
  done: '✅ Bajarildi',
  rejected: '❌ Rad etildi',
}

export default function ZayavkalarPage() {
  const [zayavkalar, setZayavkalar] = useState([])
  const [filtr, setFiltr] = useState('all')
  const [tanlangan, setTanlangan] = useState(null)
  const [izoh, setIzoh] = useState('')

  useEffect(() => { yuklash() }, [])

  async function yuklash() {
    const res = await fetch('/api/zayavkalar')
    setZayavkalar(await res.json())
  }

  async function holatOzgartir(id, holat) {
    await fetch(`/api/zayavkalar/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ holat }),
    })
    yuklash()
  }

  async function izohSaqla(id) {
    await fetch(`/api/zayavkalar/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ izoh }),
    })
    setTanlangan(null)
    yuklash()
  }

  async function ochir(id) {
    if (!confirm('Haqiqatan ham o\'chirmoqchimisiz?')) return
    await fetch(`/api/zayavkalar/${id}`, { method: 'DELETE' })
    yuklash()
  }

  const korsatilgan = filtr === 'all' ? zayavkalar : zayavkalar.filter((z) => z.holat === filtr)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Zayavkalar</h1>
          <p className="text-gray-500 text-sm mt-1">Jami: {zayavkalar.length} ta</p>
        </div>
      </div>

      {/* Filtrlar */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[['all', 'Barchasi'], ['new', '🆕 Yangi'], ['inProgress', '⏳ Jarayonda'], ['done', '✅ Bajarildi'], ['rejected', '❌ Rad etildi']].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFiltr(val)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filtr === val ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {label}
            <span className="ml-2 bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs">
              {val === 'all' ? zayavkalar.length : zayavkalar.filter((z) => z.holat === val).length}
            </span>
          </button>
        ))}
      </div>

      {/* Jadval */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {korsatilgan.length === 0 ? (
          <div className="text-center py-16 text-gray-400">Zayavkalar yo'q</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {korsatilgan.map((z) => (
              <div key={z.id} className="p-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold text-gray-900">{z.ism || 'Noma\'lum'}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${HOLAT_STIL[z.holat]}`}>
                        {HOLAT_NOMI[z.holat]}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">📞 {z.telefon}</div>
                    {z.email && <div className="text-sm text-gray-500">✉️ {z.email}</div>}
                    {z.mahsulot && <div className="text-sm text-gray-500 mt-1">📦 {z.mahsulot}</div>}
                    {z.xabar && <div className="text-sm text-gray-600 mt-2 bg-gray-50 p-3 rounded-lg">{z.xabar}</div>}
                    {z.izoh && <div className="text-sm text-blue-600 mt-1 italic">💬 {z.izoh}</div>}
                    <div className="text-xs text-gray-400 mt-2">{new Date(z.sana).toLocaleString('uz-UZ')}</div>
                  </div>

                  <div className="flex flex-col gap-2 min-w-fit">
                    <select
                      value={z.holat}
                      onChange={(e) => holatOzgartir(z.id, e.target.value)}
                      className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="new">🆕 Yangi</option>
                      <option value="inProgress">⏳ Jarayonda</option>
                      <option value="done">✅ Bajarildi</option>
                      <option value="rejected">❌ Rad etildi</option>
                    </select>
                    <button
                      onClick={() => { setTanlangan(z.id); setIzoh(z.izoh || '') }}
                      className="text-xs text-blue-600 hover:underline text-center"
                    >
                      💬 Izoh qo'sh
                    </button>
                    <button
                      onClick={() => ochir(z.id)}
                      className="text-xs text-red-500 hover:underline text-center"
                    >
                      🗑 O'chirish
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Izoh modal */}
      {tanlangan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Admin izohi</h3>
            <textarea
              value={izoh}
              onChange={(e) => setIzoh(e.target.value)}
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Izoh yozing..."
            />
            <div className="flex gap-3 mt-4">
              <button onClick={() => izohSaqla(tanlangan)} className="flex-1 bg-blue-500 text-white py-2.5 rounded-xl font-medium hover:bg-blue-600">Saqlash</button>
              <button onClick={() => setTanlangan(null)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-200">Bekor</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
