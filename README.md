# Zola

A **frontend-only** study-together app. Where most focus apps lean on pressure,
Zola leans on **body doubling** — the simple, well-documented boost you get from
someone present and working alongside you. Here that someone is **Zola, a
friendly giraffe** who studies at your shared desk, pops up gentle
encouragement, and celebrates when you finish. One warm page, no shame: step
away and Zola just keeps your seat warm.

There is no backend, no account, and no network. Everything lives on your device
and the app works fully offline.

---

## How it works

It's a single screen with three calm phases:

- **ready** — say hi to Zola, pick a length (15 / 25 / 45 min), and press
  **Study together**.
- **studying** — Zola tilts her head down to her own book and writes beside you.
  A soft progress bar and a big timer count down; she offers a rotating word of
  encouragement and little milestone cheers at the halfway and almost-done
  marks. Pause/resume any time, or tap **I'm done for now** to stop early —
  every minute together still counts.
- **done** — Zola throws her arms up with confetti and a soft chime, and you can
  **Study again**.

**Presence, kindly.** If you switch away and come back, Zola simply says "You're
back! I kept your seat warm." There is **no penalty and no scolding** — this is
body doubling, not a commitment device. Stepping away costs you nothing.

A quiet line tracks how many times you've studied together and your day streak —
gentle togetherness, never a leaderboard.

---

## Tech stack

- **React 19 + TypeScript** (strict), built with **Vite**
- **Tailwind CSS v4** (configured in CSS with `@theme`, no `tailwind.config.js`)
- **Zustand** for state, **Zod** for validating the persisted shape
- **vite-plugin-pwa** so the app is installable and works offline
- **Vitest** + **Testing Library** for unit and component tests, **Playwright**
  for browser tests (it uses the clock API to fast-forward a session)

---

## Getting started

You need **Node 20+** and **pnpm** (`npm install -g pnpm`).

```bash
pnpm install
pnpm dev
```

Open <http://localhost:5173>. There is nothing else to configure — no backend.

---

## Commands

| Command          | What it does                              |
| ---------------- | ----------------------------------------- |
| `pnpm dev`       | Start the Vite dev server                 |
| `pnpm build`     | Type-check and build for production       |
| `pnpm preview`   | Preview the production build locally      |
| `pnpm lint`      | Run ESLint (must pass with zero warnings) |
| `pnpm format`    | Format every file with Prettier           |
| `pnpm typecheck` | Type-check without building               |
| `pnpm test`      | Run the unit and component tests (Vitest) |
| `pnpm test:e2e`  | Run the browser tests (Playwright)        |

Run `pnpm test:e2e:install` once to download the browser before `pnpm test:e2e`.

---

## How it is built

```
src/
├── components/      overlay (the settings dialog primitive)
├── features/study/  the single screen, the giraffe, confetti, settings
├── store/           the Zustand store (settings + togetherness stats)
├── hooks/           interval, apply-theme
├── lib/             pure logic & data: stats, date, copy, chime, format, repository
├── types/           Zod schemas and the types they produce
└── styles/          the theme + the giraffe's pose animations (CSS)
```

A few ideas worth knowing:

- **Saving goes through one seam.** `lib/repository.ts` is a small typed
  interface backed by localStorage; saved data is parsed with Zod, so an old or
  corrupt shape safely falls back to defaults.
- **The streak logic is pure and tested.** `bankSession` (in `lib/stats.ts`)
  adds the session and minutes and bumps the day streak at most once per day —
  no React, so the day-boundary cases are easy to test.
- **The giraffe is pure CSS.** Zola is one SVG with three poses (idle / study /
  cheer) switched by a `data-pose` attribute; all the bobbing, blinking,
  writing, and cheering live in keyframes and are dropped under
  `prefers-reduced-motion`.

---

## Accessibility & motion

- The timer controls and duration pills are real, keyboard-operable buttons;
  Zola's speech bubble is an `aria-live` region so her encouragement is
  announced; the settings dialog traps focus and closes on Escape.
- The app honors `prefers-reduced-motion` (the giraffe settles, confetti is
  dropped) and `prefers-color-scheme`. Day/night, accent, default length, and
  the cheer sound are all in the small settings panel.

---

## License

MIT.
