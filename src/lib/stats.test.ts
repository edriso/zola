import { describe, expect, it } from 'vitest';
import type { Stats } from '@/types/domain';
import { bankSession, minutesStudied } from './stats';

const NOW = new Date(2026, 2, 10, 12, 0, 0); // "2026-03-10"

function stats(overrides: Partial<Stats> = {}): Stats {
  return { sessions: 0, totalMin: 0, streak: 0, lastDay: null, ...overrides };
}

describe('bankSession', () => {
  it('records the first session and starts the streak at 1', () => {
    const next = bankSession(stats(), 25, NOW);
    expect(next).toEqual({ sessions: 1, totalMin: 25, streak: 1, lastDay: '2026-03-10' });
  });

  it('adds minutes and counts sessions', () => {
    const after = bankSession(bankSession(stats(), 25, NOW), 15, NOW);
    expect(after.sessions).toBe(2);
    expect(after.totalMin).toBe(40);
  });

  it('bumps the streak at most once per day', () => {
    const first = bankSession(stats({ streak: 3, lastDay: '2026-03-09' }), 25, NOW);
    expect(first.streak).toBe(4);
    const second = bankSession(first, 25, NOW);
    expect(second.streak).toBe(4); // same day, no extra bump
    expect(second.sessions).toBe(2);
  });

  it('continues the streak on a new day', () => {
    const next = bankSession(stats({ streak: 2, lastDay: '2026-03-09' }), 25, NOW);
    expect(next.streak).toBe(3);
  });
});

describe('minutesStudied', () => {
  it('rounds elapsed seconds to whole minutes', () => {
    expect(minutesStudied(1500, 1500)).toBe(0);
    expect(minutesStudied(1500, 0)).toBe(25);
    expect(minutesStudied(1500, 1410)).toBe(2); // 90s -> 2 min (rounded)
  });
});
