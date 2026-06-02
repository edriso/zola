import { create } from 'zustand';
import { repository } from '@/lib/repository';
import { bankSession } from '@/lib/stats';
import type { Accent, Settings, Stats, Theme } from '@/types/domain';

interface ZolaState {
  settings: Settings;
  stats: Stats;
  /** Record a finished session of `minutes` (bumps streak once per day). */
  bank: (minutes: number) => void;
  setDuration: (duration: Settings['duration']) => void;
  setTheme: (theme: Theme) => void;
  setAccent: (accent: Accent) => void;
  setSound: (sound: boolean) => void;
}

const initial = repository.getState();

export const useZolaStore = create<ZolaState>((set, get) => {
  function patchSettings(patch: Partial<Settings>): void {
    set({ settings: repository.setSettings(patch).settings });
  }

  return {
    settings: initial.settings,
    stats: initial.stats,

    bank: (minutes) => set({ stats: repository.setStats(bankSession(get().stats, minutes)).stats }),

    setDuration: (duration) => patchSettings({ duration }),
    setTheme: (theme) => patchSettings({ theme }),
    setAccent: (accent) => patchSettings({ accent }),
    setSound: (sound) => patchSettings({ sound }),
  };
});
