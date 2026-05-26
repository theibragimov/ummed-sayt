import AdminSidebar from '@/components/admin/AdminSidebar'

export const metadata = { title: 'Ummed Admin Panel' }

export default function AdminLayout({ children }) {
  return (
    <html lang="uz">
      <head>
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&display=swap"
        />
      </head>
      <body style={{ fontFamily: "'Satoshi', -apple-system, BlinkMacSystemFont, sans-serif", margin: 0, background: '#f5f5f0' }}>
        <div className="min-h-screen flex" style={{ background: '#f5f5f0' }}>
          <AdminSidebar />
          <main className="flex-1 min-h-screen" style={{ marginLeft: '260px', padding: '32px' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
