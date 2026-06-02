import {
  type PersistedState,
  persistedStateSchema,
  type Settings,
  type Stats,
} from '@/types/domain';

/*
 * The persistence seam. Components and the store never touch storage directly.
 * Saved data is parsed with Zod, so a corrupt, partial, or out-of-date shape
 * safely falls back to sensible defaults instead of crashing.
 */
const STORAGE_KEY = 'zola-v1';

export function createDefaultState(): PersistedState {
  return {
    version: 1,
    settings: { duration: 25, theme: 'day', accent: '#6f9f6a', sound: true },
    stats: { sessions: 0, totalMin: 0, streak: 0, lastDay: null },
  };
}

export interface Repository {
  getState(): PersistedState;
  saveState(state: PersistedState): void;
  setSettings(patch: Partial<Settings>): PersistedState;
  setStats(stats: Stats): PersistedState;
  clear(): void;
}

export function createLocalStorageRepository(storage: Storage = localStorage): Repository {
  function read(): PersistedState {
    try {
      const raw = storage.getItem(STORAGE_KEY);
      if (!raw) {
        return createDefaultState();
      }
      const parsed = persistedStateSchema.safeParse(JSON.parse(raw));
      return parsed.success ? parsed.data : createDefaultState();
    } catch {
      return createDefaultState();
    }
  }

  function saveState(state: PersistedState): void {
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage can be unavailable (private mode, quota); the session still works.
    }
  }

  function setSettings(patch: Partial<Settings>): PersistedState {
    const current = read();
    const next: PersistedState = { ...current, settings: { ...current.settings, ...patch } };
    saveState(next);
    return next;
  }

  function setStats(stats: Stats): PersistedState {
    const current = read();
    const next: PersistedState = { ...current, stats };
    saveState(next);
    return next;
  }

  function clear(): void {
    try {
      storage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors.
    }
  }

  return { getState: read, saveState, setSettings, setStats, clear };
}

export const repository: Repository = createLocalStorageRepository();
