# Ummed — Tibbiy Jihozlar Savdo Sayti

Next.js + Sanity CMS bilan qurilgan korporativ veb-sayt.

---

## O'rnatish qadamlari

### 1. Loyihani klonlash va paketlarni o'rnatish

```bash
git clone <repo-url>
cd ummed-sayt
npm install
```

### 2. Sanity loyihasini yaratish

[sanity.io](https://sanity.io) saytiga kiring va yangi loyiha yarating:

1. [sanity.io/manage](https://sanity.io/manage) ga o'ting
2. "New project" tugmasini bosing
3. Loyiha nomini kiriting: `ummed-sayt`
4. Dataset: `production`
5. Project ID ni nusxalab oling

### 3. Muhit o'zgaruvchilarini sozlash

```bash
cp .env.local.example .env.local
```

`.env.local` faylini oching va to'ldiring:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=abc123xyz    # sanity.io/manage dan
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=skXXXXXXXXXX             # quyidagi qadamda olinadi
```

**API Token olish:**
1. [sanity.io/manage](https://sanity.io/manage) → loyihangiz → API → Tokens
2. "Add API token" → nomi: `next-sayt` → roli: **Editor**
3. Tokenni nusxalab `.env.local` ga joylashtiring

### 4. CORS sozlash (muhim!)

1. [sanity.io/manage](https://sanity.io/manage) → loyihangiz → API → CORS origins
2. "Add CORS origin" bosing:
   - Development: `http://localhost:3000` — Allow credentials: ✅
   - Production: `https://your-domain.vercel.app` — Allow credentials: ✅

### 5. Saytni ishga tushirish

```bash
npm run dev
```

- **Sayt:** http://localhost:3000
- **Admin panel:** http://localhost:3000/studio

---

## Sanity Studio ishlatish

### Content turlari

| Schema | Tavsif |
|---|---|
| `product` | Tibbiy jihozlar |
| `category` | Mahsulot kategoriyalari |
| `brand` | Ishlab chiqaruvchilar |
| `post` | Blog / Yangiliklar |
| `postCategory` | Blog bo'limlari |
| `banner` | Bosh sahifa slider |

### Studio navigatsiya

```
Mahsulotlar
   ├── Barcha mahsulotlar
   ├── Kategoriyalar
   └── Brendlar
Blog & Yangiliklar
   ├── Maqolalar
   └── Post kategoriyalari
Bannerlar / Slider
```

---

## CSV Import — Mahsulotlarni ommaviy yuklash

### CSV fayl formati

```csv
nom,narx,kategoriya_nomi,brend,model,qisqa_tavsif
Tonometr A200,450000,Diagnostika,Omron,A200,Qon bosimini o'lchash
UZI apparati,12000000,UZI,Samsung,HS40,Professional diagnostika
```

### Import ishga tushirish

```bash
node import-products.js ./mahsulotlar.csv
```

Skript avtomatik:
- Mavjud bo'lmagan kategoriyalarni yaratadi
- Takroriy mahsulotlarni yangilaydi (slug bo'yicha)
- Har bir qator natijasini ko'rsatadi

---

## Vercel Deploy

### 1. Muhit o'zgaruvchilarini qo'shish

Vercel dashboard → loyiha → Settings → Environment Variables:

```
NEXT_PUBLIC_SANITY_PROJECT_ID = abc123xyz
NEXT_PUBLIC_SANITY_DATASET    = production
SANITY_API_TOKEN              = skXXXXXXXXXX
```

### 2. Deploy

```bash
vercel --prod
```

### 3. Vercel domenini CORS ga qo'shish

[sanity.io/manage](https://sanity.io/manage) → API → CORS origins → Vercel domenini qo'shing.

---

## Kodda Sanity ma'lumotlarini ishlatish

```js
import { getProducts, getProductBySlug, getPosts, urlFor } from '@/lib/sanity'

// Barcha mahsulotlar
const products = await getProducts()

// Bitta mahsulot
const product = await getProductBySlug('tonometr-a200')

// Rasm URL
const imageUrl = urlFor(product.asosiyRasm).width(800).url()

// Blog postlar
const posts = await getPosts()
```

---

## Texnik ma'lumotlar

- **Framework:** Next.js 16 (App Router)
- **CMS:** Sanity v3
- **Stil:** Tailwind CSS v4
- **Deploy:** Vercel
- **Revalidate:** 60 sekund (ISR)
- **Til:** O'zbek tili
