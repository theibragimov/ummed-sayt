/**
 * Mahsulotlarni CSV fayldan Sanity CMS ga import qilish skripti
 *
 * CSV format (birinchi qator sarlavha bo'lishi kerak):
 *   nom,narx,kategoriya_nomi,brend,model,qisqa_tavsif
 *
 * Ishlatish:
 *   node import-products.js ./mahsulotlar.csv
 *
 * Muhit o'zgaruvchilari (.env.local faylidan):
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET
 *   SANITY_API_TOKEN  (Editor yoki Write roli kerak)
 */

import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'
import { createClient } from '@sanity/client'

// .env.local faylini yuklash
function loadEnv() {
  const envPath = path.resolve('.env.local')
  if (!fs.existsSync(envPath)) {
    console.error('.env.local fayli topilmadi!')
    process.exit(1)
  }
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const [key, ...rest] = trimmed.split('=')
    process.env[key.trim()] = rest.join('=').trim()
  }
}

loadEnv()

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-а-яёa-z]/gi, '')
    .replace(/--+/g, '-')
    .trim()
}

async function getOrCreateCategory(nom) {
  const existing = await client.fetch(
    `*[_type == "category" && nom == $nom][0]{ _id }`,
    { nom }
  )
  if (existing) return existing._id

  const doc = await client.create({
    _type: 'category',
    nom,
    slug: { _type: 'slug', current: slugify(nom) },
  })
  console.log(`  ✅ Yangi kategoriya yaratildi: ${nom}`)
  return doc._id
}

async function importProducts(csvPath) {
  if (!fs.existsSync(csvPath)) {
    console.error(`CSV fayl topilmadi: ${csvPath}`)
    process.exit(1)
  }

  const content = fs.readFileSync(csvPath, 'utf-8')
  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  })

  console.log(`\n📦 ${records.length} ta mahsulot topildi. Import boshlanmoqda...\n`)

  let success = 0
  let failed = 0

  for (const row of records) {
    const nom = row.nom || row.name
    if (!nom) {
      console.warn('  ⚠️  Nom bo\'sh, o\'tkazib yuborildi')
      failed++
      continue
    }

    try {
      const doc = {
        _type: 'product',
        nom,
        slug: { _type: 'slug', current: slugify(nom) },
        narx: row.narx ? Number(row.narx.replace(/\s/g, '')) : undefined,
        narxBirligi: "so'm",
        brend: row.brend || row.brand || undefined,
        model: row.model || undefined,
        qisqaTavsif: row.qisqa_tavsif || row.description || undefined,
        mavjudligi: true,
      }

      if (row.kategoriya_nomi || row.category) {
        const katNom = row.kategoriya_nomi || row.category
        const katId = await getOrCreateCategory(katNom)
        doc.kategoriya = { _type: 'reference', _ref: katId }
      }

      // Slug takrorlanmasligini tekshirish
      const existing = await client.fetch(
        `*[_type == "product" && slug.current == $slug][0]{ _id }`,
        { slug: doc.slug.current }
      )

      if (existing) {
        await client.patch(existing._id).set(doc).commit()
        console.log(`  🔄 Yangilandi: ${nom}`)
      } else {
        await client.create(doc)
        console.log(`  ✅ Qo'shildi: ${nom}`)
      }

      success++
    } catch (err) {
      console.error(`  ❌ Xato (${nom}): ${err.message}`)
      failed++
    }
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`✅ Muvaffaqiyatli: ${success}`)
  console.log(`❌ Xato:           ${failed}`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)
}

const csvFile = process.argv[2]
if (!csvFile) {
  console.error('Ishlatish: node import-products.js <csv-fayl-yoli>')
  console.error('Misol:     node import-products.js ./mahsulotlar.csv')
  process.exit(1)
}

importProducts(path.resolve(csvFile))
