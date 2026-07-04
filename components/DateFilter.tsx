'use client';
import { useState } from 'react';
import { Calendar, Loader2 } from 'lucide-react';

interface Props {
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
  loading?: boolean;
}

const presets = [
  { label: 'Bu oy', value: 'month' },
  { label: '7 kun', value: '7' },
  { label: '30 kun', value: '30' },
  { label: '90 kun', value: '90' },
];

export default function DateFilter({ from, to, onChange, loading }: Props) {
  const [active, setActive] = useState('Bu oy');

  function applyPreset(value: string, label: string) {
    setActive(label);
    const now = new Date();
    const toStr = now.toISOString().substring(0, 10);
    if (value === 'month') {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      onChange(start.toISOString().substring(0, 10), toStr);
    } else {
      const days = parseInt(value);
      const start = new Date(now.getTime() - days * 86400000);
      onChange(start.toISOString().substring(0, 10), toStr);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {presets.map(p => (
        <button
          key={p.label}
          onClick={() => applyPreset(p.value, p.label)}
          className="px-3.5 py-1.5 rounded-xl text-[12px] font-semibold transition-all duration-200"
          style={active === p.label ? {
            background: 'linear-gradient(135deg, #FF6B35, #FF4500)',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(255,107,53,0.35)',
          } : {
            background: '#fff',
            color: '#6B7280',
            border: '1px solid #F1F2F6',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          {p.label}
        </button>
      ))}

      <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-1.5"
        style={{ border: '1px solid #F1F2F6', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <Calendar size={13} className="text-gray-400 flex-shrink-0" />
        <input
          type="date"
          value={from}
          onChange={e => { setActive(''); onChange(e.target.value, to); }}
          className="text-[12px] font-medium text-gray-700 outline-none bg-transparent w-[110px]"
        />
        <span className="text-gray-300 text-xs">—</span>
        <input
          type="date"
          value={to}
          onChange={e => { setActive(''); onChange(from, e.target.value); }}
          className="text-[12px] font-medium text-gray-700 outline-none bg-transparent w-[110px]"
        />
      </div>

      {loading && (
        <div className="flex items-center gap-1.5 text-[12px] font-medium text-orange-500">
          <Loader2 size={13} className="animate-spin" />
          Yangilanmoqda...
        </div>
      )}
    </div>
  );
}
