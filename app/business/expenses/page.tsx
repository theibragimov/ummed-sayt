'use client';
import { useState, useEffect, useCallback } from 'react';
import { CreditCard, Bell, Search, ArrowUpRight, ArrowDownRight, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { SalesAreaChart } from '@/components/SalesChart';
import DonutChart from '@/components/DonutChart';
import DateFilter from '@/components/DateFilter';
import { formatSumShort } from '@/lib/ms-api';
import { expenseRecs, Rec } from '@/lib/recommendations';

interface ExpensesData {
  monthExpenses: number;
  lastMonthExpenses: number;
  dailyExpenses: { date: string; sum: number }[];
  byCategory: { name: string; sum: number }[];
  topPayees: { name: string; sum: number }[];
  creditors: { name: string; balance: number }[];
  totalCredit: number;
  creditorCount: number;
  topCategory: string;
  topCategoryShare: number;
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

export default function ExpensesPage() {
  const [data, setData] = useState<ExpensesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [from, setFrom] = useState(getMonthStart());
  const [to, setTo] = useState(getToday());

  const load = useCallback(async (f: string, t: string) => {
    setLoading(true); setError('');
    try {
      const res = await fetch(`/api/expenses?from=${f}&to=${t}`);
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
  const expChange = pct(data?.monthExpenses ?? 0, data?.lastMonthExpenses ?? 0);

  const recs = data ? expenseRecs({
    monthExpenses: data.monthExpenses,
    lastMonthExpenses: data.lastMonthExpenses,
    monthRevenue: 0,
    topCategory: data.topCategory,
    topCategoryShare: data.topCategoryShare,
    creditorCount: data.creditorCount,
    totalCredit: data.totalCredit,
  }) : [];

  const maxPayee = data?.topPayees[0]?.sum ?? 1;
  const maxCreditor = data?.creditors[0]?.balance ?? 1;

  return (
    <div className="min-h-screen" style={{ background: '#F4F5F9' }}>
      {/* HEADER */}
      <header className="bg-white sticky top-0 z-30 px-4 md:px-8 py-4"
        style={{ borderBottom: '1px solid #EEEEF2', boxShadow: '0 1px 0 rgba(0,0,0,0.04)' }}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-shrink-0">
            <h1 className="text-[15px] font-bold text-gray-900 tracking-tight">Xarajatlar</h1>
            <p className="text-[11px] text-gray-400 mt-0.5 hidden sm:block">
              {now.getDate()} {monthNames[now.getMonth()]} {now.getFullYear()} · Xarajatlar tahlili
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
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
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
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => <div key={i} className="rounded-2xl h-[110px] animate-pulse bg-white" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }} />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="rounded-2xl h-[300px] animate-pulse bg-white" />
              <div className="rounded-2xl h-[300px] animate-pulse bg-white" />
            </div>
          </div>
        ) : data ? (
          <div className="space-y-5">

            {/* ROW 1: STATS */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="col-span-2 lg:col-span-1 rounded-2xl p-5" style={{ background: '#16161E', boxShadow: '0 4px 24px rgba(0,0,0,0.18)' }}>
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Oylik xarajat</p>
                <p className="text-[26px] font-bold text-white mt-2 leading-none">{formatSumShort(data.monthExpenses)} so'm</p>
                <div className={`mt-3 flex items-center gap-1 text-[12px] font-bold ${expChange <= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {expChange <= 0 ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />}
                  {Math.abs(expChange).toFixed(1)}% o'tgan oyga
                </div>
              </div>
              <div className="rounded-2xl p-5 bg-white" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">O'tgan oy</p>
                <p className="text-[22px] font-bold text-gray-900 mt-2 leading-none">{formatSumShort(data.lastMonthExpenses)} so'm</p>
                <p className="text-[12px] text-gray-400 mt-2">Solishtirma</p>
              </div>
              <div className="rounded-2xl p-5 bg-white" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Kreditork. qarzi</p>
                <p className="text-[22px] font-bold text-gray-900 mt-2 leading-none">{formatSumShort(data.totalCredit)} so'm</p>
                <p className="text-[12px] text-gray-400 mt-2">{data.creditorCount} ta kontragent</p>
              </div>
            </div>

            {/* ROW 2: DONUT + DAILY */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Donut chart */}
              <div className="bg-white rounded-2xl p-6" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
                <h3 className="text-[14px] font-bold text-gray-900 mb-4">Xarajatlar tarkibi</h3>
                {data.byCategory.length > 0
                  ? <DonutChart data={data.byCategory} />
                  : <p className="text-[13px] text-gray-400">Ma'lumot yo'q</p>}
              </div>

              {/* Daily line */}
              <div className="bg-white rounded-2xl p-6" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-[14px] font-bold text-gray-900">Kunlik xarajat</h3>
                    <p className="text-[11px] text-gray-400 mt-1">Paymentout + Cashout</p>
                  </div>
                </div>
                <SalesAreaChart data={data.dailyExpenses} />
              </div>
            </div>

            {/* ROW 3: TOP PAYEES + CREDITORS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Top kimga to'langan */}
              <div className="bg-white rounded-2xl p-6" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
                <h3 className="text-[14px] font-bold text-gray-900 mb-4">Top 10 to'lov qilingan</h3>
                <div className="space-y-3">
                  {data.topPayees.map((p, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-[10px] font-bold text-gray-400 w-4 flex-shrink-0">{i + 1}</span>
                          <span className="text-[12px] font-semibold text-gray-700 leading-snug">{p.name}</span>
                        </div>
                        <span className="text-[12px] font-bold text-gray-900 ml-2 flex-shrink-0">{formatSumShort(p.sum)}</span>
                      </div>
                      <div className="ml-6 w-full bg-gray-100 rounded-full h-1">
                        <div className="h-1 rounded-full bg-red-400" style={{ width: `${(p.sum / maxPayee) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                  {data.topPayees.length === 0 && <p className="text-[13px] text-gray-400">Ma'lumot yo'q</p>}
                </div>
              </div>

              {/* Kreditorlar */}
              <div className="rounded-2xl p-6" style={{ background: '#16161E', boxShadow: '0 4px 24px rgba(0,0,0,0.18)' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[14px] font-bold text-white">Kreditor qarzi (top 10)</h3>
                  <span className="text-[11px] font-bold text-red-400">{formatSumShort(data.totalCredit)}</span>
                </div>
                <div className="space-y-3">
                  {data.creditors.map((c, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-[10px] font-bold text-gray-600 w-4 flex-shrink-0">{i + 1}</span>
                          <span className="text-[12px] font-semibold text-gray-300 leading-snug">{c.name}</span>
                        </div>
                        <span className="text-[12px] font-bold text-red-400 ml-2 flex-shrink-0">{formatSumShort(c.balance)}</span>
                      </div>
                      <div className="ml-6 w-full bg-white/5 rounded-full h-1">
                        <div className="h-1 rounded-full bg-red-500" style={{ width: `${(c.balance / maxCreditor) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                  {data.creditors.length === 0 && <p className="text-[12px] text-gray-600">Kreditor qarzi yo'q</p>}
                </div>
              </div>
            </div>

            {/* ROW 4: RECOMMENDATIONS */}
            {recs.length > 0 && (
              <div className="bg-white rounded-2xl p-6" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard size={15} className="text-orange-500" />
                  <h3 className="text-[14px] font-bold text-gray-900">Xarajatlar bo'yicha tavsiyalar</h3>
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
