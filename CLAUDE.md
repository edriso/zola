# CLAUDE.md — Zola

Project memory for Claude Code. Read this before doing anything. Keep edits aligned with it; if you intentionally diverge, update this file in the same change.

## What Zola is

A **frontend-only** study-together app built around **body doubling** — the proven boost of having someone present and studying alongside you. That someone is **Zola, a friendly giraffe** who works at your shared desk, cheers you on, and celebrates when you finish. It is the warm counterpart to a pressure-based focus app: presence over pressure, and **never any shame** — stepping away costs nothing; Zola just keeps your seat warm. No backend, no accounts; all state local; works offline.

> Keep it minimal: **one warm page.** Resist feeds, leaderboards, to-do lists, analytics. The power is the companionship and the calm loop.

(The prototype called the giraffe "Twiga"; the shipped app and the giraffe are named **Zola**. Only user-facing names changed — internal CSS classes keep the prototype's `tw-` prefix so the pose-animation selectors line up.)

## Product shape (one screen, three phases — don't extend it)

A single centered stage: Zola's name, a tiny togetherness line (sessions studied together · day streak), a speech bubble, the giraffe at a shared desk, and a phase panel. Phases are `ready | studying | done`:

- **ready** — a greeting bubble, duration pills (15 / 25 / 45), and a **Study together** button. Zola waves (idle pose).
- **studying** — Zola tilts down to her book and writes (study pose). A progress bar + big timer count down; rotating encouragement plus halfway/almost-done milestone cheers; Pause/Resume and a kind **I'm done for now** (early stop still counts the minutes).
- **done** — Zola throws her arms up with confetti + a soft chime (cheer pose); **Study again** resets.

**Presence, kindly (the defining choice).** On `visibilitychange` return, Zola says "You're back! I kept your seat warm." — **no penalty, no broken state, no scold.** This is deliberately the opposite of a loss-aversion commitment device. Do not add punishment.

## Design system — warm, cute, savanna

Default **day** (warm off-white `#fdf3e0`, soft brown ink); also a cozy **night** theme. Accent default sage `#6f9f6a`, with warm swatches (sage, amber, coral, blue, mauve); tints via `color-mix`. Giraffe palette is its own set of tokens (`--gir`, `--gir-spot`, `--gir-belly`, `--desk`…). **Baloo 2** (rounded, friendly) for display/headings/timer; **Hanken Grotesk** for UI. The giraffe is one SVG animated purely in CSS via `data-pose`; honor `prefers-reduced-motion` (settle the giraffe, drop confetti) and `prefers-color-scheme`. Two quiet top-corner controls (settings + day/night). Voice: warm, present, proud of you, never shaming ("We make a good team, you and me." · "Every minute together counts.").

## Tech & architecture

- **React 19 + TypeScript (strict)**, **Vite**, **Tailwind v4** (CSS-first `@theme`, no config; Node 20+).
- **Zustand** for state; single screen, **no router**. **Zod** validates the persisted shape.
- **Persistence behind a typed `repository`** (`getState`/`saveState`/`setSettings`/`setStats`) over localStorage; components never touch storage directly; Zod safe defaults.
- **Chime** via WebAudio on the finish gesture, gated by the sound setting, try/catch.
- **PWA**: installable, offline-first (vite-plugin-pwa + manifest, giraffe icon).
- Folders: `components/`, `features/study/` (screen, giraffe, confetti, settings), `store/`, `hooks/`, `lib/` (stats, date, copy, chime, format, repository), `types/`, `styles/`. Co-locate tests.

### Conventions

- Naming: `PascalCase` components/types · `camelCase` functions/vars · `kebab-case` files · `SCREAMING_SNAKE_CASE` constants. One component per file; keep small.
- No `any` (`unknown` + narrowing). Path aliases (`@/`). **Pure, unit-tested logic** for the streak (`bankSession`) — keep out of components.
- The countdown updater stays pure (decrement only); milestones and completion run in an effect off the committed time, so no setState happens inside a setState updater.
- Accessibility: keyboard-operable controls, the speech bubble is `aria-live`, the settings dialog traps focus + closes on Escape, visible focus rings, reduced-motion respected.

## Commands

```bash
pnpm install
pnpm dev          # vite dev server
pnpm build        # type-check + production build
pnpm preview      # preview the build
pnpm lint         # eslint, zero warnings
pnpm format       # prettier --write
pnpm test         # vitest (unit + component)
pnpm test:e2e     # playwright
```

Husky: pre-commit runs Prettier + ESLint on staged files; pre-push runs type-check + unit tests. Conventional Commits (commitlint). Deployed on Netlify (`netlify.toml`); the build command runs the full quality gate.

## Definition of done

Lint clean (zero warnings), `tsc` clean, unit/component/e2e green (the streak and the study loop especially), builds, **installs and runs offline**, keyboard-accessible, reduced-motion safe, and faithful to the design — warm savanna, Baloo 2, a cute animated giraffe. The prototype (`Twiga.html` + `twiga-giraffe.jsx` + `twiga-app.jsx`) is the source of truth for the giraffe, the poses, the copy, and the loop; port it faithfully (renamed to Zola). Above all: **it must feel like a kind friend studying beside you — present, encouraging, and never shaming when you step away.**
