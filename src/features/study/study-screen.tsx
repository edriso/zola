import { useEffect, useRef, useState } from 'react';
import { useInterval } from '@/hooks/use-interval';
import { playChime } from '@/lib/chime';
import { BACK, CHEERS, FINISH_CLEAN, FINISH_EARLY, MILESTONES, pick, READY } from '@/lib/copy';
import { formatClock } from '@/lib/format';
import { minutesStudied } from '@/lib/stats';
import { useZolaStore } from '@/store/zola-store';
import { DURATIONS, type Duration, type Phase, type Pose } from '@/types/domain';
import { Confetti } from './confetti';
import { Giraffe } from './giraffe';

const ROTATE_MS = 80_000;

export function StudyScreen() {
  const settings = useZolaStore((state) => state.settings);
  const stats = useZolaStore((state) => state.stats);
  const bank = useZolaStore((state) => state.bank);

  const [phase, setPhase] = useState<Phase>('ready');
  const [duration, setLocalDuration] = useState<Duration>(settings.duration);
  const [left, setLeft] = useState(settings.duration * 60);
  const [running, setRunning] = useState(true);
  const [pose, setPose] = useState<Pose>('idle');
  const [clean, setClean] = useState(true);
  const [doneMinutes, setDoneMinutes] = useState(0);
  const [seed, setSeed] = useState(1);
  const [bubble, setBubble] = useState<string>(() => READY[0]);
  const milestones = useRef({ half: false, near: false });

  const total = duration * 60;

  // Keep the ready-state clock in sync with the default-length setting.
  useEffect(() => {
    setLocalDuration(settings.duration);
    setPhase((current) => {
      if (current === 'ready') {
        setLeft(settings.duration * 60);
      }
      return current;
    });
  }, [settings.duration]);

  // Countdown: the updater stays pure (just decrement) so it accumulates
  // correctly even when many ticks fire at once. Milestones and completion are
  // handled in an effect off the committed `left`, keeping setState out of the
  // updater.
  useInterval(
    () => setLeft((s) => Math.max(0, s - 1)),
    phase === 'studying' && running ? 1000 : null,
  );

  useEffect(() => {
    if (phase !== 'studying') {
      return;
    }
    if (left <= 0) {
      finish();
      return;
    }
    const elapsed = total - left;
    if (!milestones.current.half && elapsed >= total / 2) {
      milestones.current.half = true;
      setBubble(MILESTONES.half);
    } else if (!milestones.current.near && left <= total * 0.12) {
      milestones.current.near = true;
      setBubble(MILESTONES.near);
    }
    // finish is stable enough for this run; deps intentionally limited to the clock.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left, phase, total]);

  // Rotating encouragement.
  useInterval(
    () => {
      setSeed((s) => s + 1);
      setBubble((current) => pick(CHEERS, seed + 1, current));
    },
    phase === 'studying' && running ? ROTATE_MS : null,
  );

  // Gentle presence: a kind "you came back" — never a scold (this is body doubling).
  useEffect(() => {
    if (phase !== 'studying') {
      return;
    }
    let wasHidden = false;
    const onVisibility = () => {
      if (document.hidden) {
        wasHidden = true;
      } else if (wasHidden) {
        wasHidden = false;
        setBubble(BACK);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [phase]);

  function begin() {
    milestones.current = { half: false, near: false };
    setLeft(total);
    setRunning(true);
    setPose('study');
    setPhase('studying');
    setSeed((s) => s + 1);
    setBubble(pick(CHEERS, seed + 1));
  }

  function finish() {
    setRunning(false);
    setPose('cheer');
    setPhase('done');
    setClean(true);
    setDoneMinutes(duration);
    setBubble(FINISH_CLEAN);
    playChime(settings.sound);
    bank(duration);
  }

  function endEarly() {
    const studiedSeconds = total - left;
    const studiedMinutes = minutesStudied(total, left);
    setRunning(false);
    setPose('cheer');
    setPhase('done');
    setClean(false);
    setDoneMinutes(studiedMinutes);
    setBubble(FINISH_EARLY);
    playChime(settings.sound);
    // Only bank once there's meaningful time on the clock (kind, not gameable).
    if (studiedSeconds > 30) {
      bank(studiedMinutes);
    }
  }

  function again() {
    setPhase('ready');
    setPose('idle');
    setLocalDuration(settings.duration);
    setLeft(settings.duration * 60);
    setSeed((s) => s + 1);
    setBubble(pick(READY, seed + 1));
  }

  const progress = phase === 'studying' || phase === 'done' ? (total - left) / total : 0;

  return (
    <div className="tw-stage">
      <div className="tw-top">
        <h1 className="tw-name">Zola</h1>
        {stats.sessions > 0 && (
          <div className="tw-togetherness">
            We&rsquo;ve studied together <b>{stats.sessions}</b>{' '}
            {stats.sessions === 1 ? 'time' : 'times'}
            {stats.streak > 1 ? ` · ${stats.streak}-day streak` : ''}
          </div>
        )}
      </div>

      <div className={`tw-bubble tw-bubble-${phase}`} key={bubble} role="status" aria-live="polite">
        {bubble}
      </div>

      <div className="tw-giraffe-wrap">
        <Giraffe pose={pose} size={240} />
        <Confetti show={phase === 'done' && clean} />
      </div>

      <div className="tw-panel">
        {phase === 'ready' && (
          <>
            <div className="tw-durs">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    setLocalDuration(d);
                    setLeft(d * 60);
                  }}
                  className={'tw-dur tw-tap' + (duration === d ? ' is-on' : '')}
                  aria-pressed={duration === d}
                >
                  {d}
                  <span>min</span>
                </button>
              ))}
            </div>
            <button className="tw-cta tw-tap" type="button" onClick={begin}>
              Study together
            </button>
          </>
        )}

        {phase === 'studying' && (
          <>
            <div className="tw-timer-row">
              <div className="tw-progress">
                <div className="tw-progress-fill" style={{ width: `${progress * 100}%` }} />
              </div>
              <div className="tw-time">{formatClock(left)}</div>
            </div>
            <div className="tw-controls">
              <button
                className="tw-ctrl tw-tap"
                type="button"
                onClick={() => setRunning((r) => !r)}
              >
                {running ? 'Pause' : 'Resume'}
              </button>
              <button className="tw-ctrl tw-ctrl-quiet tw-tap" type="button" onClick={endEarly}>
                I&rsquo;m done for now
              </button>
            </div>
          </>
        )}

        {phase === 'done' && (
          <>
            <div className="tw-done-stat">
              <b>
                {doneMinutes} {doneMinutes === 1 ? 'minute' : 'minutes'}
              </b>{' '}
              studied together
            </div>
            <button className="tw-cta tw-tap" type="button" onClick={again}>
              Study again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
