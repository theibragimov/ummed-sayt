import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const S = {
  card: { background: '#fff', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.06)', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' },
  h1: { fontSize: '24px', fontWeight: 700, color: '#0a0a0a', margin: '0 0 4px', letterSpacing: '-0.03em' },
  sub: { fontSize: '14px', color: '#9ca3af', margin: 0 },
  label: { fontSize: '12px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' },
  val: { fontSize: '36px', fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.04em', lineHeight: 1.1 },
}

async function getStats() {
  const [mahsulotlar, kategoriyalar, postlar, yangiZayavkalar, jamiZayavkalar, oxirgiZayavkalar] =
    await Promise.all([
      prisma.mahsulot.count(),
      prisma.kategoriya.count(),
      prisma.post.count({ where: { holat: 'published' } }),
      prisma.zayavka.count({ where: { holat: 'new' } }),
      prisma.zayavka.count(),
      prisma.zayavka.findMany({ orderBy: { sana: 'desc' }, take: 6 }),
    ])
  return { mahsulotlar, kategoriyalar, postlar, yangiZayavkalar, jamiZayavkalar, oxirgiZayavkalar }
}

const HOLAT_STIL = {
  new: { bg: 'rgba(232,73,29,0.08)', color: '#E8491D', label: 'Yangi' },
  inProgress: { bg: 'rgba(234,179,8,0.1)', color: '#b45309', label: 'Jarayonda' },
  done: { bg: 'rgba(61,184,81,0.1)', color: '#16a34a', label: 'Bajarildi' },
  rejected: { bg: 'rgba(239,68,68,0.08)', color: '#dc2626', label: 'Rad etildi' },
}

export default async function AdminDashboard() {
  const { mahsulotlar, kategoriyalar, postlar, yangiZayavkalar, oxirgiZayavkalar } = await getStats()

  const cards = [
    { label: 'Yangi zayavkalar', value: yangiZayavkalar, accent: '#E8491D', href: '/admin/zayavkalar', desc: 'Ko\'rib chiqilmagan' },
    { label: 'Mahsulotlar', value: mahsulotlar, accent: '#0a0a0a', href: '/admin/mahsulotlar', desc: 'Jami katalogda' },
    { label: 'Kategoriyalar', value: kategoriyalar, accent: '#3DB851', href: '/admin/kategoriyalar', desc: 'Faol kategoriyalar' },
    { label: 'Yangiliklar', value: postlar, accent: '#6366f1', href: '/admin/yangiliklar', desc: 'Nashr etilgan' },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={S.h1}>Dashboard</h1>
        <p style={S.sub}>Ummed tibbiy jihozlar boshqaruv paneli</p>
      </div>

      {/* Stat kartalar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {cards.map((c) => (
          <Link key={c.label} href={c.href} style={{ textDecoration: 'none' }}>
            <div style={{
              ...S.card, cursor: 'pointer',
              transition: 'box-shadow 0.2s, transform 0.2s',
              ':hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.1)' },
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <span style={S.label}>{c.label}</span>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: c.accent }} />
              </div>
              <div style={S.val}>{c.value}</div>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '6px' }}>{c.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Oxirgi zayavkalar */}
      <div style={S.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0a0a0a', margin: '0 0 2px', letterSpacing: '-0.02em' }}>
              Oxirgi zayavkalar
            </h2>
            <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>Eng so'nggi buyurtmalar</p>
          </div>
          <Link href="/admin/zayavkalar" style={{ fontSize: '13px', fontWeight: 600, color: '#E8491D', textDecoration: 'none' }}>
            Barchasi →
          </Link>
        </div>

        {oxirgiZayavkalar.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#d1d5db', fontSize: '14px' }}>
            Hozircha zayavkalar yo'q
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            {/* Table header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr auto auto', gap: '12px', padding: '8px 12px', background: '#f9faf8', borderRadius: '8px', marginBottom: '4px' }}>
              {['Ism', 'Telefon', 'Mahsulot', 'Sana', 'Holat'].map(h => (
                <span key={h} style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
              ))}
            </div>
            {oxirgiZayavkalar.map((z) => {
              const h = HOLAT_STIL[z.holat] || HOLAT_STIL.new
              return (
                <div key={z.id} style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr 2fr auto auto', gap: '12px',
                  padding: '12px', borderRadius: '8px', alignItems: 'center',
                  transition: 'background 0.15s',
                }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#0a0a0a' }}>{z.ism || '—'}</span>
                  <span style={{ fontSize: '13px', color: '#6b7280' }}>{z.telefon || '—'}</span>
                  <span style={{ fontSize: '13px', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{z.mahsulot || '—'}</span>
                  <span style={{ fontSize: '12px', color: '#9ca3af', whiteSpace: 'nowrap' }}>
                    {new Date(z.sana).toLocaleDateString('uz-UZ')}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px', background: h.bg, color: h.color, whiteSpace: 'nowrap' }}>
                    {h.label}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
