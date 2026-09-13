**Issue:** [#1](https://github.com/Humble-Coders/Infini/issues/1)
**Milestone:** M1 — Foundation
**Blocks:** T2, T3, T4 — and therefore everything else. Nothing starts until this merges.
**Blocked by:** nothing. Start immediately.

## 📖 Story / Why

We're rebuilding `infini.co.in` for **INFINI**, a precision **surface-finishing** company — it applies the MMP treatment to components *its customers* manufacture. It does **not** manufacture parts. Copy that calls INFINI a manufacturer is wrong and gets sent back.

This ticket is the framework move, and nothing else. The repo is currently a **Vite client-rendered SPA**, which physically cannot deliver the SEO and social-preview work this project is contracted for: non-JS crawlers (LinkedIn, WhatsApp, Slack, most LLM fetchers) fetch the raw HTML and see an empty `<div id="root">`. Every page would preview as a blank card.

Doing this now costs a day, because the repo holds one placeholder page. Doing it in week 4 costs the project.

**Deliberately narrow scope: get to a building, server-rendering Next.js app on TypeScript. No design work, no new features.** Placeholder styling is fine — T2 handles the design system.

## 🧭 Context

The repo is a bare Vite 8 + React 19 boilerplate: 28 files, one placeholder `src/pages/Home.jsx`, no router, no real screens. Nothing of product value is at risk.

**Keep and port:**
- `tailwind.config.js` — already fully token-driven, every colour maps to a CSS variable. **Port as-is**; don't rewrite it.
- `src/components/ui/*` — 8 Radix/shadcn primitives (button, input, textarea, select, switch, label, accordion, alert-dialog). Port to typed `.tsx`.
- `src/index.css` — keep the *variable structure*. T2 replaces the values.

**Delete outright — this repo carries another client's branding.** The boilerplate was last used for a hospitality project:
- `src/assets/logo.png` — a **"Hotel Dreamland"** logo (ornate gold, chef illustration).
- `src/assets/hero.png`, `src/assets/react.svg`, `src/assets/vite.svg` — boilerplate stock art.
- `public/favicon.svg` — unrelated purple geometric glyph.

Shipping any of this would be embarrassing. It must be gone before anything deploys.

Target structure is defined in [`CLAUDE.md`](../../CLAUDE.md). Read it first.

## 🔑 Access & prerequisites

- [ ] Repo access to `Humble-Coders/Infini` (private). Branch `feature/<issue#>-nextjs-migration` off `main`.
- [ ] Node 20+.
- [ ] No credentials needed for this ticket. Firebase setup is T4.

## ✅ Scope / What to build

- [ ] Migrate to **Next.js (App Router)** with **TypeScript**, `strict: true`.
- [ ] Remove Vite completely: `vite.config.js`, root `index.html`, `src/main.jsx`, and all Vite dependencies from `package.json`.
- [ ] Create the folder structure from `CLAUDE.md`: `app/`, `components/`, `lib/`, `functions/`.
- [ ] Port `tailwind.config.js` and the PostCSS config; migrate ESLint to the Next.js config.
- [ ] Port all 8 `components/ui/*` primitives to typed `.tsx`. **Port, don't rewrite** — behaviour should be unchanged.
- [ ] Delete every foreign brand asset listed in Context. Add a temporary neutral favicon (T2 replaces it).
- [ ] A minimal `app/page.tsx` that renders server-side and proves the stack works.
- [ ] Update `README.md` with clone → install → run steps.

## 🎯 Acceptance Criteria

- [ ] `npm run build` and `npm run lint` pass clean, zero TypeScript errors.
- [ ] **`curl` on the running app returns real HTML content in the raw response** — not an empty root div. *(Verify with `curl`, **not** DevTools. DevTools shows the post-JavaScript DOM and will happily hide exactly the failure this ticket exists to prevent.)*
- [ ] `grep -ri "vite\|dreamland" --exclude-dir=node_modules --exclude-dir=.git .` returns nothing.
- [ ] No file remains under `src/assets/` from the old boilerplate.
- [ ] All 8 UI primitives compile as `.tsx` and render without runtime errors.
- [ ] No `any` types introduced in ported code.
- [ ] `README.md` gets a developer from clone to running app with no verbal help.

## 🚫 Out of scope

- The design system, tokens, colours, fonts — **T2**.
- Header, navigation, footer, page shell — **T3**.
- Firebase wiring and deployment — **T4**.
- Any real page content or copy.

## 📚 References

- [`CLAUDE.md`](../../CLAUDE.md) — architecture rules and target folder structure.
- [`docs/PRD.md`](../PRD.md) §4 architecture, §10 decision **D1** (why Next.js).

## 🤖 Kickoff prompt

```
/start-ticket 1
```
