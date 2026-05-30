import { ThemeDefinition } from 'vuetify'
import DarkLegacy from './dark/legacy'
import DarkOled from './dark/oled'
import DarkRedesigned from './dark/redesigned'
import DarkUnifi from './dark/unifi'
import LightLegacy from './light/legacy'
import LightRedesigned from './light/redesigned'

const themes = [DarkUnifi, DarkLegacy, DarkRedesigned, DarkOled, LightLegacy, LightRedesigned]

export default themes.reduce(
  (obj, theme) => {
    obj[theme.id] = theme.theme
    return obj
  },
  {} as Record<string, ThemeDefinition>
)

export { themes, DarkLegacy, DarkRedesigned, DarkOled, DarkUnifi, LightLegacy, LightRedesigned }
