import { Download, HardDrive, Activity, Upload, Share2 } from 'lucide-react';
import { StatCard } from './StatCard';
import { SpeedChart } from './SpeedChart';
import { useMainData, useTransferInfo, useAppPreferences } from '@/hooks/use-qbit';
import { formatBytes, formatSpeed, formatRatio } from '@/lib/utils';

export function Dashboard() {
  const { data: mainData } = useMainData();
  const { data: transferInfo } = useTransferInfo();
  const { data: preferences } = useAppPreferences();

  const serverState = mainData?.server_state;
  const torrents = mainData?.torrents ? Object.values(mainData.torrents) : [];

  const activeDownloads = torrents.filter(
    (t) => t.state === 'downloading' || t.state === 'forcedDL' || t.state === 'metaDL',
  ).length;
  const activeUploads = torrents.filter(
    (t) => t.state === 'uploading' || t.state === 'forcedUP',
  ).length;
  const totalTorrents = torrents.length;
  const freeSpace = serverState?.free_space_on_disk;

  return (
    <div className="max-w-[1440px] mx-auto space-y-6">
      {/* Page header */}
      <div>
        <h2 className="text-xl font-semibold text-text">Overview</h2>
        <p className="text-text-tertiary text-[13px] mt-0.5">Real-time torrent and transfer statistics</p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Download Speed"
          value={transferInfo ? formatSpeed(transferInfo.dl_info_speed) : '—'}
          subValue={transferInfo ? `Total ${formatBytes(transferInfo.dl_info_data)}` : undefined}
          icon={<Download size={18} />}
        />
        <StatCard
          label="Upload Speed"
          value={transferInfo ? formatSpeed(transferInfo.up_info_speed) : '—'}
          subValue={transferInfo ? `Total ${formatBytes(transferInfo.up_info_data)}` : undefined}
          icon={<Upload size={18} />}
        />
        <StatCard
          label="Active Torrents"
          value={`${activeDownloads + activeUploads}`}
          subValue={`${totalTorrents} total · ${activeDownloads} DL / ${activeUploads} UL`}
          icon={<Activity size={18} />}
        />
        <StatCard
          label="Free Disk Space"
          value={freeSpace !== undefined ? formatBytes(freeSpace) : '—'}
          subValue={preferences?.save_path ?? 'Default path'}
          icon={<HardDrive size={18} />}
        />
      </div>

      {/* Second row: chart + more cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Speed Chart - takes 2/3 width */}
        <div className="lg:col-span-2">
          <SpeedChart />
        </div>

        {/* Side stats */}
        <div className="space-y-4">
          <StatCard
            label="Global Ratio"
            value={serverState ? formatRatio(parseFloat(serverState.global_ratio)) : '—'}
            subValue={serverState ? `${formatBytes(serverState.alltime_dl)} / ${formatBytes(serverState.alltime_ul)}` : undefined}
            icon={<Share2 size={18} />}
          />
          <StatCard
            label="DHT Nodes"
            value={serverState ? String(serverState.dht_nodes) : '—'}
            subValue="Distributed hash table"
          />
        </div>
      </div>

      {/* Active Torrents Quick List */}
      {torrents.length > 0 && (
        <div className="bg-card border border-border-subtle rounded-lg overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border-subtle flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-text">Active Torrents</h3>
              <p className="text-text-tertiary text-[12px] mt-0.5">
                {totalTorrents} torrent{totalTorrents !== 1 ? 's' : ''} total
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-text-tertiary text-[11px] uppercase tracking-wider bg-sidebar">
                  <th className="text-left px-5 py-2.5 font-semibold">Name</th>
                  <th className="text-right px-4 py-2.5 font-semibold">Size</th>
                  <th className="text-right px-4 py-2.5 font-semibold">Progress</th>
                  <th className="text-right px-4 py-2.5 font-semibold">Download</th>
                  <th className="text-right px-4 py-2.5 font-semibold">Upload</th>
                  <th className="text-right px-4 py-2.5 font-semibold">Ratio</th>
                  <th className="text-right px-5 py-2.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {torrents.slice(0, 10).map((t) => (
                  <tr key={t.hash} className="hover:bg-card-hover transition-colors">
                    <td className="px-5 py-2.5 text-text max-w-72 truncate font-medium" title={t.name}>
                      {t.name}
                    </td>
                    <td className="px-4 py-2.5 text-text-secondary text-right font-mono text-[12px] tabular-nums">
                      {formatBytes(t.size)}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <div className="w-24 h-1.5 bg-input rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              t.progress >= 1 ? 'bg-emerald-400' : 'bg-accent'
                            }`}
                            style={{ width: `${Math.min(t.progress * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-text-secondary text-[12px] font-mono tabular-nums w-10 text-right">
                          {(t.progress * 100).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-[12px] tabular-nums text-blue-400">
                      {formatSpeed(t.dlspeed)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-[12px] tabular-nums text-emerald-400">
                      {formatSpeed(t.upspeed)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-[12px] tabular-nums text-text-secondary">
                      {formatRatio(t.ratio)}
                    </td>
                    <td className="px-5 py-2.5 text-right">
                      <StateBadge state={t.state} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function StateBadge({ state }: { state: string }) {
  let color = 'text-text-tertiary';
  let bg = 'bg-card';
  let label = state;
  if (state.includes('downloading') || state.includes('DL') || state === 'metaDL' || state === 'forcedDL') {
    color = 'text-blue-400'; bg = 'bg-blue-500/10'; label = state === 'metaDL' ? 'Metadata' : 'Downloading';
  } else if (state.includes('uploading') || state === 'forcedUP') {
    color = 'text-emerald-400'; bg = 'bg-emerald-400/10'; label = 'Seeding';
  } else if (state.includes('paused')) {
    color = 'text-text-tertiary'; label = 'Paused';
  } else if (state.includes('error') || state.includes('missing')) {
    color = 'text-danger'; bg = 'bg-red-400/10'; label = 'Error';
  } else if (state.includes('queued')) {
    color = 'text-text-secondary'; label = 'Queued';
  } else if (state.includes('stalled')) {
    color = 'text-amber-500'; label = 'Stalled';
  } else if (state.includes('checking') || state.includes('moving') || state.includes('allocating')) {
    color = 'text-amber-500'; bg = 'bg-amber-500/10'; label = state.charAt(0).toUpperCase() + state.slice(1);
  }
  return (
    <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${color} ${bg}`}>
      {label}
    </span>
  );
}
