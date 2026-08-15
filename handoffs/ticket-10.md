**Ticket:** #10 — Industry pages (7) with unique content + admin CRUD

## Summary

Adds the public-facing industry pages: an index at `/industries` listing all 7, and a statically-generated detail template at `/industries/[slug]` covering overview, capabilities, applications/materials, relevant certifications, related case studies (with an empty state, since T13 hasn't landed), and a Request a Quote CTA. All 7 industries got genuinely distinct copy — hero, relevance framing, capabilities, applications and materials differ per industry, written to what an actual buyer in that sector cares about (e.g. edge geometry for Cutting Tools vs. contamination control for Medical Implants). ISO 13485 is referenced on the Medical Implants page. The homepage moved into the `app/(public)/` route group alongside the new industries routes, which was a required structural step, not a content change. Content is static (`data/industries.ts`) — Firestore-backed content and the Admin CRUD portion of this ticket are explicitly deferred; see Deviations below.

## Files changed

**Public routes**
- `app/(public)/industries/page.tsx` (new) — industries index, card grid linking to each detail page.
- `app/(public)/industries/[slug]/page.tsx` (new) — detail template, `generateStaticParams` over all 7 slugs, `generateMetadata` from each industry's `seo` map.
- `app/(public)/page.tsx` (renamed from `app/page.tsx`) — homepage moved into the route group so it sits alongside `industries/`.

**Content**
- `data/industries.ts` — expanded from a name/slug/icon stub to full per-industry content: `seo`, `hero`, `relevance`, `capabilities[]`, `applications[]`, `materials[]`, `certifications[]`, plus `industriesIndexCopy` for the index page's header copy.

**Component**
- `components/sections/industries/IndustryCard.tsx` — simplified the hover-reveal "Know More" affordance from a `grid-template-rows` collapse trick to a plain opacity transition; same visual result, less code.

## How to test

```bash
npm install
npm run build   # confirms all 7 detail pages statically generate
npm run dev
```

Then visit:
- `http://localhost:3000/industries` — index grid of all 7.
- `http://localhost:3000/industries/cutting-tools` (and the other 6 slugs: `forge-stamping-die`, `plastic-injection-molds`, `medical-implants`, `aerospace`, `additive-manufacturing`, `gears-transmission`).
- View source / inspect `<head>` on at least two detail pages to confirm distinct `<title>` and OG tags.
- Resize to 375px, 768px, 1280px, 1920px to check responsiveness.

## Acceptance criteria

- [x] All 7 pages exist at the exact slugs specified in the ticket.
- [x] No two pages share substantially the same body copy — each industry's `relevance`, `capabilities`, `applications`, and `materials` are written to that industry's actual concerns, not a swapped-name template.
- [x] ISO 13485 is referenced on the Medical Implants page (`certifications: ["ISO 9001:2015", "ISO 13485 process alignment"]`).
- [x] Each page has its own title, description and OG tags — `generateMetadata` per detail page, static `metadata` on the index page.
- [x] Case-study blocks render an empty state cleanly while T13 is outstanding — verified via `data/case-studies.ts`, currently empty.
- [ ] **Admin can edit every field and see changes live without a redeploy — NOT MET.** No admin panel exists yet (T6/T7/T8 not built). Content is static in `data/industries.ts`.
- [ ] **A Content Editor can edit; a Leads Manager cannot — NOT MET.** Depends on the same missing admin/auth infrastructure.
- [~] Responsive at the four breakpoints; Lighthouse mobile ≥ 90 — layout uses fluid `clamp()` type and `sm:`/`lg:` breakpoints throughout, consistent with the rest of the built site, but **not verified in an actual browser or with Lighthouse this session** (no browser automation tool was available) — code-level review only.
- [x] Meets `docs/UI-STANDARDS.md` on the points checkable without a live browser: design tokens only (no hardcoded hex), Radix/`components/ui` reuse (`Container`, `Button`), semantic headings, `prefers-reduced-motion` handled globally in `app/globals.css`.

## Deviations / decisions

- **Admin CRUD is out of this PR.** The ticket scopes it in, but it's blocked on T6 (auth/roles), T7 (admin shell), and T8 (media library — `<MediaPicker>` reuse), none of which exist in the repo yet. Building it now would mean either faking auth or building throwaway admin UI. Flagging this against CLAUDE.md's "nothing admin-editable may be hardcoded" rule rather than silently treating the ticket as done.
- **No imagery.** The ticket lists industry imagery as content to gather from the client pack or live site; none was supplied, so no images are used anywhere in these pages (icon-based treatment instead of placeholder stock photos). `next/image` will be introduced when real photography lands rather than seeding fake images now.
- **Content is static, not Firestore-backed**, even though `lib/data/industries.ts` (Firestore accessor, from T5) already exists. Wiring these pages to Firestore is bundled with the Admin CRUD deferral above — swapping the data source now, ahead of the admin UI that would actually manage it, would mean seeding data no one can edit yet.
- The `IndustryCard.tsx` animation simplification is a minor unrelated cleanup, not ticket-driven — same visual behavior, fewer wrapper elements.

## Open questions / follow-ups

- When T6/T7/T8 land, this ticket needs a follow-up pass: move `data/industries.ts` content into Firestore (via the seed script or admin entry), point these pages at `lib/data/industries.ts`, and build the Admin CRUD screen.
- Real industry photography is still needed from the client/live-site pack (ticket's own prerequisite, not supplied this session).
- Lighthouse mobile score and live cross-breakpoint/cross-browser verification (Chrome + Safari, per `docs/UI-STANDARDS.md`) haven't been run — no browser tool was available this session.
- `/request-a-quote?industry=<slug>` is linked from both the hero and closing CTA on every detail page, but that route doesn't exist yet (T17) — will 404 until then, which is expected per this ticket's scope but worth knowing before staging review.
