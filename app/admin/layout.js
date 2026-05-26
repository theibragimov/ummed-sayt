import AdminSidebar from '@/components/admin/AdminSidebar'

export const metadata = { title: 'Ummed Admin Panel' }

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-6 min-h-screen">
        {children}
      </main>
    </div>
  )
}
