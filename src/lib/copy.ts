/*
 * Zola's voice: warm, present, never shaming. She studies beside you and cheers
 * you on; stepping away is met with a kept seat, not a scold.
 */
export const CHEERS = [
  "You're doing great. I'm right here with you.",
  'Look at us, focusing together.',
  "So proud of how you're sticking with this.",
  "Nice and steady. I'm not going anywhere.",
  'We make a good team, you and me.',
  "Keep going. I'm taking notes too.",
] as const;

export const MILESTONES = {
  half: "Halfway there! We've totally got this.",
  near: "Almost done now. I'm so proud of you.",
} as const;

export const READY = [
  "Ready to study together? I'll work right beside you.",
  'Pull up a chair. We focus better together.',
  'I saved you a seat. Shall we begin?',
] as const;

export const BACK = "You're back! I kept your seat warm.";
export const FINISH_CLEAN = 'We did it! That was lovely focusing with you.';
export const FINISH_EARLY = "Every minute together counts. I'm proud of you.";

/** Pick from a list, avoiding `not` when possible, seeded for stable renders/tests. */
export function pick<T>(list: readonly T[], seed: number, not?: T): T {
  if (list.length === 0) {
    throw new Error('pick from an empty list');
  }
  let index = Math.abs(seed) % list.length;
  if (not !== undefined && list.length > 1 && list[index] === not) {
    index = (index + 1) % list.length;
  }
  return list[index];
}
