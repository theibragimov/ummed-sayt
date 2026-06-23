export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 daqiqa (Vercel Pro)

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { prisma } from '@/lib/prisma'
import {
  msKategoriyalarOl,
  msMahsulotlarOl,
  msMahsulotRasmlariOl,
  msRasmniYuklash,
} from '@/lib/moysklad'

function slugYarat(matn) {
  const tr = {
    а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'yo',ж:'zh',з:'z',и:'i',
    й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',
    у:'u',ф:'f',х:'h',ц:'ts',ч:'ch',ш:'sh',щ:'sch',ъ:'',ы:'y',ь:'',
    э:'e',ю:'yu',я:'ya',ў:'o',қ:'q',ғ:'g',ҳ:'h',
  }
  return matn
    .toLowerCase()
    .split('')
    .map(c => tr[c] ?? c)
    .join('')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .slice(0, 100)
}

// Slug noyobligini ta'minlash
async function noyobSlugOl(bazaSlug, moyskladId) {
  // Agar shu moyskladId bilan mahsulot allaqachon mavjud bo'lsa, uning slugini qaytaramiz
  const mavjud = await prisma.mahsulot.findUnique({ where: { moyskladId } })
  if (mavjud) return mavjud.slug

  let slug = bazaSlug || 'mahsulot'
  let raqam = 0
  while (true) {
    const test = raqam === 0 ? slug : `${slug}-${raqam}`
    const bor = await prisma.mahsulot.findUnique({ where: { slug: test } })
    if (!bor) return test
    raqam++
  }
}

function msIdOl(href) {
  return href?.split('/').pop()
}

export async function POST(request) {
  // Vercel cron yoki manual trigger uchun secret tekshirish
  const secret = request.headers.get('x-cron-secret')
    || new URL(request.url).searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ xato: 'Ruxsat yo\'q' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  )

  const natija = {
    kategoriyalar: { qoshildi: 0, yangilandi: 0 },
    mahsulotlar: { qoshildi: 0, yangilandi: 0, yashirildi: 0 },
    rasmlar: { yuklandi: 0, xato: 0 },
    boshlanganVaqt: new Date().toISOString(),
  }

  // ─── 1. Kategoriyalar sinxronizatsiyasi ──────────────────────────────────────
  const msKategoriyalar = await msKategoriyalarOl()

  // Avval top-level kategoriyalarni yaratamiz (parent yo'q)
  const msKatMap = new Map() // moyskladId → DB id

  for (const msKat of msKategoriyalar) {
    const msId = msIdOl(msKat.meta.href)
    const parentMsId = msKat.productFolder ? msIdOl(msKat.productFolder.meta.href) : null

    const nom = msKat.name
    const slug = slugYarat(nom) || `kategoriya-${msId.slice(-6)}`

    const mavjud = await prisma.kategoriya.findUnique({ where: { moyskladId: msId } })
    let parentId = parentMsId ? (msKatMap.get(parentMsId) ?? null) : null

    if (mavjud) {
      await prisma.kategoriya.update({
        where: { moyskladId: msId },
        data: { nom, ...(parentId ? { parentId } : {}) },
      })
      msKatMap.set(msId, mavjud.id)
      natija.kategoriyalar.yangilandi++
    } else {
      const slugNoyob = await (async () => {
        let s = slug, n = 0
        while (true) {
          const test = n === 0 ? s : `${s}-${n}`
          const bor = await prisma.kategoriya.findUnique({ where: { slug: test } })
          if (!bor) return test
          n++
        }
      })()
      const yangi = await prisma.kategoriya.create({
        data: { nom, slug: slugNoyob, moyskladId: msId, parentId },
      })
      msKatMap.set(msId, yangi.id)
      natija.kategoriyalar.qoshildi++
    }
  }

  // ─── 2. Mahsulotlar sinxronizatsiyasi ────────────────────────────────────────
  const msMahsulotlar = await msMahsulotlarOl()
  const msMahsulotIdlar = new Set(msMahsulotlar.map(p => msIdOl(p.meta.href)))

  for (const msProd of msMahsulotlar) {
    const msId = msIdOl(msProd.meta.href)
    const nom = msProd.name
    const mavjudligi = !msProd.archived
    const narx = msProd.salePrices?.[0]?.value
      ? msProd.salePrices[0].value / 100
      : null
    const tavsif = msProd.description || null
    const kod = msProd.article || msProd.code || null

    const kategoriyaMsId = msProd.productFolder
      ? msIdOl(msProd.productFolder.meta.href)
      : null
    const kategoriyaId = kategoriyaMsId ? (msKatMap.get(kategoriyaMsId) ?? null) : null

    const msUpdated = new Date(msProd.updated)

    const mavjud = await prisma.mahsulot.findUnique({ where: { moyskladId: msId } })

    let mahsulotId

    if (mavjud) {
      await prisma.mahsulot.update({
        where: { moyskladId: msId },
        data: {
          nom,
          mavjudligi,
          narx,
          qisqaTavsif: tavsif,
          kategoriyaId,
          modelRaqami: kod,
          moyskladUpdated: msUpdated,
        },
      })
      mahsulotId = mavjud.id
      natija.mahsulotlar.yangilandi++

      // Rasmlarni faqat yangilangan mahsulotlar uchun qayta yuklash
      const oxirgiYangilanish = mavjud.moyskladUpdated
      if (!oxirgiYangilanish || msUpdated > oxirgiYangilanish) {
        await rasmlarniYangilash(supabase, msId, mahsulotId, natija)
      }
    } else {
      const slug = await noyobSlugOl(slugYarat(nom), msId)
      const yangi = await prisma.mahsulot.create({
        data: {
          nom,
          slug,
          mavjudligi,
          narx,
          qisqaTavsif: tavsif,
          kategoriyaId,
          modelRaqami: kod,
          moyskladId: msId,
          moyskladUpdated: msUpdated,
          turi: 'katalog',
        },
      })
      mahsulotId = yangi.id
      natija.mahsulotlar.qoshildi++
      await rasmlarniYangilash(supabase, msId, mahsulotId, natija)
    }
  }

  // ─── 3. MoySkladda yo'q mahsulotlarni yashirish ──────────────────────────────
  const dbMsMahsulotlar = await prisma.mahsulot.findMany({
    where: { moyskladId: { not: null } },
    select: { id: true, moyskladId: true },
  })

  for (const dbProd of dbMsMahsulotlar) {
    if (!msMahsulotIdlar.has(dbProd.moyskladId)) {
      await prisma.mahsulot.update({
        where: { id: dbProd.id },
        data: { mavjudligi: false },
      })
      natija.mahsulotlar.yashirildi++
    }
  }

  // ─── 4. Oxirgi sinxronizatsiya vaqtini saqlash ───────────────────────────────
  await prisma.saytSozlamalari.upsert({
    where: { kalit: 'moysklad_last_sync' },
    update: { qiymat: new Date().toISOString() },
    create: { kalit: 'moysklad_last_sync', qiymat: new Date().toISOString() },
  })

  natija.tugaganVaqt = new Date().toISOString()
  console.log('MoySklad sync natija:', JSON.stringify(natija))
  return NextResponse.json(natija)
}

async function rasmlarniYangilash(supabase, msMahsulotId, dbMahsulotId, natija) {
  try {
    const msRasmlar = await msMahsulotRasmlariOl(msMahsulotId)
    if (!msRasmlar.length) return

    await prisma.mahsulotRasm.deleteMany({ where: { mahsulotId: dbMahsulotId } })

    let tartib = 0
    for (const rasm of msRasmlar) {
      const downloadHref = rasm.meta?.downloadHref
      if (!downloadHref) continue

      try {
        const fileName = `${msMahsulotId}-${tartib}`
        const url = await msRasmniYuklash(downloadHref, supabase, fileName)

        await prisma.mahsulotRasm.create({
          data: { mahsulotId: dbMahsulotId, rasmUrl: url, tartib },
        })

        if (tartib === 0) {
          await prisma.mahsulot.update({
            where: { id: dbMahsulotId },
            data: { asosiyRasmUrl: url },
          })
        }

        natija.rasmlar.yuklandi++
        tartib++
      } catch (e) {
        console.error(`Rasm yuklanmadi (${msMahsulotId}):`, e.message)
        natija.rasmlar.xato++
      }
    }
  } catch (e) {
    console.error(`Rasmlar olishda xato (${msMahsulotId}):`, e.message)
  }
}

// GET — manual tekshirish uchun (admin paneldan)
export async function GET(request) {
  const secret = new URL(request.url).searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ xato: 'Ruxsat yo\'q' }, { status: 401 })
  }
  // POST ga yo'naltirish (xuddi shu logika)
  return POST(request)
}
