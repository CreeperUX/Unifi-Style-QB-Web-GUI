import { ComposedChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useRef, useState } from 'react';
import { getGlobalTransferInfo } from '@/lib/qbit-api';
import { formatSpeed, formatBytes, formatRatio } from '@/lib/utils';
import { usePreferencesStore } from '@/stores/preferences';
import type { GlobalTransferInfo, SyncMainDataResponse, AppPreferences } from '@/types/qbit';

interface Props {
  transferInfo: GlobalTransferInfo | undefined;
  mainData: SyncMainDataResponse | undefined;
  preferences: AppPreferences | undefined;
}

export function Dashboard({ transferInfo, mainData }: Props) {
  const [speedHistory, setSpeedHistory] = useState<{ time: string; dl: number; ul: number }[]>([]);
  const interval = usePreferencesStore(s => s.refreshInterval);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const torrents = mainData?.torrents ? Object.values(mainData.torrents) : [];

  useEffect(() => {
    const tick = async () => {
      try {
        const info = await getGlobalTransferInfo();
        const now = new Date();
        const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
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

  const hasData = speedHistory.length > 0;

  return (
    <div className="space-y-3">
      {/* ====== Traffic Chart ====== */}
      <div className="bg-card-bg border border-border-subtle rounded-md overflow-hidden">
        <div className="px-5 py-3 border-b border-border-subtle flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Traffic</h3>
            <p className="text-xs text-text-tertiary mt-0.5">Real-time transfer speed</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-text-secondary">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-success" /> Download</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent" /> Upload</span>
          </div>
        </div>
        <div className="p-4">
          {!hasData ? (
            <div className="flex items-center justify-center h-[180px] text-text-tertiary">
              <div className="text-center">
                <div className="text-2xl mb-2 opacity-40">📊</div>
                <p className="text-sm">Waiting for traffic data...</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <ComposedChart data={speedHistory} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="dlFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#33CA5E" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#33CA5E" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ulFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#006FFF" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#006FFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2C2C30" vertical={false} />
                <XAxis dataKey="time" stroke="#3A3A3F" tick={{ fontSize: 11, fill: '#686B75' }} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={50} />
                <YAxis stroke="#3A3A3F" tick={{ fontSize: 11, fill: '#686B75' }} tickLine={false} axisLine={false} tickFormatter={(v: number) => formatSpeed(v)} width={72} />
                <Tooltip contentStyle={{ background: '#1E1E21', border: '1px solid #3A3A3F', borderRadius: '6px', fontSize: '12px', color: '#D6D7DC', padding: '8px 12px' }} formatter={(v: number, name: string) => [formatSpeed(v), name === 'dl' ? 'Download' : 'Upload']} />
                <Area type="monotone" dataKey="dl" stroke="#33CA5E" strokeWidth={1.5} fill="url(#dlFill)" isAnimationActive={false} dot={false} />
                <Area type="monotone" dataKey="ul" stroke="#006FFF" strokeWidth={1.5} fill="url(#ulFill)" isAnimationActive={false} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ====== Torrents Table ====== */}
      <div className="bg-card-bg border border-border-subtle rounded-md overflow-hidden">
        <div className="px-5 py-3 border-b border-border-subtle flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Torrents</h3>
            <p className="text-xs text-text-tertiary mt-0.5">{torrents.length} total</p>
          </div>
        </div>
        {torrents.length === 0 ? (
          <div className="flex items-center justify-center h-[100px] text-text-tertiary">
            <p className="text-sm">No torrents</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-text-tertiary text-[11px] uppercase tracking-wider border-b border-border-subtle bg-root-bg">
                  <th className="text-left px-4 py-2.5 font-semibold">Name</th>
                  <th className="text-right px-3 py-2.5 font-semibold">Size</th>
                  <th className="text-right px-3 py-2.5 font-semibold">Progress</th>
                  <th className="text-right px-3 py-2.5 font-semibold">↓</th>
                  <th className="text-right px-3 py-2.5 font-semibold">↑</th>
                  <th className="text-right px-3 py-2.5 font-semibold">Ratio</th>
                  <th className="text-right px-4 py-2.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {torrents.slice(0, 15).map(t => (
                  <tr key={t.hash} className="hover:bg-hover-bg transition-colors">
                    <td className="px-4 py-2 text-text-primary max-w-80 truncate">{t.name}</td>
                    <td className="px-3 py-2 text-text-secondary text-right font-mono tabular-nums text-xs">{formatBytes(t.size)}</td>
                    <td className="px-3 py-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-20 h-1.5 bg-input-bg rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${t.progress >= 1 ? 'bg-success' : 'bg-accent'}`} style={{ width: `${t.progress * 100}%` }} />
                        </div>
                        <span className="text-text-secondary font-mono tabular-nums text-xs w-9 text-right">{(t.progress * 100).toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right font-mono tabular-nums text-xs" style={{ color: t.dlspeed > 0 ? '#33CA5E' : '#686B75' }}>{formatSpeed(t.dlspeed)}</td>
                    <td className="px-3 py-2 text-right font-mono tabular-nums text-xs" style={{ color: t.upspeed > 0 ? '#006FFF' : '#686B75' }}>{formatSpeed(t.upspeed)}</td>
                    <td className="px-3 py-2 text-right font-mono tabular-nums text-text-secondary text-xs">{formatRatio(t.ratio)}</td>
                    <td className="px-4 py-2 text-right"><StateBadge state={t.state} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ====== Bottom Stats ====== */}
      <div className="grid grid-cols-4 gap-3">
        <BottomStat label="Downloaded" value={transferInfo ? formatBytes(transferInfo.dl_info_data) : '—'} />
        <BottomStat label="Uploaded" value={transferInfo ? formatBytes(transferInfo.up_info_data) : '—'} />
        <BottomStat label="Free Disk" value={mainData?.server_state ? formatBytes(mainData.server_state.free_space_on_disk) : '—'} />
        <BottomStat label="Peers" value={String(mainData?.server_state?.total_peer_connections ?? '—')} />
      </div>
    </div>
  );
}

function StateBadge({ state }: { state: string }) {
  let color = 'text-text-tertiary', label = state;
  if (state.includes('downloading') || state === 'forcedDL' || state === 'metaDL') { color = 'text-accent'; label = 'DL'; }
  else if (state.includes('uploading') || state === 'forcedUP') { color = 'text-success'; label = 'UL'; }
  else if (state.includes('paused')) { label = 'Paused'; }
  else if (state.includes('queued')) { label = 'Queued'; }
  else if (state.includes('error')) { color = 'text-danger'; label = 'Error'; }
  else if (state.includes('stalled')) { color = 'text-warning'; label = 'Stalled'; }
  return <span className={`text-xs font-semibold ${color}`}>{label}</span>;
}

function BottomStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card-bg border border-border-subtle rounded-md px-4 py-3">
      <div className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">{label}</div>
      <div className="text-lg font-bold font-mono tracking-tight tabular-nums text-text-primary">{value}</div>
    </div>
  );
}
