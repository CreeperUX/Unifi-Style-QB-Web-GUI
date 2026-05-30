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
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <StatCard
          label="Download Speed"
          value={transferInfo ? formatSpeed(transferInfo.dl_info_speed) : '—'}
          subValue={
            transferInfo
              ? `Total: ${formatBytes(transferInfo.dl_info_data)}`
              : undefined
          }
          icon={<Download size={16} />}
        />
        <StatCard
          label="Upload Speed"
          value={transferInfo ? formatSpeed(transferInfo.up_info_speed) : '—'}
          subValue={
            transferInfo
              ? `Total: ${formatBytes(transferInfo.up_info_data)}`
              : undefined
          }
          icon={<Upload size={16} />}
        />
        <StatCard
          label="Active Torrents"
          value={`${activeDownloads + activeUploads}`}
          subValue={`${totalTorrents} total`}
          icon={<Activity size={16} />}
        />
        <StatCard
          label="Disk Space"
          value={freeSpace !== undefined ? formatBytes(freeSpace) : '—'}
          subValue={preferences?.save_path?.split('/').slice(-2).join('/') ?? 'Default path'}
          icon={<HardDrive size={16} />}
        />
        <StatCard
          label="Global Ratio"
          value={serverState ? formatRatio(parseFloat(serverState.global_ratio)) : '—'}
          subValue={
            serverState
              ? `${formatBytes(serverState.alltime_dl)} DL / ${formatBytes(serverState.alltime_ul)} UL`
              : undefined
          }
          icon={<Share2 size={16} />}
        />
      </div>

      {/* Chart + Torrent List */}
      <div className="space-y-4">
        {/* Speed Chart */}
        <SpeedChart />

        {/* Active Torrents Quick List */}
        {torrents.length > 0 && (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <h2 className="text-sm font-semibold text-text">Active Torrents</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-text-tertiary text-xs uppercase tracking-wider">
                    <th className="text-left px-4 py-2 font-medium">Name</th>
                    <th className="text-right px-4 py-2 font-medium">Size</th>
                    <th className="text-right px-4 py-2 font-medium">Progress</th>
                    <th className="text-right px-4 py-2 font-medium">↓ Speed</th>
                    <th className="text-right px-4 py-2 font-medium">↑ Speed</th>
                    <th className="text-right px-4 py-2 font-medium">Ratio</th>
                    <th className="text-right px-4 py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {torrents.slice(0, 10).map((t) => (
                    <tr
                      key={t.hash}
                      className="hover:bg-card-hover transition-colors"
                    >
                      <td className="px-4 py-2.5 text-text max-w-60 truncate" title={t.name}>
                        {t.name}
                      </td>
                      <td className="px-4 py-2.5 text-text-secondary text-right font-mono text-xs">
                        {formatBytes(t.size)}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-20 h-1.5 bg-input rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                t.progress >= 1
                                  ? 'bg-emerald-400'
                                  : 'bg-accent'
                              }`}
                              style={{ width: `${t.progress * 100}%` }}
                            />
                          </div>
                          <span className="text-text-secondary text-xs font-mono w-10 text-right">
                            {(t.progress * 100).toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-xs text-blue-400">
                        {formatSpeed(t.dlspeed)}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-xs text-emerald-400">
                        {formatSpeed(t.upspeed)}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-xs text-text-secondary">
                        {formatRatio(t.ratio)}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <span className={`text-xs font-medium ${
                          t.state.includes('downloading') || t.state.includes('DL') ? 'text-blue-400' :
                          t.state.includes('uploading') || t.state.includes('UP') ? 'text-emerald-400' :
                          t.state.includes('paused') ? 'text-text-tertiary' :
                          t.state.includes('error') ? 'text-danger' :
                          'text-text-secondary'
                        }`}>
                          {t.state}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
