import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  variant?: 'default' | 'featured' | 'dark';
  subValue?: string;
  subLabel?: string;
}

export default function StatsCard({
  title, value, change, changeLabel, icon: Icon, variant = 'default', subValue, subLabel,
}: StatsCardProps) {
  const isPositive = (change ?? 0) >= 0;

  if (variant === 'featured') {
    return (
      <div className="relative overflow-hidden rounded-2xl p-6 flex flex-col justify-between min-h-[148px]"
        style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF4500 100%)', boxShadow: '0 20px 40px -12px rgba(255,107,53,0.45)' }}>
        <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/10" />
        <div className="absolute -right-2 -bottom-8 w-20 h-20 rounded-full bg-white/10" />
        <div className="flex items-center justify-between relative z-10">
          <span className="text-[11px] font-semibold text-orange-100 uppercase tracking-widest">{title}</span>
          <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Icon size={15} className="text-white" />
          </div>
        </div>
        <div className="relative z-10">
          <p className="text-[28px] font-bold text-white leading-none mt-3">{value}</p>
          {subLabel && <p className="text-[11px] text-orange-200 mt-2 font-medium">{subLabel}</p>}
        </div>
      </div>
    );
  }

  if (variant === 'dark') {
    return (
      <div className="rounded-2xl p-6 flex flex-col justify-between min-h-[148px]"
        style={{ background: '#16161E', boxShadow: '0 4px 24px rgba(0,0,0,0.18)' }}>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">{title}</span>
          <div className="w-8 h-8 rounded-xl bg-white/8 flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <Icon size={15} className="text-gray-400" />
          </div>
        </div>
        <div>
          <p className="text-[28px] font-bold text-white leading-none mt-3">{value}</p>
          {change !== undefined && (
            <div className="flex items-center gap-2 mt-2">
              <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                isPositive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
              }`}>
                {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {isPositive ? '+' : ''}{change.toFixed(1)}%
              </span>
              {changeLabel && <span className="text-[11px] text-gray-600">{changeLabel}</span>}
            </div>
          )}
          {subLabel && <p className="text-[11px] text-gray-600 mt-2 font-medium">{subLabel}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 flex flex-col justify-between min-h-[148px]"
      style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">{title}</span>
        <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
          <Icon size={15} className="text-gray-400" />
        </div>
      </div>
      <div>
        <p className="text-[28px] font-bold text-gray-900 leading-none mt-3">{value}</p>
        {change !== undefined && (
          <div className="flex items-center gap-2 mt-2">
            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
              isPositive
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-red-50 text-red-500'
            }`}>
              {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {isPositive ? '+' : ''}{change.toFixed(1)}%
            </span>
            {changeLabel && <span className="text-[11px] text-gray-400">{changeLabel}</span>}
            {subValue && <span className="text-[11px] font-semibold text-gray-500">{subValue}</span>}
          </div>
        )}
        {subLabel && !change && <p className="text-[11px] text-gray-400 mt-2">{subLabel}</p>}
      </div>
    </div>
  );
}
