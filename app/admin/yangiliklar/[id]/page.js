export const dynamic = 'force-dynamic'
import PostForm from '@/components/admin/PostForm'
import Link from 'next/link'
import { getPostById } from '@/lib/db'
import { notFound } from 'next/navigation'

export default async function PostTahrirlash({ params }) {
  const post = await getPostById(params.id)
  if (!post) notFound()

  const boshlangich = {
    sarlavha: post.sarlavha,
    slug: post.slug,
    muallif: post.muallif || '',
    qisqaTavsif: post.qisqaTavsif || '',
    toliqMatn: post.toliqMatn || '',
    holat: post.holat,
    kategoriyaId: post.kategoriyaId || '',
    muqovaRasmUrl: post.muqovaRasmUrl || '',
    sana: new Date(post.sana).toISOString().slice(0, 16),
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/yangiliklar" className="text-gray-400 hover:text-gray-600">← Orqaga</Link>
        <h1 className="text-2xl font-bold text-gray-900">Maqolani tahrirlash</h1>
      </div>
      <PostForm boshlangich={boshlangich} postId={params.id} />
    </div>
  )
}
