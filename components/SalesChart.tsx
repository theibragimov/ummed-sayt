'use client';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { formatSumShort } from '@/lib/ms-api';

interface DailySale { date: string; sum: number; }

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload?.length) {
    return (
      <div className="rounded-2xl px-4 py-3 border"
        style={{ background: '#16161E', borderColor: 'rgba(255,255,255,0.08)', boxShadow: '0 16px 32px rgba(0,0,0,0.3)' }}>
        <p className="text-[11px] text-gray-500 mb-1 font-medium">{label}</p>
        <p className="text-sm font-bold text-orange-400">{formatSumShort(payload[0].value)} so'm</p>
      </div>
    );
  }
  return null;
}

export function SalesAreaChart({ data }: { data: DailySale[] }) {
  const chartData = data.map(d => ({
    date: d.date.substring(5),
    sum: d.sum,
  }));

  return (
    <ResponsiveContainer width="100%" height={230}>
      <AreaChart data={chartData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF6B35" stopOpacity={0.18} />
            <stop offset="100%" stopColor="#FF6B35" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="0" stroke="#F1F2F6" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: '#B0B3C0', fontFamily: 'Plus Jakarta Sans' }}
          axisLine={false}
          tickLine={false}
          tickMargin={10}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#B0B3C0', fontFamily: 'Plus Jakarta Sans' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={v => formatSumShort(v)}
          width={58}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#FF6B35', strokeWidth: 1, strokeDasharray: '4 4' }} />
        <Area
          type="monotone"
          dataKey="sum"
          stroke="#FF6B35"
          strokeWidth={2.5}
          fill="url(#lineGrad)"
          dot={false}
          activeDot={{ r: 5, fill: '#FF6B35', stroke: '#fff', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// SalesBarChart ham export qilinadi (ishlatilmasa ham)
export function SalesBarChart({ data }: { data: DailySale[] }) {
  return <SalesAreaChart data={data} />;
}
