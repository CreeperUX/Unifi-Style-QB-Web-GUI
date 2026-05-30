import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, ComposedChart,
} from 'recharts';
import { useEffect, useRef, useState } from 'react';
import { getGlobalTransferInfo } from '@/lib/qbit-api';
import { formatSpeed, formatBytes, formatRatio, getStateColor } from '@/lib/utils';
import { usePreferencesStore } from '@/stores/preferences';
import type { GlobalTransferInfo, SyncMainDataResponse, AppPreferences } from '@/types/qbit';

interface Props {
  transferInfo: GlobalTransferInfo | undefined;
  mainData: SyncMainDataResponse | undefined;
  preferences: AppPreferences | undefined;
}

interface SpeedPoint {
  time: string;
  dl: number;
  ul: number;
}

export function Dashboard({ transferInfo, mainData, preferences }: Props) {
  const [speedHistory, setSpeedHistory] = useState<SpeedPoint[]>([]);
  const interval = usePreferencesStore((s) => s.refreshInterval);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const torrents = mainData?.torrents ? Object.values(mainData.torrents) : [];

  useEffect(() => {
    const tick = async () => {
      try {
        const info = await getGlobalTransferInfo();
        const now = new Date();
        const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
        setSpeedHistory(prev => {
          const next = [...prev, { time, dl: info.dl_info_speed, ul: info.up_info_speed }];
          return next.length > 90 ? next.slice(-90) : next;
        });
      } catch { /* noop */ }
    };
    tick();
    timerRef.current = setInterval(tick, interval);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [interval]);

  return (
    <div className="space-y-3">
      {/* ====== Traffic Chart Panel ====== */}
      <Panel title="Traffic" subtitle="Real-time transfer speed">
        <div className="h-[220px]">
          {speedHistory.length === 0 ? (
            <EmptyState text="Waiting for traffic data..." />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={speedHistory} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="dlFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14C977" stopOpacity={0.08} />
                    <stop offset="95%" stopColor="#14C977" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ulFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1A6AFF" stopOpacity={0.08} />
                    <stop offset="95%" stopColor="#1A6AFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2630" vertical={false} />
                <XAxis dataKey="time" stroke="#2B3540" tick={{ fontSize: 10, fill: '#5E6B7A' }} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={50} />
                <YAxis stroke="#2B3540" tick={{ fontSize: 10, fill: '#5E6B7A' }} tickLine={false} axisLine={false} tickFormatter={(v: number) => formatSpeed(v)} width={68} />
                <Tooltip
                  contentStyle={{ background:'#11161C', border:'1px solid #2B3540', borderRadius:'6px', fontSize:'11px', color:'#DEE4EC', padding:'6px 10px' }}
                  formatter={(v: number, name: string) => [formatSpeed(v), name === 'dl' ? 'Download' : 'Upload']}
                />
                <Area type="monotone" dataKey="dl" stroke="#14C977" strokeWidth={1} fill="url(#dlFill)" isAnimationActive={false} dot={false} />
                <Area type="monotone" dataKey="ul" stroke="#1A6AFF" strokeWidth={1} fill="url(#ulFill)" isAnimationActive={false} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
        {/* Legend */}
        <div className="flex items-center gap-4 px-4 pb-3 text-[11px] text-text-tertiary">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green" /> Download</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent" /> Upload</span>
        </div>
      </Panel>

      {/* ====== Torrent Table ====== */}
      <Panel title="Torrents" subtitle={`${torrents.length} total`}>
        {torrents.length === 0 ? (
          <EmptyState text="No torrents" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="text-text-tertiary text-[11px] uppercase tracking-wider border-b border-border-subtle">
                  <th className="text-left px-3 py-2 font-medium">Name</th>
                  <th className="text-right px-3 py-2 font-medium">Size</th>
                  <th className="text-right px-3 py-2 font-medium">Progress</th>
                  <th className="text-right px-3 py-2 font-medium">↓</th>
                  <th className="text-right px-3 py-2 font-medium">↑</th>
                  <th className="text-right px-3 py-2 font-medium">Ratio</th>
                  <th className="text-right px-3 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {torrents.slice(0, 15).map(t => (
                  <tr key={t.hash} className="hover:bg-hover-bg transition-colors">
                    <td className="px-3 py-1.5 text-text-primary max-w-64 truncate">{t.name}</td>
                    <td className="px-3 py-1.5 text-text-secondary text-right font-mono tabular-nums">{formatBytes(t.size)}</td>
                    <td className="px-3 py-1.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-1 bg-input-bg rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${t.progress >= 1 ? 'bg-green' : 'bg-accent'}`} style={{ width: `${t.progress * 100}%` }} />
                        </div>
                        <span className="text-text-secondary font-mono text-[11px] tabular-nums w-9 text-right">{(t.progress*100).toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-1.5 text-right font-mono tabular-nums text-[11px]" style={{color: t.dlspeed > 0 ? '#14C977' : '#5E6B7A'}}>{formatSpeed(t.dlspeed)}</td>
                    <td className="px-3 py-1.5 text-right font-mono tabular-nums text-[11px]" style={{color: t.upspeed > 0 ? '#1A6AFF' : '#5E6B7A'}}>{formatSpeed(t.upspeed)}</td>
                    <td className="px-3 py-1.5 text-right font-mono tabular-nums text-text-secondary">{formatRatio(t.ratio)}</td>
                    <td className="px-3 py-1.5 text-right">
                      <StateBadge state={t.state} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {/* ====== Bottom Stats Row ====== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MiniStat label="Downloaded" value={transferInfo ? formatBytes(transferInfo.dl_info_data) : '—'} color="text-green" />
        <MiniStat label="Uploaded" value={transferInfo ? formatBytes(transferInfo.up_info_data) : '—'} color="text-accent" />
        <MiniStat label="Free Disk" value={mainData?.server_state ? formatBytes(mainData.server_state.free_space_on_disk) : '—'} color="text-text-primary" />
        <MiniStat label="Peers" value={String(mainData?.server_state?.total_peer_connections ?? '—')} color="text-text-primary" />
      </div>
    </div>
  );
}

/* Panel wrapper */
function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-panel-bg border border-border-subtle rounded-md overflow-hidden">
      <div className="px-4 py-2 border-b border-border-subtle flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-text-primary">{title}</span>
          {subtitle && <span className="text-[11px] text-text-tertiary">{subtitle}</span>}
        </div>
      </div>
      {children}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center h-[120px] text-text-tertiary text-[12px]">
      {text}
    </div>
  );
}

function StateBadge({ state }: { state: string }) {
  let color = 'text-text-tertiary';
  let label = state;
  if (state.includes('downloading') || state === 'forcedDL' || state === 'metaDL') { color = 'text-accent'; label = 'DL'; }
  else if (state.includes('uploading') || state === 'forcedUP') { color = 'text-green'; label = 'UL'; }
  else if (state.includes('paused')) { label = 'Paused'; }
  else if (state.includes('queued')) { label = 'Queued'; color = 'text-text-secondary'; }
  else if (state.includes('error')) { color = 'text-red'; label = 'Error'; }
  else if (state.includes('stalled')) { color = 'text-yellow'; label = 'Stalled'; }
  return <span className={`text-[11px] font-medium ${color}`}>{label}</span>;
}

function MiniStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-panel-bg border border-border-subtle rounded-md px-3 py-2.5">
      <div className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1">{label}</div>
      <div className={`text-[18px] font-bold font-mono tracking-tight tabular-nums ${color}`}>{value}</div>
    </div>
  );
}
