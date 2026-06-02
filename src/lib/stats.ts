import type { Stats } from '@/types/domain';
import { dayKey } from './date';

/*
 * Pure togetherness logic. Banking a session adds one to the count and the
 * minutes studied, and bumps the day streak at most once per day. There is no
 * punishment for stepping away — this is body doubling, kindly — so any banked
 * session counts the same toward the streak.
 */
export function bankSession(stats: Stats, minutes: number, now: Date = new Date()): Stats {
  const key = dayKey(now);
  const alreadyToday = stats.lastDay === key;
  return {
    sessions: stats.sessions + 1,
    totalMin: stats.totalMin + Math.max(0, Math.round(minutes)),
    streak: alreadyToday ? stats.streak : stats.streak + 1,
    lastDay: key,
  };
}

/** Whole minutes studied so far in a session of `total` seconds with `left` remaining. */
export function minutesStudied(total: number, left: number): number {
  return Math.round((total - left) / 60);
}
