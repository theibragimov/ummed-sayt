'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [login, setLogin] = useState('')
  const [parol, setParol] = useState('')
  const [parolKorinsin, setParolKorinsin] = useState(false)
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
      body: JSON.stringify({ login, parol }),
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '12px' }}>
              <img src="/logo.png" alt="Ummed" style={{ height: '44px', width: 'auto', objectFit: 'contain' }} />
              <span style={{ fontSize: '22px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.03em' }}>Ummed</span>
            </div>
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
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px', letterSpacing: '0.01em' }}>
                  Login
                </label>
                <input
                  type="email"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  placeholder="email@ummed.uz"
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
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px', letterSpacing: '0.01em' }}>
                  Parol
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={parolKorinsin ? 'text' : 'password'}
                    value={parol}
                    onChange={(e) => setParol(e.target.value)}
                    placeholder="••••••••••"
                    required
                    style={{
                      width: '100%', padding: '11px 44px 11px 14px',
                      border: '1px solid rgba(0,0,0,0.12)',
                      borderRadius: '10px', fontSize: '14px',
                      fontFamily: 'inherit', outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.15s',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#E8491D'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.12)'}
                  />
                  <button
                    type="button"
                    onClick={() => setParolKorinsin(!parolKorinsin)}
                    style={{
                      position: 'absolute', right: '12px', top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      padding: '4px', color: '#9ca3af', display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {parolKorinsin ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
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
            Ummed — Tibbiy Jihozlar © 2026
          </p>
        </div>
      </body>
    </html>
  )
}
