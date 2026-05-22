import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
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
      model,
      asosiyRasm,
      "kategoriya": kategoriya->{ nom, slug }
    }`,
    {},
    { next: { revalidate: 60 } }
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
      model,
      sertifikatlar,
      seoSarlavha,
      seoTavsif,
      asosiyRasm,
      qoshimchaRasmlar,
      "kategoriya": kategoriya->{ nom, slug }
    }`,
    { slug },
    { next: { revalidate: 60 } }
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
      asosiyRasm
    }`,
    { categorySlug },
    { next: { revalidate: 60 } }
  )
}

// ─── Kategoriyalar ───────────────────────────────────────────────────────────

export async function getCategories() {
  return client.fetch(
    `*[_type == "category"] | order(nom asc) {
      _id,
      nom,
      slug,
      tavsif,
      rasm,
      "parent": parentKategoriya->{ nom, slug },
      "mahsulotlarSoni": count(*[_type == "product" && kategoriya._ref == ^._id])
    }`,
    {},
    { next: { revalidate: 60 } }
  )
}

// ─── Blog / Yangiliklar ──────────────────────────────────────────────────────

export async function getPosts() {
  return client.fetch(
    `*[_type == "post" && holat == "published"] | order(chopEtilganSana desc) {
      _id,
      sarlavha,
      slug,
      qisqaTavsif,
      muallif,
      chopEtilganSana,
      muqovaRasm,
      "kategoriya": kategoriya->{ nom, slug }
    }`,
    {},
    { next: { revalidate: 60 } }
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
      "kategoriya": kategoriya->{ nom, slug }
    }`,
    { slug },
    { next: { revalidate: 60 } }
  )
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
    { next: { revalidate: 60 } }
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
    { next: { revalidate: 60 } }
  )
}
