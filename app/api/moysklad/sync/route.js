export const dynamic = 'force-dynamic'
export const maxDuration = 300

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
    .slice(0, 100) || 'mahsulot'
}

function msIdOl(href) {
  return href?.split('/').pop()
}

function noyobSlug(base, usedSlugs) {
  let slug = base || 'mahsulot'
  let n = 0
  while (usedSlugs.has(n === 0 ? slug : `${slug}-${n}`)) n++
  const result = n === 0 ? slug : `${slug}-${n}`
  usedSlugs.add(result)
  return result
}

export async function GET(request) {
  const secret = new URL(request.url).searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ xato: 'Ruxsat yo\'q' }, { status: 401 })
  }
  return syncQil()
}

export async function POST(request) {
  const secret = request.headers.get('x-cron-secret')
    || new URL(request.url).searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ xato: 'Ruxsat yo\'q' }, { status: 401 })
  }
  return syncQil()
}

async function syncQil() {
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

  // ─── 1. DB dagi barcha ma'lumotlarni bir marta olish ────────────────────────
  const [dbKategoriyalar, dbMahsulotlar, dbSluglar] = await Promise.all([
    prisma.kategoriya.findMany({ select: { id: true, moyskladId: true, slug: true } }),
    prisma.mahsulot.findMany({ select: { id: true, moyskladId: true, slug: true, moyskladUpdated: true } }),
    prisma.mahsulot.findMany({ select: { slug: true } }),
  ])

  // Hashmap: moyskladId → {id, slug, moyskladUpdated}
  const katMsMap = new Map(dbKategoriyalar.filter(k => k.moyskladId).map(k => [k.moyskladId, k]))
  const prodMsMap = new Map(dbMahsulotlar.filter(p => p.moyskladId).map(p => [p.moyskladId, p]))
  const usedSlugs = new Set(dbSluglar.map(p => p.slug))

  // ─── 2. Kategoriyalar ────────────────────────────────────────────────────────
  const msKategoriyalar = await msKategoriyalarOl()
  const msKatIdMap = new Map() // msId → DB id

  for (const msKat of msKategoriyalar) {
    const msId = msIdOl(msKat.meta.href)
    const nom = msKat.name
    const parentMsId = msKat.productFolder ? msIdOl(msKat.productFolder.meta.href) : null
    const parentId = parentMsId ? (msKatIdMap.get(parentMsId) ?? katMsMap.get(parentMsId)?.id ?? null) : null

    const mavjud = katMsMap.get(msId)
    if (mavjud) {
      await prisma.kategoriya.update({
        where: { id: mavjud.id },
        data: { nom, ...(parentId ? { parentId } : {}) },
      })
      msKatIdMap.set(msId, mavjud.id)
      natija.kategoriyalar.yangilandi++
    } else {
      const slugBase = slugYarat(nom)
      let slug = slugBase, n = 0
      const katSluglar = new Set((await prisma.kategoriya.findMany({ select: { slug: true } })).map(k => k.slug))
      while (katSluglar.has(slug)) { n++; slug = `${slugBase}-${n}` }

      const yangi = await prisma.kategoriya.create({
        data: { nom, slug, moyskladId: msId, parentId },
      })
      msKatIdMap.set(msId, yangi.id)
      katMsMap.set(msId, { id: yangi.id, moyskladId: msId, slug })
      natija.kategoriyalar.qoshildi++
    }
  }

  // ─── 3. Mahsulotlar ──────────────────────────────────────────────────────────
  const msMahsulotlar = await msMahsulotlarOl()
  const msMahsulotIdlar = new Set(msMahsulotlar.map(p => msIdOl(p.meta.href)))

  // Batch upsert: yangi va yangilangan mahsulotlarni ajratish
  const yangilar = []
  const yangilash = []

  for (const msProd of msMahsulotlar) {
    const msId = msIdOl(msProd.meta.href)
    const nom = msProd.name
    const mavjudligi = !msProd.archived
    const narx = msProd.salePrices?.[0]?.value ? msProd.salePrices[0].value / 100 : null
    const tavsif = msProd.description || null
    const kod = msProd.article || msProd.code || null
    const kategoriyaMsId = msProd.productFolder ? msIdOl(msProd.productFolder.meta.href) : null
    const kategoriyaId = kategoriyaMsId ? (msKatIdMap.get(kategoriyaMsId) ?? katMsMap.get(kategoriyaMsId)?.id ?? null) : null
    const msUpdated = new Date(msProd.updated)

    const mavjud = prodMsMap.get(msId)
    const dataBase = { nom, mavjudligi, narx, qisqaTavsif: tavsif, kategoriyaId, modelRaqami: kod, moyskladId: msId, moyskladUpdated: msUpdated }

    if (mavjud) {
      yangilash.push({ id: mavjud.id, ...dataBase, rasimYangilash: !mavjud.moyskladUpdated || msUpdated > mavjud.moyskladUpdated })
    } else {
      const slug = noyobSlug(slugYarat(nom), usedSlugs)
      yangilar.push({ ...dataBase, slug, turi: 'katalog' })
    }
  }

  // Yangilarni batch create
  if (yangilar.length) {
    for (const m of yangilar) {
      const { rasimYangilash, ...data } = m
      const created = await prisma.mahsulot.create({ data, select: { id: true, moyskladId: true } })
      prodMsMap.set(created.moyskladId, { id: created.id, moyskladId: created.moyskladId })
      natija.mahsulotlar.qoshildi++
      await rasmlarniYangilash(supabase, created.moyskladId, created.id, natija)
    }
  }

  // Yangilanishlarni batch update
  for (const m of yangilash) {
    const { id, rasimYangilash, ...data } = m
    await prisma.mahsulot.update({ where: { id }, data })
    natija.mahsulotlar.yangilandi++
    if (rasimYangilash) {
      await rasmlarniYangilash(supabase, data.moyskladId, id, natija)
    }
  }

  // ─── 4. MoySkladda yo'q mahsulotlarni yashirish ──────────────────────────────
  for (const [msId, dbProd] of prodMsMap) {
    if (!msMahsulotIdlar.has(msId)) {
      await prisma.mahsulot.update({ where: { id: dbProd.id }, data: { mavjudligi: false } })
      natija.mahsulotlar.yashirildi++
    }
  }

  // ─── 5. Oxirgi sync vaqtini saqlash ─────────────────────────────────────────
  await prisma.saytSozlamalari.upsert({
    where: { kalit: 'moysklad_last_sync' },
    update: { qiymat: new Date().toISOString() },
    create: { kalit: 'moysklad_last_sync', qiymat: new Date().toISOString() },
  })

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
        const fileName = `${msMahsulotId}-${tartib}`
        const url = await msRasmniYuklash(downloadHref, supabase, fileName)
        await prisma.mahsulotRasm.create({
          data: { mahsulotId: dbMahsulotId, rasmUrl: url, tartib },
        })
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
