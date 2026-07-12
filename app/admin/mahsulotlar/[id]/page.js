export const dynamic = 'force-dynamic'
import MahsulotForm from '@/components/admin/MahsulotForm'
import Link from 'next/link'
import { getMahsulotById } from '@/lib/db'
import { notFound } from 'next/navigation'

export default async function MahsulotTahrirlash({ params }) {
  const { id } = await params
  const mahsulot = await getMahsulotById(id)
  if (!mahsulot) notFound()

  const boshlangich = {
    nom: mahsulot.nom,
    nomRu: mahsulot.nomRu || '',
    nomEn: mahsulot.nomEn || '',
    slug: mahsulot.slug,
    narx: mahsulot.narx || '',
    narxBirligi: mahsulot.narxBirligi,
    brend: mahsulot.brend || '',
    modelRaqami: mahsulot.modelRaqami || '',
    qisqaTavsif: mahsulot.qisqaTavsif || '',
    qisqaTavsifRu: mahsulot.qisqaTavsifRu || '',
    qisqaTavsifEn: mahsulot.qisqaTavsifEn || '',
    toliqTavsif: mahsulot.toliqTavsif || '',
    toliqTavsifRu: mahsulot.toliqTavsifRu || '',
    toliqTavsifEn: mahsulot.toliqTavsifEn || '',
    mavjudligi: mahsulot.mavjudligi,
    featured: mahsulot.featured,
    kategoriyaId: mahsulot.kategoriyaId ? String(mahsulot.kategoriyaId) : '',
    asosiyRasmUrl: mahsulot.asosiyRasmUrl || '',
    turi: mahsulot.turi || 'katalog',
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/mahsulotlar" className="text-gray-400 hover:text-gray-600">← Orqaga</Link>
        <h1 className="text-2xl font-bold text-gray-900">Mahsulotni tahrirlash</h1>
      </div>
      <MahsulotForm boshlangich={boshlangich} mahsulotId={id} />
    </div>
  )
}
