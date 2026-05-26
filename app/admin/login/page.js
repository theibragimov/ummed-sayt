'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [parol, setParol] = useState('')
  const [xato, setXato] = useState('')
  const [yuklanmoqda, setYuklanmoqda] = useState(false)
  const router = useRouter()

  async function kirishHandler(e) {
    e.preventDefault()
    setYuklanmoqda(true)
    setXato('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ parol }),
    })
    if (res.ok) {
      router.push('/admin')
      router.refresh()
    } else {
      const d = await res.json()
      setXato(d.xato || 'Xatolik')
    }
    setYuklanmoqda(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🏥</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Ummed Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Boshqaruv paneli</p>
        </div>

        <form onSubmit={kirishHandler} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parol</label>
            <input
              type="password"
              value={parol}
              onChange={(e) => setParol(e.target.value)}
              placeholder="Admin parolini kiriting"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
            />
          </div>

          {xato && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">
              ❌ {xato}
            </div>
          )}

          <button
            type="submit"
            disabled={yuklanmoqda}
            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {yuklanmoqda ? 'Kirish...' : 'Kirish →'}
          </button>
        </form>
      </div>
    </div>
  )
}
