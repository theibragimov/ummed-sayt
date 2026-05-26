'use client'
import { useState } from 'react'
import Image from 'next/image'

export default function RasmYuklash({ qiymat, onChange, label = 'Rasm' }) {
  const [yuklanmoqda, setYuklanmoqda] = useState(false)

  async function faylTanlash(e) {
    const fayl = e.target.files[0]
    if (!fayl) return
    setYuklanmoqda(true)
    const formData = new FormData()
    formData.append('fayl', fayl)
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const data = await res.json()
    if (data.url) onChange(data.url)
    setYuklanmoqda(false)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex items-start gap-4">
        {qiymat && (
          <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
            <Image src={qiymat} alt="rasm" fill className="object-cover" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600"
            >×</button>
          </div>
        )}
        <div className="flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={faylTanlash}
            className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
          />
          <input
            type="text"
            value={qiymat || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Yoki URL kiriting..."
            className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          {yuklanmoqda && <p className="text-sm text-blue-500 mt-1">⏳ Yuklanmoqda...</p>}
        </div>
      </div>
    </div>
  )
}
