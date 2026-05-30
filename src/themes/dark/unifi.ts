import { getVariables } from '@/themes/global'

// UniFi-inspired torrent state colors (overriding the green-heavy defaults)
const unifiTorrentColors: Record<string, string> = {
  'torrent-allocating': '#D2911E',
  'torrent-checking_disk': '#0197A8',
  'torrent-checking_resume_data': '#0197A8',
  'torrent-dl_forced': '#006FFF',
  'torrent-dl_stopped': '#9DA2B0',
  'torrent-dl_queued': '#6F7483',
  'torrent-dl_stalled': '#D2911E',
  'torrent-downloading': '#006FFF',
  'torrent-error': '#F2555A',
  'torrent-forced_meta_download': '#A252E3',
  'torrent-meta_download': '#A252E3',
  'torrent-missing_files': '#F2555A',
  'torrent-moving': '#D2911E',
  'torrent-ul_forced': '#3DD68C',
  'torrent-ul_stopped': '#3DD68C',
  'torrent-ul_queued': '#6F7483',
  'torrent-ul_stalled': '#D2911E',
  'torrent-unknown': '#6F7483',
  'torrent-uploading': '#3DD68C',
}

export default {
  id: 'dark-unifi',
  theme: {
    dark: true,
    colors: {
      // ── UniFi OS exact colors ──
      'background': '#0E0E0E',
      'on-background': '#E6E8ED',
      'surface': '#1C1D21',
      'on-surface': '#E6E8ED',
      'surface-bright': '#25262B',
      'on-surface-bright': '#E6E8ED',
      'surface-variant': '#2E2F35',
      'on-surface-variant': '#B0B3BC',
      'surface-light': '#23242A',
      'on-surface-light': '#E6E8ED',

      'primary': '#006FFF',
      'on-primary': '#FFFFFF',
      'primary-darken-1': '#005AE0',
      'secondary': '#2A2D35',
      'on-secondary': '#E6E8ED',
      'error': '#F2555A',
      'on-error': '#FFFFFF',
      'info': '#2D8AFF',
      'on-info': '#FFFFFF',
      'success': '#3DD68C',
      'on-success': '#0D1410',
      'warning': '#E5A620',
      'on-warning': '#0E0E0E',

      // Navigation
      'navbar': '#141518',

      // Customs — all blue accent
      'accent': '#006FFF' as string,
      'upload': '#2D8AFF' as string,
      'download': '#006FFF' as string,
      'ratio': '#0197A8' as string,
      'category': '#006FFF' as string,
      'tag': '#0197A8' as string,
      'tracker': '#E5A620' as string,
      'red': '#F2555A' as string,

      // Torrent state colors
      ...unifiTorrentColors,

      // Merge remaining getVariables (already have upload/download/accent/ratio/category/tag/tracker/red overridden)
      ...Object.fromEntries(
        Object.entries(getVariables(true)).filter(
          ([k]) => !['upload', 'download', 'accent', 'ratio', 'category', 'tag', 'tracker', 'red',
            ...Object.keys(unifiTorrentColors)
          ].includes(k)
        )
      ),
    },
  },
}
