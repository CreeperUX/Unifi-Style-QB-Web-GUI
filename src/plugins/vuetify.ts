import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as directives from 'vuetify/directives'
import themeMap, { DarkUnifi } from '@/themes'

export default createVuetify({
  directives,
  defaults: {
    global: {
      elevation: 0,
    },
    VCard: {
      elevation: 0,
      rounded: 'sm',
    },
    VSheet: {
      elevation: 0,
      rounded: 'sm',
    },
    VBtn: {
      variant: 'tonal',
      rounded: 'sm',
    },
    VChip: {
      variant: 'tonal',
      rounded: 'sm',
    },
    VNavigationDrawer: {
      elevation: 0,
    },
    VToolbar: {
      elevation: 0,
    },
    VAppBar: {
      elevation: 0,
    },
  },
  display: {
    mobileBreakpoint: 'sm',
  },
  icons: {
    defaultSet: 'mdi',
  },
  theme: {
    defaultTheme: DarkUnifi.id,
    variations: {
      colors: [
        'primary', 'secondary',
        'torrent-allocating', 'torrent-checking_disk', 'torrent-checking_resume_data',
        'torrent-dl_forced', 'torrent-dl_stopped', 'torrent-dl_queued', 'torrent-dl_stalled',
        'torrent-downloading', 'torrent-error', 'torrent-forced_meta_download',
        'torrent-meta_download', 'torrent-missing_files', 'torrent-moving',
        'torrent-ul_forced', 'torrent-ul_stopped', 'torrent-ul_queued', 'torrent-ul_stalled',
        'torrent-unknown', 'torrent-uploading',
      ],
      lighten: 3,
      darken: 3,
    },
    themes: themeMap,
  },
})
