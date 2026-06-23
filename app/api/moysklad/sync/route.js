export const dynamic = 'force-dynamic'
export const maxDuration = 300

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { prisma } from '@/lib/prisma'
import {
  msKategoriyalarOl,
  msMahsulotlarOl,
  msYangilanganMahsulotlarOl,
  msMahsulotIdlarOl,
  msMahsulotRasmlariOl,
  msMahsulotVariantlarOl,
  msRasmniYuklash,
  msIdOl,
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
    .slice(0, 100) || 'mahsulot'
}

function noyobSlug(base, usedSlugs) {
  let n = 0
  while (usedSlugs.has(n === 0 ? base : `${base}-${n}`)) n++
  const result = n === 0 ? base : `${base}-${n}`
  usedSlugs.add(result)
  return result
}

export async function GET(request) {
  const secret = new URL(request.url).searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ xato: 'Ruxsat yo\'q' }, { status: 401 })
  }
  // to'liq yoki incremental?
  const tolik = new URL(request.url).searchParams.get('toliq') === 'true'
  return syncQil({ tolik })
}

export async function POST(request) {
  const secret = request.headers.get('x-cron-secret')
    || new URL(request.url).searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ xato: 'Ruxsat yo\'q' }, { status: 401 })
  }
  const tolik = new URL(request.url).searchParams.get('toliq') === 'true'
  return syncQil({ tolik })
}

async function syncQil({ tolik = false } = {}) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  )

  const natija = {
    tur: tolik ? 'toliq' : 'incremental',
    kategoriyalar: { qoshildi: 0, yangilandi: 0 },
    mahsulotlar: { qoshildi: 0, yangilandi: 0, yashirildi: 0 },
    rasmlar: { yuklandi: 0, xato: 0 },
    variantlar: { yuklandi: 0 },
    boshlanganVaqt: new Date().toISOString(),
  }

  // ─── Oxirgi sync vaqtini olish ───────────────────────────────────────────────
  const lastSyncRow = await prisma.saytSozlamalari.findUnique({
    where: { kalit: 'moysklad_last_sync' },
  })
  const lastSyncAt = lastSyncRow?.qiymat || null
  const isIncremental = !tolik && !!lastSyncAt

  // ─── DB hashmaplanri ─────────────────────────────────────────────────────────
  const [dbKategoriyalar, dbMahsulotlar] = await Promise.all([
    prisma.kategoriya.findMany({ select: { id: true, moyskladId: true, slug: true } }),
    prisma.mahsulot.findMany({ select: { id: true, moyskladId: true, slug: true, moyskladUpdated: true } }),
  ])

  const katMsMap = new Map(dbKategoriyalar.filter(k => k.moyskladId).map(k => [k.moyskladId, k]))
  const prodMsMap = new Map(dbMahsulotlar.filter(p => p.moyskladId).map(p => [p.moyskladId, p]))
  const usedSlugs = new Set(dbMahsulotlar.map(p => p.slug))

  // ─── 1. Kategoriyalar ────────────────────────────────────────────────────────
  const msKategoriyalar = await msKategoriyalarOl()
  const msKatIdMap = new Map()

  for (const msKat of msKategoriyalar) {
    const msId = msIdOl(msKat.meta.href)
    const nom = msKat.name
    const parentMsId = msKat.productFolder ? msIdOl(msKat.productFolder.meta.href) : null
    const parentId = parentMsId ? (msKatIdMap.get(parentMsId) ?? katMsMap.get(parentMsId)?.id ?? null) : null

    const mavjud = katMsMap.get(msId)
    if (mavjud) {
      await prisma.kategoriya.update({ where: { id: mavjud.id }, data: { nom, ...(parentId ? { parentId } : {}) } })
      msKatIdMap.set(msId, mavjud.id)
      natija.kategoriyalar.yangilandi++
    } else {
      const slugBase = slugYarat(nom)
      const dbKatSluglar = new Set((await prisma.kategoriya.findMany({ select: { slug: true } })).map(k => k.slug))
      let slug = slugBase, n = 0
      while (dbKatSluglar.has(slug)) { n++; slug = `${slugBase}-${n}` }
      const yangi = await prisma.kategoriya.create({ data: { nom, slug, moyskladId: msId, parentId } })
      msKatIdMap.set(msId, yangi.id)
      katMsMap.set(msId, { id: yangi.id, moyskladId: msId })
      natija.kategoriyalar.qoshildi++
    }
  }

  // ─── 2. Mahsulotlar ──────────────────────────────────────────────────────────
  // Incremental: faqat yangilangan mahsulotlarni olish
  const msMahsulotlar = isIncremental
    ? await msYangilanganMahsulotlarOl(lastSyncAt)
    : await msMahsulotlarOl()

  const yangilar = []
  const yangilash = []

  for (const msProd of msMahsulotlar) {
    const msId = msIdOl(msProd.meta.href)
    const nom = msProd.name
    const mavjudligi = !msProd.archived
    const kategoriyaMsId = msProd.productFolder ? msIdOl(msProd.productFolder.meta.href) : null
    const kategoriyaId = kategoriyaMsId ? (msKatIdMap.get(kategoriyaMsId) ?? katMsMap.get(kategoriyaMsId)?.id ?? null) : null
    const msUpdated = new Date(msProd.updated)
    const variantsCount = msProd.variantsCount || 0

    const dataBase = {
      nom,
      mavjudligi,
      narx: null, // Narx ko'rsatilmaydi
      qisqaTavsif: null, // Tavsif ko'rsatilmaydi
      toliqTavsif: null,
      kategoriyaId,
      modelRaqami: msProd.article || msProd.code || null,
      moyskladId: msId,
      moyskladUpdated: msUpdated,
    }

    const mavjud = prodMsMap.get(msId)
    if (mavjud) {
      const rasmYangilash = !mavjud.moyskladUpdated || msUpdated > mavjud.moyskladUpdated
      yangilash.push({ id: mavjud.id, ...dataBase, rasmYangilash, variantsCount })
    } else {
      const slug = noyobSlug(slugYarat(nom), usedSlugs)
      yangilar.push({ ...dataBase, slug, turi: 'katalog', variantsCount })
    }
  }

  // Yangi mahsulotlarni create
  for (const m of yangilar) {
    const { variantsCount, ...data } = m
    let created
    try {
      created = await prisma.mahsulot.create({ data, select: { id: true, moyskladId: true } })
    } catch (e) {
      if (e.code === 'P2002') {
        const newSlug = `${data.slug}-${Date.now().toString(36)}`
        created = await prisma.mahsulot.create({ data: { ...data, slug: newSlug }, select: { id: true, moyskladId: true } })
      } else throw e
    }
    prodMsMap.set(created.moyskladId, { id: created.id, moyskladId: created.moyskladId })
    natija.mahsulotlar.qoshildi++
    await rasmlarniYangilash(supabase, created.moyskladId, created.id, natija)
    if (variantsCount > 0) await variantlarniYangilash(created.moyskladId, created.id, natija)
  }

  // Yangilanganlarni update
  for (const m of yangilash) {
    const { id, rasmYangilash, variantsCount, ...data } = m
    await prisma.mahsulot.update({ where: { id }, data })
    natija.mahsulotlar.yangilandi++
    if (rasmYangilash) await rasmlarniYangilash(supabase, data.moyskladId, id, natija)
    if ((rasmYangilash || tolik) && variantsCount > 0) await variantlarniYangilash(data.moyskladId, id, natija)
  }

  // ─── 3. O'chirilgan/arxivlanganlarni yashirish ───────────────────────────────
  // To'liq sync bo'lsa yoki birinchi sync bo'lsa — barcha IDlarni tekshirish
  if (!isIncremental || tolik) {
    const msMahsulotIdlar = new Set(msMahsulotlar.map(p => msIdOl(p.meta.href)))
    for (const [msId, dbProd] of prodMsMap) {
      if (!msMahsulotIdlar.has(msId)) {
        await prisma.mahsulot.update({ where: { id: dbProd.id }, data: { mavjudligi: false } })
        natija.mahsulotlar.yashirildi++
      }
    }
  } else {
    // Incremental: faqat lightweight ID ro'yxatini olish va arxivlanganlarni yashirish
    try {
      const msIdlar = await msMahsulotIdlarOl()
      const msMahsulotIdSet = new Set(msIdlar.filter(p => !p.archived).map(p => p.id))
      for (const [msId, dbProd] of prodMsMap) {
        if (!msMahsulotIdSet.has(msId)) {
          await prisma.mahsulot.update({ where: { id: dbProd.id }, data: { mavjudligi: false } })
          natija.mahsulotlar.yashirildi++
        }
      }
    } catch (e) {
      console.error('ID tekshirish xato:', e.message)
    }
  }

  // ─── 4. Oxirgi sync vaqtini saqlash ─────────────────────────────────────────
  await prisma.$executeRaw`
    INSERT INTO sayt_sozlamalari (kalit, qiymat)
    VALUES ('moysklad_last_sync', ${new Date().toISOString()})
    ON CONFLICT (kalit) DO UPDATE SET qiymat = EXCLUDED.qiymat
  `

  natija.tugaganVaqt = new Date().toISOString()
  console.log('MoySklad sync:', JSON.stringify(natija))
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
        const url = await msRasmniYuklash(downloadHref, supabase, `${msMahsulotId}-${tartib}`)
        await prisma.mahsulotRasm.create({ data: { mahsulotId: dbMahsulotId, rasmUrl: url, tartib } })
        if (tartib === 0) {
          await prisma.mahsulot.update({ where: { id: dbMahsulotId }, data: { asosiyRasmUrl: url } })
        }
        natija.rasmlar.yuklandi++
        tartib++
      } catch (e) {
        console.error(`Rasm xato (${msMahsulotId}):`, e.message)
        natija.rasmlar.xato++
      }
    }
  } catch (e) {
    console.error(`Rasmlar xato (${msMahsulotId}):`, e.message)
  }
}

async function variantlarniYangilash(msMahsulotId, dbMahsulotId, natija) {
  try {
    const variantlar = await msMahsulotVariantlarOl(msMahsulotId)
    await prisma.mahsulot.update({
      where: { id: dbMahsulotId },
      data: { variantlar: variantlar },
    })
    natija.variantlar.yuklandi += variantlar.length
  } catch (e) {
    console.error(`Variantlar xato (${msMahsulotId}):`, e.message)
  }
}
