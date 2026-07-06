import { useColorScheme } from 'react-native';
import { useSettingsStore } from '../store/settingsStore';
import { day, dayDark, DayPalette } from './colors';

// Resolves the daylight-surface palette. Nighttime-capture surfaces do not use
// this — they import the `night` palette directly and are always true-dark.
export function useDayTheme(): { palette: DayPalette; isDark: boolean } {
  const system = useColorScheme();
  const mode = useSettingsStore((s) => s.themeMode);
  const isDark = mode === 'night' || (mode === 'system' && system === 'dark');
  return { palette: isDark ? dayDark : day, isDark };
}
