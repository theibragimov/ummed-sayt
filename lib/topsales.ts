import { fetchMS } from './ms-api';

export interface TopSalesResult {
  /** Eng ko'p sotilgandan kamayib boruvchi tartibda — MoySklad "Прибыльность → По товарам"
   *  hisobotidagi qatorlar bilan bir xil darajada (har bir aniq mahsulot/modifikatsiya alohida) */
  top50Ranked: string[];
  /** top50Ranked bilan bir xil, faqat tez qidirish (badge) uchun Set sifatida saqlanadi */
  top50: string[];
  hisoblanganVaqt: string;
}

const SOZLAMA_KALITI = 'order_top_sotuvlar';

/**
 * So'nggi `kunlar` kunlik sotuvlar bo'yicha TOP 50 mahsulotlarni hisoblaydi.
 *
 * MoySkladning o'zidagi "Прибыльность → По товарам" hisobotiga mos kelishi uchun,
 * har bir aniq assortiment qatori (mahsulot yoki uning bitta aniq modifikatsiyasi)
 * o'zining sotilgan miqdori bo'yicha ALOHIDA hisoblanadi — boshqa modifikatsiyalar
 * bilan qo'shib yig'ilmaydi. Shu sababli, agar bitta mahsulotning faqat bitta o'lchami
 * (masalan, 20-80mm) ko'p sotilgan bo'lsa, faqat o'sha aniq o'lcham TOP 50ga tushadi —
 * sotilmagan boshqa o'lchamlari/rangdagi modifikatsiyalari emas.
 */
export async function hisoblaTopSotuvlar(kunlar = 30): Promise<TopSalesResult> {
  const now = new Date();
  const from = new Date(now);
  from.setDate(from.getDate() - kunlar);
  const fmt = (d: Date) => d.toISOString().replace('T', ' ').slice(0, 19);

  // Sotuvlar hisobotini TO'LIQ (barcha sahifalar) olib, har bir aniq assortiment
  // (mahsulot yoki modifikatsiya) bo'yicha sotilgan miqdorni yig'ish
  const qtyById: Record<string, number> = {};
  let offset = 0;
  while (true) {
    const data = await fetchMS(
      `/report/profit/byproduct?momentFrom=${fmt(from)}&momentTo=${fmt(now)}&limit=1000&offset=${offset}`
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
    .slice(0, 50)
    .map(([id]) => id);

  return { top50Ranked, top50: top50Ranked, hisoblanganVaqt: new Date().toISOString() };
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
    if (Array.isArray(parsed?.top50) && Array.isArray(parsed?.top50Ranked)) return parsed;
  } catch {}
  return null;
}
