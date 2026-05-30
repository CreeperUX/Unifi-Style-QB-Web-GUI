import { useQuery } from '@tanstack/react-query';
import { syncMainData, getGlobalTransferInfo, getPreferences } from '@/lib/qbit-api';
import { usePreferencesStore } from '@/stores/preferences';
import { useRef } from 'react';

/**
 * Polls qBittorrent sync/maindata endpoint for real-time updates
 */
export function useMainData() {
  const ridRef = useRef(0);
  const interval = usePreferencesStore((s) => s.refreshInterval);

  return useQuery({
    queryKey: ['maindata'],
    queryFn: async () => {
      const data = await syncMainData(ridRef.current);
      ridRef.current = data.rid;
      return data;
    },
    refetchInterval: interval,
    staleTime: 0,
  });
}

/**
 * Global transfer stats (download/upload speed, totals)
 */
export function useTransferInfo() {
  const interval = usePreferencesStore((s) => s.refreshInterval);

  return useQuery({
    queryKey: ['transfer'],
    queryFn: getGlobalTransferInfo,
    refetchInterval: interval,
    staleTime: 0,
  });
}

/**
 * Application preferences
 */
export function useAppPreferences() {
  return useQuery({
    queryKey: ['preferences'],
    queryFn: getPreferences,
    staleTime: 60_000,
  });
}
