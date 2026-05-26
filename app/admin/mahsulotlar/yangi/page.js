import MahsulotForm from '@/components/admin/MahsulotForm'
import Link from 'next/link'

export default function YangiMahsulot() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/mahsulotlar" className="text-gray-400 hover:text-gray-600">← Orqaga</Link>
        <h1 className="text-2xl font-bold text-gray-900">Yangi mahsulot</h1>
      </div>
      <MahsulotForm />
    </div>
  )
}
