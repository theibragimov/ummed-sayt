import { NextRequest, NextResponse } from 'next/server';
import { safeFetch, fetchAllRows, msDate, sumRows } from '@/lib/ms-fetch';
import { startOfMonth, endOfMonth } from 'date-fns';
import { getCached } from '@/lib/server-cache';

export async function GET(req: NextRequest) {
  try {
    const cacheKey = `earnings:${req.nextUrl.searchParams.toString()}`;
    const payload = await getCached(cacheKey, 60_000, async () => {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const now = new Date();
    const monthStart = from ? new Date(from) : startOfMonth(now);
    const monthEnd = to ? new Date(to + 'T23:59:59') : endOfMonth(now);
    const lastMonthEnd = new Date(monthStart.getTime() - 1);
    const lastMonthStart = new Date(lastMonthEnd.getFullYear(), lastMonthEnd.getMonth(), 1);

    const inExp = (f: Date, t: Date, type: 'paymentin' | 'cashin') =>
      `/entity/${type}?filter=moment>${msDate(f)};moment<${msDate(t)}&expand=agent`;

    // 1-guruh
    const [
      paymentinRows,
      cashinRows,
      lastPaymentinRows,
      lastCashinRows,
      profitByProduct,
    ] = await Promise.all([
      fetchAllRows(inExp(monthStart, monthEnd, 'paymentin')),
      fetchAllRows(inExp(monthStart, monthEnd, 'cashin')),
      fetchAllRows(inExp(lastMonthStart, lastMonthEnd, 'paymentin')),
      fetchAllRows(inExp(lastMonthStart, lastMonthEnd, 'cashin')),
      fetchAllRows(`/report/profit/byproduct?momentFrom=${msDate(monthStart)}&momentTo=${msDate(monthEnd)}`),
    ]);

    // 2-guruh
    const [
      profitByFolder,
      counterpartyReport,
      demandData,
    ] = await Promise.all([
      safeFetch(`/report/profit/byproductfolder?momentFrom=${msDate(monthStart)}&momentTo=${msDate(monthEnd)}&limit=50`),
      safeFetch(`/report/counterparty?limit=200`),
      safeFetch(`/entity/demand?filter=moment>${msDate(monthStart)};moment<${msDate(monthEnd)}&limit=1&offset=0`),
    ]);

    const allIncoming = [...paymentinRows, ...cashinRows];
    const lastIncoming = [...lastPaymentinRows, ...lastCashinRows];
    const monthRevenue = sumRows(allIncoming);
    const lastMonthRevenue = sumRows(lastIncoming);

    // Kunlik tushum
    const dailyMap: Record<string, number> = {};
    allIncoming.forEach((d: any) => {
      const day = (d.moment || '').substring(0, 10);
      if (day) dailyMap[day] = (dailyMap[day] || 0) + (Number(d.sum) || 0);
    });
    const dailyIncome = Object.entries(dailyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, sum]) => ({ date, sum }));

    // Agent bo'yicha tushum
    const agentMap: Record<string, number> = {};
    allIncoming.forEach((r: any) => {
      const name = r.agent?.name?.trim() || "Noma'lum";
      agentMap[name] = (agentMap[name] || 0) + Number(r.sum || 0);
    });
    const topIncomeAgents = Object.entries(agentMap)
      .filter(([n]) => n !== "Noma'lum")
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, sum]) => ({ name, sum }));

    // Foyda va marja
    const totalSellSum = profitByProduct.reduce((s: number, r: any) => s + (Number(r.sellSum) || 0), 0);
    const totalProfit = profitByProduct.reduce((s: number, r: any) => s + (Number(r.profit) || 0), 0);
    const avgMargin = totalSellSum > 0 ? (totalProfit / totalSellSum) * 100 : 0;

    // Kategoriyalar bo'yicha sotuv
    const categories = (profitByFolder.rows || [])
      .filter((r: any) => (r.sellSum || 0) > 0)
      .sort((a: any, b: any) => b.sellSum - a.sellSum)
      .slice(0, 8)
      .map((r: any) => ({
        name: r.productFolder?.name || 'Kategoriyasiz',
        sellSum: Number(r.sellSum) || 0,
        profit: Number(r.profit) || 0,
      }));

    // Qarzdorlar (counterparty report)
    const debtors = (counterpartyReport.rows || [])
      .filter((r: any) => (r.balance || 0) > 0)
      .sort((a: any, b: any) => b.balance - a.balance)
      .slice(0, 10)
      .map((r: any) => ({
        name: r.counterparty?.name || "Noma'lum",
        balance: Number(r.balance) || 0,
        salesCount: Number(r.salesCount) || 0,
      }));

    const totalDebt = debtors.reduce((s: number, d: any) => s + d.balance, 0);
    const topClientShare = monthRevenue > 0 && topIncomeAgents[0]
      ? topIncomeAgents[0].sum / monthRevenue : 0;

    return {
      monthRevenue,
      lastMonthRevenue,
      totalProfit,
      totalSellSum,
      avgMargin,
      dailyIncome,
      topIncomeAgents,
      debtors,
      totalDebt,
      debtorCount: debtors.length,
      categories,
      topClientShare,
      monthDemandsCount: demandData?.meta?.size || 0,
    };
    });

    return NextResponse.json(payload, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
