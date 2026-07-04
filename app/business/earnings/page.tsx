'use client';
import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, Bell, Search, ArrowUpRight, ArrowDownRight, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { SalesAreaChart } from '@/components/SalesChart';
import DateFilter from '@/components/DateFilter';
import { formatSumShort } from '@/lib/ms-api';
import { earningsRecs, Rec } from '@/lib/recommendations';

interface EarningsData {
  monthRevenue: number;
  lastMonthRevenue: number;
  totalProfit: number;
  totalSellSum: number;
  avgMargin: number;
  dailyIncome: { date: string; sum: number }[];
  topIncomeAgents: { name: string; sum: number }[];
  debtors: { name: string; balance: number; salesCount: number }[];
  totalDebt: number;
  debtorCount: number;
  categories: { name: string; sellSum: number; profit: number }[];
  topClientShare: number;
  monthDemandsCount: number;
}

function pct(a: number, b: number) { return b ? ((a - b) / b) * 100 : 0; }
function getMonthStart() { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), 1).toISOString().substring(0, 10); }
function getToday() { return new Date().toISOString().substring(0, 10); }

function RecCard({ rec }: { rec: Rec }) {
  const map = {
    critical: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', icon: AlertCircle, color: '#EF4444' },
    warning: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', icon: AlertTriangle, color: '#F59E0B' },
    positive: { bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', icon: CheckCircle, color: '#10B981' },
    info: { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)', icon: Info, color: '#3B82F6' },
  };
  const s = map[rec.type];
  const Icon = s.icon;
  return (
    <div className="rounded-2xl p-4" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
      <div className="flex items-start gap-3">
        <Icon size={16} style={{ color: s.color, flexShrink: 0, marginTop: 2 }} />
        <div>
          <p className="text-[13px] font-bold text-gray-900 leading-snug">{rec.title}</p>
          <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">{rec.body}</p>
        </div>
      </div>
    </div>
  );
}

export default function EarningsPage() {
  const [data, setData] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [from, setFrom] = useState(getMonthStart());
  const [to, setTo] = useState(getToday());

  const load = useCallback(async (f: string, t: string) => {
    setLoading(true); setError('');
    try {
      const res = await fetch(`/api/earnings?from=${f}&to=${t}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setData(json);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(from, to); }, []);
  function handleFilterChange(f: string, t: string) { setFrom(f); setTo(t); load(f, t); }

  const now = new Date();
  const monthNames = ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr'];

  const revenueChange = pct(data?.monthRevenue ?? 0, data?.lastMonthRevenue ?? 0);

  const recs = data ? earningsRecs({
    monthRevenue: data.monthRevenue,
    lastMonthRevenue: data.lastMonthRevenue,
    monthProfit: data.totalProfit,
    monthSalesSum: data.totalSellSum,
    totalDebt: data.totalDebt,
    topClientShare: data.topClientShare,
    avgMargin: data.avgMargin,
    debtorCount: data.debtorCount,
  }) : [];

  const maxAgent = data?.topIncomeAgents[0]?.sum ?? 1;
  const maxDebtor = data?.debtors[0]?.balance ?? 1;
  const maxCat = data?.categories[0]?.sellSum ?? 1;

  return (
    <div className="min-h-screen" style={{ background: '#F4F5F9' }}>
      {/* HEADER */}
      <header className="bg-white sticky top-0 z-30 px-4 md:px-8 py-4"
        style={{ borderBottom: '1px solid #EEEEF2', boxShadow: '0 1px 0 rgba(0,0,0,0.04)' }}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-shrink-0">
            <h1 className="text-[15px] font-bold text-gray-900 tracking-tight">Daromad</h1>
            <p className="text-[11px] text-gray-400 mt-0.5 hidden sm:block">
              {now.getDate()} {monthNames[now.getMonth()]} {now.getFullYear()} · Daromad tahlili
            </p>
          </div>
          <div className="hidden md:flex flex-1 justify-center max-w-xl">
            <DateFilter from={from} to={to} onChange={handleFilterChange} loading={loading} />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all"><Search size={15} /></button>
            <button className="relative w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all">
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

      <main className="px-4 md:px-8 py-6 max-w-[1400px] mx-auto">
        {error && <div className="mb-5 bg-red-50 border border-red-100 rounded-2xl p-4 text-[13px] text-red-600 font-medium">⚠ {error}</div>}

        {loading && !data ? (
          <div className="space-y-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => <div key={i} className="rounded-2xl h-[110px] animate-pulse bg-white" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }} />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 rounded-2xl h-[300px] animate-pulse bg-white" />
              <div className="rounded-2xl h-[300px] animate-pulse bg-white" />
            </div>
          </div>
        ) : data ? (
          <div className="space-y-5">

            {/* ROW 1: STATS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Oylik tushum */}
              <div className="col-span-2 lg:col-span-1 rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, #FF6B35, #FF4500)', boxShadow: '0 8px 24px rgba(255,107,53,0.35)' }}>
                <p className="text-[11px] font-semibold text-orange-100 uppercase tracking-widest">Oylik tushum</p>
                <p className="text-[26px] font-bold text-white mt-2 leading-none">{formatSumShort(data.monthRevenue)} so'm</p>
                <div className={`mt-3 flex items-center gap-1 text-[12px] font-bold ${revenueChange >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                  {revenueChange >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                  {Math.abs(revenueChange).toFixed(1)}% o'tgan oyga
                </div>
              </div>
              {/* Foyda */}
              <div className="rounded-2xl p-5 bg-white" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Sof foyda</p>
                <p className="text-[22px] font-bold text-gray-900 mt-2 leading-none">{formatSumShort(data.totalProfit)} so'm</p>
                <p className={`mt-2 text-[12px] font-semibold ${data.totalProfit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {data.totalProfit >= 0 ? 'Foyda' : 'Zarar'}
                </p>
              </div>
              {/* Marja */}
              <div className="rounded-2xl p-5 bg-white" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">O'rtacha marja</p>
                <p className="text-[22px] font-bold text-gray-900 mt-2 leading-none">{data.avgMargin.toFixed(1)}%</p>
                <p className={`mt-2 text-[12px] font-semibold ${data.avgMargin >= 20 ? 'text-emerald-600' : data.avgMargin >= 10 ? 'text-amber-500' : 'text-red-500'}`}>
                  {data.avgMargin >= 20 ? "Yaxshi" : data.avgMargin >= 10 ? "O'rtacha" : "Past"}
                </p>
              </div>
              {/* Qarzdorlik */}
              <div className="rounded-2xl p-5" style={{ background: '#16161E', boxShadow: '0 4px 24px rgba(0,0,0,0.18)' }}>
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Debitorlik</p>
                <p className="text-[22px] font-bold text-white mt-2 leading-none">{formatSumShort(data.totalDebt)} so'm</p>
                <p className="text-[12px] text-gray-500 mt-2">{data.debtorCount} ta mijoz</p>
              </div>
            </div>

            {/* ROW 2: CHART + TOP AGENTS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Line chart */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-[14px] font-bold text-gray-900">Kunlik daromad dinamikasi</h3>
                    <p className="text-[11px] text-gray-400 mt-1">Paymentin + Cashin</p>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl" style={{ background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.15)' }}>
                    <span className="text-[11px] font-semibold text-orange-600">{formatSumShort(data.monthRevenue)} so'm</span>
                  </div>
                </div>
                <SalesAreaChart data={data.dailyIncome} />
              </div>

              {/* Top 10 agents */}
              <div className="bg-white rounded-2xl p-6" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
                <h3 className="text-[14px] font-bold text-gray-900 mb-4">Top 10 daromad manbai</h3>
                <div className="space-y-3 overflow-y-auto" style={{ maxHeight: 300 }}>
                  {data.topIncomeAgents.map((a, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-[10px] font-bold text-gray-400 w-4 flex-shrink-0">{i + 1}</span>
                          <span className="text-[12px] font-semibold text-gray-700 leading-snug">{a.name}</span>
                        </div>
                        <span className="text-[12px] font-bold text-gray-900 ml-2 flex-shrink-0">{formatSumShort(a.sum)}</span>
                      </div>
                      <div className="ml-6 w-full bg-gray-100 rounded-full h-1">
                        <div className="h-1 rounded-full" style={{ width: `${(a.sum / maxAgent) * 100}%`, background: 'linear-gradient(90deg,#FF6B35,#FF4500)' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ROW 3: CATEGORIES + DEBTORS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Kategoriyalar */}
              <div className="bg-white rounded-2xl p-6" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
                <h3 className="text-[14px] font-bold text-gray-900 mb-4">Kategoriyalar bo'yicha sotuv</h3>
                <div className="space-y-3">
                  {data.categories.map((c, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[12px] font-semibold text-gray-700">{c.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] text-emerald-600 font-semibold">{formatSumShort(c.profit)}</span>
                          <span className="text-[12px] font-bold text-gray-900">{formatSumShort(c.sellSum)}</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full" style={{ width: `${(c.sellSum / maxCat) * 100}%`, background: 'linear-gradient(90deg,#FF6B35,#FF4500)' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top qarzdorlar */}
              <div className="rounded-2xl p-6" style={{ background: '#16161E', boxShadow: '0 4px 24px rgba(0,0,0,0.18)' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[14px] font-bold text-white">Top 10 qarzdorlar</h3>
                  <span className="text-[11px] font-bold text-orange-400">{formatSumShort(data.totalDebt)} so'm</span>
                </div>
                <div className="space-y-3 overflow-y-auto" style={{ maxHeight: 300 }}>
                  {data.debtors.map((d, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-[10px] font-bold text-gray-600 w-4 flex-shrink-0">{i + 1}</span>
                          <span className="text-[12px] font-semibold text-gray-300 leading-snug">{d.name}</span>
                        </div>
                        <span className="text-[12px] font-bold text-orange-400 ml-2 flex-shrink-0">{formatSumShort(d.balance)}</span>
                      </div>
                      <div className="ml-6 w-full bg-white/5 rounded-full h-1">
                        <div className="h-1 rounded-full bg-orange-500" style={{ width: `${(d.balance / maxDebtor) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                  {data.debtors.length === 0 && <p className="text-[12px] text-gray-600">Qarzdor mijoz yo'q</p>}
                </div>
              </div>
            </div>

            {/* ROW 4: AI RECOMMENDATIONS */}
            {recs.length > 0 && (
              <div className="bg-white rounded-2xl p-6" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={15} className="text-orange-500" />
                  <h3 className="text-[14px] font-bold text-gray-900">Moliyaviy tavsiyalar</h3>
                  <span className="ml-auto px-2.5 py-1 rounded-lg text-[10px] font-bold text-orange-600"
                    style={{ background: 'rgba(255,107,53,0.08)' }}>AI tahlil</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {recs.map((r, i) => <RecCard key={i} rec={r} />)}
                </div>
              </div>
            )}

          </div>
        ) : null}
      </main>
    </div>
  );
}
