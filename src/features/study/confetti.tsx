const COLORS = ['var(--accent)', 'var(--gir)', 'var(--gir-spot)', '#e88c6a', '#7fb2e0'];

// A tiny deterministic pseudo-random so the burst is stable per render (no
// Math.random in the component tree).
function rand(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/** A lightweight confetti burst for the clean-finish celebration. */
export function Confetti({ show }: { show: boolean }) {
  if (!show) {
    return null;
  }
  const bits = Array.from({ length: 26 }, (_, i) => i);
  return (
    <div className="tw-confetti" aria-hidden="true">
      {bits.map((i) => {
        const left = rand(i + 1) * 100;
        const delay = rand(i + 2) * 0.5;
        const duration = 1.8 + rand(i + 3) * 1.4;
        const rotation = rand(i + 4) * 360;
        const width = 6 + rand(i + 5) * 6;
        return (
          <span
            key={i}
            style={{
              left: `${left}%`,
              background: COLORS[i % COLORS.length],
              width,
              height: width * (0.5 + rand(i + 6)),
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              transform: `rotate(${rotation}deg)`,
              borderRadius: rand(i + 7) > 0.5 ? '50%' : '2px',
            }}
          />
        );
      })}
    </div>
  );
}
