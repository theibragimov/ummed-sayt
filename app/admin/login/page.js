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
    <html lang="uz">
      <head>
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&display=swap" />
      </head>
      <body style={{ margin: 0, fontFamily: "'Satoshi', -apple-system, sans-serif", background: '#f5f5f0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '400px', padding: '0 16px' }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{
              width: '52px', height: '52px', background: '#E8491D',
              borderRadius: '14px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 16px',
              fontSize: '24px', fontWeight: 800, color: '#fff',
            }}>U</div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0a0a0a', margin: '0 0 4px', letterSpacing: '-0.03em' }}>
              Ummed Admin
            </h1>
            <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>Boshqaruv paneliga kirish</p>
          </div>

          {/* Form */}
          <div style={{
            background: '#fff', borderRadius: '16px',
            border: '1px solid rgba(0,0,0,0.06)',
            padding: '32px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          }}>
            <form onSubmit={kirishHandler}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px', letterSpacing: '0.01em' }}>
                  Parol
                </label>
                <input
                  type="password"
                  value={parol}
                  onChange={(e) => setParol(e.target.value)}
                  placeholder="••••••••••"
                  required
                  style={{
                    width: '100%', padding: '11px 14px',
                    border: '1px solid rgba(0,0,0,0.12)',
                    borderRadius: '10px', fontSize: '14px',
                    fontFamily: 'inherit', outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#E8491D'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.12)'}
                />
              </div>

              {xato && (
                <div style={{
                  background: 'rgba(232,73,29,0.06)', border: '1px solid rgba(232,73,29,0.2)',
                  color: '#E8491D', borderRadius: '8px', padding: '10px 14px',
                  fontSize: '13px', marginBottom: '16px',
                }}>
                  {xato}
                </div>
              )}

              <button
                type="submit"
                disabled={yuklanmoqda}
                style={{
                  width: '100%', padding: '12px',
                  background: yuklanmoqda ? '#f0a88e' : '#E8491D',
                  color: '#fff', border: 'none', borderRadius: '10px',
                  fontSize: '14px', fontWeight: 600, fontFamily: 'inherit',
                  cursor: yuklanmoqda ? 'not-allowed' : 'pointer',
                  transition: 'background 0.15s',
                  letterSpacing: '0.01em',
                }}
              >
                {yuklanmoqda ? 'Kirish...' : 'Kirish →'}
              </button>
            </form>
          </div>

          <p style={{ textAlign: 'center', fontSize: '12px', color: '#d1d5db', marginTop: '24px' }}>
            Ummed — Tibbiy Jihozlar © 2024
          </p>
        </div>
      </body>
    </html>
  )
}
