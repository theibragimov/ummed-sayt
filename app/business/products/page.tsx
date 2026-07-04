'use client';
import { useState, useEffect, useCallback } from 'react';
import { Package, Bell, Search, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import DateFilter from '@/components/DateFilter';
import { formatSumShort } from '@/lib/ms-api';
import { productRecs, Rec } from '@/lib/recommendations';

interface Product {
  name: string;
  sellCount: number;
  sellSum: number;
  profit: number;
  margin: number;
  abcClass?: 'A' | 'B' | 'C';
  costSum?: number;
}

interface Category {
  name: string;
  sellSum: number;
  profit: number;
  sellCount: number;
  margin: number;
}

interface ProductsData {
  allProducts: Product[];
  top10BySales: Product[];
  top10ByMargin: Product[];
  categories: Category[];
  avgMargin: number;
  totalSellSum: number;
  totalProfit: number;
  totalCount: number;
  aClassCount: number;
  bClassCount: number;
  cClassCount: number;
  aClassShare: number;
  topMarginProduct: string;
  topMargin: number;
  lowMarginCount: number;
}

function pct(a: number, b: number) { return b ? ((a - b) / b) * 100 : 0; }
function getMonthStart() { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), 1).toISOString().substring(0, 10); }
function getToday() { return new Date().toISOString().substring(0, 10); }

function AbcBadge({ cls }: { cls: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    A: { bg: 'rgba(16,185,129,0.12)', color: '#10B981' },
    B: { bg: 'rgba(245,158,11,0.12)', color: '#F59E0B' },
    C: { bg: 'rgba(156,163,175,0.15)', color: '#9CA3AF' },
  };
  const s = map[cls] || map.C;
  return (
    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0"
      style={{ background: s.bg, color: s.color }}>{cls}</span>
  );
}

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

export default function ProductsPage() {
  const [data, setData] = useState<ProductsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [from, setFrom] = useState(getMonthStart());
  const [to, setTo] = useState(getToday());
  const [activeTab, setActiveTab] = useState<'sales' | 'margin' | 'abc'>('sales');

  const load = useCallback(async (f: string, t: string) => {
    setLoading(true); setError('');
    try {
      const res = await fetch(`/api/products-report?from=${f}&to=${t}`);
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

  const recs = data ? productRecs({
    aClassCount: data.aClassCount,
    bClassCount: data.bClassCount,
    cClassCount: data.cClassCount,
    aClassShare: data.aClassShare,
    topMarginProduct: data.topMarginProduct,
    topMargin: data.topMargin,
    lowMarginCount: data.lowMarginCount,
  }) : [];

  const maxSale = data?.top10BySales[0]?.sellSum ?? 1;
  const maxMargin = data?.top10ByMargin[0]?.margin ?? 1;

  const tabs = [
    { key: 'sales', label: 'Top sotuv' },
    { key: 'margin', label: 'Top marja' },
    { key: 'abc', label: 'ABC tahlil' },
  ] as const;

  return (
    <div className="min-h-screen" style={{ background: '#F4F5F9' }}>
      {/* HEADER */}
      <header className="bg-white sticky top-0 z-30 px-4 md:px-8 py-4"
        style={{ borderBottom: '1px solid #EEEEF2', boxShadow: '0 1px 0 rgba(0,0,0,0.04)' }}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-shrink-0">
            <h1 className="text-[15px] font-bold text-gray-900 tracking-tight">Mahsulotlar</h1>
            <p className="text-[11px] text-gray-400 mt-0.5 hidden sm:block">
              {now.getDate()} {monthNames[now.getMonth()]} {now.getFullYear()} · Mahsulot tahlili
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => <div key={i} className="rounded-2xl h-[100px] animate-pulse bg-white" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }} />)}
            </div>
            <div className="rounded-2xl h-[400px] animate-pulse bg-white" />
          </div>
        ) : data ? (
          <div className="space-y-5">

            {/* ROW 1: STATS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, #FF6B35, #FF4500)', boxShadow: '0 8px 24px rgba(255,107,53,0.3)' }}>
                <p className="text-[11px] font-semibold text-orange-100 uppercase tracking-widest">Jami sotuv</p>
                <p className="text-[22px] font-bold text-white mt-2 leading-none">{formatSumShort(data.totalSellSum)} so'm</p>
                <p className="text-[11px] text-orange-200 mt-1">{data.totalCount} ta mahsulot</p>
              </div>
              <div className="rounded-2xl p-5 bg-white" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Jami foyda</p>
                <p className="text-[22px] font-bold text-gray-900 mt-2 leading-none">{formatSumShort(data.totalProfit)} so'm</p>
                <p className={`text-[11px] mt-1 font-semibold ${data.totalProfit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {data.avgMargin.toFixed(1)}% marja
                </p>
              </div>
              <div className="rounded-2xl p-5 bg-white" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">ABC — A sinf</p>
                <p className="text-[22px] font-bold text-gray-900 mt-2 leading-none">{data.aClassCount} ta</p>
                <p className="text-[11px] text-emerald-600 mt-1 font-semibold">{(data.aClassShare * 100).toFixed(0)}% daromad</p>
              </div>
              <div className="rounded-2xl p-5" style={{ background: '#16161E', boxShadow: '0 4px 24px rgba(0,0,0,0.18)' }}>
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">Past marja</p>
                <p className="text-[22px] font-bold text-white mt-2 leading-none">{data.lowMarginCount} ta</p>
                <p className="text-[11px] text-red-400 mt-1">10% dan past</p>
              </div>
            </div>

            {/* ROW 2: TABS — top 10 */}
            <div className="bg-white rounded-2xl p-6" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
              {/* Tab buttons */}
              <div className="flex items-center gap-1 mb-5 p-1 rounded-xl w-fit" style={{ background: '#F4F5F9' }}>
                {tabs.map(t => (
                  <button key={t.key} onClick={() => setActiveTab(t.key)}
                    className="px-4 py-2 rounded-xl text-[12px] font-bold transition-all"
                    style={activeTab === t.key
                      ? { background: 'linear-gradient(135deg,#FF6B35,#FF4500)', color: '#fff', boxShadow: '0 4px 12px rgba(255,107,53,0.3)' }
                      : { color: '#9CA3AF' }}>
                    {t.label}
                  </button>
                ))}
              </div>

              {activeTab === 'sales' && (
                <div>
                  <h3 className="text-[14px] font-bold text-gray-900 mb-4">Top 10 — sotuv summasi bo'yicha</h3>
                  <div className="space-y-3">
                    {data.top10BySales.map((p, i) => (
                      <div key={i}>
                        <div className="flex items-start justify-between mb-1 gap-3">
                          <div className="flex items-start gap-2 min-w-0">
                            <span className="text-[10px] font-bold text-gray-400 w-4 flex-shrink-0 mt-0.5">{i + 1}</span>
                            {p.abcClass && <AbcBadge cls={p.abcClass} />}
                            <span className="text-[12px] font-semibold text-gray-700 leading-snug">{p.name}</span>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-[12px] font-bold text-gray-900">{formatSumShort(p.sellSum)}</p>
                            <p className="text-[10px] text-gray-400">{p.sellCount} dona</p>
                          </div>
                        </div>
                        <div className="ml-6 w-full bg-gray-100 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full" style={{ width: `${(p.sellSum / maxSale) * 100}%`, background: 'linear-gradient(90deg,#FF6B35,#FF4500)' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'margin' && (
                <div>
                  <h3 className="text-[14px] font-bold text-gray-900 mb-4">Top 10 — marja bo'yicha (min 3 dona)</h3>
                  <div className="space-y-3">
                    {data.top10ByMargin.map((p, i) => (
                      <div key={i}>
                        <div className="flex items-start justify-between mb-1 gap-3">
                          <div className="flex items-start gap-2 min-w-0">
                            <span className="text-[10px] font-bold text-gray-400 w-4 flex-shrink-0 mt-0.5">{i + 1}</span>
                            <span className="text-[12px] font-semibold text-gray-700 leading-snug">{p.name}</span>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-[12px] font-bold text-emerald-600">{p.margin.toFixed(1)}%</p>
                            <p className="text-[10px] text-gray-400">{formatSumShort(p.profit)}</p>
                          </div>
                        </div>
                        <div className="ml-6 w-full bg-gray-100 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full bg-emerald-400" style={{ width: `${(p.margin / maxMargin) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                    {data.top10ByMargin.length === 0 && <p className="text-[13px] text-gray-400">Ma'lumot yo'q</p>}
                  </div>
                </div>
              )}

              {activeTab === 'abc' && (
                <div>
                  <h3 className="text-[14px] font-bold text-gray-900 mb-2">ABC tahlil</h3>
                  <p className="text-[12px] text-gray-400 mb-4">A=80%, B=15%, C=5% daromad ulushi bo'yicha</p>
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {[
                      { cls: 'A', count: data.aClassCount, desc: `${(data.aClassShare * 100).toFixed(0)}% daromad`, color: '#10B981', bg: 'rgba(16,185,129,0.08)' },
                      { cls: 'B', count: data.bClassCount, desc: "O'rta daromad", color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
                      { cls: 'C', count: data.cClassCount, desc: 'Past daromad', color: '#9CA3AF', bg: 'rgba(156,163,175,0.1)' },
                    ].map(s => (
                      <div key={s.cls} className="rounded-xl p-4 text-center" style={{ background: s.bg }}>
                        <p className="text-[22px] font-bold" style={{ color: s.color }}>{s.cls}</p>
                        <p className="text-[18px] font-bold text-gray-900 mt-1">{s.count}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                  {/* ABC product list */}
                  <div className="space-y-2 overflow-y-auto" style={{ maxHeight: 400 }}>
                    {data.allProducts.map((p, i) => (
                      <div key={i} className="flex items-start gap-3 py-2 px-1" style={{ borderBottom: '1px solid #F0F0F0' }}>
                        <span className="text-[10px] font-bold text-gray-300 w-5 flex-shrink-0 mt-0.5">{i + 1}</span>
                        {p.abcClass && <AbcBadge cls={p.abcClass} />}
                        <span className="text-[12px] text-gray-700 font-medium flex-1 leading-snug">{p.name}</span>
                        <div className="text-right flex-shrink-0">
                          <p className="text-[11px] font-bold text-gray-900">{formatSumShort(p.sellSum)}</p>
                          <p className="text-[10px] text-gray-400">{p.margin.toFixed(0)}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ROW 3: CATEGORIES */}
            <div className="bg-white rounded-2xl p-6" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
              <h3 className="text-[14px] font-bold text-gray-900 mb-4">Kategoriyalar bo'yicha sotuv</h3>
              <div className="space-y-4">
                {data.categories.slice(0, 8).map((cat, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[13px] font-bold text-gray-900">{cat.name}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-[11px] text-emerald-600 font-semibold">{cat.margin.toFixed(1)}% marja</span>
                        <span className="text-[13px] font-bold text-gray-900">{formatSumShort(cat.sellSum)}</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full" style={{ width: `${(cat.sellSum / (data.categories[0]?.sellSum || 1)) * 100}%`, background: 'linear-gradient(90deg,#FF6B35,#FF4500)' }} />
                    </div>
                  </div>
                ))}
                {data.categories.length === 0 && <p className="text-[13px] text-gray-400">Kategoriya ma'lumotlari yo'q</p>}
              </div>
            </div>

            {/* ROW 4: RECOMMENDATIONS */}
            {recs.length > 0 && (
              <div className="bg-white rounded-2xl p-6" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <Package size={15} className="text-orange-500" />
                  <h3 className="text-[14px] font-bold text-gray-900">Mahsulot tavsiyalari</h3>
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
