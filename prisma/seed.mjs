import { config } from 'dotenv'
config({ path: '.env.local' })

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

function slug(text) {
  return text.toLowerCase()
    .replace(/'/g, '').replace(/'/g, '')
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

async function main() {
  console.log('🌱 Seed boshlandi...')

  // 1. Kategoriyalar
  const kategoriyalar = [
    { nom: 'Diagnostika',     slug: 'diagnostika',     tartibRaqami: 1 },
    { nom: 'Nafas jihozlari', slug: 'nafas-jihozlari', tartibRaqami: 2 },
    { nom: 'Yurak jihozlari', slug: 'yurak-jihozlari', tartibRaqami: 3 },
    { nom: 'Tibbiy mebel',    slug: 'tibbiy-mebel',    tartibRaqami: 4 },
    { nom: 'Sterilizatsiya',  slug: 'sterilizatsiya',  tartibRaqami: 5 },
  ]

  const katMap = {}
  for (const k of kategoriyalar) {
    const created = await prisma.kategoriya.upsert({
      where: { slug: k.slug },
      update: {},
      create: k,
    })
    katMap[k.slug] = created.id
    console.log(`  ✓ Kategoriya: ${k.nom}`)
  }

  // Slug map — eski category key -> yangi slug
  const catSlugMap = {
    diagnostika:   'diagnostika',
    nafas:         'nafas-jihozlari',
    yurak:         'yurak-jihozlari',
    mebel:         'tibbiy-mebel',
    sterilizatsiya: 'sterilizatsiya',
  }

  // 2. Mahsulotlar
  const mahsulotlar = [
    { id: 1, name: 'Tonometr avtomatik',        category: 'diagnostika',    price: 320000, img: '🩺',  badge: 'Ommabop',      desc: "Raqamli qon bosimi o'lchagich, bilak tipi",    inStock: true,  featured: true  },
    { id: 2, name: "Glukometr to'plami",        category: 'diagnostika',    price: 180000, img: '💉',  badge: null,           desc: "Qand darajasini o'lchash, 50 ta test chizig'i bilan", inStock: true },
    { id: 3, name: 'Infraqizil termometr',      category: 'diagnostika',    price: 95000,  img: '🌡️', badge: 'Yangi',         desc: "Kontaktsiz, 1 soniyada o'lchaydi",             inStock: true,  featured: true  },
    { id: 4, name: 'Kompressor nebulayzer',     category: 'nafas',          price: 450000, img: '💨',  badge: null,           desc: 'Nafas kasalliklari uchun, bolalar va kattalar', inStock: true   },
    { id: 5, name: 'Ultratovush nebulayzer',    category: 'nafas',          price: 620000, img: '🌬️', badge: 'Sertifikat',    desc: "Jimjit ishlaydi, kichik o'lchamli",            inStock: false  },
    { id: 6, name: 'Pulse oksimetr',            category: 'diagnostika',    price: 120000, img: '❤️',  badge: null,           desc: "SpO2 va puls tezligini o'lchaydi",             inStock: true   },
    { id: 7, name: 'ECG apparat 12-kanal',      category: 'yurak',          price: 2800000,img: '📈',  badge: 'Professional', desc: "Ko'chma elektrokardiograf, printer bilan",     inStock: true   },
    { id: 8, name: 'Holter monitor',            category: 'yurak',          price: 4500000,img: '🫀',  badge: null,           desc: '24 soatlik EKG monitoring tizimi',             inStock: true   },
    { id: 9, name: 'Tibbiy krovat',             category: 'mebel',          price: 1200000,img: '🛏️', badge: null,           desc: 'Statsionar, balandligi sozlanadi',             inStock: true   },
    { id: 10, name: 'Dropper stendi',           category: 'mebel',          price: 85000,  img: '🪝',  badge: null,           desc: "Ko'chma, to'rtta tutqich bilan",              inStock: true   },
    { id: 11, name: 'Avtoklavlar 23L',          category: 'sterilizatsiya', price: 3200000,img: '🧪',  badge: 'Sertifikat',   desc: "Yuqori bosimli bug' sterilizatori",            inStock: true   },
    { id: 12, name: 'UV sterilizator',          category: 'sterilizatsiya', price: 180000, img: '💡',  badge: null,           desc: "Qurilmalar uchun ultrabinafsha sterilizator",  inStock: true   },
  ]

  for (const m of mahsulotlar) {
    const katSlug = catSlugMap[m.category] || m.category
    const kategoriyaId = katMap[katSlug]
    const mahsulotSlug = slug(m.name)

    await prisma.mahsulot.upsert({
      where: { slug: mahsulotSlug },
      update: {},
      create: {
        nom: m.name,
        slug: mahsulotSlug,
        kategoriyaId,
        narx: m.price,
        narxBirligi: "so'm",
        mavjudligi: m.inStock ?? true,
        featured: m.featured ?? false,
        qisqaTavsif: m.desc,
        asosiyRasmUrl: null,
        brend: null,
        modelRaqami: null,
      },
    })
    console.log(`  ✓ Mahsulot: ${m.name}`)
  }

  // 3. Post kategoriyalar
  const postKats = [
    { nom: 'Yangilik',   slug: 'yangilik',   rang: '#E8491D' },
    { nom: 'Tahlil',     slug: 'tahlil',     rang: '#6366f1' },
    { nom: 'Hamkorlik',  slug: 'hamkorlik',  rang: '#3DB851' },
    { nom: 'Sifat',      slug: 'sifat',      rang: '#f59e0b' },
    { nom: 'Tadbir',     slug: 'tadbir',     rang: '#0ea5e9' },
  ]

  const postKatMap = {}
  for (const k of postKats) {
    const c = await prisma.postKategoriya.upsert({ where: { slug: k.slug }, update: {}, create: k })
    postKatMap[k.slug] = c.id
    console.log(`  ✓ Post kategoriya: ${k.nom}`)
  }

  // 4. Yangiliklar
  const postlar = [
    { sarlavha: 'Ummed kompaniyasi yangi tibbiy jihozlar lineyasini taqdim etdi', kat: 'yangilik', sana: '2025-05-15', qisqa: "2025 yilda kompaniyamiz xalqaro sifat standartlariga javob beradigan yangi diagnostika uskunalari bilan assortimentini kengaytirdi.", muallif: 'Ummed jamoasi', holat: 'published' },
    { sarlavha: "O'zbekistonda tibbiy jihozlar bozori: 2025 yil tendensiyalari", kat: 'tahlil', sana: '2025-05-02', qisqa: "Mutaxassislar fikricha, tibbiy uskunalar sohasida raqamlashtirish va zamonaviy texnologiyalar joriy etilishi davom etmoqda.", muallif: 'Tahlil bo\'limi', holat: 'published' },
    { sarlavha: '550 dan ortiq dorixona bilan hamkorlik: muvaffaqiyat sirlari', kat: 'hamkorlik', sana: '2025-04-18', qisqa: "Ummed jamoasi butun O'zbekiston bo'ylab o'rnatgan ishonchli hamkorlik tarmog'i haqida batafsil ma'lumot.", muallif: 'Marketing bo\'limi', holat: 'published' },
    { sarlavha: 'ISO sertifikatlash jarayoni: sifat nazoratimiz qanday ishlaydi', kat: 'sifat', sana: '2025-04-05', qisqa: "Kompaniyamiz mahsulotlari qat'iy xalqaro standartlar asosida tekshiriladi. Ushbu maqolada jarayon batafsil yoritilgan.", muallif: 'Sifat nazorat', holat: 'published' },
    { sarlavha: "Toshkent tibbiyot ko'rgazmasida Ummed stendi", kat: 'tadbir', sana: '2025-03-20', qisqa: "Mart oyida bo'lib o'tgan xalqaro ko'rgazmada kompaniyamiz eng yangi mahsulotlarini namoyish etdi.", muallif: 'PR bo\'limi', holat: 'published' },
    { sarlavha: 'Yangi logistika markazi: yetkazib berish tezlashadi', kat: 'yangilik', sana: '2025-03-10', qisqa: "Ummed O'zbekiston bo'ylab tezkor yetkazib berishni ta'minlash uchun yangi logistika infratuzilmasini ishga tushirdi.", muallif: 'Ummed jamoasi', holat: 'published' },
  ]

  for (const p of postlar) {
    const postSlug = slug(p.sarlavha)
    await prisma.post.upsert({
      where: { slug: postSlug },
      update: {},
      create: {
        sarlavha: p.sarlavha,
        slug: postSlug,
        qisqaTavsif: p.qisqa,
        muallif: p.muallif,
        sana: new Date(p.sana),
        holat: p.holat,
        kategoriyaId: postKatMap[p.kat],
      },
    })
    console.log(`  ✓ Post: ${p.sarlavha.slice(0, 40)}...`)
  }

  console.log('\n✅ Seed muvaffaqiyatli tugadi!')
  console.log(`   ${mahsulotlar.length} mahsulot, ${kategoriyalar.length} kategoriya, ${postlar.length} yangilik`)
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
