export type RecType = 'critical' | 'warning' | 'positive' | 'info';

export interface Rec {
  type: RecType;
  title: string;
  body: string;
}

function fmt(sum: number) {
  const v = sum / 100;
  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)} mlrd so'm`;
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)} mln so'm`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)} ming so'm`;
  return `${v.toFixed(0)} so'm`;
}

function pct(a: number, b: number) {
  if (!b) return 0;
  return ((a - b) / b) * 100;
}

// ===== DAROMAD TAVSIYALARI =====
export function earningsRecs(p: {
  monthRevenue: number;
  lastMonthRevenue: number;
  monthProfit: number;
  monthSalesSum: number;
  totalDebt: number;
  topClientShare: number;
  avgMargin: number;
  debtorCount: number;
}): Rec[] {
  const recs: Rec[] = [];
  const growth = pct(p.monthRevenue, p.lastMonthRevenue);
  const netMargin = p.monthRevenue > 0 ? (p.monthProfit / p.monthRevenue) * 100 : 0;
  const debtRatio = p.monthRevenue > 0 ? p.totalDebt / p.monthRevenue : 0;

  if (p.monthProfit < 0) {
    recs.push({
      type: "critical",
      title: "Zarar: darhol xarajatlarni kamaytirish kerak",
      body: `Bu davr ${fmt(-p.monthProfit)} zarar bilan yakunlanmoqda. Birinchi qadam — mahsulot tannarxini va operatsion xarajatlarni audit qiling. Rentabelli bo'lmagan mahsulotlarni assortimentdan chiqarish yoki narxini oshirish zarur.`,
    });
  } else if (netMargin < 8) {
    recs.push({
      type: "critical",
      title: "Net marja kritik darajada past",
      body: `Net marja atigi ${netMargin.toFixed(1)}% — bu barqaror biznes uchun yetarli emas (minimal 15% tavsiya etiladi). Tannarxi past mahsulotlarga e'tiborni kuchaytiring va xarajatlar tuzilmasini qayta ko'rib chiqing.`,
    });
  } else if (p.avgMargin < 15) {
    recs.push({
      type: "warning",
      title: "Mahsulot marjasi past — narx siyosatini qayta ko'rib chiqing",
      body: `O'rtacha gross marja ${p.avgMargin.toFixed(1)}%. Yuqori marjali mahsulotlarni savdoda ustuvor qilib, past marjali pozitsiyalarni cheklash yoki narxini oshirish daromadlilikni sezilarli yaxshilaydi.`,
    });
  } else if (p.avgMargin >= 30) {
    recs.push({
      type: "positive",
      title: "Ajoyib marja — o'sish strategiyasini kuchaytirish vaqti",
      body: `${p.avgMargin.toFixed(1)}% marja — sog'lom ko'rsatkich. Endi savdo hajmini oshirishga sarmoya kiritish (reklama, yangi mijozlar, tarqatish kanallari) yuqori ROI beradi.`,
    });
  }

  if (p.topClientShare > 0.40) {
    recs.push({
      type: "warning",
      title: "Yuqori kontsentratsiya: bitta mijozga bog'liqlik xavfli",
      body: `Eng yirik mijoz umumiy tushumning ${(p.topClientShare * 100).toFixed(0)}% ini tashkil etmoqda. Agar ushbu mijoz to'lov to'xtatsa yoki raqobatchilar bilan ketsa, katta yo'qotishlar bo'lishi mumkin. Yangi mijozlar jalb qilishni kuchaytiring.`,
    });
  }

  if (debtRatio > 0.35) {
    recs.push({
      type: "warning",
      title: "Debitorlik qarzlari nazorat ostiga olinishi kerak",
      body: `${p.debtorCount} ta mijozdan umumiy qarzdorlik ${fmt(p.totalDebt)} — bu oylik tushumning ${(debtRatio * 100).toFixed(0)}%. Muddati o'tgan qarzlar uchun avtomatik eslatma tizimi va kechiktirilgan to'lovlarga jarima joriy qiling.`,
    });
  }

  if (growth < -20 && recs.length < 2) {
    recs.push({
      type: "warning",
      title: "Tushum pasaymoqda — savdo kanallarini tekshiring",
      body: `O'tgan davriga nisbatan tushum ${Math.abs(growth).toFixed(1)}% kamaydi. Asosiy sabab: yangi mijozlar yetarli kelmayapti yoki mavjud mijozlar xarid qilishni kamaytiryapti. CRM tahlili va mijozlar bilan muloqotni kuchaytiring.`,
    });
  } else if (growth > 25 && recs.length < 2) {
    recs.push({
      type: "positive",
      title: "O'sish trendini qo'llab-quvvatlang",
      body: `Tushum ${growth.toFixed(1)}% o'sdi. Bu natijani saqlash uchun: o'sishni ta'minlayotgan mahsulot/mijoz segmentiga resurslarni ko'proq yo'naltiring va omborni bu talabga moslashtiring.`,
    });
  }

  if (recs.length === 0) {
    recs.push({
      type: "info",
      title: "Moliyaviy ko'rsatkichlar barqaror",
      body: "Asosiy ko'rsatkichlar normal chegarada. Keyingi qadam: debitorlik qarzlarini optimallashtirish, yuqori marjali mahsulotlar ulushini oshirish va mijozlar bazasini diversifikatsiya qilish orqali o'sishni ta'minlang.",
    });
  }

  return recs.slice(0, 2);
}

// ===== XARAJAT TAVSIYALARI =====
export function expenseRecs(p: {
  monthExpenses: number;
  lastMonthExpenses: number;
  monthRevenue: number;
  topCategory: string;
  topCategoryShare: number;
  creditorCount: number;
  totalCredit: number;
}): Rec[] {
  const recs: Rec[] = [];
  const expGrowth = pct(p.monthExpenses, p.lastMonthExpenses);
  const expRatio = p.monthRevenue > 0 ? p.monthExpenses / p.monthRevenue : 0;

  if (expRatio > 0.85) {
    recs.push({
      type: "critical",
      title: "Xarajatlar daromadni yeyaotganini ko'rsatmoqda",
      body: `Xarajatlar daromadning ${(expRatio * 100).toFixed(1)}% ni tashkil etmoqda. Bu barqaror emas — optimal nisbat 60-70%. Har bir xarajat moddasi bo'yicha audit o'tkazing va kamaytirilishi mumkin bo'lgan pozitsiyalarni aniqlang.`,
    });
  } else if (expRatio > 0.70) {
    recs.push({
      type: "warning",
      title: "Xarajatlar ulushi oshib bormoqda",
      body: `Xarajatlar daromadning ${(expRatio * 100).toFixed(1)}% ini tashkil etmoqda. Optimal 60% chegarasiga qaytish uchun "${p.topCategory}" kabi yirik xarajat moddalarini optimallashtiring.`,
    });
  }

  if (expGrowth > 30) {
    recs.push({
      type: "warning",
      title: `Xarajatlar keskin oshdi (+${expGrowth.toFixed(1)}%)`,
      body: `O'tgan davriga nisbatan xarajatlar ${expGrowth.toFixed(1)}% oshdi. Eng yirik o'sish "${p.topCategory}" bo'limida. Bu o'sishning sababi bir martalik xarajatmi yoki doimiy trend ekanligini aniqlash muhim.`,
    });
  } else if (expGrowth < -15) {
    recs.push({
      type: "positive",
      title: "Xarajatlarni kamaytirishda yaxshi natija",
      body: `Xarajatlar ${Math.abs(expGrowth).toFixed(1)}% kamaydi. Bu tejamkor boshqaruvning belgisi. Ammo xarajat qisqarishining mahsulot sifati yoki xizmat darajasiga salbiy ta'sir ko'rsatmasligini nazorat qiling.`,
    });
  }

  if (p.topCategoryShare > 0.5) {
    recs.push({
      type: "info",
      title: `"${p.topCategory}" — xarajatlarning yarmi`,
      body: `Bu kategoriya umumiy xarajatlarning ${(p.topCategoryShare * 100).toFixed(0)}% ini tashkil etmoqda. Yetkazib beruvchilar bilan narxlarni qayta muzokaraa qilish yoki muqobil yetkazib beruvchilar topish orqali sezilarli tejash mumkin.`,
    });
  }

  if (recs.length === 0) {
    recs.push({
      type: "info",
      title: "Xarajatlar nazorat ostida",
      body: "Xarajatlar barqaror darajada. Keyingi qadam: har oyda xarajatlar byudjetini tuzib, haqiqiy xarajatlarni rejaga solishtirish — bu ortiqcha xarajatlarni oldindan aniqlashga yordam beradi.",
    });
  }

  return recs.slice(0, 2);
}

// ===== MAHSULOT TAVSIYALARI =====
export function productRecs(p: {
  aClassCount: number;
  bClassCount: number;
  cClassCount: number;
  aClassShare: number;
  topMarginProduct: string;
  topMargin: number;
  lowMarginCount: number;
}): Rec[] {
  const recs: Rec[] = [];

  if (p.aClassCount <= 3) {
    recs.push({
      type: "warning",
      title: "Assortiment konsentratsiyasi yuqori",
      body: `Atigi ${p.aClassCount} ta mahsulot daromadning 80% ini ta'minlamoqda. Ushbu "A" sinf mahsulotlarni har doim ombordan chiqarmaslik va yangi yuqori daromadli pozitsiyalar kiritish muhim.`,
    });
  }

  if (p.cClassCount > p.aClassCount * 3) {
    recs.push({
      type: "info",
      title: `${p.cClassCount} ta past savdoli mahsulot assortimentni to'sib turibdi`,
      body: `"C" sinf mahsulotlar omborni band qiladi va boshqaruv vaqtini oladi. Ularni belgilangan muddatda sotilmasa, chegirmaga qo'yish yoki chiqarib tashlash hisobga olinsin.`,
    });
  }

  if (p.topMargin > 40) {
    recs.push({
      type: "positive",
      title: `"${p.topMarginProduct.substring(0, 40)}" — eng foydali mahsulot`,
      body: `Bu mahsulotning marjasi ${p.topMargin.toFixed(0)}%. Savdosini oshirish uchun uni ko'zga ko'rinadigan joyga qo'yish, paket takliflar tuzish va mijozlarga faol tavsiya qilish tavsiya etiladi.`,
    });
  }

  if (p.lowMarginCount > 5) {
    recs.push({
      type: "warning",
      title: `${p.lowMarginCount} ta mahsulot 10% dan past marja bilan sotilmoqda`,
      body: `Bu mahsulotlar tannarxidan kam foyda keltirmoqda. Narxlarni oshirish, tannarxni kamaytirish (yetkazib beruvchilarni almashtirish) yoki ularni assortimentdan chiqarish variantlarini ko'rib chiqing.`,
    });
  }

  if (recs.length === 0) {
    recs.push({
      type: "info",
      title: "Assortiment yaxshi muvozanatda",
      body: "Mahsulotlar portfeli barqaror. Keyingi o'sish uchun: mavjud \"A\" sinf mahsulotlar bilan bog'liq yangi pozitsiyalar kiritish (cross-sell) yoki eng yuqori marjali mahsulotlar savdosini oshirish strategiyasini qo'llang.",
    });
  }

  return recs.slice(0, 2);
}
