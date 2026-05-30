import { ComposedChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useRef, useState } from 'react';
import { getGlobalTransferInfo } from '@/lib/qbit-api';
import { formatSpeed, formatBytes, formatRatio } from '@/lib/utils';
import { usePreferencesStore } from '@/stores/preferences';
import type { GlobalTransferInfo, SyncMainDataResponse } from '@/types/qbit';

interface Props {
  transferInfo: GlobalTransferInfo | undefined;
  mainData: SyncMainDataResponse | undefined;
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
    <div className="space-y-4">
      {/* Traffic Chart */}
      <Panel title="Traffic" subtitle="Real-time transfer speed">
        {!hasData ? (
          <div className="flex items-center justify-center h-[200px]">
            <div className="text-center">
              <div className="text-3xl mb-3 opacity-30">📊</div>
              <p className="text-text-secondary text-sm">Waiting for traffic data...</p>
            </div>
          </div>
        ) : (
          <div className="p-2">
            <ResponsiveContainer width="100%" height={200}>
              <ComposedChart data={speedHistory} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="dlGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3DD68C" stopOpacity={0.15} /><stop offset="95%" stopColor="#3DD68C" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ulGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#006FFF" stopOpacity={0.15} /><stop offset="95%" stopColor="#006FFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D3139" vertical={false} />
                <XAxis dataKey="time" stroke="#3E434D" tick={{ fontSize: 11, fill: '#6F7483' }} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={50} />
                <YAxis stroke="#3E434D" tick={{ fontSize: 11, fill: '#6F7483' }} tickLine={false} axisLine={false} tickFormatter={(v: number) => formatSpeed(v)} width={72} />
                <Tooltip contentStyle={{ background: '#20232B', border: '1px solid #3E434D', borderRadius: '8px', fontSize: '12px', color: '#E6E8F0', padding: '8px 12px' }} formatter={(v: number, name: string) => [formatSpeed(v), name === 'dl' ? 'Download' : 'Upload']} />
                <Area type="monotone" dataKey="dl" stroke="#3DD68C" strokeWidth={1.5} fill="url(#dlGrad)" isAnimationActive={false} dot={false} />
                <Area type="monotone" dataKey="ul" stroke="#006FFF" strokeWidth={1.5} fill="url(#ulGrad)" isAnimationActive={false} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </Panel>

      {/* Torrents Table */}
      <Panel title="Torrents" subtitle={`${torrents.length} total`}>
        {torrents.length === 0 ? (
          <div className="flex items-center justify-center h-[100px] text-text-secondary text-sm">No torrents</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-text-tertiary text-xs uppercase tracking-wider border-b border-border-subtle bg-root-bg/50">
                  <th className="text-left px-5 py-3 font-semibold">Name</th>
                  <th className="text-right px-4 py-3 font-semibold">Size</th>
                  <th className="text-right px-4 py-3 font-semibold">Progress</th>
                  <th className="text-right px-4 py-3 font-semibold">↓</th>
                  <th className="text-right px-4 py-3 font-semibold">↑</th>
                  <th className="text-right px-4 py-3 font-semibold">Ratio</th>
                  <th className="text-right px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {torrents.slice(0, 15).map(t => (
                  <tr key={t.hash} className="hover:bg-hover-bg transition-colors">
                    <td className="px-5 py-2.5 text-text-primary max-w-96 truncate">{t.name}</td>
                    <td className="px-4 py-2.5 text-text-secondary text-right font-mono tabular-nums">{formatBytes(t.size)}</td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <div className="w-24 h-2 bg-input-bg rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${t.progress >= 1 ? 'bg-success' : 'bg-accent'}`} style={{ width: `${t.progress * 100}%` }} />
                        </div>
                        <span className="text-text-secondary font-mono tabular-nums w-9 text-right">{(t.progress * 100).toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono tabular-nums" style={{ color: t.dlspeed > 0 ? '#3DD68C' : '#6F7483' }}>{formatSpeed(t.dlspeed)}</td>
                    <td className="px-4 py-2.5 text-right font-mono tabular-nums" style={{ color: t.upspeed > 0 ? '#006FFF' : '#6F7483' }}>{formatSpeed(t.upspeed)}</td>
                    <td className="px-4 py-2.5 text-right font-mono tabular-nums text-text-secondary">{formatRatio(t.ratio)}</td>
                    <td className="px-5 py-2.5 text-right"><StateBadge state={t.state} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {/* Bottom Stats */}
      <div className="grid grid-cols-4 gap-3">
        <StatBox label="Downloaded" value={transferInfo ? formatBytes(transferInfo.dl_info_data) : '—'} />
        <StatBox label="Uploaded" value={transferInfo ? formatBytes(transferInfo.up_info_data) : '—'} />
        <StatBox label="Free Disk" value={mainData?.server_state ? formatBytes(mainData.server_state.free_space_on_disk) : '—'} />
        <StatBox label="Peers" value={String(mainData?.server_state?.total_peer_connections ?? '—')} />
      </div>
    </div>
  );
}

function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-panel-bg border border-border-subtle rounded-lg overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
      <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
        <div>
          <h3 className="text-[15px] font-semibold text-text-primary">{title}</h3>
          {subtitle && <p className="text-xs text-text-tertiary mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="p-4">{children}</div>
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

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-panel-bg border border-border-subtle rounded-lg px-5 py-4" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
      <div className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider mb-2">{label}</div>
      <div className="text-xl font-bold font-mono tracking-tight tabular-nums text-text-primary">{value}</div>
    </div>
  );
}
