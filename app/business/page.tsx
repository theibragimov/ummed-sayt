'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  Wallet, TrendingUp, ShoppingCart, BarChart3, Package, Bell, Search,
  ArrowUpRight, ArrowDownRight, CreditCard,
} from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import { SalesAreaChart } from '@/components/SalesChart';
import TopProducts from '@/components/TopProducts';
import TopCounterparties from '@/components/TopCounterparties';
import DateFilter from '@/components/DateFilter';
import { formatSumShort } from '@/lib/ms-api';

interface DashboardData {
  monthRevenue: number;
  weekRevenue: number;
  prevWeekRevenue: number;
  todayRevenue: number;
  yesterdayRevenue: number;
  monthSalesSum: number;
  monthDemandsCount: number;
  monthProfit: number;
  monthExpenses: number;
  lastMonthExpenses: number;
  dailySales: { date: string; sum: number }[];
  topProducts: { name: string; sellCount: number; sellSum: number; profit: number }[];
  topCounterparties: { name: string; sellSum: number; sellCount: number }[];
}

function pct(curr: number, prev: number) {
  if (!prev) return 0;
  return ((curr - prev) / prev) * 100;
}
function getMonthStart() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().substring(0, 10);
}
function getToday() {
  return new Date().toISOString().substring(0, 10);
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [from, setFrom] = useState(getMonthStart());
  const [to, setTo] = useState(getToday());

  const load = useCallback(async (f: string, t: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/dashboard?from=${f}&to=${t}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setData(json);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(from, to); }, []);

  function handleFilterChange(f: string, t: string) {
    setFrom(f); setTo(t); load(f, t);
  }

  const now = new Date();
  const monthNames = ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr'];
  const weekChange = pct(data?.weekRevenue ?? 0, data?.prevWeekRevenue ?? 0);
  const dayChange = pct(data?.todayRevenue ?? 0, data?.yesterdayRevenue ?? 0);
  const expenseChange = pct(data?.monthExpenses ?? 0, data?.lastMonthExpenses ?? 0);

  return (
    <div className="min-h-screen" style={{ background: '#F4F5F9' }}>

      {/* ===== HEADER ===== */}
      <header className="bg-white sticky top-0 z-30 px-4 md:px-8 py-4"
        style={{ borderBottom: '1px solid #EEEEF2', boxShadow: '0 1px 0 rgba(0,0,0,0.04)' }}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-shrink-0">
            <h1 className="text-[15px] font-bold text-gray-900 tracking-tight">Savdo Dashboard</h1>
            <p className="text-[11px] text-gray-400 mt-0.5 hidden sm:block">
              {now.getDate()} {monthNames[now.getMonth()]} {now.getFullYear()} · Jonli ma'lumot
            </p>
          </div>

          <div className="hidden md:flex flex-1 justify-center max-w-xl">
            <DateFilter from={from} to={to} onChange={handleFilterChange} loading={loading} />
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
              <Search size={15} />
            </button>
            <button className="relative w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
              <Bell size={15} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-orange-500" />
            </button>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
              style={{ background: 'linear-gradient(135deg, #FF6B35, #FF4500)', boxShadow: '0 4px 12px rgba(255,107,53,0.35)' }}>
              <span className="text-white font-bold text-[11px]">MS</span>
            </div>
          </div>
        </div>

        <div className="md:hidden mt-3">
          <DateFilter from={from} to={to} onChange={handleFilterChange} loading={loading} />
        </div>
      </header>

      {/* ===== CONTENT ===== */}
      <main className="px-4 md:px-8 py-6 max-w-[1400px] mx-auto">

        {error && (
          <div className="mb-5 bg-red-50 border border-red-100 rounded-2xl p-4 text-[13px] text-red-600 font-medium">
            ⚠ {error}
          </div>
        )}

        {/* ===== SKELETON ===== */}
        {loading && !data ? (
          <div className="space-y-5">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="rounded-2xl h-[148px] animate-pulse"
                  style={{ background: i === 0 ? 'rgba(255,107,53,0.2)' : i === 3 ? '#1E1E28' : '#E8E9EF' }} />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 rounded-2xl h-[320px] animate-pulse bg-white" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }} />
              <div className="space-y-4">
                <div className="rounded-2xl h-[148px] animate-pulse" style={{ background: '#1E1E28' }} />
                <div className="rounded-2xl h-[148px] animate-pulse bg-white" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }} />
              </div>
            </div>
          </div>
        ) : data ? (
          <div className="space-y-5">

            {/* ===== ROW 1: STATS ===== */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-3 ml-0.5">
                Tushum — kirim to'lovlar
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <StatsCard
                  title="Oylik tushum"
                  value={formatSumShort(data.monthRevenue) + " so'm"}
                  icon={Wallet}
                  variant="featured"
                  subLabel={`${from} — ${to}`}
                />
                <StatsCard
                  title="Haftalik tushum"
                  value={formatSumShort(data.weekRevenue) + " so'm"}
                  change={weekChange}
                  changeLabel="o'tgan hafta"
                  icon={TrendingUp}
                />
                <StatsCard
                  title="Bugungi tushum"
                  value={formatSumShort(data.todayRevenue) + " so'm"}
                  change={dayChange}
                  changeLabel="kecha"
                  subValue={formatSumShort(data.yesterdayRevenue)}
                  icon={ShoppingCart}
                />
                <StatsCard
                  title="Oy foydasi"
                  value={formatSumShort(data.monthProfit) + " so'm"}
                  icon={BarChart3}
                  variant="dark"
                  subLabel="Sof foyda"
                />
                <StatsCard
                  title="Oylik xarajat"
                  value={formatSumShort(data.monthExpenses) + " so'm"}
                  change={expenseChange}
                  changeLabel="o'tgan oy"
                  icon={CreditCard}
                />
              </div>
            </div>

            {/* ===== ROW 2: CHART + SOTUV ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

              {/* Line Chart */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-[14px] font-bold text-gray-900">Tushum dinamikasi</h3>
                    <p className="text-[11px] text-gray-400 mt-1">Kunlik kirim to'lovlar (paymentin + cashin)</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
                    style={{ background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.15)' }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    <span className="text-[11px] font-semibold text-orange-600">{formatSumShort(data.monthRevenue)} so'm</span>
                  </div>
                </div>
                <SalesAreaChart data={data.dailySales} />
              </div>

              {/* Sotuv panels */}
              <div className="flex flex-col gap-4">
                {/* Dark sotuv card */}
                <div className="rounded-2xl p-6 flex flex-col justify-between flex-1"
                  style={{ background: '#16161E', boxShadow: '0 4px 24px rgba(0,0,0,0.18)', minHeight: 148 }}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Oylik sotuv</span>
                    <Package size={15} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-[28px] font-bold text-white leading-none mt-3">{formatSumShort(data.monthSalesSum)} so'm</p>
                    <p className="text-[11px] text-gray-600 mt-2">{data.monthDemandsCount} ta otgruzka</p>
                    <div className="mt-3 pt-3 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <span className="text-[11px] text-gray-600">O'rtacha</span>
                      <span className="text-[11px] font-bold text-gray-400">
                        {formatSumShort(data.monthDemandsCount ? data.monthSalesSum / data.monthDemandsCount : 0)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tushum / Sotuv */}
                <div className="bg-white rounded-2xl p-6 flex-1" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)', minHeight: 148 }}>
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-4">Tushum / Sotuv</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
                        <span className="text-[12px] text-gray-500 font-medium">Tushum</span>
                      </div>
                      <span className="text-[13px] font-bold text-gray-900">{formatSumShort(data.monthRevenue)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gray-200 flex-shrink-0" />
                        <span className="text-[12px] text-gray-500 font-medium">Sotuv</span>
                      </div>
                      <span className="text-[13px] font-bold text-gray-900">{formatSumShort(data.monthSalesSum)}</span>
                    </div>
                  </div>
                  <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full"
                      style={{
                        width: `${Math.min((data.monthRevenue / (data.monthSalesSum || 1)) * 100, 100)}%`,
                        background: 'linear-gradient(90deg, #FF6B35, #FF4500)',
                        transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)'
                      }} />
                  </div>
                  <div className={`mt-3 flex items-center gap-1.5 text-[12px] font-bold ${data.monthRevenue >= data.monthSalesSum ? 'text-emerald-600' : 'text-red-500'}`}>
                    {data.monthRevenue >= data.monthSalesSum
                      ? <ArrowUpRight size={14} />
                      : <ArrowDownRight size={14} />}
                    {data.monthRevenue >= data.monthSalesSum ? 'Ortiqcha tushum' : 'Qarzga sotuv'}
                    <span className="text-gray-400 font-normal text-[11px] ml-0.5">
                      {formatSumShort(Math.abs(data.monthRevenue - data.monthSalesSum))}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== ROW 3: TOP TABLES ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <TopProducts products={data.topProducts} />
              <TopCounterparties list={data.topCounterparties} />
            </div>

          </div>
        ) : null}
      </main>
    </div>
  );
}
