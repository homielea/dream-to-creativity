import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from '../lib/storage';

export type ThemeMode = 'night' | 'day' | 'system';
export type TranscriptionMode = 'device' | 'proxy';

interface SettingsState {
  themeMode: ThemeMode;
  silent: boolean; // default true — no sounds at night
  confirmHaptic: boolean; // default false — single record-start tick, opt-in
  transcriptionMode: TranscriptionMode;
  proxyOptIn: boolean; // audio/transcripts leave the device only when true
  paidTier: boolean;

  setThemeMode: (mode: ThemeMode) => void;
  setSilent: (silent: boolean) => void;
  setConfirmHaptic: (on: boolean) => void;
  setTranscriptionMode: (mode: TranscriptionMode) => void;
  setProxyOptIn: (optIn: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      themeMode: 'system',
      silent: true,
      confirmHaptic: false,
      transcriptionMode: 'device',
      proxyOptIn: false,
      paidTier: false,

      setThemeMode: (themeMode) => set({ themeMode }),
      setSilent: (silent) => set({ silent }),
      setConfirmHaptic: (confirmHaptic) => set({ confirmHaptic }),
      setTranscriptionMode: (transcriptionMode) => set({ transcriptionMode }),
      setProxyOptIn: (proxyOptIn) => set({ proxyOptIn }),
    }),
    {
      name: 'dream-capture-settings-v1',
      storage: zustandStorage,
    }
  )
);
