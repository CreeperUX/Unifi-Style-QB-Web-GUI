import { Wifi, HardDrive, Dices, Upload, Download, Globe } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { getGlobalTransferInfo } from '@/lib/qbit-api';
import { formatBytes, formatSpeed, formatRatio } from '@/lib/utils';
import { usePreferencesStore } from '@/stores/preferences';
import type { GlobalTransferInfo, SyncMainDataResponse, AppPreferences } from '@/types/qbit';

interface Props {
  transferInfo: GlobalTransferInfo | undefined;
  mainData: SyncMainDataResponse | undefined;
  preferences: AppPreferences | undefined;
}

export function StatusSidebar({ transferInfo, mainData }: Props) {
  const ss = mainData?.server_state;
  const torrents = mainData?.torrents ? Object.values(mainData.torrents) : [];
  const dls = torrents.filter(t => t.state.includes('downloading') || t.state === 'metaDL' || t.state === 'forcedDL').length;
  const uls = torrents.filter(t => t.state.includes('uploading') || t.state === 'forcedUP').length;
  const paused = torrents.filter(t => t.state.includes('paused') || t.state.includes('queued')).length;
  const connected = transferInfo?.connection_status === 'connected';

  // Mini throughput history
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

  return (
    <aside className="w-[290px] bg-panel-bg border-r border-border-subtle overflow-y-auto flex-shrink-0 p-4 space-y-4">
      
      <Section title="Connection">
        <Row icon={<Globe size={15} />} label="Status">
          <span className={`text-sm font-semibold ${connected ? 'text-success' : 'text-warning'}`}>
            {connected ? 'Connected' : 'Firewalled'}
          </span>
        </Row>
        <Row label="DHT Nodes">
          <span className="text-text-primary font-mono tabular-nums text-sm font-medium">{ss?.dht_nodes ?? '—'}</span>
        </Row>
      </Section>

      <Section title="Throughput">
        <Row icon={<Download size={15} className="text-success" />} label="Download">
          <span className="text-success font-mono tabular-nums text-sm font-semibold">
            {transferInfo ? formatSpeed(transferInfo.dl_info_speed) : '—'}
          </span>
        </Row>
        <Row icon={<Upload size={15} className="text-accent" />} label="Upload">
          <span className="text-accent font-mono tabular-nums text-sm font-semibold">
            {transferInfo ? formatSpeed(transferInfo.up_info_speed) : '—'}
          </span>
        </Row>
        {/* Mini throughput sparkline */}
        {miniHistory.length > 2 && (
          <div className="mt-2 h-[50px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={miniHistory} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="miniDl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#33CA5E" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#33CA5E" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="miniUl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#006FFF" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#006FFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="dl" stroke="#33CA5E" strokeWidth={1} fill="url(#miniDl)" isAnimationActive={false} dot={false} />
                <Area type="monotone" dataKey="ul" stroke="#006FFF" strokeWidth={1} fill="url(#miniUl)" isAnimationActive={false} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </Section>

      <Section title="Session">
        <Row label="Downloaded">
          <span className="text-text-primary font-mono tabular-nums text-sm">{transferInfo ? formatBytes(transferInfo.dl_info_data) : '—'}</span>
        </Row>
        <Row label="Uploaded">
          <span className="text-text-primary font-mono tabular-nums text-sm">{transferInfo ? formatBytes(transferInfo.up_info_data) : '—'}</span>
        </Row>
        <Row label="Ratio">
          <span className="text-text-primary font-mono tabular-nums text-sm font-medium">{ss ? formatRatio(parseFloat(ss.global_ratio)) : '—'}</span>
        </Row>
      </Section>

      <Section title="Torrents">
        <Row label="Downloading">
          <span className="text-accent font-mono tabular-nums text-sm font-semibold">{dls}</span>
        </Row>
        <Row label="Seeding">
          <span className="text-success font-mono tabular-nums text-sm font-semibold">{uls}</span>
        </Row>
        <Row label="Paused / Queued">
          <span className="text-text-secondary font-mono tabular-nums text-sm">{paused}</span>
        </Row>
        <Row label="Total">
          <span className="text-text-primary font-mono tabular-nums text-sm font-bold">{torrents.length}</span>
        </Row>
      </Section>

      <Section title="Storage">
        <Row icon={<HardDrive size={15} />} label="Free">
          <span className="text-text-primary font-mono tabular-nums text-sm font-medium">
            {ss?.free_space_on_disk ? formatBytes(ss.free_space_on_disk) : '—'}
          </span>
        </Row>
        <Row label="All-time DL">
          <span className="text-text-secondary font-mono tabular-nums text-xs">{ss ? formatBytes(ss.alltime_dl) : '—'}</span>
        </Row>
        <Row label="All-time UL">
          <span className="text-text-secondary font-mono tabular-nums text-xs">{ss ? formatBytes(ss.alltime_ul) : '—'}</span>
        </Row>
      </Section>

      <Section title="Health">
        <Row icon={<Wifi size={15} />} label="Peers">
          <span className="text-text-primary font-mono tabular-nums text-sm">{ss?.total_peer_connections ?? '—'}</span>
        </Row>
        <Row icon={<Dices size={15} />} label="Queued I/O">
          <span className="text-text-primary font-mono tabular-nums text-sm">{ss?.queued_io_jobs ?? '—'}</span>
        </Row>
      </Section>
    </aside>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider mb-3 px-1">
        {title}
      </div>
      <div className="space-y-[2px]">
        {children}
      </div>
    </div>
  );
}

function Row({ icon, label, children }: { icon?: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-2 py-1 rounded hover:bg-hover-bg transition-colors">
      <span className="flex items-center gap-2 text-text-secondary text-[13px] min-w-0 truncate pr-3">
        {icon}
        <span className="truncate">{label}</span>
      </span>
      <span className="flex-shrink-0 text-right pr-0.5">
        {children}
      </span>
    </div>
  );
}
