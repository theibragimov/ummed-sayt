'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const MENU = [
  { href: '/admin', label: 'Dashboard', icon: '📊', exact: true },
  { href: '/admin/zayavkalar', label: 'Zayavkalar', icon: '📋' },
  { href: '/admin/mahsulotlar', label: 'Mahsulotlar', icon: '🛒' },
  { href: '/admin/kategoriyalar', label: 'Kategoriyalar', icon: '📁' },
  { href: '/admin/yangiliklar', label: 'Yangiliklar', icon: '📰' },
  { href: '/admin/tugmalar', label: 'Tugmalar', icon: '🔗' },
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
    <aside className="fixed top-0 left-0 h-full w-64 bg-gray-900 text-white flex flex-col z-50">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-red-500 rounded-xl flex items-center justify-center text-lg">🏥</div>
          <div>
            <div className="font-bold text-base">Ummed</div>
            <div className="text-gray-400 text-xs">Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Menyu */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {MENU.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              faol(item)
                ? 'bg-red-500 text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Quyi qism */}
      <div className="px-3 py-4 border-t border-gray-700 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <span>🌐</span> Saytni ko'rish
        </Link>
        <button
          onClick={chiqish}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-300 hover:bg-red-900 hover:text-red-300 transition-colors"
        >
          <span>🚪</span> Chiqish
        </button>
      </div>
    </aside>
  )
}
