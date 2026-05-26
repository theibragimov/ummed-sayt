'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const MENU = [
  { href: '/admin', label: 'Dashboard', icon: '▦', exact: true },
  { href: '/admin/zayavkalar', label: 'Zayavkalar', icon: '◫' },
  { href: '/admin/mahsulotlar', label: 'Mahsulotlar', icon: '◈' },
  { href: '/admin/kategoriyalar', label: 'Kategoriyalar', icon: '◉' },
  { href: '/admin/yangiliklar', label: 'Yangiliklar', icon: '◎' },
  { href: '/admin/tugmalar', label: 'Tugmalar', icon: '◯' },
]

export default function AdminSidebar() {
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
      position: 'fixed', top: 0, left: 0, height: '100vh', width: '260px',
      background: '#ffffff',
      borderRight: '1px solid rgba(0,0,0,0.06)',
      display: 'flex', flexDirection: 'column',
      zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{ padding: '28px 24px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px', height: '38px',
            background: '#E8491D',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '18px', fontWeight: 700,
          }}>U</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '15px', color: '#0a0a0a', letterSpacing: '-0.02em' }}>Ummed</div>
            <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Admin Panel</div>
          </div>
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
              padding: '9px 12px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: active ? 600 : 500,
              color: active ? '#E8491D' : '#374151',
              background: active ? 'rgba(232,73,29,0.07)' : 'transparent',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
              borderLeft: active ? '2px solid #E8491D' : '2px solid transparent',
            }}>
              <span style={{ fontSize: '16px', opacity: active ? 1 : 0.5 }}>{item.icon}</span>
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
