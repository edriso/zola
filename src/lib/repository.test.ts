import { beforeEach, describe, expect, it } from 'vitest';
import { createLocalStorageRepository, type Repository } from './repository';

function memoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (key: string) => map.get(key) ?? null,
    key: (index: number) => Array.from(map.keys())[index] ?? null,
    removeItem: (key: string) => {
      map.delete(key);
    },
    setItem: (key: string, value: string) => {
      map.set(key, value);
    },
  } as Storage;
}

describe('localStorage repository', () => {
  let repo: Repository;
  let storage: Storage;

  beforeEach(() => {
    storage = memoryStorage();
    repo = createLocalStorageRepository(storage);
  });

  it('returns sensible defaults when nothing is stored', () => {
    const state = repo.getState();
    expect(state.version).toBe(1);
    expect(state.settings.duration).toBe(25);
    expect(state.settings.theme).toBe('day');
    expect(state.stats.sessions).toBe(0);
  });

  it('falls back to defaults on corrupt JSON', () => {
    storage.setItem('zola-v1', 'not json');
    expect(repo.getState().settings.accent).toBe('#6f9f6a');
  });

  it('falls back to defaults on a wrong shape', () => {
    storage.setItem('zola-v1', JSON.stringify({ version: 1, settings: {} }));
    expect(repo.getState().settings.duration).toBe(25);
  });

  it('rejects an invalid duration', () => {
    storage.setItem(
      'zola-v1',
      JSON.stringify({
        version: 1,
        settings: { duration: 30, theme: 'day', accent: '#6f9f6a', sound: true },
        stats: { sessions: 0, totalMin: 0, streak: 0, lastDay: null },
      }),
    );
    expect(repo.getState().settings.duration).toBe(25);
  });

  it('round-trips settings and stats', () => {
    repo.setSettings({ theme: 'night', sound: false });
    repo.setStats({ sessions: 3, totalMin: 75, streak: 2, lastDay: '2026-03-10' });
    const after = repo.getState();
    expect(after.settings.theme).toBe('night');
    expect(after.settings.sound).toBe(false);
    expect(after.stats.sessions).toBe(3);
    expect(after.stats.streak).toBe(2);
  });
});
