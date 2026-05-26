import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getStats() {
  const [mahsulotlar, kategoriyalar, postlar, yangiZayavkalar, jamiZayavkalar, oxirgiZayavkalar] =
    await Promise.all([
      prisma.mahsulot.count(),
      prisma.kategoriya.count(),
      prisma.post.count({ where: { holat: 'published' } }),
      prisma.zayavka.count({ where: { holat: 'new' } }),
      prisma.zayavka.count(),
      prisma.zayavka.findMany({
        orderBy: { sana: 'desc' },
        take: 5,
      }),
    ])
  return { mahsulotlar, kategoriyalar, postlar, yangiZayavkalar, jamiZayavkalar, oxirgiZayavkalar }
}

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

export default async function AdminDashboard() {
  const { mahsulotlar, kategoriyalar, postlar, yangiZayavkalar, jamiZayavkalar, oxirgiZayavkalar } =
    await getStats()

  const cards = [
    { label: 'Yangi zayavkalar', value: yangiZayavkalar, icon: '🆕', color: 'bg-red-500', href: '/admin/zayavkalar' },
    { label: 'Jami mahsulotlar', value: mahsulotlar, icon: '🛒', color: 'bg-blue-500', href: '/admin/mahsulotlar' },
    { label: 'Kategoriyalar', value: kategoriyalar, icon: '📁', color: 'bg-green-500', href: '/admin/kategoriyalar' },
    { label: 'Nashr yangiliklar', value: postlar, icon: '📰', color: 'bg-purple-500', href: '/admin/yangiliklar' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Ummed tibbiy jihozlar boshqaruv paneli</p>
      </div>

      {/* Statistika kartalar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cards.map((c) => (
          <Link key={c.label} href={c.href}>
            <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 ${c.color} rounded-xl flex items-center justify-center text-2xl mb-4`}>
                {c.icon}
              </div>
              <div className="text-3xl font-bold text-gray-900">{c.value}</div>
              <div className="text-gray-500 text-sm mt-1">{c.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Oxirgi zayavkalar */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">Oxirgi zayavkalar</h2>
          <Link href="/admin/zayavkalar" className="text-red-500 text-sm hover:underline">
            Hammasini ko'rish →
          </Link>
        </div>

        {oxirgiZayavkalar.length === 0 ? (
          <p className="text-gray-400 text-center py-8">Hozircha zayavkalar yo'q</p>
        ) : (
          <div className="space-y-3">
            {oxirgiZayavkalar.map((z) => (
              <div key={z.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-medium text-gray-900">{z.ism || 'Noma\'lum'}</div>
                  <div className="text-sm text-gray-500">{z.telefon}</div>
                  {z.mahsulot && (
                    <div className="text-xs text-gray-400 mt-0.5">📦 {z.mahsulot}</div>
                  )}
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${HOLAT_STIL[z.holat]}`}>
                    {HOLAT_NOMI[z.holat]}
                  </span>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(z.sana).toLocaleDateString('uz-UZ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
