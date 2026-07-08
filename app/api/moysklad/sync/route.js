export const dynamic = 'force-dynamic'
export const maxDuration = 300

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { prisma } from '@/lib/prisma'
import { tarjimaQil } from '@/lib/translate'
import {
  msKategoriyalarOl,
  msMahsulotlarOl,
  msYangilanganMahsulotlarOl,
  msMahsulotIdlarOl,
  msMahsulotRasmlariOl,
  msMahsulotVariantlarOl,
  msRasmniYuklash,
  msStokOl,
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
  // To'liq syncda rasmlar yuklanmaydi (timeout oldini olish uchun)
  const rasmYuklama = tolik ? false : true
  return syncQil({ tolik, rasmYuklama })
}

export async function POST(request) {
  const secret = request.headers.get('x-cron-secret')
    || new URL(request.url).searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ xato: 'Ruxsat yo\'q' }, { status: 401 })
  }
  const tolik = new URL(request.url).searchParams.get('toliq') === 'true'
  const rasmYuklama = tolik ? false : true
  return syncQil({ tolik, rasmYuklama })
}

async function syncQil({ tolik = false, rasmYuklama = true } = {}) {
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
    prisma.mahsulot.findMany({ select: { id: true, moyskladId: true, slug: true, moyskladUpdated: true, asosiyRasmUrl: true } }),
  ])

  const katMsMap = new Map(dbKategoriyalar.filter(k => k.moyskladId).map(k => [k.moyskladId, k]))
  const prodMsMap = new Map(dbMahsulotlar.filter(p => p.moyskladId).map(p => [p.moyskladId, p]))
  const usedSlugs = new Set(dbMahsulotlar.map(p => p.slug))

  // ─── 1. Kategoriyalar ────────────────────────────────────────────────────────
  const msKategoriyalar = await msKategoriyalarOl()
  const msKatIdMap = new Map()

  for (const msKat of msKategoriyalar) {
    const msId = msKat.id || msIdOl(msKat.meta.href)
    const nomRu = msKat.name // MoySklad'dagi nom har doim ruscha
    const parentMsId = msKat.productFolder ? (msKat.productFolder.id || msIdOl(msKat.productFolder.meta.href)) : null
    const parentId = parentMsId ? (msKatIdMap.get(parentMsId) ?? katMsMap.get(parentMsId)?.id ?? null) : null

    const mavjud = katMsMap.get(msId)
    if (mavjud) {
      // Mavjud kategoriya endi admin tomonidan boshqariladi — faqat struktura (parentId) yangilanadi,
      // nom/nomRu/nomEn/rangKodi admin panelda kiritilgandek saqlanib qoladi.
      if (parentId) {
        await prisma.kategoriya.update({ where: { id: mavjud.id }, data: { parentId } })
      }
      msKatIdMap.set(msId, mavjud.id)
      natija.kategoriyalar.yangilandi++
    } else {
      const [nomUz, nomEn] = await Promise.all([
        tarjimaQil(nomRu, 'uz'),
        tarjimaQil(nomRu, 'en'),
      ])
      const slugBase = slugYarat(nomRu)
      const dbKatSluglar = new Set((await prisma.kategoriya.findMany({ select: { slug: true } })).map(k => k.slug))
      let slug = slugBase, n = 0
      while (dbKatSluglar.has(slug)) { n++; slug = `${slugBase}-${n}` }
      const yangi = await prisma.kategoriya.create({ data: { nom: nomUz, nomRu, nomEn, slug, moyskladId: msId, parentId } })
      msKatIdMap.set(msId, yangi.id)
      katMsMap.set(msId, { id: yangi.id, moyskladId: msId, nomRu })
      natija.kategoriyalar.qoshildi++
    }
  }

  // ─── 2. Mahsulotlar ──────────────────────────────────────────────────────────
  // Incremental: faqat yangilangan mahsulotlarni olish
  const [msMahsulotlar, { productMap, variantMap }] = await Promise.all([
    isIncremental ? msYangilanganMahsulotlarOl(lastSyncAt) : msMahsulotlarOl(),
    msStokOl(),
  ])

  const yangilar = []
  const yangilash = []

  for (const msProd of msMahsulotlar) {
    const msId = msProd.id || msIdOl(msProd.meta.href)
    const nomRu = msProd.name // MoySklad'dagi nom har doim ruscha
    const variantsCount = msProd.variantsCount || 0
    // Faqat reportda ANIQ <= 0 bo'lsa yashir.
    // Reportda yo'q (hech qachon stock kelmagan) → ko'rsat.
    let mavjudligi
    if (msProd.archived) {
      mavjudligi = false
    } else if (variantsCount > 0) {
      mavjudligi = true // variantlarniYangilash da aniqlanadi
    } else if (productMap.has(msId)) {
      mavjudligi = productMap.get(msId) > 0
    } else {
      mavjudligi = true // Reportda yo'q = stock hisobi yo'q, lekin mahsulot mavjud
    }
    const msUpdated = new Date(msProd.updated)
    const mavjud = prodMsMap.get(msId)

    if (mavjud) {
      // Mavjud mahsulot endi admin tomonidan boshqariladi (nom, kategoriya, tavsif, narx —
      // hech biriga tegilmaydi). Sync faqat haqiqiy zaxira holatini yangilab turadi.
      const rasmYangilash = !mavjud.moyskladUpdated || msUpdated > mavjud.moyskladUpdated || !mavjud.asosiyRasmUrl
      yangilash.push({ id: mavjud.id, moyskladId: msId, mavjudligi, moyskladUpdated: msUpdated, rasmYangilash, variantsCount })
    } else {
      // Yangi mahsulot — MoySklad'da topilgan, DB'da hali yo'q. Draft sifatida yaratiladi:
      // admin uni admin panelda topib, tavsif/rang/belgi qo'shib "nashr" qiladi.
      const kategoriyaMsId = msProd.productFolder ? (msProd.productFolder.id || msIdOl(msProd.productFolder.meta.href)) : null
      const kategoriyaId = kategoriyaMsId ? (msKatIdMap.get(kategoriyaMsId) ?? katMsMap.get(kategoriyaMsId)?.id ?? null) : null
      const [nomUz, nomEn] = await Promise.all([
        tarjimaQil(nomRu, 'uz'),
        tarjimaQil(nomRu, 'en'),
      ])
      const slug = noyobSlug(slugYarat(nomRu), usedSlugs)
      yangilar.push({
        nom: nomUz, nomRu, nomEn, mavjudligi, kategoriyaId,
        modelRaqami: msProd.article || msProd.code || null,
        moyskladId: msId, moyskladUpdated: msUpdated,
        slug, turi: 'katalog', variantsCount,
      })
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
    if (rasmYuklama) await rasmlarniYangilash(supabase, created.moyskladId, created.id, natija)
    if (variantsCount > 0) await variantlarniYangilash(created.moyskladId, created.id, variantMap, natija)
  }

  // Yangilanganlarni update — faqat mavjudligi/moyskladUpdated (admin ma'lumotlariga tegilmaydi)
  for (const m of yangilash) {
    const { id, moyskladId, rasmYangilash, variantsCount, ...data } = m
    await prisma.mahsulot.update({ where: { id }, data })
    natija.mahsulotlar.yangilandi++
    if (rasmYuklama && rasmYangilash) await rasmlarniYangilash(supabase, moyskladId, id, natija)
    if ((rasmYangilash || tolik) && variantsCount > 0) await variantlarniYangilash(moyskladId, id, variantMap, natija)
  }

  // ─── 3. Arxivlangan/aniq stoksizlarni yashirish ─────────────────────────────
  if (!isIncremental || tolik) {
    // To'liq sync: faqat arxivlangan YOKI reportda aniq 0 bo'lganlarni yashir
    const msMahsulotIdlar = new Set(msMahsulotlar.map(p => p.id || msIdOl(p.meta.href)))
    for (const [msId, dbProd] of prodMsMap) {
      const arxivlangan = !msMahsulotIdlar.has(msId)
      const stokAniq = productMap.has(msId) && productMap.get(msId) <= 0
      if (arxivlangan || stokAniq) {
        await prisma.mahsulot.update({ where: { id: dbProd.id }, data: { mavjudligi: false } })
        natija.mahsulotlar.yashirildi++
      }
    }
  } else {
    // Incremental: arxivlangan YOKI aniq 0 bo'lganlarni yashir
    try {
      const msIdlar = await msMahsulotIdlarOl()
      const msMahsulotIdSet = new Set(msIdlar.filter(p => !p.archived).map(p => p.id))
      for (const [msId, dbProd] of prodMsMap) {
        const arxivlangan = !msMahsulotIdSet.has(msId)
        const stokAniq = productMap.has(msId) && productMap.get(msId) <= 0
        if (arxivlangan || stokAniq) {
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

async function variantlarniYangilash(msMahsulotId, dbMahsulotId, variantMap, natija) {
  try {
    const variantlar = await msMahsulotVariantlarOl(msMahsulotId, variantMap)
    // Ota mahsulot mavjudligi: kamida bitta varianti stokda bo'lsa true
    const parentMavjudligi = variantlar.some(v => v.mavjudligi)
    await prisma.mahsulot.update({
      where: { id: dbMahsulotId },
      data: { variantlar, mavjudligi: parentMavjudligi },
    })
    natija.variantlar.yuklandi += variantlar.length
  } catch (e) {
    console.error(`Variantlar xato (${msMahsulotId}):`, e.message)
  }
}
