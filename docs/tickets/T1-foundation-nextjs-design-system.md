**Milestone:** M1 — Foundation
**Blocks:** every subsequent ticket. Nothing else should start until this merges.

## 📖 Story / Why

We are rebuilding `infini.co.in` for **INFINI**, a precision **surface-finishing** company (it applies the MMP treatment to components *its customers* manufacture — it does not manufacture parts itself). The current site is a dated WordPress build that under-sells the company.

This is ticket 1 of the build. It doesn't ship a visible page to the client — it establishes the ground everything else stands on: the framework, the language, the design system, and a deployable staging environment.

Two things make it urgent. First, the repo is currently a **Vite client-rendered SPA**, which physically cannot deliver the SEO and social-preview requirements the project is contracted for — non-JS crawlers see an empty shell. Second, the repo ships **another client's branding** (the boilerplate was last used for a hospitality project), which must be gone before anything is deployed anywhere.

Get this right and the next ten tickets are straightforward. Get it wrong and every one of them inherits the problem.

## 🧭 Context

**What exists now.** A bare Vite 8 + React 19 boilerplate — 28 files, one placeholder `src/pages/Home.jsx`, no router, no real screens. Nothing of product value is being thrown away.

What's worth keeping:
- `tailwind.config.js` — already fully token-driven; every colour maps to a CSS variable. **Port it as-is.** The rebrand is a variable swap, not a config rewrite.
- `src/components/ui/*` — 8 Radix/shadcn primitives (button, input, textarea, select, switch, label, accordion, alert-dialog). Port to `.tsx`.
- `src/index.css` — keep the *variable structure*, replace every *value*.

What must be deleted outright:
- `src/assets/logo.png` — this is a **"Hotel Dreamland"** logo (ornate gold, chef illustration). It belongs to a different client.
- `src/assets/hero.png`, `src/assets/react.svg`, `src/assets/vite.svg` — boilerplate stock art.
- `public/favicon.svg` — unrelated purple geometric glyph.
- The entire gold `#c9a227` + Playfair Display theme in `index.css`. That was Hotel Dreamland's look, not INFINI's.

**Target architecture.** Next.js App Router + TypeScript on Firebase App Hosting. Full rules in [`CLAUDE.md`](../../CLAUDE.md); full spec in [`docs/PRD.md`](../PRD.md).

**Design authority.** There is **no Figma and no approved mockup — you design this in-code** (PRD decision D3). You have real creative freedom, bounded by the brand rules below. This is the documented exception to the usual "match the design exactly" rule.

- INFINI's identity is **red / black / white**. Build a sophisticated palette *around* that core — supporting neutrals, tints, shades, restrained gradients are all welcome. Do not drift so far that it stops reading as INFINI.
- Quality benchmark: `https://mmptechnology.com/` — this is the **global sibling brand for the same MMP technology**, not a random inspiration site. Calibrate typography, spacing, motion and presentation against it. **Do not copy it**; the output must be distinctly INFINI.
- Target feel: *industrial credibility + modern technology + premium presentation + usability.* Explicitly not a generic manufacturing template, not Bootstrap-grade corporate, and not the current site recoloured.

**Deployment.** Firebase App Hosting, with a **separate staging backend** on the Firebase-provided `*.web.app` domain. The unfinished site must never be served from `infini.co.in`.

**Infrastructure ownership (read this — it changes how you work).** You create and own the Firebase project during the build; it transfers to us and then to the client at handover (PRD decision D5, revised). Because of that, **the project must be reproducible from this repo, not merely transferable.** Commit rules and config as code, and write down every console-only setting as you make it. Assume the project will be recreated from scratch by someone who wasn't there.

## 🔑 Access & prerequisites

- [ ] **Repo access** — `Humble-Coders/Infini` (private). Branch `feature/<issue#>-foundation` off `main`.
- [ ] **Firebase project** — create your own on the **Blaze (pay-as-you-go)** plan. Blaze is required for App Hosting, Cloud Functions and reCAPTCHA Enterprise; the free Spark plan will not work. Costs at this stage are negligible, but **set a budget alert** so nothing runs away.
- [ ] **INFINI brand assets** — being requested from the client (logo vector, brand guidelines, facility and component photography, certificate PDFs). **Do not wait for these.** Extract interim assets from the live `infini.co.in` and proceed. Flag immediately in the ticket thread if what you find is too low-resolution to build a premium site on — that's a client conversation we need to start early, not at week 5.
- [ ] **No secrets in this repo.** The Firebase *web* config is public by design and belongs in `NEXT_PUBLIC_*`. Anything genuinely secret (SMTP app password, reCAPTCHA secret key, service-account JSON) goes to Cloud Functions config / Secret Manager and is requested from the manager via secure channel — never committed, never `NEXT_PUBLIC_`.

## ✅ Scope / What to build

**1. Framework migration**
- [ ] Migrate to **Next.js (App Router)** with **TypeScript** (`strict: true`).
- [ ] Remove Vite entirely: `vite.config.js`, root `index.html`, `src/main.jsx`, and the Vite dependencies.
- [ ] Establish the folder structure defined in `CLAUDE.md` (`app/`, `components/`, `lib/`, `functions/`).
- [ ] Port `tailwind.config.js` and PostCSS; migrate ESLint to the Next.js config.
- [ ] Port the 8 `components/ui/*` primitives to typed `.tsx`. Don't rewrite them — port them.

**2. Purge foreign branding**
- [ ] Delete every asset listed in Context. Verify no "Hotel Dreamland" artwork, purple glyph, or Vite/React logo survives anywhere, including `public/`.
- [ ] Replace the favicon with an INFINI mark (interim from the live site is fine).

**3. Design system** — the substantive part of this ticket
- [ ] Define the full token set as CSS variables in `app/globals.css`: primary/supporting/background/surface colours, typography scale and weights, spacing scale, radii, shadows, and interaction states.
- [ ] Choose and wire typography via **`next/font`** (self-hosted, no render-blocking external stylesheet). **Playfair Display is out** — it belonged to the previous brand.
- [ ] Style the base components against the tokens: buttons (all variants and states), form fields, cards, section containers.
- [ ] Build a **`/styleguide` route** rendering every token and component state on one page. Exclude it from production builds or `noindex` it. This is how the design direction gets reviewed without waiting for real pages.

**4. App shell**
- [ ] Root layout with default metadata (title template, description, Open Graph defaults, favicon).
- [ ] Responsive header with primary navigation and a **prominent Request a Quote CTA** — per the PRD this appears on every page, so it belongs in the shell, not on individual pages.
- [ ] Footer skeleton with the legal-page slots (Privacy, Terms) wired but unpopulated.
- [ ] Working mobile navigation — a real mobile pattern, not a shrunken desktop menu.
- [ ] A placeholder home page proving the shell, tokens and fonts render end-to-end.

**5. Firebase wiring**
- [ ] `lib/firebase/client.ts` — browser SDK, safe for client bundles.
- [ ] `lib/firebase/admin.ts` — Admin SDK, **must begin with `import "server-only"`**. This SDK bypasses all security rules; if it reaches a client bundle the database is effectively public.
- [ ] Update `.env.example` with every required key — **names only, never values**.
- [ ] Commit `firebase.json`, `firestore.rules`, `storage.rules`, `firestore.indexes.json`. Rules start **deny-all**; later tickets open them deliberately.

**6. Deploy + document**
- [ ] Deploy to a **staging** App Hosting backend on `*.web.app`.
- [ ] Staging must send `X-Robots-Tag: noindex` **and** serve a `robots.txt` that disallows everything. Staging must never be indexed.
- [ ] Create `docs/INFRA.md` documenting every console-only setting: project ID, backends, env var names, authorised domains, budget alert. Write it as you go.
- [ ] `README.md` with clone → install → env → run → deploy steps, written for someone with no context.

## 🎯 Acceptance Criteria

- [ ] `npm run build` and `npm run lint` both pass clean, with no TypeScript errors.
- [ ] Viewing source on the deployed staging home page shows **real server-rendered HTML** — content and `<meta>` tags present in the raw response, not injected by JavaScript. *(Verify with `curl` on the staging URL, not DevTools — DevTools shows the post-JS DOM and will hide a failure here.)*
- [ ] Zero references to Vite, Playfair Display, `#c9a227` gold, or Hotel Dreamland assets remain anywhere in the repo. `grep -ri "playfair\|c9a227\|dreamland"` returns nothing.
- [ ] `/styleguide` renders every colour token, the full type scale, and every button/form/card state.
- [ ] The design reads as a credible premium industrial brand in **red/black/white** — a reviewer unfamiliar with the project should not mistake it for a generic template.
- [ ] Header, nav, mobile menu and footer work correctly at 375px, 768px, 1280px and 1920px.
- [ ] Request a Quote CTA is visible and reachable from the shell on every viewport, including mobile.
- [ ] `lib/firebase/admin.ts` is provably server-only — importing it from a client component fails the build.
- [ ] Firestore and Storage rules are committed and deny all access by default.
- [ ] Staging returns `noindex` and a disallow-all `robots.txt`. Confirm with `curl -I`.
- [ ] `docs/INFRA.md` and `README.md` are complete enough for a different developer to recreate the project cold.
- [ ] Lighthouse mobile performance ≥ 90 on the placeholder home page. If it can't clear 90 with almost nothing on the page, it never will with real content.

## 🖼️ UI standards

Applies to all UI work on this project. Web-adapted from the team standard.

**Design fidelity**
- [ ] **This ticket is the documented exception to "match the design exactly"** — no design exists; you design against the brand rules in Context. Every *later* UI ticket inherits the system you build here.
- [ ] All colour, spacing and radius values come from tokens. **No hardcoded hex, no arbitrary `[#ff0000]` Tailwind values in components.**
- [ ] Reuse and extend `components/ui/*`. Never hand-roll a second button.

**Theming**
- [ ] **Single brand theme — no dark mode.** Deliberately descoped (manager decision): the client never requested it and it roughly doubles design QA. Still structure tokens semantically (`--surface`, `--text-primary`, not `--black`) so a future theme isn't a rewrite.

**Components**
- [ ] Prefer the existing Radix primitives and semantic HTML over hand-rolled widgets. Use real `<button>`, `<nav>`, `<header>`, `<main>`, `<footer>`.
- [ ] Where a design idea can't be built accessibly with a native/Radix component, say so in the ticket thread with the trade-off, then proceed with the closest accessible approach.

**Layout & responsiveness**
- [ ] Responsive from 320px to 1920px+. Fluid layouts, not fixed pixel positions. Cap content width and centre on large screens.
- [ ] Full-bleed sections respect **iOS safe-area insets** so hero content isn't lost under a notch in mobile Safari.
- [ ] Overflowing text ellipsizes cleanly on the intended number of lines — never clips, overlaps, or breaks the layout.

**Input**
- [ ] Correct input types and `inputmode` per field (`email`, `tel`, numeric), sensible `autocomplete` hints, and appropriate `enterkeyhint`.
- [ ] The focused field stays visible when the mobile keyboard opens.
- [ ] Phone numbers are **tap-to-call** (`tel:` links) on mobile.

**States & feedback**
- [ ] Define **loading, empty, error and disabled** states for anything that fetches or submits. No silent failures, no raw error dumps.
- [ ] Consistent hover/focus/active feedback from the design system. Keep motion purposeful and **respect `prefers-reduced-motion`**.

**Accessibility & content**
- [ ] Semantic HTML, logical focus order, visible focus indicators, keyboard navigable throughout.
- [ ] Layouts survive browser font-size increases (use `rem`, not fixed `px`, for type).
- [ ] Touch targets ≥ 44px. Colour contrast meets **WCAG AA** — check this against red-on-black early, it's the most likely place this palette fails.
- [ ] Every image has meaningful `alt`. Use **`next/image`** everywhere; no raw `<img>`.
- [ ] No hardcoded user-facing strings scattered through components — centralise shell/chrome copy. *(English-only for v1; a full i18n layer is explicitly out of scope, but don't make one impossible.)*

**Verification**
- [ ] Verify at 375px, 768px, 1280px, 1920px, at increased browser font size, and in Chrome + Safari before marking done.

## 🚫 Out of scope

- Real page content and copywriting (the 7 industry pages, Company/Capabilities).
- The admin panel, authentication, roles, and CMS wiring.
- Firestore collections and typed data accessors — **ticket 2**.
- The Request a Quote form, Cloud Functions, reCAPTCHA, and email.
- Per-page SEO metadata beyond layout defaults, sitemap, structured data, and the 301 redirect map.
- GA4, GTM, and cookie consent.
- Production deployment or any DNS change on `infini.co.in`.
- Dark mode (see UI standards).
- Migrating WordPress content.

## 🔗 Dependencies

- **Blocks:** all subsequent tickets. Nothing else starts until this merges.
- **Blocked by:** nothing. Start immediately.
- **Soft dependency:** official INFINI brand assets from the client. Interim assets from the live site are acceptable — do not let this stall the ticket.
- **Checkpoint:** on completion, `/styleguide` plus the staging home page become the **design-direction review** with the manager. This is the gate that stops week 4 being the first time anyone sees the look. Do not start ticket 4 (homepage) before that review happens.

## 📚 References

- [`CLAUDE.md`](../../CLAUDE.md) — architecture rules. Read before writing code.
- [`docs/PRD.md`](../PRD.md) — full spec. §4 architecture, §5.1 design system, §10 decision log (D1 Next.js, D3 in-code design, D5 infra ownership, D7 URL strategy).
- [`docs/PROCESS.md`](../PROCESS.md) — ticket workflow.
- `https://infini.co.in` — current site being replaced (WordPress); interim asset source.
- `https://mmptechnology.com/` — quality benchmark and global MMP sibling brand. Calibrate against; do not copy.

## 🤖 Kickoff prompt (paste into Claude Code)

```
/start-ticket <this-issue-number>
```
