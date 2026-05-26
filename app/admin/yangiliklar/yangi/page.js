import PostForm from '@/components/admin/PostForm'
import Link from 'next/link'

export default function YangiPost() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/yangiliklar" className="text-gray-400 hover:text-gray-600">← Orqaga</Link>
        <h1 className="text-2xl font-bold text-gray-900">Yangi maqola</h1>
      </div>
      <PostForm />
    </div>
  )
}
