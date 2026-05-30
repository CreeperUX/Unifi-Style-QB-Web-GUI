import { getVariables } from '@/themes/global'

const vars = getVariables(true)

export default {
  id: 'dark-unifi',
  theme: {
    dark: true,
    colors: Object.assign({}, vars, {
      // Vuetify base overrides
      'background': '#080A0D' as string,
      'surface': '#1A1D24',
      'surface-bright': '#20232B',
      'surface-light': '#252830',
      'surface-variant': '#2D3139',
      'on-surface-variant': '#9DA2B0',
      'primary': '#006FFF',
      'primary-darken-1': '#0056CC',
      'secondary': '#3DD68C',
      'secondary-darken-1': '#2FB872',
      'error': '#F2555A',
      'info': '#2D8AFF',
      'success': '#3DD68C',
      'warning': '#E5A620',
      'navbar': '#0E1015',
      'download': '#3DD68C',
      'upload': '#006FFF',
      'ratio': '#2D8AFF',
      'category': '#006FFF',
      'tag': '#0197A8',
      'tracker': '#E5A620',
      'red': '#F2555A',
    }),
  },
}
