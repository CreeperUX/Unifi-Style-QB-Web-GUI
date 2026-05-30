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

  return (
    <aside className="w-[300px] bg-sidebar-bg border-r border-border flex-shrink-0 overflow-y-auto">
      {/* Connection */}
      <Section title="Connection">
        <Row icon={<Globe size={16} />} label="Status">
          <span className={`text-[15px] font-semibold ${connected ? 'text-success' : 'text-warning'}`}>
            {connected ? 'Connected' : 'Firewalled'}
          </span>
        </Row>
        <Row label="DHT Nodes">
          <span className="text-text-primary font-mono font-medium">{ss?.dht_nodes ?? '—'}</span>
        </Row>
      </Section>

      {/* Throughput */}
      <Section title="Throughput">
        <Row icon={<Download size={16} className="text-success" />} label="Download">
          <span className="text-success font-mono font-semibold tabular-nums">
            {transferInfo ? formatSpeed(transferInfo.dl_info_speed) : '—'}
          </span>
        </Row>
        <Row icon={<Upload size={16} className="text-accent" />} label="Upload">
          <span className="text-accent font-mono font-semibold tabular-nums">
            {transferInfo ? formatSpeed(transferInfo.up_info_speed) : '—'}
          </span>
        </Row>
        {miniHistory.length > 2 && (
          <div className="mt-3 mb-1 h-[50px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={miniHistory} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="mDl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3DD68C" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3DD68C" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="mUl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#006FFF" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#006FFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="dl" stroke="#3DD68C" strokeWidth={1} fill="url(#mDl)" isAnimationActive={false} dot={false} />
                <Area type="monotone" dataKey="ul" stroke="#006FFF" strokeWidth={1} fill="url(#mUl)" isAnimationActive={false} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </Section>

      {/* Session */}
      <Section title="Session">
        <Row label="Downloaded">
          <span className="text-text-primary font-mono tabular-nums">{transferInfo ? formatBytes(transferInfo.dl_info_data) : '—'}</span>
        </Row>
        <Row label="Uploaded">
          <span className="text-text-primary font-mono tabular-nums">{transferInfo ? formatBytes(transferInfo.up_info_data) : '—'}</span>
        </Row>
        <Row label="Ratio">
          <span className="text-text-primary font-mono tabular-nums font-semibold">{ss ? formatRatio(parseFloat(ss.global_ratio)) : '—'}</span>
        </Row>
      </Section>

      {/* Torrents */}
      <Section title="Torrents">
        <Row label="Downloading">
          <span className="text-accent font-mono tabular-nums font-semibold">{dls}</span>
        </Row>
        <Row label="Seeding">
          <span className="text-success font-mono tabular-nums font-semibold">{uls}</span>
        </Row>
        <Row label="Paused / Queued">
          <span className="text-text-secondary font-mono tabular-nums">{paused}</span>
        </Row>
        <Row label="Total">
          <span className="text-text-primary font-mono tabular-nums font-bold">{torrents.length}</span>
        </Row>
      </Section>

      {/* Storage */}
      <Section title="Storage">
        <Row icon={<HardDrive size={16} />} label="Free Space">
          <span className="text-text-primary font-mono tabular-nums font-semibold">
            {ss?.free_space_on_disk ? formatBytes(ss.free_space_on_disk) : '—'}
          </span>
        </Row>
        <Row label="All-time DL">
          <span className="text-text-tertiary font-mono tabular-nums text-[13px]">{ss ? formatBytes(ss.alltime_dl) : '—'}</span>
        </Row>
        <Row label="All-time UL">
          <span className="text-text-tertiary font-mono tabular-nums text-[13px]">{ss ? formatBytes(ss.alltime_ul) : '—'}</span>
        </Row>
      </Section>

      {/* Health */}
      <Section title="Health">
        <Row icon={<Wifi size={16} />} label="Peers">
          <span className="text-text-primary font-mono tabular-nums">{ss?.total_peer_connections ?? '—'}</span>
        </Row>
        <Row icon={<Dices size={16} />} label="Queued I/O">
          <span className="text-text-primary font-mono tabular-nums">{ss?.queued_io_jobs ?? '—'}</span>
        </Row>
      </Section>
    </aside>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-5 pt-5 pb-4 border-b border-border-subtle">
      <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">{title}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Row({ icon, label, children }: { icon?: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="flex items-center gap-2.5 text-text-secondary text-sm min-w-0 truncate pr-2">
        {icon}
        <span className="truncate">{label}</span>
      </span>
      <span className="flex-shrink-0 text-right text-sm">{children}</span>
    </div>
  );
}
