import { formatSumShort } from '@/lib/ms-api';
import { Package } from 'lucide-react';

interface Product {
  name: string;
  sellCount: number;
  sellSum: number;
  profit: number;
}

export default function TopProducts({ products }: { products: Product[] }) {
  const max = Math.max(...products.map(p => p.sellSum), 1);

  return (
    <div className="bg-white rounded-2xl p-6" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(255,107,53,0.1)' }}>
            <Package size={16} className="text-orange-500" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-gray-900">Top 10 Mahsulot</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Sotuv summasi bo'yicha</p>
          </div>
        </div>
        <span className="text-[11px] font-medium text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl">Summa</span>
      </div>

      <div className="space-y-4">
        {products.map((p, i) => (
          <div key={i}>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <span className={`mt-0.5 flex-shrink-0 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ${
                  i === 0 ? 'bg-[#FF6B35] text-white' :
                  i === 1 ? 'text-white' :
                  i === 2 ? 'text-white' :
                  'bg-gray-100 text-gray-400'
                }`}
                style={i === 1 ? { background: '#FF8C5A' } : i === 2 ? { background: '#FFB08C' } : {}}>
                  {i + 1}
                </span>
                <span className="text-[13px] text-gray-700 font-medium leading-snug">{p.name}</span>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="text-[13px] font-bold text-gray-900">{formatSumShort(p.sellSum)}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{p.sellCount} dona</p>
              </div>
            </div>
            <div className="ml-8 w-full bg-gray-100 rounded-full h-1">
              <div
                className="h-1 rounded-full"
                style={{
                  width: `${(p.sellSum / max) * 100}%`,
                  background: i < 3
                    ? 'linear-gradient(90deg, #FF6B35, #FF4500)'
                    : '#E5E7EB',
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
