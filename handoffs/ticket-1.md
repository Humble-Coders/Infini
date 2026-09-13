**Ticket:** #1 — Migrate Vite SPA to Next.js App Router + TypeScript, purge foreign brand assets

## Summary

Migrates the repo from a Vite client-rendered SPA to Next.js (App Router) on TypeScript with `strict: true`, so the site can actually be crawled and previewed by non-JS clients (search engines, LinkedIn/WhatsApp/Slack unfurls, most LLM fetchers) — the SPA shipped an empty `<div id="root">` to anyone who doesn't execute JavaScript. Deliberately narrow scope: framework move only, no design or content work. All 8 Radix/shadcn UI primitives ported to typed `.tsx`, `tailwind.config.js` and the CSS variable structure carried forward as-is, and every foreign-brand asset from the repo's previous life as a hospitality boilerplate (Hotel Dreamland logo, stock art, unrelated favicon) removed.

## Files changed

- `app/layout.tsx`, `app/page.tsx` — root layout and a minimal server-rendered page proving the stack works.
- `components/ui/*.tsx` — all 8 primitives (`button`, `input`, `textarea`, `select`, `switch`, `label`, `accordion`, `alert-dialog`) ported from `.jsx` to typed `.tsx`, behavior unchanged.
- `tailwind.config.js`, `postcss.config.js` — ported as-is (already fully token-driven).
- `eslint.config.js` — migrated to the Next.js flat config.
- `tsconfig.json` — `strict: true`.
- `package.json` — Vite and its dependencies removed entirely; Next.js, React 19, TypeScript added.
- `README.md` — clone → install → run steps.
- Removed: `vite.config.js`, root `index.html`, `src/main.jsx`, and every file under the old `src/assets/` (Hotel Dreamland logo, hero art, Vite/React starter SVGs), plus the unrelated purple favicon.

## How to test

```bash
npm install
npm run build   # zero TypeScript errors
npm run lint     # clean
npm run dev
curl -s http://localhost:3000/ | grep -c "<h1"   # confirms real HTML, not an empty root div
grep -ri "vite\|dreamland" --exclude-dir=node_modules --exclude-dir=.git .   # empty
```

## Acceptance criteria

- [x] `npm run build` and `npm run lint` pass clean, zero TypeScript errors.
- [x] `curl` on the running app returns real HTML content, not an empty root div — confirmed via server-rendered `app/page.tsx`.
- [x] `grep -ri "vite\|dreamland"` (excluding `node_modules`/`.git`) returns nothing outside build cache.
- [x] No file remains under `src/assets/` from the old boilerplate — `src/` no longer exists.
- [x] All 8 UI primitives compile as `.tsx` and render without runtime errors.
- [x] No `any` types introduced in ported code.
- [x] `README.md` gets a developer from clone to running app.

## Deviations / decisions

- None — this ticket's scope was deliberately narrow (framework move only), and stayed that way. Design, shell, and Firebase wiring are handled by T2/T3/T4 respectively.

## Open questions / follow-ups

- None outstanding from this ticket specifically.
