import { prisma } from './prisma'

// ─── Slug yaratish ───────────────────────────────────────────────────────────
export function slugYarat(matn) {
  return matn
    .toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ñ]/g, 'n')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// ─── Kategoriyalar ───────────────────────────────────────────────────────────

export async function getKategoriyalar() {
  return prisma.kategoriya.findMany({
    orderBy: [{ tartibRaqami: 'asc' }, { nom: 'asc' }],
    include: {
      parent: { select: { nom: true, slug: true } },
      _count: { select: { mahsulotlar: { where: { mavjudligi: true } } } },
    },
  })
}

export async function getKategoriyaBySlug(slug) {
  return prisma.kategoriya.findUnique({
    where: { slug },
    include: { parent: { select: { nom: true, slug: true } } },
  })
}

export async function createKategoriya(data) {
  const slug = data.slug || slugYarat(data.nom)
  return prisma.kategoriya.create({ data: { ...data, slug } })
}

export async function updateKategoriya(id, data) {
  return prisma.kategoriya.update({ where: { id: Number(id) }, data })
}

export async function deleteKategoriya(id) {
  return prisma.kategoriya.delete({ where: { id: Number(id) } })
}

// ─── Mahsulotlar ─────────────────────────────────────────────────────────────

export async function getMahsulotlar({ kategoriyaSlug, featured, limit, turi } = {}) {
  const where = { mavjudligi: true, kategoriyaId: { not: null } }
  if (kategoriyaSlug) where.kategoriya = { slug: kategoriyaSlug }
  if (featured) where.featured = true
  if (turi) where.turi = turi
  else where.turi = 'katalog'

  return prisma.mahsulot.findMany({
    where,
    orderBy: { yaratilgan: 'desc' },
    take: limit,
    include: {
      kategoriya: { select: { nom: true, nomRu: true, slug: true } },
      rasmlar: { orderBy: { tartib: 'asc' }, take: 1 },
    },
  })
}

export async function getAllMahsulotlar({ turi } = {}) {
  return prisma.mahsulot.findMany({
    where: turi ? { turi } : undefined,
    orderBy: { yaratilgan: 'desc' },
    include: {
      kategoriya: { select: { nom: true, nomRu: true, slug: true } },
    },
  })
}

export async function getMahsulotBySlug(slug) {
  return prisma.mahsulot.findUnique({
    where: { slug },
    include: {
      kategoriya: { select: { nom: true, nomRu: true, slug: true } },
      rasmlar: { orderBy: { tartib: 'asc' } },
    },
  })
}

export async function getMahsulotById(id) {
  return prisma.mahsulot.findUnique({
    where: { id: Number(id) },
    include: {
      kategoriya: true,
      rasmlar: { orderBy: { tartib: 'asc' } },
    },
  })
}

export async function createMahsulot(data) {
  const { rasmlar, ...rest } = data
  const slug = rest.slug || slugYarat(rest.nom)
  return prisma.mahsulot.create({
    data: {
      ...rest,
      slug,
      rasmlar: rasmlar?.length
        ? { create: rasmlar.map((url, i) => ({ rasmUrl: url, tartib: i })) }
        : undefined,
    },
    include: { rasmlar: true },
  })
}

export async function updateMahsulot(id, data) {
  const { rasmlar, kategoriyaId, narx, ...rest } = data
  const mahsulot = await prisma.mahsulot.update({
    where: { id: Number(id) },
    data: {
      ...rest,
      narx: narx !== undefined ? (narx ? parseFloat(narx) : null) : undefined,
      ...(kategoriyaId !== undefined ? { kategoriyaId: kategoriyaId ? Number(kategoriyaId) : null } : {}),
    },
  })
  if (rasmlar !== undefined) {
    await prisma.mahsulotRasm.deleteMany({ where: { mahsulotId: Number(id) } })
    if (rasmlar.length) {
      await prisma.mahsulotRasm.createMany({
        data: rasmlar.map((url, i) => ({ mahsulotId: Number(id), rasmUrl: url, tartib: i })),
      })
    }
  }
  return mahsulot
}

export async function deleteMahsulot(id) {
  return prisma.mahsulot.delete({ where: { id: Number(id) } })
}

// ─── Postlar ──────────────────────────────────────────────────────────────────

export async function getPostlar({ limit, kategoriyaSlug, hammasi } = {}) {
  const where = hammasi ? {} : { holat: 'published' }
  if (kategoriyaSlug) where.kategoriya = { slug: kategoriyaSlug }

  return prisma.post.findMany({
    where,
    orderBy: { sana: 'desc' },
    take: limit,
    include: { kategoriya: { select: { nom: true, slug: true, rang: true } } },
  })
}

export async function getAllPostlar() {
  return prisma.post.findMany({
    orderBy: { sana: 'desc' },
    include: { kategoriya: { select: { nom: true, slug: true } } },
  })
}

export async function getPostBySlug(slug) {
  return prisma.post.findUnique({
    where: { slug },
    include: { kategoriya: { select: { nom: true, slug: true, rang: true } } },
  })
}

export async function getPostById(id) {
  return prisma.post.findUnique({
    where: { id: Number(id) },
    include: { kategoriya: true },
  })
}

export async function createPost(data) {
  const { kategoriyaId, sana, ...rest } = data
  const slug = rest.slug || slugYarat(rest.sarlavha)
  return prisma.post.create({
    data: {
      ...rest,
      slug,
      ...(kategoriyaId ? { kategoriyaId: Number(kategoriyaId) } : {}),
      ...(sana ? { sana: new Date(sana) } : {}),
    },
  })
}

export async function updatePost(id, data) {
  const { kategoriyaId, sana, ...rest } = data
  return prisma.post.update({
    where: { id: Number(id) },
    data: {
      ...rest,
      ...(kategoriyaId !== undefined ? { kategoriyaId: kategoriyaId ? Number(kategoriyaId) : null } : {}),
      ...(sana ? { sana: new Date(sana) } : {}),
    },
  })
}

export async function deletePost(id) {
  return prisma.post.delete({ where: { id: Number(id) } })
}

// ─── Post Kategoriyalar ───────────────────────────────────────────────────────

export async function getPostKategoriyalar() {
  return prisma.postKategoriya.findMany({
    orderBy: { nom: 'asc' },
    include: { _count: { select: { postlar: { where: { holat: 'published' } } } } },
  })
}

export async function createPostKategoriya(data) {
  const slug = data.slug || slugYarat(data.nom)
  return prisma.postKategoriya.create({ data: { ...data, slug } })
}

export async function updatePostKategoriya(id, data) {
  return prisma.postKategoriya.update({ where: { id: Number(id) }, data })
}

export async function deletePostKategoriya(id) {
  return prisma.postKategoriya.delete({ where: { id: Number(id) } })
}

// ─── Zayavkalar ──────────────────────────────────────────────────────────────

export async function getZayavkalar({ holat } = {}) {
  const where = holat ? { holat } : {}
  return prisma.zayavka.findMany({
    where,
    orderBy: { sana: 'desc' },
  })
}

export async function getZayavkaById(id) {
  return prisma.zayavka.findUnique({ where: { id: Number(id) } })
}

export async function createZayavka(data) {
  return prisma.zayavka.create({ data })
}

export async function updateZayavka(id, data) {
  return prisma.zayavka.update({ where: { id: Number(id) }, data })
}

export async function deleteZayavka(id) {
  return prisma.zayavka.delete({ where: { id: Number(id) } })
}

export async function getYangiZayavkalarSoni() {
  return prisma.zayavka.count({ where: { holat: 'new' } })
}

// ─── Tugmalar ─────────────────────────────────────────────────────────────────

export async function getTugmalar() {
  const list = await prisma.tugma.findMany({ where: { faol: true } })
  return list.reduce((acc, t) => {
    acc[t.nom] = { matn: t.matn, havola: t.havola, yangiTabda: t.yangiTabda }
    return acc
  }, {})
}

export async function getAllTugmalar() {
  return prisma.tugma.findMany()
}

export async function createTugma(data) {
  return prisma.tugma.create({ data })
}

export async function updateTugma(id, data) {
  return prisma.tugma.update({ where: { id: Number(id) }, data })
}

export async function deleteTugma(id) {
  return prisma.tugma.delete({ where: { id: Number(id) } })
}

// ─── Dashboard statistika ─────────────────────────────────────────────────────

export async function getDashboardStats() {
  const [mahsulotlar, kategoriyalar, postlar, yangiZayavkalar, jamiZayavkalar] =
    await Promise.all([
      prisma.mahsulot.count(),
      prisma.kategoriya.count(),
      prisma.post.count({ where: { holat: 'published' } }),
      prisma.zayavka.count({ where: { holat: 'new' } }),
      prisma.zayavka.count(),
    ])
  return { mahsulotlar, kategoriyalar, postlar, yangiZayavkalar, jamiZayavkalar }
}
