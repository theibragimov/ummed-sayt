'use client'
import { useState, useEffect } from 'react'
import AdminSidebar from './AdminSidebar'

export default function AdminShell({ children }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  // Close sidebar on route change (mobile)
  useEffect(() => { setOpen(false) }, [])

  return (
    <>
      <style>{`
        .admin-wrap * { font-family: 'Satoshi', -apple-system, BlinkMacSystemFont, sans-serif !important; }
        .admin-sidebar-wrap {
          position: fixed; top: 0; left: 0; height: 100vh; width: 260px; z-index: 50;
        }
        .admin-overlay {
          display: none; position: fixed; inset: 0;
          background: rgba(0,0,0,0.35); z-index: 49;
          opacity: 0; transition: opacity 0.25s;
        }
        .admin-main { margin-left: 260px; min-height: 100vh; padding: 32px; }
        .admin-topbar { display: none; }
        .admin-sidebar-close { display: none !important; }

        @media (max-width: 768px) {
          .admin-sidebar-wrap {
            transform: translateX(-100%);
            transition: transform 0.25s ease;
          }
          .admin-sidebar-wrap.open { transform: translateX(0); }
          .admin-overlay { display: block; }
          .admin-overlay.open { opacity: 1; pointer-events: auto; }
          .admin-main { margin-left: 0 !important; padding: 16px; padding-top: 72px; }
          .admin-topbar {
            display: flex; align-items: center; gap: 12px;
            position: fixed; top: 0; left: 0; right: 0; height: 56px;
            background: #fff; border-bottom: 1px solid rgba(0,0,0,0.07);
            padding: 0 16px; z-index: 48;
          }
          .admin-sidebar-close { display: flex !important; }
        }
      `}</style>

      <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&display=swap" />

      {/* Mobile top bar */}
      <div className="admin-topbar">
        <button
          onClick={() => setOpen(true)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', borderRadius: '8px' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <span style={{ fontWeight: 700, fontSize: '15px', color: '#0a0a0a', letterSpacing: '-0.02em' }}>Ummed Admin</span>
      </div>

      {/* Mobile overlay */}
      <div
        className={`admin-overlay${open ? ' open' : ''}`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar */}
      <div className={`admin-sidebar-wrap${open ? ' open' : ''}`}>
        <AdminSidebar onClose={() => setOpen(false)} />
      </div>

      {/* Main content */}
      <div className="admin-wrap" style={{ background: '#f5f5f0', minHeight: '100vh' }}>
        <main className="admin-main">
          {children}
        </main>
      </div>
    </>
  )
}
