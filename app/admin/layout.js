import AdminSidebar from '@/components/admin/AdminSidebar'

export const metadata = { title: 'Ummed Admin Panel' }

export default function AdminLayout({ children }) {
  return (
    <>
      <style>{`
        .admin-wrap * { font-family: 'Satoshi', -apple-system, BlinkMacSystemFont, sans-serif !important; }
      `}</style>
      <link
        rel="stylesheet"
        href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&display=swap"
      />
      <div className="admin-wrap min-h-screen flex" style={{ background: '#f5f5f0' }}>
        <AdminSidebar />
        <main className="flex-1 min-h-screen" style={{ marginLeft: '260px', padding: '32px' }}>
          {children}
        </main>
      </div>
    </>
  )
}
