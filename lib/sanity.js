import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
  token: process.env.SANITY_API_TOKEN,
})

// Write client (for creating documents — no CDN cache)
export const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

const builder = imageUrlBuilder(client)

export function urlFor(source) {
  return builder.image(source)
}

// ─── Mahsulotlar ────────────────────────────────────────────────────────────

export async function getProducts() {
  return client.fetch(
    `*[_type == "product" && mavjudligi == true] | order(_createdAt desc) {
      _id,
      nom,
      slug,
      narx,
      narxBirligi,
      mavjudligi,
      qisqaTavsif,
      brend,
      modelRaqami,
      featured,
      asosiyRasm,
      "kategoriya": kategoriya->{ nom, slug }
    }`,
    {},
    { next: { revalidate: 30 } }
  )
}

export async function getProductBySlug(slug) {
  return client.fetch(
    `*[_type == "product" && slug.current == $slug][0] {
      _id,
      nom,
      slug,
      narx,
      narxBirligi,
      mavjudligi,
      qisqaTavsif,
      toliqTavsif,
      brend,
      modelRaqami,
      featured,
      sertifikatlar,
      seoSarlavha,
      seoTavsif,
      asosiyRasm,
      qoshimchaRasmlar,
      "kategoriya": kategoriya->{ nom, slug }
    }`,
    { slug },
    { next: { revalidate: 30 } }
  )
}

export async function getProductsByCategory(categorySlug) {
  return client.fetch(
    `*[_type == "product" && kategoriya->slug.current == $categorySlug && mavjudligi == true] | order(_createdAt desc) {
      _id,
      nom,
      slug,
      narx,
      narxBirligi,
      qisqaTavsif,
      brend,
      featured,
      asosiyRasm
    }`,
    { categorySlug },
    { next: { revalidate: 30 } }
  )
}

export async function getFeaturedProducts() {
  return client.fetch(
    `*[_type == "product" && featured == true && mavjudligi == true] | order(_createdAt desc) {
      _id,
      nom,
      slug,
      narx,
      narxBirligi,
      qisqaTavsif,
      brend,
      modelRaqami,
      asosiyRasm,
      "kategoriya": kategoriya->{ nom, slug }
    }`,
    {},
    { next: { revalidate: 30 } }
  )
}

// ─── Kategoriyalar ───────────────────────────────────────────────────────────

export async function getCategories() {
  return client.fetch(
    `*[_type == "category"] | order(tartibRaqami asc, nom asc) {
      _id,
      nom,
      slug,
      tavsif,
      tartibRaqami,
      rasm,
      "parent": parentKategoriya->{ nom, slug },
      "mahsulotlarSoni": count(*[_type == "product" && kategoriya._ref == ^._id && mavjudligi == true])
    }`,
    {},
    { next: { revalidate: 30 } }
  )
}

export async function getCategoryBySlug(slug) {
  return client.fetch(
    `*[_type == "category" && slug.current == $slug][0] {
      _id,
      nom,
      slug,
      tavsif,
      tartibRaqami,
      rasm,
      "parent": parentKategoriya->{ nom, slug }
    }`,
    { slug },
    { next: { revalidate: 30 } }
  )
}

// ─── Blog / Yangiliklar ──────────────────────────────────────────────────────

export async function getPosts(limit = 20) {
  return client.fetch(
    `*[_type == "post" && holat == "published"] | order(chopEtilganSana desc) [0...$limit] {
      _id,
      sarlavha,
      slug,
      qisqaTavsif,
      muallif,
      chopEtilganSana,
      muqovaRasm,
      "kategoriya": kategoriya->{ nom, slug, rang }
    }`,
    { limit },
    { next: { revalidate: 30 } }
  )
}

export async function getPostsByCategory(categorySlug) {
  return client.fetch(
    `*[_type == "post" && holat == "published" && kategoriya->slug.current == $categorySlug] | order(chopEtilganSana desc) {
      _id,
      sarlavha,
      slug,
      qisqaTavsif,
      muallif,
      chopEtilganSana,
      muqovaRasm,
      "kategoriya": kategoriya->{ nom, slug, rang }
    }`,
    { categorySlug },
    { next: { revalidate: 30 } }
  )
}

export async function getPostBySlug(slug) {
  return client.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      _id,
      sarlavha,
      slug,
      qisqaTavsif,
      toliqMatn,
      muallif,
      chopEtilganSana,
      holat,
      muqovaRasm,
      "kategoriya": kategoriya->{ nom, slug, rang }
    }`,
    { slug },
    { next: { revalidate: 30 } }
  )
}

export async function getPostCategories() {
  return client.fetch(
    `*[_type == "postCategory"] | order(nom asc) {
      _id,
      nom,
      slug,
      rang,
      "postlarSoni": count(*[_type == "post" && kategoriya._ref == ^._id && holat == "published"])
    }`,
    {},
    { next: { revalidate: 30 } }
  )
}

// ─── Tugmalar ────────────────────────────────────────────────────────────────

export async function getButtons() {
  const buttons = await client.fetch(
    `*[_type == "button" && faol == true] {
      nom,
      matn,
      havola,
      yangiTabda
    }`,
    {},
    { next: { revalidate: 30 } }
  )
  // { "Bosh sahifa hero tugmasi": { matn, havola, yangiTabda }, ... }
  return buttons.reduce((acc, btn) => {
    acc[btn.nom] = { matn: btn.matn, havola: btn.havola, yangiTabda: btn.yangiTabda }
    return acc
  }, {})
}

// ─── Zayavkalar (server side only) ──────────────────────────────────────────

export async function getApplications() {
  return writeClient.fetch(
    `*[_type == "application"] | order(sana desc) {
      _id,
      ism,
      telefon,
      email,
      xabar,
      mahsulot,
      holat,
      sana,
      izoh
    }`
  )
}

export async function getNewApplicationsCount() {
  const result = await writeClient.fetch(
    `count(*[_type == "application" && holat == "new"])`
  )
  return result
}

// ─── Bannerlar ───────────────────────────────────────────────────────────────

export async function getBanners() {
  return client.fetch(
    `*[_type == "banner" && faol == true] | order(tartibRaqami asc) {
      _id,
      sarlavha,
      tavsif,
      havola,
      tartibRaqami,
      rasm
    }`,
    {},
    { next: { revalidate: 30 } }
  )
}

// ─── Brendlar ────────────────────────────────────────────────────────────────

export async function getBrands() {
  return client.fetch(
    `*[_type == "brand"] | order(nom asc) {
      _id,
      nom,
      logo,
      vebsayt
    }`,
    {},
    { next: { revalidate: 30 } }
  )
}
