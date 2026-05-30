import { Bell, Wifi, Zap } from 'lucide-react';
import type { GlobalTransferInfo } from '@/types/qbit';

interface TopBarProps {
  transferInfo: GlobalTransferInfo | undefined;
}

export function TopBar({ transferInfo }: TopBarProps) {
  return (
    <header className="flex items-center justify-between h-14 px-6 bg-header border-b border-border">
      {/* Left: breadcrumb / page title */}
      <div className="flex items-center gap-4">
        <span className="text-text font-medium text-sm">Dashboard</span>
      </div>

      {/* Right: global stats + actions */}
      <div className="flex items-center gap-4">
        {/* Speed indicators */}
        <div className="flex items-center gap-4 text-xs text-text-secondary">
          <span className="flex items-center gap-1.5">
            <Zap size={14} className="text-emerald-400" />
            <span className="text-text font-mono">
              {transferInfo ? formatSpeed(transferInfo.dl_info_speed) : '—'}
            </span>
            <span className="text-text-tertiary">DL</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Zap size={14} className="text-accent" />
            <span className="text-text font-mono">
              {transferInfo ? formatSpeed(transferInfo.up_info_speed) : '—'}
            </span>
            <span className="text-text-tertiary">UL</span>
          </span>
        </div>

        {/* Connection status */}
        <span
          className={`flex items-center gap-1.5 text-xs ${
            transferInfo?.connection_status === 'connected'
              ? 'text-emerald-400'
              : 'text-amber-500'
          }`}
        >
          <Wifi size={14} />
          {transferInfo?.connection_status === 'connected' ? 'Connected' : 'Firewalled'}
        </span>

        {/* Notification icon */}
        <button className="p-1.5 rounded-md text-text-tertiary hover:text-text-secondary hover:bg-card transition-colors">
          <Bell size={18} />
        </button>
      </div>
    </header>
  );
}

function formatSpeed(bytesPerSec: number): string {
  if (!bytesPerSec) return '0 B/s';
  const k = 1024;
  const sizes = ['B/s', 'KiB/s', 'MiB/s', 'GiB/s'];
  const i = Math.floor(Math.log(bytesPerSec) / Math.log(k));
  const val = parseFloat((bytesPerSec / Math.pow(k, i)).toFixed(1));
  return `${val} ${sizes[i]}`;
}
