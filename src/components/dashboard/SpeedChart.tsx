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

const MAX_POINTS = 60;

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
          const next = [...prev, { time, download: info.dl_info_speed, upload: info.up_info_speed }];
          return next.length > MAX_POINTS ? next.slice(next.length - MAX_POINTS) : next;
        });
      } catch {
        if (timerRef.current) clearInterval(timerRef.current);
      }
    };
    fetchSpeed();
    timerRef.current = setInterval(fetchSpeed, interval);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [interval]);

  const hasData = data.length > 0;

  return (
    <div className="bg-card border border-border-subtle rounded-lg overflow-hidden h-full">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-border-subtle flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-text">Throughput</h3>
          <p className="text-text-tertiary text-[12px] mt-0.5">
            {hasData ? 'Real-time transfer speed' : 'Waiting for data…'}
          </p>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-4 text-[12px] text-text-secondary">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Download
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent" />
            Upload
          </span>
        </div>
      </div>

      {/* Chart body */}
      <div className="px-2 py-3">
        {!hasData ? (
          <div className="flex flex-col items-center justify-center h-[200px] text-text-tertiary">
            <div className="text-3xl mb-3 opacity-30">📊</div>
            <p className="text-[13px]">No transfer data yet</p>
            <p className="text-[11px] mt-1 opacity-70">Data will appear once connected to qBittorrent</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="dlGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14C977" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#14C977" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ulGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1A6AFF" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1A6AFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#21262D" vertical={false} />
              <XAxis
                dataKey="time"
                stroke="#484F58"
                tick={{ fontSize: 10, fill: '#6E7681' }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                minTickGap={40}
              />
              <YAxis
                stroke="#484F58"
                tick={{ fontSize: 10, fill: '#6E7681' }}
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
                  padding: '8px 12px',
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
                fill="url(#dlGrad)"
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="upload"
                stroke="#1A6AFF"
                strokeWidth={1.5}
                fill="url(#ulGrad)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
