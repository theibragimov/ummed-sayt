import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function slugYarat(matn) {
  return matn
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export async function POST(request) {
  try {
    const { mahsulotlar } = await request.json()
    if (!Array.isArray(mahsulotlar) || mahsulotlar.length === 0) {
      return NextResponse.json({ xato: 'Mahsulotlar ro\'yxati bo\'sh' }, { status: 400 })
    }

    // Kategoriyalarni bir marta olish
    const kategoriyalar = await prisma.kategoriya.findMany()
    const katMap = {}
    for (const k of kategoriyalar) katMap[k.slug] = k.id

    let qoshildi = 0
    let ozgartirildi = 0
    let xatolar = 0

    for (const m of mahsulotlar) {
      try {
        const kategoriyaId = katMap[m.kategoriya_slug]
        if (!kategoriyaId) { xatolar++; continue }

        const slug = slugYarat(m.nom)

        await prisma.mahsulot.upsert({
          where: { slug },
          update: {
            nom: m.nom,
            narx: m.narx,
            narxBirligi: m.narxBirligi || "so'm",
            qisqaTavsif: m.qisqaTavsif || null,
            mavjudligi: m.mavjudligi ?? true,
            featured: m.featured ?? false,
            kategoriyaId,
            brend: m.brend || null,
            modelRaqami: m.modelRaqami || null,
          },
          create: {
            nom: m.nom,
            slug,
            narx: m.narx,
            narxBirligi: m.narxBirligi || "so'm",
            qisqaTavsif: m.qisqaTavsif || null,
            mavjudligi: m.mavjudligi ?? true,
            featured: m.featured ?? false,
            kategoriyaId,
            brend: m.brend || null,
            modelRaqami: m.modelRaqami || null,
            asosiyRasmUrl: null,
          },
        })

        // Upsert natijasini aniqlash uchun oddiy hisob
        qoshildi++
      } catch (e) {
        console.error('Mahsulot import xatosi:', e.message)
        xatolar++
      }
    }

    return NextResponse.json({ qoshildi, ozgartirildi, xatolar })
  } catch (e) {
    console.error('Import xatosi:', e)
    return NextResponse.json({ xato: e.message }, { status: 500 })
  }
}
