import { z } from 'zod';

export const DURATIONS = [15, 25, 45] as const;
export const durationSchema = z.union([z.literal(15), z.literal(25), z.literal(45)]);
export type Duration = z.infer<typeof durationSchema>;

export const THEMES = ['day', 'night'] as const;
export const themeSchema = z.enum(THEMES);
export type Theme = z.infer<typeof themeSchema>;

/** Warm, friendly accent swatches. */
export const ACCENTS = ['#6f9f6a', '#e0a23c', '#e0795a', '#5f97c8', '#b07cc8'] as const;
export const accentSchema = z.enum(ACCENTS);
export type Accent = z.infer<typeof accentSchema>;

export const settingsSchema = z.object({
  duration: durationSchema,
  theme: themeSchema,
  accent: accentSchema,
  sound: z.boolean(),
});
export type Settings = z.infer<typeof settingsSchema>;

/** Gentle togetherness stats — sessions and minutes shared, plus a day streak. */
export const statsSchema = z.object({
  sessions: z.number().int().nonnegative(),
  totalMin: z.number().int().nonnegative(),
  streak: z.number().int().nonnegative(),
  lastDay: z.string().nullable(),
});
export type Stats = z.infer<typeof statsSchema>;

export const persistedStateSchema = z.object({
  version: z.literal(1),
  settings: settingsSchema,
  stats: statsSchema,
});
export type PersistedState = z.infer<typeof persistedStateSchema>;

/** The single screen's phase. */
export type Phase = 'ready' | 'studying' | 'done';

/** Zola's pose, switched by phase. */
export type Pose = 'idle' | 'study' | 'cheer';
