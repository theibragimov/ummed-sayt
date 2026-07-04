import { NextRequest, NextResponse } from 'next/server';
import { safeFetch, fetchAllRows, msDate, sumRows } from '@/lib/ms-fetch';
import { startOfMonth, endOfMonth } from 'date-fns';
import { getCached } from '@/lib/server-cache';

export async function GET(req: NextRequest) {
  try {
    const cacheKey = `expenses:${req.nextUrl.searchParams.toString()}`;
    const payload = await getCached(cacheKey, 60_000, async () => {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const now = new Date();
    const monthStart = from ? new Date(from) : startOfMonth(now);
    const monthEnd = to ? new Date(to + 'T23:59:59') : endOfMonth(now);
    const lastMonthEnd = new Date(monthStart.getTime() - 1);
    const lastMonthStart = new Date(lastMonthEnd.getFullYear(), lastMonthEnd.getMonth(), 1);

    const outExp = (f: Date, t: Date, type: 'paymentout' | 'cashout') =>
      `/entity/${type}?filter=moment>${msDate(f)};moment<${msDate(t)}&expand=agent,expenseItem`;
    const outSimple = (f: Date, t: Date, type: 'paymentout' | 'cashout') =>
      `/entity/${type}?filter=moment>${msDate(f)};moment<${msDate(t)}`;

    const [
      paymentoutRows,
      cashoutRows,
      lastPaymentoutRows,
      lastCashoutRows,
      counterpartyReport,
    ] = await Promise.all([
      fetchAllRows(outExp(monthStart, monthEnd, 'paymentout')),
      fetchAllRows(outExp(monthStart, monthEnd, 'cashout')),
      fetchAllRows(outSimple(lastMonthStart, lastMonthEnd, 'paymentout')),
      fetchAllRows(outSimple(lastMonthStart, lastMonthEnd, 'cashout')),
      safeFetch(`/report/counterparty?limit=200`),
    ]);

    const allOut = [...paymentoutRows, ...cashoutRows];
    const monthExpenses = sumRows(allOut);
    const lastMonthExpenses = sumRows([...lastPaymentoutRows, ...lastCashoutRows]);

    // Kunlik xarajat
    const dailyMap: Record<string, number> = {};
    allOut.forEach((d: any) => {
      const day = (d.moment || '').substring(0, 10);
      if (day) dailyMap[day] = (dailyMap[day] || 0) + Number(d.sum || 0);
    });
    const dailyExpenses = Object.entries(dailyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, sum]) => ({ date, sum }));

    // Kategoriya bo'yicha (expenseItem)
    const categoryMap: Record<string, number> = {};
    allOut.forEach((r: any) => {
      const cat = r.expenseItem?.name?.trim() || 'Kategoriyasiz';
      categoryMap[cat] = (categoryMap[cat] || 0) + Number(r.sum || 0);
    });
    const byCategory = Object.entries(categoryMap)
      .sort(([, a], [, b]) => b - a)
      .map(([name, sum]) => ({ name, sum }));

    // Agent bo'yicha (kimga to'langan)
    const agentMap: Record<string, number> = {};
    allOut.forEach((r: any) => {
      const name = r.agent?.name?.trim() || "Noma'lum";
      agentMap[name] = (agentMap[name] || 0) + Number(r.sum || 0);
    });
    const topPayees = Object.entries(agentMap)
      .filter(([n]) => n !== "Noma'lum")
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, sum]) => ({ name, sum }));

    // Kreditorlar (biz ularga qarzimiz bor - balance < 0)
    const creditors = (counterpartyReport.rows || [])
      .filter((r: any) => (r.balance || 0) < 0)
      .sort((a: any, b: any) => a.balance - b.balance)
      .slice(0, 10)
      .map((r: any) => ({
        name: r.counterparty?.name || "Noma'lum",
        balance: Math.abs(Number(r.balance) || 0),
      }));

    const totalCredit = creditors.reduce((s: number, c: any) => s + c.balance, 0);
    const topCat = byCategory[0];

    return {
      monthExpenses,
      lastMonthExpenses,
      dailyExpenses,
      byCategory,
      topPayees,
      creditors,
      totalCredit,
      creditorCount: creditors.length,
      topCategory: topCat?.name || '',
      topCategoryShare: monthExpenses > 0 ? (topCat?.sum || 0) / monthExpenses : 0,
    };
    });

    return NextResponse.json(payload, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
