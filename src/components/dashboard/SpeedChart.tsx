import { useEffect, useRef, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getGlobalTransferInfo } from '@/lib/qbit-api';
import { formatSpeed } from '@/lib/utils';
import { usePreferencesStore } from '@/stores/preferences';

interface SpeedDataPoint {
  time: string;
  download: number;
  upload: number;
}

const MAX_POINTS = 60; // ~2 min at 2s intervals

export function SpeedChart() {
  const [data, setData] = useState<SpeedDataPoint[]>([]);
  const interval = usePreferencesStore((s) => s.refreshInterval);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    const fetchSpeed = async () => {
      try {
        const info = await getGlobalTransferInfo();
        const now = new Date();
        const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

        setData((prev) => {
          const next = [
            ...prev,
            {
              time,
              download: info.dl_info_speed,
              upload: info.up_info_speed,
            },
          ];
          if (next.length > MAX_POINTS) {
            return next.slice(next.length - MAX_POINTS);
          }
          return next;
        });
      } catch {
        // silently ignore fetch errors (e.g., not logged in)
        if (timerRef.current) clearInterval(timerRef.current);
      }
    };

    fetchSpeed();
    timerRef.current = setInterval(fetchSpeed, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [interval]);

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h2 className="text-sm font-semibold text-text mb-4">Throughput</h2>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-text-tertiary text-sm">
          Waiting for data...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="dlGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14C977" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#14C977" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="ulGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1A6AFF" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#1A6AFF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#30363D" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#6E7681"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="#6E7681"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => formatSpeed(v)}
              width={70}
            />
            <Tooltip
              contentStyle={{
                background: '#161B22',
                border: '1px solid #30363D',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#E6EDF3',
              }}
              formatter={(value: number, name: string) => [
                formatSpeed(value),
                name === 'download' ? 'Download' : 'Upload',
              ]}
              labelFormatter={(label: string) => `Time: ${label}`}
            />
            <Area
              type="monotone"
              dataKey="download"
              stroke="#14C977"
              strokeWidth={1.5}
              fill="url(#dlGradient)"
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="upload"
              stroke="#1A6AFF"
              strokeWidth={1.5}
              fill="url(#ulGradient)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
      {/* Legend */}
      {data.length > 0 && (
        <div className="flex items-center gap-6 mt-3 text-xs text-text-secondary">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            Download
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-accent" />
            Upload
          </span>
        </div>
      )}
    </div>
  );
}
