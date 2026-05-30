import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PreferencesState {
  qbittorrentUrl: string;
  refreshInterval: number;
  sidebarCollapsed: boolean;
  selectedTorrentHash: string | null;
  setQbittorrentUrl: (url: string) => void;
  setRefreshInterval: (ms: number) => void;
  toggleSidebar: () => void;
  selectTorrent: (hash: string | null) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      qbittorrentUrl: '',
      refreshInterval: 2000,
      sidebarCollapsed: false,
      selectedTorrentHash: null,

      setQbittorrentUrl: (url) => set({ qbittorrentUrl: url }),
      setRefreshInterval: (ms) => set({ refreshInterval: ms }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      selectTorrent: (hash) => set({ selectedTorrentHash: hash }),
    }),
    { name: 'qb-webui-preferences' },
  ),
);
