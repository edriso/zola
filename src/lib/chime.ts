/*
 * A soft four-note celebration chime via WebAudio, created on the user gesture
 * that completes a session. Fully try/catch-wrapped and gated by the sound
 * setting, so a missing or blocked AudioContext never breaks the flow.
 */
export function playChime(enabled: boolean): void {
  if (!enabled) {
    return;
  }
  try {
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) {
      return;
    }
    const ctx = new Ctx();
    const now = ctx.currentTime;
    const notes: Array<[number, number]> = [
      [523, 0],
      [659, 0.13],
      [784, 0.26],
      [1047, 0.39],
    ];
    for (const [frequency, offset] of notes) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = frequency;
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0, now + offset);
      gain.gain.linearRampToValueAtTime(0.15, now + offset + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.8);
      osc.start(now + offset);
      osc.stop(now + offset + 0.9);
    }
    setTimeout(() => ctx.close?.(), 1800);
  } catch {
    // Audio can be unavailable or blocked; the session still completes silently.
  }
}
