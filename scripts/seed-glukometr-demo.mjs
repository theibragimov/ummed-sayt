// Bir martalik skript: foydalanuvchi yuborgan namuna rasm asosida "Glyukometrlar va
// test-polosalar" kategoriyasi va 4 ta namunaviy mahsulot qo'lda (admin sifatida) qo'shiladi.
// Ishga tushirish: node scripts/seed-glukometr-demo.mjs

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { tarjimaQil } from '../lib/translate.js'

const prisma = new PrismaClient()

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

const KATEGORIYA = {
  nomRu: 'Глюкометры и тест-полоски',
  rangKodi: '#38BDF8',
}

const MAHSULOTLAR = [
  {
    nomRu: 'Глюкометр Сателлит Экспресс',
    qisqaTavsifRu: 'Надёжный и точный глюкометр для ежедневного контроля уровня глюкозы в крови. Результат за 7 секунд, используя всего 1 мкл крови. Память на 60 измерений. Производитель — ЭЛТА, Россия.',
    featured: true,
  },
  {
    nomRu: 'Глюкометр Сателлит Online',
    qisqaTavsifRu: 'Глюкометр нового поколения: результат за 4 секунды, минимальный объём крови — 0,4 мкл, память на 800 результатов, синхронизация с мобильным приложением через Bluetooth. Производитель — ЭЛТА, Россия.',
    belgi: 'yangi',
  },
  {
    nomRu: 'Тест-полоски Сателлит Экспресс',
    qisqaTavsifRu: 'Оригинальные тест-полоски для глюкометра Сателлит Экспресс. В упаковке 50 тест-полосок и контрольная полоска. Производство — ЭЛТА, Россия.',
  },
  {
    nomRu: 'Тест-полоски Сателлит Плюс',
    qisqaTavsifRu: 'Тест-полоски для глюкометра Сателлит Плюс, для ежедневного контроля уровня сахара в крови. В комплекте 50 тест-полосок и контрольная полоска. Производство — ЭЛТА, Россия.',
  },
]

async function main() {
  const slug = slugYarat(KATEGORIYA.nomRu)
  const [katNomUz, katNomEn] = await Promise.all([
    tarjimaQil(KATEGORIYA.nomRu, 'uz'),
    tarjimaQil(KATEGORIYA.nomRu, 'en'),
  ])
  const kategoriya = await prisma.kategoriya.upsert({
    where: { slug },
    update: { rangKodi: KATEGORIYA.rangKodi },
    create: { nom: katNomUz, nomRu: KATEGORIYA.nomRu, nomEn: katNomEn, slug, rangKodi: KATEGORIYA.rangKodi },
  })
  console.log('Kategoriya:', kategoriya.nom, kategoriya.id)

  const usedSlugs = new Set((await prisma.mahsulot.findMany({ select: { slug: true } })).map(m => m.slug))

  for (const m of MAHSULOTLAR) {
    const [nomUz, nomEn, tavsifUz] = await Promise.all([
      tarjimaQil(m.nomRu, 'uz'),
      tarjimaQil(m.nomRu, 'en'),
      tarjimaQil(m.qisqaTavsifRu, 'uz'),
    ])
    let slugBase = slugYarat(m.nomRu), slug = slugBase, n = 0
    while (usedSlugs.has(slug)) { n++; slug = `${slugBase}-${n}` }
    usedSlugs.add(slug)

    const yaratilgan = await prisma.mahsulot.create({
      data: {
        nom: nomUz,
        nomRu: m.nomRu,
        nomEn,
        slug,
        kategoriyaId: kategoriya.id,
        qisqaTavsif: tavsifUz,
        qisqaTavsifRu: m.qisqaTavsifRu,
        mavjudligi: true,
        featured: Boolean(m.featured),
        belgi: m.belgi || null,
        turi: 'katalog',
      },
    })
    console.log('  +', yaratilgan.nom, `(#${yaratilgan.id})`)
  }

  console.log('Tayyor. Rasm hali yuklanmagan — admin panel orqali qo\'shing.')
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1 })
  .finally(() => prisma.$disconnect())
