import { cookies } from 'next/headers'
import { sessionTokenTekshir } from '@/lib/auth'
import AdminShell from '@/components/admin/AdminShell'

export const metadata = { title: 'Ummed Admin Panel' }

export default async function AdminLayout({ children }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  const autentifikatsiya = sessionTokenTekshir(token)

  if (!autentifikatsiya) {
    return <>{children}</>
  }

  return <AdminShell>{children}</AdminShell>
}
