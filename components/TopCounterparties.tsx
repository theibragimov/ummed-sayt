import { formatSumShort } from '@/lib/ms-api';
import { Users } from 'lucide-react';

interface Counterparty {
  name: string;
  sellSum: number;
  sellCount: number;
}

export default function TopCounterparties({ list }: { list: Counterparty[] }) {
  const max = Math.max(...list.map(c => c.sellSum), 1);

  return (
    <div className="rounded-2xl p-6" style={{ background: '#16161E', boxShadow: '0 4px 24px rgba(0,0,0,0.18)' }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,107,53,0.15)' }}>
            <Users size={16} className="text-orange-400" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-white">Top 10 Kontragent</h3>
            <p className="text-[11px] text-gray-500 mt-0.5">Haqiqiy to'lovlar</p>
          </div>
        </div>
        <span className="text-[11px] font-medium text-gray-500 px-3 py-1.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.06)' }}>Summa</span>
      </div>

      <div className="space-y-4">
        {list.map((c, i) => (
          <div key={i}>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <span className={`mt-0.5 flex-shrink-0 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center`}
                  style={
                    i === 0 ? { background: '#FF6B35', color: '#fff' } :
                    i === 1 ? { background: '#FF8C5A', color: '#fff' } :
                    i === 2 ? { background: '#FFB08C', color: '#fff' } :
                    { background: 'rgba(255,255,255,0.08)', color: '#6B7280' }
                  }>
                  {i + 1}
                </span>
                <span className="text-[13px] text-gray-200 font-medium leading-snug">{c.name}</span>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="text-[13px] font-bold text-orange-400">{formatSumShort(c.sellSum)}</p>
                <p className="text-[11px] text-gray-600 mt-0.5">{c.sellCount} ta</p>
              </div>
            </div>
            <div className="ml-8 w-full rounded-full h-1" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div
                className="h-1 rounded-full"
                style={{
                  width: `${(c.sellSum / max) * 100}%`,
                  background: i < 3
                    ? 'linear-gradient(90deg, #FF6B35, #FF4500)'
                    : 'rgba(255,107,53,0.3)',
                  transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)'
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
