// Bir martalik skript: MoySklad sync orqali kelgan, hali tarjima qilinmagan
// (nomRu bo'sh) kategoriya va mahsulotlarni Google Translate orqali uz/en'ga tarjima qiladi.
//
// Ishga tushirish: node scripts/tarjima-backfill.mjs

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { tarjimaQil } from '../lib/translate.js'

const prisma = new PrismaClient()

const PARALLEL = 4

async function partiyalarda(royxat, ishchi) {
  let i = 0
  let bajarildi = 0
  while (i < royxat.length) {
    const partiya = royxat.slice(i, i + PARALLEL)
    await Promise.all(partiya.map(ishchi))
    i += PARALLEL
    bajarildi += partiya.length
    console.log(`  ${bajarildi}/${royxat.length}`)
  }
}

async function kategoriyalarniTarjima() {
  const kategoriyalar = await prisma.kategoriya.findMany({
    where: { nomRu: null },
    select: { id: true, nom: true },
  })
  console.log(`Kategoriyalar: ${kategoriyalar.length} ta tarjima qilinadi`)

  await partiyalarda(kategoriyalar, async (k) => {
    const nomRu = k.nom
    const [nomUz, nomEn] = await Promise.all([
      tarjimaQil(nomRu, 'uz'),
      tarjimaQil(nomRu, 'en'),
    ])
    await prisma.kategoriya.update({
      where: { id: k.id },
      data: { nom: nomUz, nomRu, nomEn },
    })
  })
}

async function mahsulotlarniTarjima() {
  const mahsulotlar = await prisma.mahsulot.findMany({
    where: { nomRu: null },
    select: { id: true, nom: true },
  })
  console.log(`Mahsulotlar: ${mahsulotlar.length} ta tarjima qilinadi`)

  await partiyalarda(mahsulotlar, async (m) => {
    const nomRu = m.nom
    const [nomUz, nomEn] = await Promise.all([
      tarjimaQil(nomRu, 'uz'),
      tarjimaQil(nomRu, 'en'),
    ])
    await prisma.mahsulot.update({
      where: { id: m.id },
      data: { nom: nomUz, nomRu, nomEn },
    })
  })
}

async function main() {
  await kategoriyalarniTarjima()
  await mahsulotlarniTarjima()
  console.log('Tayyor.')
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1 })
  .finally(() => prisma.$disconnect())
