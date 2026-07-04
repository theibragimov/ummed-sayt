'use client';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatSumShort } from '@/lib/ms-api';

const COLORS = [
  '#FF6B35', '#FF4500', '#3B82F6', '#10B981', '#8B5CF6',
  '#F59E0B', '#EC4899', '#06B6D4', '#84CC16', '#F97316',
];

interface DonutData { name: string; sum: number }

interface Props { data: DonutData[]; title?: string }

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="px-3 py-2 rounded-xl text-[12px] font-semibold shadow-xl"
      style={{ background: '#16161E', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}>
      <p style={{ color: d.payload.fill }}>{d.name}</p>
      <p className="text-white mt-0.5">{formatSumShort(d.value)} so'm</p>
      <p className="text-gray-500">{((d.payload.percent || 0) * 100).toFixed(1)}%</p>
    </div>
  );
}

export default function DonutChart({ data, title }: Props) {
  const total = data.reduce((s, d) => s + d.sum, 0);
  const chartData = data.map((d, i) => ({
    ...d,
    value: d.sum,
    fill: COLORS[i % COLORS.length],
    percent: total > 0 ? d.sum / total : 0,
  }));

  return (
    <div>
      {title && <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">{title}</p>}
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={100}
            paddingAngle={2} dataKey="value">
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => (
              <span style={{ color: '#9CA3AF', fontSize: 11, fontWeight: 600 }}>
                {value.length > 22 ? value.substring(0, 22) + '…' : value}
              </span>
            )}
            iconSize={8} iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
