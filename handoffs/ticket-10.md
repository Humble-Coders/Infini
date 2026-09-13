**Ticket:** #10 — Industry pages (7) with unique content + admin CRUD

## Summary

Adds the public-facing industry pages: an index at `/industries` listing all 7, and a statically-generated detail template at `/industries/[slug]` covering overview, capabilities, applications/materials, relevant certifications, related case studies, and a Request a Quote CTA. All 7 industries have genuinely distinct copy — hero, relevance framing, capabilities, applications and materials differ per industry, written to what an actual buyer in that sector cares about (e.g. edge geometry for Cutting Tools vs. contamination control for Medical Implants). ISO 13485 is referenced on the Medical Implants page via a real certification document. Content is fully Firestore-backed via `lib/data/industries.ts`, so an admin can change any of it without a redeploy.

## Files changed

- `app/(public)/industries/page.tsx` — index page, fetches `getPublishedIndustries()`, card grid linking to each detail page.
- `app/(public)/industries/[slug]/page.tsx` — detail template; `generateStaticParams` calls `getPublishedIndustrySlugs()` (all 7 pages statically generate at build time against real Firestore data), `generateMetadata` and the page body use `getIndustryBySlug()`. The certifications section calls `getCertificationsByIds(industry.relatedCertIds)` and renders real certificate names linking to `/certifications`. Case studies section calls `getCaseStudiesByIndustry()` with a designed empty state (T13 hasn't landed content yet).
- `lib/types/industry.ts` — `IndustryHero` includes `eyebrow`; `capabilities` is `{title, description}[]`; added `relevance: string` for the "why surface finish matters here" section.
- `components/sections/industries/{IndustriesSection,IndustryCard}.tsx` — accept `industries: WithId<IndustryDoc>[]` as a prop (shared with the homepage teaser).
- `lib/constants/industryIcons.tsx` — per-industry icon choice as a small `<IndustryIcon slug={...} />` component (icon choice is a design decision, not admin content — Firestore stores the industry's data, not a React component reference).
- `backend/scripts/content.ts` — the 7 industries' full copy (hero, relevance, capabilities, applications, materials, `relatedCertIds`), seeded into Firestore.

## How to test

```bash
npm install
npm run build   # confirms all 7 detail pages statically generate against live data
npm run dev
```

Then visit:
- `/industries` — index grid of all 7.
- `/industries/cutting-tools` (and the other 6 slugs: `forge-stamping-die`, `plastic-injection-molds`, `medical-implants`, `aerospace`, `additive-manufacturing`, `gears-transmission`).
- `/industries/medical-implants` — confirm ISO 13485 appears in the certifications section.
- View source on at least two detail pages to confirm distinct `<title>` and OG tags.
- Resize to 375px, 768px, 1280px, 1920px.

## Acceptance criteria

- [x] All 7 pages exist at the exact slugs specified in the ticket.
- [x] No two pages share substantially the same body copy — each industry's `relevance`, `capabilities`, `applications`, and `materials` are written to that industry's actual concerns.
- [x] ISO 13485 is referenced on the Medical Implants page, via a real `Certification` document (`relatedCertIds: ["iso-9001-2015", "iso-13485-2016"]`).
- [x] Each page has its own title, description and OG tags — `generateMetadata` per detail page, reading the live document's `seo` map.
- [x] Case-study blocks render an empty state cleanly while T13 is outstanding.
- [~] **Admin can edit every field and see changes live without a redeploy — data layer supports this fully; the `/admin/industries` CRUD screen itself is still a stub** (T7 built the shell and shared patterns it'll use: `DeleteConfirmDialog`, `PublishToggle`, `FormActions`).
- [~] A Content Editor can edit; a Leads Manager cannot — enforced correctly at the Firestore rules layer (verified in `backend/firestore.rules.test.ts`), but there's no admin UI to exercise it through yet.
- [ ] Responsive at the four breakpoints; Lighthouse mobile ≥ 90 — not verified in an actual browser this session.
- [x] Meets `docs/UI-STANDARDS.md` on statically-checkable points: design tokens only, Radix/`components/ui` reuse, semantic headings.

## Deviations / decisions

- **Certifications display on the detail page is a minimal badge list (name + link to `/certifications`)**, not the full card-with-logo-and-download treatment — that's T12's scope ("reusable certifications block for industry pages and Company/Capabilities").
- **No industry photography** — none supplied in the client asset pack; icon-based treatment used instead of placeholder stock photos. `next/image` will be introduced when real photography lands.
- **Admin CRUD screen is not built in this pass** — the data model and rules are real and correct; the `/admin/industries` list/edit UI itself is still T7's "coming soon" stub.

## Open questions / follow-ups

- `/admin/industries` needs a real CRUD screen (list, edit, reorder, publish/unpublish) — the shared patterns from T7 exist specifically so this doesn't start from scratch.
- Lighthouse mobile score and live cross-breakpoint/cross-browser verification (Chrome + Safari, per `docs/UI-STANDARDS.md`) haven't been run.
- Real industry photography is still needed from the client/live-site pack.
- `/request-a-quote?industry=<slug>` is linked from every detail page but that route doesn't exist yet (T17) — expected per this ticket's scope, will 404 until then.
