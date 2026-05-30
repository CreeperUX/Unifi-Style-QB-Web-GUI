import { Wifi, HardDrive, Dices, Upload, Download, Globe } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { getGlobalTransferInfo } from '@/lib/qbit-api';
import { formatBytes, formatSpeed, formatRatio } from '@/lib/utils';
import { usePreferencesStore } from '@/stores/preferences';
import type { GlobalTransferInfo, SyncMainDataResponse } from '@/types/qbit';

interface Props {
  transferInfo: GlobalTransferInfo | undefined;
  mainData: SyncMainDataResponse | undefined;
}

const BUILD = 'v4';

export function StatusSidebar({ transferInfo, mainData }: Props) {
  const ss = mainData?.server_state;
  const torrents = mainData?.torrents ? Object.values(mainData.torrents) : [];
  const dls = torrents.filter(t => t.state.includes('downloading') || t.state === 'metaDL' || t.state === 'forcedDL').length;
  const uls = torrents.filter(t => t.state.includes('uploading') || t.state === 'forcedUP').length;
  const paused = torrents.filter(t => t.state.includes('paused') || t.state.includes('queued')).length;
  const connected = transferInfo?.connection_status === 'connected';

  const [miniHistory, setMiniHistory] = useState<{ t: number; dl: number; ul: number }[]>([]);
  const interval = usePreferencesStore(s => s.refreshInterval);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  useEffect(() => {
    const tick = async () => {
      try {
        const info = await getGlobalTransferInfo();
        setMiniHistory(prev => {
          const next = [...prev, { t: Date.now(), dl: info.dl_info_speed, ul: info.up_info_speed }];
          return next.length > 40 ? next.slice(-40) : next;
        });
      } catch { /* noop */ }
    };
    tick();
    timerRef.current = setInterval(tick, interval);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [interval]);

  const rows = [
    { icon: <Globe size={16} />, label: 'Status', value: <span className={connected ? 'text-success font-semibold' : 'text-warning font-semibold'}>{connected ? 'Connected' : 'Firewalled'}</span> },
    { label: 'DHT Nodes', value: <span className="text-text-primary font-mono font-medium">{ss?.dht_nodes ?? '—'}</span> },
  ];

  return (
    <aside className="w-[300px] bg-panel-bg border-r border-border flex-shrink-0 overflow-y-auto">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 border-b border-border-subtle">
        <span className="text-xs text-text-tertiary font-mono">Status</span>
        <span className="text-[10px] text-text-tertiary ml-2 font-mono opacity-50">{BUILD}</span>
      </div>

      {/* Connection */}
      <div className="px-5 pt-4 pb-3 border-b border-border-subtle">
        {rows.map((r, i) => (
          <div key={i} className="flex items-center justify-between py-1">
            <span className="flex items-center gap-2.5 text-text-secondary text-sm">
              {r.icon}{r.label}
            </span>
            <span className="text-sm">{r.value}</span>
          </div>
        ))}
      </div>

      {/* Throughput */}
      <div className="px-5 pt-4 pb-3 border-b border-border-subtle">
        <div className="flex items-center justify-between py-1">
          <span className="flex items-center gap-2.5 text-text-secondary text-sm">
            <Download size={16} className="text-success" />Download
          </span>
          <span className="text-success font-mono font-semibold text-sm tabular-nums">
            {transferInfo ? formatSpeed(transferInfo.dl_info_speed) : '—'}
          </span>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="flex items-center gap-2.5 text-text-secondary text-sm">
            <Upload size={16} className="text-accent" />Upload
          </span>
          <span className="text-accent font-mono font-semibold text-sm tabular-nums">
            {transferInfo ? formatSpeed(transferInfo.up_info_speed) : '—'}
          </span>
        </div>
        {miniHistory.length > 2 && (
          <div className="mt-2 h-[48px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={miniHistory} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="miniDl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#33CA5E" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#33CA5E" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="miniUl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#006FFF" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#006FFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="dl" stroke="#33CA5E" strokeWidth={1} fill="url(#miniDl)" isAnimationActive={false} dot={false} />
                <Area type="monotone" dataKey="ul" stroke="#006FFF" strokeWidth={1} fill="url(#miniUl)" isAnimationActive={false} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Session Totals */}
      <div className="px-5 pt-4 pb-3 border-b border-border-subtle">
        <div className="flex items-center justify-between py-1">
          <span className="text-text-secondary text-sm">Downloaded</span>
          <span className="text-text-primary font-mono tabular-nums text-sm">{transferInfo ? formatBytes(transferInfo.dl_info_data) : '—'}</span>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-text-secondary text-sm">Uploaded</span>
          <span className="text-text-primary font-mono tabular-nums text-sm">{transferInfo ? formatBytes(transferInfo.up_info_data) : '—'}</span>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-text-secondary text-sm">Ratio</span>
          <span className="text-text-primary font-mono tabular-nums text-sm font-medium">{ss ? formatRatio(parseFloat(ss.global_ratio)) : '—'}</span>
        </div>
      </div>

      {/* Torrents */}
      <div className="px-5 pt-4 pb-3 border-b border-border-subtle">
        <div className="flex items-center justify-between py-1">
          <span className="text-text-secondary text-sm">Downloading</span>
          <span className="text-accent font-mono tabular-nums text-sm font-semibold">{dls}</span>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-text-secondary text-sm">Seeding</span>
          <span className="text-success font-mono tabular-nums text-sm font-semibold">{uls}</span>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-text-secondary text-sm">Paused / Queued</span>
          <span className="text-text-secondary font-mono tabular-nums text-sm">{paused}</span>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-text-secondary text-sm">Total</span>
          <span className="text-text-primary font-mono tabular-nums text-sm font-bold">{torrents.length}</span>
        </div>
      </div>

      {/* Storage */}
      <div className="px-5 pt-4 pb-3 border-b border-border-subtle">
        <div className="flex items-center justify-between py-1">
          <span className="flex items-center gap-2.5 text-text-secondary text-sm">
            <HardDrive size={16} />Free
          </span>
          <span className="text-text-primary font-mono tabular-nums text-sm font-medium">
            {ss?.free_space_on_disk ? formatBytes(ss.free_space_on_disk) : '—'}
          </span>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-text-secondary text-sm">All-time DL</span>
          <span className="text-text-tertiary font-mono tabular-nums text-xs">{ss ? formatBytes(ss.alltime_dl) : '—'}</span>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-text-secondary text-sm">All-time UL</span>
          <span className="text-text-tertiary font-mono tabular-nums text-xs">{ss ? formatBytes(ss.alltime_ul) : '—'}</span>
        </div>
      </div>

      {/* Health */}
      <div className="px-5 pt-4 pb-5">
        <div className="flex items-center justify-between py-1">
          <span className="flex items-center gap-2.5 text-text-secondary text-sm">
            <Wifi size={16} />Peers
          </span>
          <span className="text-text-primary font-mono tabular-nums text-sm">{ss?.total_peer_connections ?? '—'}</span>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="flex items-center gap-2.5 text-text-secondary text-sm">
            <Dices size={16} />Queued I/O
          </span>
          <span className="text-text-primary font-mono tabular-nums text-sm">{ss?.queued_io_jobs ?? '—'}</span>
        </div>
      </div>
    </aside>
  );
}
