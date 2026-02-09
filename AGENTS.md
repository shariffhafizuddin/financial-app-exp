# AGENTS.md

This repository is a **Next.js** application using **TypeScript**, **Tailwind CSS**, and **Vitest**.

This file defines how humans and AI agents should work in this codebase: how to run it, how to structure code, and what quality looks like.

---

## Tech stack

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* npm
* Vitest (unit & component tests)
* Client-side state only (localStorage)

There is:

* ❌ No backend
* ❌ No database
* ❌ No authentication
* ❌ No server APIs beyond Next.js itself

---

## Project commands

### Install

```bash
npm install
```

### Dev

```bash
npm run dev
```

### Build & start

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

### Typecheck

```bash
npm run typecheck
```

### Tests

```bash
npm run test
npm run test:watch
npm run test:run
```

If a script is missing, update `package.json` or this file so they stay in sync.

---

## Repository structure

Preferred structure:

* `src/app/` — routes, layouts, pages (App Router)
* `src/components/` — shared UI components
* `src/components/ui.tsx` — small, reusable UI primitives
* `src/hooks/` — client hooks (e.g. localStorage hydration)
* `src/lib/` — utilities, helpers (especially localStorage logic)
* `public/` — static assets (if needed)

Co-locate route-specific components inside `src/app/<route>/` when possible.

---

## Rendering & state model

### Server vs Client Components

* Default to **Server Components**
* Use `"use client"` **only** when needed:

  * state (`useState`, `useReducer`)
  * effects (`useEffect`)
  * localStorage access
  * user interactions

Any component touching `window`, `document`, or `localStorage` **must** be a Client Component.

---

## Local storage rules

* **localStorage is the only persistence layer**
* All localStorage access lives in `src/lib/` (and hooks in `src/hooks/`)
* Do not access `localStorage` directly in components
* Prefer shared helpers/hooks (e.g. `src/lib/storage/*`, `src/hooks/*`)
* Always handle:

  * missing keys
  * invalid JSON
  * unavailable storage

State must:

* hydrate safely on the client
* not break server rendering
* fail gracefully

---

## Tailwind CSS conventions

* Prefer Tailwind utilities over custom CSS
* Keep class lists readable:

  * line breaks for long class strings
  * use `clsx` / `classnames` / `cn` helper for conditionals
* Avoid arbitrary values unless necessary
* Use Tailwind config for shared tokens (colors, spacing, fonts)

No inline styles unless unavoidable.

---

## Component guidelines

* Keep components small and focused
* Extract logic into hooks or `lib/` helpers
* Avoid “god components”
* Prefer composition over deeply nested props
* Ensure basic accessibility:

  * semantic HTML
  * labels for inputs
  * keyboard-friendly interactions

---

## Testing (Vitest)

* Test pure logic and hooks where possible
* UI tests should focus on behavior, not implementation
* Prefer clear test names and minimal mocking
* Avoid snapshot-heavy tests unless they add real value

When fixing a bug, add a test when reasonable.

This repo co-locates tests next to the code (e.g. `src/lib/**/*.test.ts`) and uses `vitest.setup.ts`.

---

## Quality bar (definition of done)

A change is “done” when:

* `npm run lint` passes
* `npm run build` passes
* `npm run typecheck` passes
* `npm run test` passes
* No console errors or warnings
* UI works after refresh (localStorage persistence)
* Code matches existing patterns and structure

---

## Git & PR guidelines

* Keep PRs small and focused
* Include screenshots for UI changes
* Avoid drive-by refactors
* Use clear, imperative commit messages

---

## How agents should behave in this repo

When acting as an agent:

1. Read existing code and patterns before writing
2. Respect constraints:

   * no backend
   * no auth
   * no server-side persistence
3. Prefer simple, readable solutions
4. Make minimal, targeted changes
5. Explain non-obvious decisions briefly

If something is missing or unclear, update this file or leave a clear TODO.

---

## Explicit project constraints

* Persistence: **localStorage only**
* Multi-device sync: **not supported**
* Security guarantees: **none beyond the browser**
* Data loss on clear storage: **accepta
