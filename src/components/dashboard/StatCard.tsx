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
    <div className="bg-card border border-border rounded-lg p-4 hover:border-border-hover transition-colors">
      <div className="flex items-start justify-between mb-2">
        <span className="text-text-tertiary text-xs font-medium uppercase tracking-wider">
          {label}
        </span>
        {icon && (
          <span className="text-text-tertiary">{icon}</span>
        )}
      </div>
      <div className="text-2xl font-semibold text-text font-mono tracking-tight">
        {value}
      </div>
      <div className="flex items-center gap-2 mt-1.5">
        {subValue && (
          <span className="text-text-secondary text-xs">{subValue}</span>
        )}
        {trend && trendValue && (
          <span
            className={`flex items-center gap-0.5 text-xs font-medium ${
              trend === 'up' ? 'text-emerald-400' : 'text-danger'
            }`}
          >
            {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trendValue}
          </span>
        )}
      </div>
    </div>
  );
}
