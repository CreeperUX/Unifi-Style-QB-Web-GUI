import { Wifi, HardDrive, Dices, Upload, Download, Globe } from 'lucide-react';
import type { GlobalTransferInfo, SyncMainDataResponse, AppPreferences } from '@/types/qbit';
import { formatBytes, formatSpeed, formatRatio } from '@/lib/utils';

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

  return (
    <aside className="w-[280px] bg-panel-bg border-r border-border-subtle overflow-y-auto flex-shrink-0 p-4 space-y-4">
      
      <Section title="Connection">
        <Row icon={<Globe size={14} />} label="Status">
          <span className={`text-sm font-semibold ${connected ? 'text-success' : 'text-warning'}`}>
            {connected ? 'Connected' : 'Firewalled'}
          </span>
        </Row>
        <Row label="DHT Nodes">
          <span className="text-text-primary font-mono tabular-nums font-medium">{ss?.dht_nodes ?? '—'}</span>
        </Row>
      </Section>

      <Section title="Throughput">
        <Row icon={<Download size={14} className="text-success" />} label="Download">
          <span className="text-success font-mono tabular-nums font-semibold">
            {transferInfo ? formatSpeed(transferInfo.dl_info_speed) : '—'}
          </span>
        </Row>
        <Row icon={<Upload size={14} className="text-accent" />} label="Upload">
          <span className="text-accent font-mono tabular-nums font-semibold">
            {transferInfo ? formatSpeed(transferInfo.up_info_speed) : '—'}
          </span>
        </Row>
      </Section>

      <Section title="Session">
        <Row label="Downloaded">
          <span className="text-text-primary font-mono tabular-nums">{transferInfo ? formatBytes(transferInfo.dl_info_data) : '—'}</span>
        </Row>
        <Row label="Uploaded">
          <span className="text-text-primary font-mono tabular-nums">{transferInfo ? formatBytes(transferInfo.up_info_data) : '—'}</span>
        </Row>
        <Row label="Ratio">
          <span className="text-text-primary font-mono tabular-nums font-medium">{ss ? formatRatio(parseFloat(ss.global_ratio)) : '—'}</span>
        </Row>
      </Section>

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

      <Section title="Storage">
        <Row icon={<HardDrive size={14} />} label="Free">
          <span className="text-text-primary font-mono tabular-nums font-medium">
            {ss?.free_space_on_disk ? formatBytes(ss.free_space_on_disk) : '—'}
          </span>
        </Row>
        <Row label="All-time DL">
          <span className="text-text-secondary font-mono text-xs tabular-nums">{ss ? formatBytes(ss.alltime_dl) : '—'}</span>
        </Row>
        <Row label="All-time UL">
          <span className="text-text-secondary font-mono text-xs tabular-nums">{ss ? formatBytes(ss.alltime_ul) : '—'}</span>
        </Row>
      </Section>

      <Section title="Health">
        <Row icon={<Wifi size={14} />} label="Peers">
          <span className="text-text-primary font-mono tabular-nums">{ss?.total_peer_connections ?? '—'}</span>
        </Row>
        <Row icon={<Dices size={14} />} label="Queued I/O">
          <span className="text-text-primary font-mono tabular-nums">{ss?.queued_io_jobs ?? '—'}</span>
        </Row>
      </Section>
    </aside>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider mb-2.5 px-1">
        {title}
      </div>
      <div className="space-y-0.5">
        {children}
      </div>
    </div>
  );
}

function Row({ icon, label, children }: { icon?: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-1.5 py-1 rounded hover:bg-hover-bg transition-colors">
      <span className="flex items-center gap-2 text-text-secondary text-[13px] min-w-0 truncate">
        {icon}
        <span className="truncate">{label}</span>
      </span>
      <span className="flex-shrink-0 ml-2 text-right text-[13px]">
        {children}
      </span>
    </div>
  );
}
