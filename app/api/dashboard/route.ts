import { NextRequest, NextResponse } from 'next/server';
import { subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { fetchAllRows, msDate, safeFetch, sumRows } from '@/lib/ms-fetch';
import { getCached } from '@/lib/server-cache';

export async function GET(req: NextRequest) {
  try {
    const cacheKey = `dashboard:${req.nextUrl.searchParams.toString()}`;
    const payload = await getCached(cacheKey, 60_000, async () => {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    const now = new Date();
    const monthStart = from ? new Date(from) : startOfMonth(now);
    const monthEnd = to ? new Date(to + 'T23:59:59') : endOfMonth(now);
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const prevWeekStart = subDays(weekStart, 7);
    const prevWeekEnd = subDays(weekEnd, 7);
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart.getTime() + 86400000 - 1);
    const yesterdayStart = subDays(todayStart, 1);
    const yesterdayEnd = subDays(todayEnd, 1);

    // Tushum uchun (sum hisoblash) — expand yo'q, tez
    const inUrl = (f: Date, t: Date, type: 'paymentin' | 'cashin') =>
      `/entity/${type}?filter=moment>${msDate(f)};moment<${msDate(t)}`;

    // Top kontragent uchun — expand=agent bilan, agent.name kerak (limit=100 chunki expand)
    const inUrlExpand = (f: Date, t: Date, type: 'paymentin' | 'cashin') =>
      `/entity/${type}?filter=moment>${msDate(f)};moment<${msDate(t)}&expand=agent`;

    const demandUrl = (f: Date, t: Date) =>
      `/entity/demand?filter=moment>${msDate(f)};moment<${msDate(t)}`;

    // Xarajat URL'lari
    const outUrl = (f: Date, t: Date, type: 'paymentout' | 'cashout') =>
      `/entity/${type}?filter=moment>${msDate(f)};moment<${msDate(t)}`;

    // Oldingi oy chegaralari
    const lastMonthEnd = new Date(monthStart.getTime() - 1);
    const lastMonthStart = new Date(lastMonthEnd.getFullYear(), lastMonthEnd.getMonth(), 1);

    // 1-guruh: oylik asosiy ma'lumotlar
    const [
      monthPaymentinRows,
      monthCashinRows,
      monthDemands,
      profitByProduct,
      monthPaymentoutRows,
      monthCashoutRows,
      lastMonthPaymentoutRows,
      lastMonthCashoutRows,
    ] = await Promise.all([
      fetchAllRows(inUrl(monthStart, monthEnd, 'paymentin')),
      fetchAllRows(inUrl(monthStart, monthEnd, 'cashin')),
      safeFetch(demandUrl(monthStart, monthEnd)),
      fetchAllRows(`/report/profit/byproduct?momentFrom=${msDate(monthStart)}&momentTo=${msDate(monthEnd)}`),
      fetchAllRows(outUrl(monthStart, monthEnd, 'paymentout')),
      fetchAllRows(outUrl(monthStart, monthEnd, 'cashout')),
      fetchAllRows(outUrl(lastMonthStart, lastMonthEnd, 'paymentout')),
      fetchAllRows(outUrl(lastMonthStart, lastMonthEnd, 'cashout')),
    ]);

    // 2-guruh: haftalik/kunlik va expand so'rovlar
    const [
      weekPaymentin,
      weekCashin,
      prevWeekPaymentin,
      prevWeekCashin,
      todayPaymentin,
      todayCashin,
      yesterdayPaymentin,
      yesterdayCashin,
      expandPaymentinRows,
      expandCashinRows,
    ] = await Promise.all([
      safeFetch(inUrl(weekStart, weekEnd, 'paymentin')),
      safeFetch(inUrl(weekStart, weekEnd, 'cashin')),
      safeFetch(inUrl(prevWeekStart, prevWeekEnd, 'paymentin')),
      safeFetch(inUrl(prevWeekStart, prevWeekEnd, 'cashin')),
      safeFetch(inUrl(todayStart, todayEnd, 'paymentin')),
      safeFetch(inUrl(todayStart, todayEnd, 'cashin')),
      safeFetch(inUrl(yesterdayStart, yesterdayEnd, 'paymentin')),
      safeFetch(inUrl(yesterdayStart, yesterdayEnd, 'cashin')),
      // agent.name ni olish uchun expand bilan (top kontragent)
      fetchAllRows(inUrlExpand(monthStart, monthEnd, 'paymentin')),
      fetchAllRows(inUrlExpand(monthStart, monthEnd, 'cashin')),
    ]);

    // Tushum = paymentin + cashin (barcha sahifalar)
    const allMonthIncoming = [...monthPaymentinRows, ...monthCashinRows];
    const monthRevenue = sumRows(allMonthIncoming);
    const weekRevenue = sumRows(weekPaymentin.rows) + sumRows(weekCashin.rows);
    const prevWeekRevenue = sumRows(prevWeekPaymentin.rows) + sumRows(prevWeekCashin.rows);
    const todayRevenue = sumRows(todayPaymentin.rows) + sumRows(todayCashin.rows);
    const yesterdayRevenue = sumRows(yesterdayPaymentin.rows) + sumRows(yesterdayCashin.rows);

    // Sotuv (otgruzka)
    const monthSalesSum = sumRows(monthDemands.rows);
    const monthDemandsCount = monthDemands.meta?.size ?? (monthDemands.rows || []).length;

    // Kunlik dinamika — paymentin + cashin birga
    const dailyMap: Record<string, number> = {};
    allMonthIncoming.forEach((d: any) => {
      const day = (d.moment || '').substring(0, 10);
      if (day) dailyMap[day] = (dailyMap[day] || 0) + (Number(d.sum) || 0);
    });
    const dailySales = Object.entries(dailyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, sum]) => ({ date, sum }));

    // Foyda — profit reportdan
    const monthProfit = profitByProduct.reduce(
      (s: number, r: any) => s + (Number(r.profit) || 0), 0
    );

    // ===== TOP 10 MAHSULOT =====
    // profitByProduct dan, bir xil nomli mahsulotlarni birlashtir, sellSum bo'yicha sort
    const productMap: Record<string, { sellCount: number; sellSum: number; profit: number }> = {};
    for (const r of profitByProduct) {
      const name = r.assortment?.name?.trim() || 'Noma\'lum';
      if (!productMap[name]) {
        productMap[name] = { sellCount: 0, sellSum: 0, profit: 0 };
      }
      productMap[name].sellCount += Math.round(Number(r.sellQuantity) || 0);
      productMap[name].sellSum += Number(r.sellSum) || 0;
      productMap[name].profit += Number(r.profit) || 0;
    }
    const topProducts = Object.entries(productMap)
      .filter(([, v]) => v.sellSum > 0)
      .sort(([, a], [, b]) => b.sellSum - a.sellSum)
      .slice(0, 10)
      .map(([name, v]) => ({
        name,
        sellCount: v.sellCount,
        sellSum: v.sellSum,
        profit: v.profit,
      }));

    // ===== TOP 10 KONTRAGENT =====
    // expand=agent bilan alohida so'rovdan agent.name olish
    const expandedRows = [
      ...expandPaymentinRows,
      ...expandCashinRows,
    ];
    const agentMap: Record<string, number> = {};
    for (const row of expandedRows) {
      const name = row.agent?.name?.trim() || 'Noma\'lum';
      agentMap[name] = (agentMap[name] || 0) + (Number(row.sum) || 0);
    }
    const topCounterparties = Object.entries(agentMap)
      .filter(([name, sum]) => name !== 'Noma\'lum' && sum > 0)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, sum]) => ({
        name,
        sellSum: sum,
        sellCount: expandedRows.filter(r => r.agent?.name?.trim() === name).length,
      }));

    // Xarajatlar hisoblash
    const monthExpenses = sumRows([...monthPaymentoutRows, ...monthCashoutRows]);
    const lastMonthExpenses = sumRows([...lastMonthPaymentoutRows, ...lastMonthCashoutRows]);

    return {
      monthExpenses,
      lastMonthExpenses,
      monthRevenue,
      weekRevenue,
      prevWeekRevenue,
      todayRevenue,
      yesterdayRevenue,
      monthSalesSum,
      monthDemandsCount,
      weekDemandsCount: (weekPaymentin.rows?.length || 0) + (weekCashin.rows?.length || 0),
      monthProfit,
      dailySales,
      topProducts,
      topCounterparties,
    };
    });

    return NextResponse.json(payload, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
