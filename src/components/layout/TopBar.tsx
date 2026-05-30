import { Bell, Wifi, Zap } from 'lucide-react';
import type { GlobalTransferInfo } from '@/types/qbit';

interface TopBarProps {
  transferInfo: GlobalTransferInfo | undefined;
}

export function TopBar({ transferInfo }: TopBarProps) {
  const connected = transferInfo?.connection_status === 'connected';

  return (
    <header className="flex items-center justify-between h-[56px] px-6 bg-header border-b border-border-subtle flex-shrink-0">
      {/* Left: page title */}
      <div>
        <h1 className="text-[15px] font-semibold text-text">Dashboard</h1>
      </div>

      {/* Right: stats + actions */}
      <div className="flex items-center gap-5">
        {/* Download speed */}
        <div className="flex items-center gap-2 text-xs">
          <Zap size={15} className="text-emerald-400" />
          <div className="flex flex-col leading-tight">
            <span className="text-text font-semibold font-mono tabular-nums">
              {transferInfo ? fmtSpeed(transferInfo.dl_info_speed) : '—'}
            </span>
            <span className="text-text-tertiary text-[11px]">Download</span>
          </div>
        </div>

        {/* Upload speed */}
        <div className="flex items-center gap-2 text-xs">
          <Zap size={15} className="text-accent" />
          <div className="flex flex-col leading-tight">
            <span className="text-text font-semibold font-mono tabular-nums">
              {transferInfo ? fmtSpeed(transferInfo.up_info_speed) : '—'}
            </span>
            <span className="text-text-tertiary text-[11px]">Upload</span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-7 bg-border-subtle" />

        {/* Connection status */}
        <div className={`flex items-center gap-1.5 text-xs font-medium ${connected ? 'text-emerald-400' : 'text-amber-500'}`}>
          <Wifi size={14} />
          <span>{connected ? 'Connected' : 'Firewalled'}</span>
        </div>

        {/* Notifications */}
        <button className="p-1.5 rounded-md text-text-tertiary hover:text-text-secondary hover:bg-card transition-colors">
          <Bell size={18} />
        </button>
      </div>
    </header>
  );
}

function fmtSpeed(bps: number): string {
  if (!bps || bps < 0) return '0 B/s';
  const units = ['B/s', 'KiB/s', 'MiB/s', 'GiB/s'];
  let i = 0, v = bps;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
  return `${v.toFixed(1)} ${units[i]}`;
}
