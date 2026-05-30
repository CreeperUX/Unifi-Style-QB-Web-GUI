/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes || bytes < 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

/**
 * Format bytes per second to human-readable speed
 */
export function formatSpeed(bytesPerSec: number, decimals = 1): string {
  return formatBytes(bytesPerSec, decimals) + '/s';
}

/**
 * Format seconds to duration string
 */
export function formatDuration(seconds: number): string {
  if (seconds <= 0 || seconds === 8640000) return '∞';
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const parts: string[] = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  if (s > 0 && parts.length === 0) parts.push(`${s}s`);
  return parts.join(' ') || '0s';
}

/**
 * Format a ratio number
 */
export function formatRatio(ratio: number): string {
  if (ratio === 8640000) return '∞';
  return ratio.toFixed(2);
}

/**
 * Format a Unix timestamp
 */
export function formatDate(timestamp: number): string {
  if (!timestamp || timestamp < 0) return '—';
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get human-readable torrent state label
 */
export function getStateLabel(state: string): string {
  const labels: Record<string, string> = {
    error: 'Error',
    missingFiles: 'Missing Files',
    uploading: 'Seeding',
    pausedUP: 'Paused',
    queuedUP: 'Queued',
    stalledUP: 'Stalled',
    checkingUP: 'Checking',
    forcedUP: '[F] Seeding',
    allocating: 'Allocating',
    downloading: 'Downloading',
    metaDL: 'Fetching Metadata',
    pausedDL: 'Paused',
    queuedDL: 'Queued',
    stalledDL: 'Stalled',
    checkingDL: 'Checking',
    forcedDL: '[F] Downloading',
    checkingResumeData: 'Checking Resume',
    moving: 'Moving',
    unknown: 'Unknown',
  };
  return labels[state] ?? state;
}

/**
 * Get color for torrent state badge
 */
export function getStateColor(state: string): string {
  if (state.includes('error')) return 'text-red-400';
  if (state.includes('stalled')) return 'text-amber-500';
  if (state.includes('paused')) return 'text-text-tertiary';
  if (state.includes('downloading') || state.includes('DL')) return 'text-blue-400';
  if (state.includes('uploading') || state.includes('UP')) return 'text-emerald-400';
  if (state.includes('checking') || state.includes('allocating') || state.includes('moving')) return 'text-amber-500';
  if (state.includes('queued')) return 'text-text-secondary';
  return 'text-text-tertiary';
}

/**
 * Get progress bar color based on torrent progress
 */
export function getProgressColor(progress: number): string {
  if (progress >= 1) return 'bg-emerald-400';
  if (progress > 0.5) return 'bg-blue-400';
  return 'bg-blue-500';
}
