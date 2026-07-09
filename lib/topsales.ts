import { fetchMS } from './ms-api';

export interface TopSalesResult {
  top10: string[];
  top50: string[];
  /** Eng ko'p sotilgandan kamayib boruvchi tartibda — faqat ota-mahsulot (yoki variantsiz mahsulot) idlari, ketma-ket ro'yxat uchun */
  top50Ranked: string[];
  hisoblanganVaqt: string;
}

const SOZLAMA_KALITI = 'order_top_sotuvlar';

/**
 * So'nggi `kunlar` kunlik sotuvlar bo'yicha TOP 10 / TOP 50 mahsulotlarni hisoblaydi.
 *
 * Muhim: variant (razmer/rang) sotuvlari o'z ota-mahsulotiga qo'shib yig'iladi —
 * aks holda bitta ko'p sotiladigan mahsulot o'nlab variantlarga bo'linib ketib,
 * har biri alohida past o'rinda qolib, umuman TOP ro'yxatga tushmay qolishi mumkin edi.
 */
export async function hisoblaTopSotuvlar(kunlar = 30): Promise<TopSalesResult> {
  const now = new Date();
  const from = new Date(now);
  from.setDate(from.getDate() - kunlar);
  const fmt = (d: Date) => d.toISOString().replace('T', ' ').slice(0, 19);

  // variantId -> ota mahsulot id (to'liq paginatsiya bilan)
  const variantToProduct: Record<string, string> = {};
  {
    let offset = 0;
    while (true) {
      const data = await fetchMS(`/entity/variant?limit=1000&offset=${offset}`);
      const rows: any[] = data?.rows ?? [];
      for (const v of rows) {
        const pid = (v.product?.meta?.href || '').split('/').pop();
        if (v.id && pid) variantToProduct[v.id] = pid;
      }
      if (rows.length < 1000 || offset >= 9000) break;
      offset += 1000;
    }
  }
  // ota mahsulot id -> variant idlar ro'yxati
  const productToVariants: Record<string, string[]> = {};
  for (const [vid, pid] of Object.entries(variantToProduct)) {
    (productToVariants[pid] ||= []).push(vid);
  }

  // Sotuvlar hisobotini TO'LIQ (barcha sahifalar) olib, mahsulot bo'yicha yig'ish
  const qtyByKey: Record<string, number> = {}; // kalit = ota mahsulot id (yoki o'z id, agar variant bo'lmasa)
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
      const key = variantToProduct[id] || id;
      qtyByKey[key] = (qtyByKey[key] || 0) + qty;
    }
    if (rows.length < 1000 || offset >= 9000) break;
    offset += 1000;
  }

  const ranked = Object.entries(qtyByKey)
    .sort((a, b) => b[1] - a[1])
    .map(([key]) => key);

  const top10 = new Set<string>();
  const top50 = new Set<string>();
  ranked.slice(0, 50).forEach((key, i) => {
    const ids = [key, ...(productToVariants[key] || [])];
    for (const id of ids) {
      top50.add(id);
      if (i < 10) top10.add(id);
    }
  });

  const top50Ranked = ranked.slice(0, 50);

  return { top10: [...top10], top50: [...top50], top50Ranked, hisoblanganVaqt: new Date().toISOString() };
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
    if (Array.isArray(parsed?.top10) && Array.isArray(parsed?.top50)) return parsed;
  } catch {}
  return null;
}
