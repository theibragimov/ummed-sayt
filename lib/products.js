export const PRODUCTS = [
  {
    id: 1,
    name: "Tonometr avtomatik",
    category: "diagnostika",
    categoryLabel: "Diagnostika",
    price: 320000,
    oldPrice: 380000,
    img: "🩺",
    badge: "Ommabop",
    desc: "Raqamli qon bosimi o'lchagich, bilak tipi",
    fullDesc: `Avtomatik tonometr — qon bosimini va puls tezligini aniq o'lchash uchun mo'ljallangan zamonaviy qurilma. Bilak tipidagi dizayni tufayli ishlatish juda qulay.

Katta LCD ekran o'lchovlarni aniq ko'rsatadi. Xotira funksiyasi oxirgi 60 ta o'lchovni saqlaydi. Aritmiya ko'rsatkichi yurak urishidagi tartibsizliklarni aniqlaydi.`,
    specs: [
      { label: "O'lchov usuli", value: "Oscillometric" },
      { label: "Manzil", value: "Bilak" },
      { label: "Xotira", value: "60 ta o'lchov" },
      { label: "Ekran", value: "LCD, katta" },
      { label: "Quvvat", value: "2 × AA batareya" },
      { label: "Kafolat", value: "2 yil" },
    ],
    inStock: true,
  },
  {
    id: 2,
    name: "Glukometr to'plami",
    category: "diagnostika",
    categoryLabel: "Diagnostika",
    price: 180000,
    oldPrice: null,
    img: "💉",
    badge: null,
    desc: "Qand darajasini o'lchash, 50 ta test chizig'i bilan",
    fullDesc: `Glukometr — qondagi glyukoza darajasini tez va aniq o'lchash uchun mo'ljallangan qurilma. To'plam ichida qurilma, 50 ta test chizig'i va 10 ta lanset mavjud.

Natija 5 soniyada tayyor. Kichik qon namunasi (0.5 µL) talab qiladi. Diabetik bemorlar uchun eng qulay yechim.`,
    specs: [
      { label: "O'lchov vaqti", value: "5 soniya" },
      { label: "Qon hajmi", value: "0.5 µL" },
      { label: "O'lchov diapazoni", value: "1.1–33.3 mmol/L" },
      { label: "Xotira", value: "500 ta natija" },
      { label: "To'plamda", value: "50 test, 10 lanset" },
      { label: "Kafolat", value: "1 yil" },
    ],
    inStock: true,
  },
  {
    id: 3,
    name: "Infraqizil termometr",
    category: "diagnostika",
    categoryLabel: "Diagnostika",
    price: 95000,
    oldPrice: 120000,
    img: "🌡️",
    badge: "Yangi",
    desc: "Kontaktsiz, 1 soniyada o'lchaydi",
    fullDesc: `Infraqizil kontaktsiz termometr — bolalar va kattalar uchun tana haroratini tez va xavfsiz o'lchaydi. Peshonaga 3–5 sm masofadan turib 1 soniyada aniq natija beradi.

Ovozli va rangli signal: yashil (normal), sariq (subfebril), qizil (isitma). Xotiraga 32 ta o'lchov saqlanadi.`,
    specs: [
      { label: "O'lchov vaqti", value: "1 soniya" },
      { label: "Masofa", value: "3–5 sm" },
      { label: "Diapazon", value: "32–42.9°C" },
      { label: "Aniqlik", value: "±0.2°C" },
      { label: "Xotira", value: "32 ta o'lchov" },
      { label: "Kafolat", value: "1 yil" },
    ],
    inStock: true,
  },
  {
    id: 4,
    name: "Kompressor nebulayzer",
    category: "nafas",
    categoryLabel: "Nafas jihozlari",
    price: 450000,
    oldPrice: null,
    img: "💨",
    badge: null,
    desc: "Nafas kasalliklari uchun, bolalar va kattalar",
    fullDesc: `Kompressor nebulayzer — bronxial astma, OEPD, bronxit va boshqa nafas yo'llari kasalliklarini davolashda dori moddalarini aerozol shaklida yetkazib beradi.

Bolalar va kattalar uchun alohida niqob to'plamlari bilan keladi. Soatiga 10 ml dori yuboradi. Jim ishlash darajasi 60 dB dan past.`,
    specs: [
      { label: "Zarralar o'lchami", value: "MMAD ≤ 5 µm" },
      { label: "Dori sarfi", value: "≥ 0.2 ml/min" },
      { label: "Hajm", value: "2–8 ml" },
      { label: "Shovqin", value: "< 60 dB" },
      { label: "To'plamda", value: "Katta + bola niqobi" },
      { label: "Kafolat", value: "2 yil" },
    ],
    inStock: true,
  },
  {
    id: 5,
    name: "Ultratovush nebulayzer",
    category: "nafas",
    categoryLabel: "Nafas jihozlari",
    price: 620000,
    oldPrice: 750000,
    img: "🌬️",
    badge: "Sertifikat",
    desc: "Jimjit ishlaydi, kichik o'lchamli",
    fullDesc: `Ultratovush nebulayzer — eng zamonaviy texnologiya asosida ishlaydigan, ovoz chiqarmaydigan qurilma. Ko'chma format: cho'ntakka sigadi, batareyada ishlaydi.

Dori zarralarini 1–5 µm gacha maydalab, nafas yo'llarining eng chuqur qismlarigacha yetkazadi.`,
    specs: [
      { label: "Texnologiya", value: "Ultratovush" },
      { label: "Zarralar", value: "1–5 µm" },
      { label: "Shovqin", value: "< 35 dB" },
      { label: "Quvvat", value: "USB yoki batareya" },
      { label: "Og'irlik", value: "120 g" },
      { label: "Kafolat", value: "2 yil" },
    ],
    inStock: false,
  },
  {
    id: 6,
    name: "Pulse oksimetr",
    category: "diagnostika",
    categoryLabel: "Diagnostika",
    price: 120000,
    oldPrice: null,
    img: "❤️",
    badge: null,
    desc: "SpO2 va puls tezligini o'lchaydi",
    fullDesc: `Pulse oksimetr — qon kislorod to'yinganligini (SpO2) va puls tezligini og'riqsiz va tez o'lchaydi. Barmoqqa kiyib 6 soniyada natija beradi.

Rangli OLED ekranda SpO2 foizi, puls tezligi va puls to'lqin grafigi ko'rsatiladi. Quyi SpO2 darajasida signal beradi.`,
    specs: [
      { label: "O'lchov", value: "SpO2 + PR" },
      { label: "SpO2 diapazoni", value: "70–99%" },
      { label: "Aniqlik", value: "±2%" },
      { label: "Ekran", value: "Rangli OLED" },
      { label: "Quvvat", value: "2 × AAA batareya" },
      { label: "Kafolat", value: "1 yil" },
    ],
    inStock: true,
  },
  {
    id: 7,
    name: "ECG apparat 12-kanal",
    category: "yurak",
    categoryLabel: "Yurak jihozlari",
    price: 2800000,
    oldPrice: null,
    img: "📈",
    badge: "Professional",
    desc: "Ko'chma elektrokardiograf, printer bilan",
    fullDesc: `12 kanalli ECG apparat — klinika va kasalxonalar uchun professional darajadagi elektrokardiograf. Ichki termik printer bilan darhol natijani qog'ozga chiqaradi.

Wi-Fi orqali natijalarni kompyuterga yuborish imkoni bor. 7 dyuymli teginish ekrani. USB flesh xotira bilan ishlaydi.`,
    specs: [
      { label: "Kanallar", value: "12" },
      { label: "Ekran", value: "7\" teginish" },
      { label: "Printer", value: "Ichki termik" },
      { label: "Xotira", value: "1000 ta ECG" },
      { label: "Ulanish", value: "Wi-Fi, USB" },
      { label: "Kafolat", value: "3 yil" },
    ],
    inStock: true,
  },
  {
    id: 8,
    name: "Holter monitor",
    category: "yurak",
    categoryLabel: "Yurak jihozlari",
    price: 4500000,
    oldPrice: null,
    img: "🫀",
    badge: null,
    desc: "24 soatlik EKG monitoring tizimi",
    fullDesc: `Holter monitor — bemorning kundalik hayoti davomida 24–72 soat mobaynida EKG signalini uzluksiz yozib boruvchi qurilma.

Yengil va kichik korpus (58 g) bemor uchun noqulaylik tug'dirmaydi. Maxsus dastur yordamida shifokor to'liq tahlil qiladi.`,
    specs: [
      { label: "Monitoring", value: "24–72 soat" },
      { label: "Kanallar", value: "3 yoki 12" },
      { label: "Xotira", value: "4 GB" },
      { label: "Og'irlik", value: "58 g" },
      { label: "Quvvat", value: "Li-Ion batareya" },
      { label: "Kafolat", value: "2 yil" },
    ],
    inStock: true,
  },
  {
    id: 9,
    name: "Tibbiy krovat",
    category: "mebel",
    categoryLabel: "Tibbiy mebel",
    price: 1200000,
    oldPrice: 1450000,
    img: "🛏️",
    badge: null,
    desc: "Statsionar, balandligi sozlanadi",
    fullDesc: `Tibbiy krovat — kasalxona va klinikalar uchun mo'ljallangan statsionar yotoq. Balandligi mexanik ravishda 45–90 sm orasida sozlanadi.

Polimer qoplamali po'lat konstruktsiya — tez tozalanadi va dezinfeksiyaga chidamli. Kattaroq g'ildiraklar krovalni xonada osongina harakatlantirishga imkon beradi.`,
    specs: [
      { label: "Balandlik", value: "45–90 sm" },
      { label: "O'lcham", value: "200 × 90 sm" },
      { label: "Yuk ko'tarish", value: "200 kg" },
      { label: "Material", value: "Po'lat + polimer" },
      { label: "G'ildiraklar", value: "To'xtatgich bilan" },
      { label: "Kafolat", value: "2 yil" },
    ],
    inStock: true,
  },
  {
    id: 10,
    name: "Dropper stendi",
    category: "mebel",
    categoryLabel: "Tibbiy mebel",
    price: 85000,
    oldPrice: null,
    img: "🪝",
    badge: null,
    desc: "Ko'chma, to'rtta tutqich bilan",
    fullDesc: `Dropper stendi — tomchi qo'yish uchun ko'chma stend. To'rtta tutqich bir vaqtda bir nechta idishni osib qo'yish imkonini beradi.

Balandligi 125–185 sm orasida sozlanadi. Og'ir bo'lmagan (2.5 kg) va qulay g'ildiraklar bilan.`,
    specs: [
      { label: "Tutqichlar", value: "4 ta" },
      { label: "Balandlik", value: "125–185 sm" },
      { label: "Og'irlik", value: "2.5 kg" },
      { label: "Material", value: "Zanglamaydigan po'lat" },
      { label: "G'ildiraklar", value: "5 ta" },
      { label: "Kafolat", value: "1 yil" },
    ],
    inStock: true,
  },
  {
    id: 11,
    name: "Sterilizator quruq issiq",
    category: "sterilizatsiya",
    categoryLabel: "Sterilizatsiya",
    price: 380000,
    oldPrice: 420000,
    img: "🔥",
    badge: "Yangi",
    desc: "200°C gacha, 20 litr hajmi",
    fullDesc: `Quruq issiqlik sterilizatori — tibbiy asboblarni 160–200°C haroratda sterilizatsiya qilish uchun. Dorixona, stomatologiya va jarrohlik klinikalariga mos.

Mexanik taymeri bilan 0–60 daqiqagacha vaqt o'rnatiladi. Ichki 20 litr hajm turli o'lchamdagi asboblarga mos keladi.`,
    specs: [
      { label: "Harorat", value: "160–200°C" },
      { label: "Hajm", value: "20 litr" },
      { label: "Taymer", value: "0–60 daqiqa" },
      { label: "Quvvat", value: "1000 Vt" },
      { label: "O'lcham", value: "370×370×250 mm" },
      { label: "Kafolat", value: "1 yil" },
    ],
    inStock: true,
  },
  {
    id: 12,
    name: "Avtoklav 24L",
    category: "sterilizatsiya",
    categoryLabel: "Sterilizatsiya",
    price: 3200000,
    oldPrice: null,
    img: "⚗️",
    badge: "Professional",
    desc: "Bug' sterilizatsiya, LCD ekran",
    fullDesc: `Avtoklav — bug' bosimi ostida sterilizatsiya qiluvchi professional qurilma. 134°C da 3 daqiqada to'liq sterilizatsiya. Stomatologiya, jarrohlik va laboratoriyalar uchun.

LCD ekran va avtomatik dasturlar jarayonni nazorat qilishni osonlashtiradi. Xavfsizlik klapani ortiqcha bosimni oldini oladi.`,
    specs: [
      { label: "Hajm", value: "24 litr" },
      { label: "Harorat", value: "121°C / 134°C" },
      { label: "Vaqt", value: "3–30 daqiqa" },
      { label: "Ekran", value: "LCD" },
      { label: "Quvvat", value: "2400 Vt" },
      { label: "Kafolat", value: "3 yil" },
    ],
    inStock: true,
  },
];

export function getProduct(id) {
  return PRODUCTS.find((p) => p.id === Number(id)) || null;
}

export function getSimilar(product, count = 3) {
  return PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, count);
}

export function formatPrice(n) {
  return n.toLocaleString("uz-UZ") + " so'm";
}
