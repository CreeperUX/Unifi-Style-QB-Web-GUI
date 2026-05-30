import { getVariables } from '@/themes/global'

const vars = getVariables(true)

export default {
  id: 'dark-unifi',
  theme: {
    dark: true,
    colors: Object.assign({}, vars, {
      // ── Core UniFi overrides ──
      'background': '#080A0D',
      'surface': '#1A1D24',
      'surface-bright': '#20232B',
      'surface-light': '#252830',
      'surface-variant': '#2D3139',
      'on-surface-variant': '#9DA2B0',
      'primary': '#006FFF',
      'primary-darken-1': '#0056CC',
      'secondary': '#2D8AFF',
      'secondary-darken-1': '#2470E0',
      'accent': '#006FFF' as string,      // ⚠️ Override green from getVariables
      'error': '#F2555A',
      'info': '#2D8AFF',
      'success': '#3DD68C',
      'warning': '#E5A620',
      // ── Navigation ──
      'navbar': '#0E1015',
      // ── Custom tokens ──
      'download': '#006FFF' as string,    // ⚠️ was green, now blue
      'upload': '#2D8AFF',
      'ratio': '#0197A8',
      'red': '#F2555A',
    }),
  },
}
