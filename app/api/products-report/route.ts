import { NextRequest, NextResponse } from 'next/server';
import { safeFetch, fetchAllRows, msDate } from '@/lib/ms-fetch';
import { startOfMonth, endOfMonth } from 'date-fns';
import { getCached } from '@/lib/server-cache';

export async function GET(req: NextRequest) {
  try {
    const cacheKey = `products-report:${req.nextUrl.searchParams.toString()}`;
    const payload = await getCached(cacheKey, 90_000, async () => {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const now = new Date();
    const monthStart = from ? new Date(from) : startOfMonth(now);
    const monthEnd = to ? new Date(to + 'T23:59:59') : endOfMonth(now);

    const [profitByProduct, profitByFolder] = await Promise.all([
      fetchAllRows(`/report/profit/byproduct?momentFrom=${msDate(monthStart)}&momentTo=${msDate(monthEnd)}`),
      safeFetch(`/report/profit/byproductfolder?momentFrom=${msDate(monthStart)}&momentTo=${msDate(monthEnd)}&limit=50`),
    ]);

    // Bir xil nomli mahsulotlarni birlashtir
    const productMap: Record<string, { sellCount: number; sellSum: number; profit: number; costSum: number }> = {};
    for (const r of profitByProduct) {
      const name = r.assortment?.name?.trim() || "Noma'lum";
      if (!productMap[name]) productMap[name] = { sellCount: 0, sellSum: 0, profit: 0, costSum: 0 };
      productMap[name].sellCount += Math.round(Number(r.sellQuantity) || 0);
      productMap[name].sellSum  += Number(r.sellSum) || 0;
      productMap[name].profit   += Number(r.profit) || 0;
      productMap[name].costSum  += Number(r.sellCostSum) || 0;
    }

    const allProducts = Object.entries(productMap)
      .filter(([, v]) => v.sellSum > 0)
      .map(([name, v]) => ({
        name,
        sellCount: v.sellCount,
        sellSum: v.sellSum,
        profit: v.profit,
        costSum: v.costSum,
        margin: v.sellSum > 0 ? (v.profit / v.sellSum) * 100 : 0,
      }))
      .sort((a, b) => b.sellSum - a.sellSum);

    // ABC tahlil
    const totalSellSum = allProducts.reduce((s, p) => s + p.sellSum, 0);
    let running = 0;
    const withClass = allProducts.map(p => {
      running += p.sellSum;
      const share = running / totalSellSum;
      return { ...p, abcClass: share <= 0.8 ? 'A' : share <= 0.95 ? 'B' : 'C', cumulativeShare: share };
    });

    const aClass = withClass.filter(p => p.abcClass === 'A');
    const bClass = withClass.filter(p => p.abcClass === 'B');
    const cClass = withClass.filter(p => p.abcClass === 'C');

    // Top 10 sotuv summasi bo'yicha
    const top10BySales = allProducts.slice(0, 10);

    // Top 10 marja bo'yicha (min 5 dona sotilgan)
    const top10ByMargin = [...allProducts]
      .filter(p => p.sellCount >= 3)
      .sort((a, b) => b.margin - a.margin)
      .slice(0, 10);

    // Kategoriyalar
    const categories = (profitByFolder.rows || [])
      .filter((r: any) => (r.sellSum || 0) > 0)
      .sort((a: any, b: any) => b.sellSum - a.sellSum)
      .map((r: any) => ({
        name: r.productFolder?.name || 'Kategoriyasiz',
        sellSum: Number(r.sellSum) || 0,
        profit: Number(r.profit) || 0,
        sellCount: Number(r.sellQuantity) || 0,
        margin: Number(r.sellSum) > 0 ? (Number(r.profit) / Number(r.sellSum)) * 100 : 0,
      }));

    const avgMargin = totalSellSum > 0
      ? (allProducts.reduce((s, p) => s + p.profit, 0) / totalSellSum) * 100 : 0;

    const lowMarginCount = allProducts.filter(p => p.margin < 10 && p.margin >= 0).length;

    return {
      allProducts: withClass.slice(0, 100),
      top10BySales,
      top10ByMargin,
      categories,
      avgMargin,
      totalSellSum,
      totalProfit: allProducts.reduce((s, p) => s + p.profit, 0),
      totalCount: allProducts.length,
      aClassCount: aClass.length,
      bClassCount: bClass.length,
      cClassCount: cClass.length,
      aClassShare: totalSellSum > 0 ? aClass.reduce((s, p) => s + p.sellSum, 0) / totalSellSum : 0,
      topMarginProduct: top10ByMargin[0]?.name || '',
      topMargin: top10ByMargin[0]?.margin || 0,
      lowMarginCount,
    };
    });

    return NextResponse.json(payload, {
      headers: { 'Cache-Control': 'public, s-maxage=90, stale-while-revalidate=180' },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
