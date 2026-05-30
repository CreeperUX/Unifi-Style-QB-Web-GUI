import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  trend?: 'up' | 'down';
  trendValue?: string;
  icon?: React.ReactNode;
}

export function StatCard({ label, value, subValue, trend, trendValue, icon }: StatCardProps) {
  return (
    <div className="bg-card border border-border-subtle rounded-lg p-5 hover:border-border-default transition-all duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
      {/* Top row: label + icon */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-text-tertiary text-[10px] font-semibold uppercase tracking-[0.08em]">
          {label}
        </span>
        {icon && (
          <span className="text-text-tertiary">{icon}</span>
        )}
      </div>

      {/* Main value */}
      <div className="text-[28px] font-bold text-text font-mono tracking-tight leading-none mb-2">
        {value}
      </div>

      {/* Bottom row: subValue + trend */}
      <div className="flex items-center gap-2 min-h-[18px]">
        {subValue && (
          <span className="text-text-secondary text-[12px] leading-tight">{subValue}</span>
        )}
        {trend && trendValue && (
          <span
            className={`flex items-center gap-0.5 text-[12px] font-semibold ${
              trend === 'up' ? 'text-emerald-400' : 'text-danger'
            }`}
          >
            {trend === 'up' ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {trendValue}
          </span>
        )}
      </div>
    </div>
  );
}
