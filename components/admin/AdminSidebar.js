'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'

const MENU = [
  { href: '/admin', label: 'Dashboard', icon: '▦', exact: true },
  { href: '/admin/zayavkalar', label: 'Zayavkalar', icon: '◫' },
  { href: '/admin/mahsulotlar', label: 'Mahsulotlar', icon: '◈' },
  { href: '/admin/mahsulotlar/import', label: 'CSV Import', icon: '⬆', sub: true },
  { href: '/admin/bulk-rasm', label: 'Ommaviy rasm', icon: '🖼', sub: true },
  { href: '/admin/kategoriyalar', label: 'Kategoriyalar', icon: '◉' },
  { href: '/admin/yangiliklar', label: 'Yangiliklar', icon: '◎' },
  { href: '/admin/tugmalar', label: 'Tugmalar', icon: '◯' },
  { href: '/admin/sozlamalar', label: 'Sozlamalar', icon: '⚙' },
  { href: '/admin/moysklad', label: 'MoySklad Sync', icon: '🔄' },
]

export default function AdminSidebar({ onClose }) {
  const pathname = usePathname()
  const router = useRouter()

  async function chiqish() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  function faol(item) {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  return (
    <aside style={{
      height: '100vh', width: '260px',
      background: '#ffffff',
      borderRight: '1px solid rgba(0,0,0,0.06)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px', height: '38px',
            background: '#ffffff',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', flexShrink: 0,
          }}>
            <Image src="/logo-icon.png" alt="Ummed logo" width={28} height={28} style={{ objectFit: 'contain' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '15px', color: '#0a0a0a', letterSpacing: '-0.02em' }}>Ummed</div>
            <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Admin Panel</div>
          </div>
          {/* Close button — only visible on mobile via CSS */}
          <button
            onClick={onClose}
            className="admin-sidebar-close"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '6px', color: '#9ca3af', alignItems: 'center', borderRadius: '6px',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{ fontSize: '10px', fontWeight: 600, color: '#9ca3af', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 12px 8px' }}>
          Menyu
        </div>
        {MENU.map((item) => {
          const active = faol(item)
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: item.sub ? '7px 12px 7px 36px' : '9px 12px',
              borderRadius: '8px',
              fontSize: item.sub ? '13px' : '14px',
              fontWeight: active ? 600 : 500,
              color: active ? '#E8491D' : item.sub ? '#6b7280' : '#374151',
              background: active ? 'rgba(232,73,29,0.07)' : 'transparent',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
              borderLeft: active ? '2px solid #E8491D' : '2px solid transparent',
            }}>
              <span style={{ fontSize: item.sub ? '13px' : '16px', opacity: active ? 1 : 0.5 }}>{item.icon}</span>
              {item.label}
              {item.href === '/admin/zayavkalar' && (
                <span style={{
                  marginLeft: 'auto', background: '#E8491D', color: '#fff',
                  borderRadius: '20px', padding: '1px 7px', fontSize: '10px', fontWeight: 700,
                }} id="zayavka-badge" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Quyi */}
      <div style={{ padding: '12px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <Link href="/" target="_blank" style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '9px 12px', borderRadius: '8px',
          fontSize: '13px', fontWeight: 500, color: '#6b7280',
          textDecoration: 'none', transition: 'all 0.15s ease',
        }}>
          <span>↗</span> Saytni ko'rish
        </Link>
        <button onClick={chiqish} style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '9px 12px', borderRadius: '8px', width: '100%',
          fontSize: '13px', fontWeight: 500, color: '#ef4444',
          background: 'transparent', border: 'none', cursor: 'pointer',
          transition: 'all 0.15s ease', textAlign: 'left',
        }}>
          <span>→</span> Chiqish
        </button>
      </div>
    </aside>
  )
}
