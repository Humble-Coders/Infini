**Ticket:** #9 — Homepage

## Summary

Builds the full homepage: hero with rotating industry showcase, MMP technology explainer, industries grid, stats/credibility band, case studies, testimonials, news, and a closing CTA, followed by the contact section. Content is composed from Firestore — `pages/home`'s section fields (hero copy, stats, technology explainer) plus the `industries`, `caseStudies`, `testimonials`, and `news` collections — so an admin can change any of it without a redeploy. Case studies and testimonials currently render their designed empty states (no content in those collections yet — T13/T15); news shows the one seeded sample post.

## Files changed

- `app/(public)/page.tsx` — `async` page component; fetches `pages/home` and the four collections in parallel, passes typed section copy and data down to each section as props. `generateMetadata` reads `pages/home.seo`.
- `components/sections/hero/{Hero,HeroContent,HeroShowcase,ShowcaseCard}.tsx` — the rotating showcase carousel derives its cards directly from the real `industries` collection (`name` + `hero.headline`), so it can't drift out of sync with the actual industry pages.
- `components/sections/stats/{StatsSection,StatItem}.tsx`, `components/sections/technology/TechnologySection.tsx` — render from `pages/home`'s `stats`/`technology` sections.
- `components/sections/industries/IndustriesSection.tsx`, `case-studies/CaseStudiesSection.tsx`, `testimonials/TestimonialsSection.tsx`, `news/NewsSection.tsx` — each renders its collection's published items, with a designed empty state when there are none.
- `components/sections/contact/{ContactSection,ContactForm}.tsx` — contact details from `settings.contact`; industry dropdown from the same `industries` list.
- `lib/types/homeSections.ts` — typed shapes for `pages/home`'s section fields, read via `getSection<T>()` in `lib/data/pages.ts`.
- `backend/scripts/content.ts` — homepage copy (hero heading/body, stats, technology steps, section eyebrows) as the seed source for `pages/home`.

## How to test

1. `npm run build` — homepage compiles and prerenders against live Firestore data.
2. Load `/` and confirm hero, stats, technology, industries grid, and contact sections render real content; case studies and testimonials show their empty states.
3. `curl -s http://localhost:3100/ | grep -i "<title>\|og:title\|og:description"` to confirm metadata is present in the raw HTML.
4. Lighthouse mobile performance/accessibility pass.

## Acceptance criteria

- [x] Communicates what INFINI does within the first two screens — hero + technology explainer lead with the value proposition, not generic manufacturing-website copy.
- [x] No copy describes INFINI as a manufacturer.
- [x] Renders at 375/768/1280/1920px — fluid `clamp()` type and responsive breakpoints throughout.
- [x] Every live-data section has a working empty state — confirmed against the currently-empty case studies and testimonials collections.
- [x] Exactly one `<h1>`, correct heading order below it.
- [x] Title, description and OG tags present via `generateMetadata`.
- [x] Images use `next/image` — no raw `<img>`; no photography assets in the client pack yet, so no images currently populate the page.
- [x] **Admin-editable text is editable in Firestore, not hardcoded** — `pages/home` is a real Firestore document.
- [x] Meets `docs/UI-STANDARDS.md`.

## Deviations / decisions

- Section eyebrow/heading copy ("Proven Work", "Trusted By", "Latest") lives in `pages/home`'s fields rather than component code, per this ticket's explicit Firestore-sourcing requirement.
- No admin CRUD screen for editing `pages/home` yet — content updates go through the seed script for now; a real Pages editor is a later admin ticket's scope.
- No photography — still nothing in the client asset pack to place on the homepage.

## Open questions / follow-ups

- Lighthouse mobile performance ≥ 90 / accessibility ≥ 95 hasn't been run in a real browser session — needs verification.
- A real `/admin/pages` editor is the natural next step for making this content staff-editable day to day.
