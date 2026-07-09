import { fetchMS } from './ms-api';

export interface TopSalesResult {
  /**
   * Sotilgan miqdori bo'yicha kamayib boruvchi TO'LIQ tartiblangan ro'yxat — MoySklad
   * "Прибыльность → По товарам" hisobotidagi qatorlar bilan bir xil darajada (har bir
   * aniq mahsulot/modifikatsiya alohida). Atayin 50 tadan KATTA ro'yxat sifatida
   * saqlanadi: ba'zi ko'p sotilgan mahsulotlar vaqtincha omborda tugab qolishi mumkin,
   * shuning uchun saytda ko'rsatilganda shulardan HOZIR SOTUVDA BOR birinchi 50 tasi
   * tanlab olinadi (qarang: app/order/page.tsx dagi top50DisplayList).
   */
  top50Ranked: string[];
  hisoblanganVaqt: string;
  /** Hisoblash uchun ishlatilgan davr (O'zbekiston vaqti bo'yicha, "YYYY-MM-DD HH:mm:ss") — tekshirish/debug uchun */
  davrBoshi: string;
  davrOxiri: string;
}

const SOZLAMA_KALITI = 'order_top_sotuvlar';
const TOSHKENT_OFFSET_SOAT = 5; // O'zbekiston UTC+5, yozgi vaqtga o'tish yo'q

// Server qaysi vaqt zonasida ishlashidan qat'iy nazar, "hozir"ni Toshkent devor-soati sifatida beradi
// (natijadagi Date obyektining getUTC* metodlari Toshkent kalendar maydonlarini qaytaradi)
function toshkentHozir(): Date {
  return new Date(Date.now() + TOSHKENT_OFFSET_SOAT * 3600 * 1000);
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

/**
 * O'tgan TO'LIQ kalendar oyining (O'zbekiston vaqti bo'yicha) boshi va oxirini hisoblaydi.
 * Masalan, bugun 2026-07-09 bo'lsa — 2026-06-01 00:00:00 dan 2026-06-30 23:59:59 gacha.
 */
function otganOyDavri(): { from: string; to: string } {
  const hozir = toshkentHozir();
  const y = hozir.getUTCFullYear();
  const m = hozir.getUTCMonth(); // 0-indeks, joriy oy
  const otganOy = new Date(Date.UTC(y, m - 1, 1));
  const py = otganOy.getUTCFullYear();
  const pm = otganOy.getUTCMonth();
  const oxirgiKun = new Date(Date.UTC(py, pm + 1, 0)).getUTCDate();

  return {
    from: `${py}-${pad(pm + 1)}-01 00:00:00`,
    to: `${py}-${pad(pm + 1)}-${pad(oxirgiKun)} 23:59:59`,
  };
}

/**
 * O'tgan TO'LIQ kalendar oyi (joriy oyning boshigacha bo'lgan oy) bo'yicha mahsulotlarni
 * sotilgan miqdoriga qarab tartiblaydi — MoySkladdagi "Прибыльность → По товарам"
 * hisobotini shu davr uchun ochganingizda ko'rinadigan tartib bilan bir xil.
 *
 * Har bir aniq assortiment qatori (mahsulot yoki uning bitta aniq modifikatsiyasi)
 * o'zining sotilgan miqdori bo'yicha ALOHIDA hisoblanadi — boshqa modifikatsiyalar
 * bilan qo'shib yig'ilmaydi. Shu sababli, agar bitta mahsulotning faqat bitta o'lchami
 * ko'p sotilgan bo'lsa, faqat o'sha aniq o'lcham yuqori o'ringa chiqadi — sotilmagan
 * boshqa o'lchamlari/rangdagi modifikatsiyalari emas.
 */
export async function hisoblaTopSotuvlar(): Promise<TopSalesResult> {
  const { from, to } = otganOyDavri();

  // Sotuvlar hisobotini TO'LIQ (barcha sahifalar) olib, har bir aniq assortiment
  // (mahsulot yoki modifikatsiya) bo'yicha sotilgan miqdorni yig'ish
  const qtyById: Record<string, number> = {};
  let offset = 0;
  while (true) {
    const data = await fetchMS(
      `/report/profit/byproduct?momentFrom=${from}&momentTo=${to}&limit=1000&offset=${offset}`
    );
    const rows: any[] = data?.rows ?? [];
    for (const row of rows) {
      const href: string = row.assortment?.meta?.href ?? '';
      const id = href.split('/').pop();
      if (!id) continue;
      const qty = row.sellQuantity ?? 0;
      if (qty <= 0) continue;
      qtyById[id] = (qtyById[id] || 0) + qty;
    }
    if (rows.length < 1000 || offset >= 9000) break;
    offset += 1000;
  }

  const top50Ranked = Object.entries(qtyById)
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id);

  return { top50Ranked, hisoblanganVaqt: new Date().toISOString(), davrBoshi: from, davrOxiri: to };
}

export async function topSotuvlarniSaqlash(prisma: any, natija: TopSalesResult) {
  await prisma.$executeRaw`
    INSERT INTO sayt_sozlamalari (kalit, qiymat)
    VALUES (${SOZLAMA_KALITI}, ${JSON.stringify(natija)})
    ON CONFLICT (kalit) DO UPDATE SET qiymat = EXCLUDED.qiymat
  `;
}

export async function keshlanganTopSotuvlarniOlish(prisma: any): Promise<TopSalesResult | null> {
  const sozlama = await prisma.saytSozlamalari.findUnique({ where: { kalit: SOZLAMA_KALITI } });
  if (!sozlama?.qiymat) return null;
  try {
    const parsed = JSON.parse(sozlama.qiymat);
    if (Array.isArray(parsed?.top50Ranked)) return parsed;
  } catch {}
  return null;
}
