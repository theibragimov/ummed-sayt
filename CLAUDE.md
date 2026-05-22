# Ummed — Tibbiy Jihozlar Savdo Kompaniyasi Sayti

## Loyiha haqida

**Ummed** — tibbiy jihozlar sotuvi bilan shug'ullanuvchi kompaniyaning korporativ veb-sayti.  
Maqsadli auditoriya: B2B mijozlar — dorixona egalari va shifokorlar.

## Texnologiyalar

- **Framework:** Next.js (App Router)
- **Stil:** Tailwind CSS
- **Deploy:** Vercel
- **Til:** O'zbek tili

## Dizayn tizimi

| Parametr | Qiymat |
|---|---|
| Asosiy shrift | Montserrat (Google Fonts) |
| Asosiy rang | `#E8491D` — to'q qizil |
| Ikkinchi rang | `#3DB851` — yashil |
| Fon | Oq / ochiq kulrang |

## Sahifalar

| Yo'l | Sahifa nomi |
|---|---|
| `/` | Bosh sahifa |
| `/mahsulotlar` | Mahsulotlar |
| `/biz-haqimizda` | Biz haqimizda |
| `/boglanish` | Bog'lanish |

## Loyiha tuzilmasi

```
ummed-sayt/
├── app/
│   ├── layout.tsx          # Root layout (shrift, metadata)
│   ├── page.tsx            # Bosh sahifa
│   ├── mahsulotlar/
│   │   └── page.tsx
│   ├── biz-haqimizda/
│   │   └── page.tsx
│   └── boglanish/
│       └── page.tsx
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── ui/
├── public/
│   └── images/
├── tailwind.config.ts
└── CLAUDE.md
```

## Kod qoidalari

- Barcha UI matnlari o'zbek tilida yoziladi
- Komponentlar `components/` papkasida saqlanadi
- Ranglar Tailwind config orqali o'zgaruvchi sifatida belgilanadi:
  - `primary` → `#E8491D`
  - `secondary` → `#3DB851`
- Responsiv dizayn: mobil birinchi yondashuv (mobile-first)
- Rasm optimizatsiyasi uchun Next.js `<Image>` komponenti ishlatiladi

## Tailwind rang sozlamasi

```ts
// tailwind.config.ts
colors: {
  primary: '#E8491D',
  secondary: '#3DB851',
}
```

## Maqsad va ton

- Professional, ishonchli, tibbiy soha uchun mos
- B2B: texnik ma'lumotlar, sertifikatlar, ulgurji narxlar
- CTA (chaqiruv tugmalari): "Buyurtma bering", "Narxni so'rang", "Bog'laning"
