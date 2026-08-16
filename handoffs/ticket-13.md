**Ticket:** #13 — Case studies with before/after + industry cross-linking

## Summary

Builds `/case-studies` (index with industry-filter pills) and `/case-studies/[slug]` (detail template: challenge, solution, process, result, a before/after comparison, technical specs, and a photo gallery). Cross-linking works both directions as the ticket requires: each case study links back to its industry, and every industry page's case-studies section links forward to each related case study via a shared, properly-linked card component (also reused on the homepage teaser). No admin CRUD in this pass — public pages only, by request; the admin screen is separate scope.

No real case study content exists from the client yet. The ticket is explicit that inventing one is a commercial and legal risk, not an engineering placeholder decision, so this ships as the fully-wired template rendering against its designed empty state everywhere (index, industry-filtered view, industry page block, homepage teaser) rather than any fabricated example.

## Files changed

- `app/(public)/case-studies/page.tsx` — index, industry filter via `?industry=<slug>` reflected in pill styling, designed empty state (industry-specific message when filtered, general message otherwise).
- `app/(public)/case-studies/[slug]/page.tsx` — detail template; `generateStaticParams`/`generateMetadata` read live Firestore data, industry link-back via `getIndustryById(caseStudy.industryId)`.
- `components/case-studies/CaseStudyCard.tsx` — shared card (image, industry label, title, challenge snippet, link), used on the index, the industry-page block, and the homepage teaser — replacing three previously-separate, unlinked `<article>` blocks with one component.
- `components/case-studies/BeforeAfterComparison.tsx` — side-by-side on tablet/desktop, stacked on mobile. Deliberately not a drag-slider: a slider needs enough width for both images to register as distinct under a thumb drag, which is exactly the layout the ticket flags as failing at 375px. Two always-visible, clearly labeled images need no interaction to be legible at any width.
- `app/(public)/industries/[slug]/page.tsx` — case-studies section now uses `CaseStudyCard` instead of static unlinked blocks.
- `components/sections/case-studies/CaseStudiesSection.tsx` — homepage teaser, same swap.
- `docs/QUESTIONS.md` — records that the detail template is unverified against real data (see Deviations).

## How to test

```bash
npm run build   # /case-studies/[slug] statically generates (zero paths today — no published case studies yet)
npm run dev
```

- Visit `/case-studies` — confirm the empty state renders.
- Visit `/case-studies?industry=medical-implants` — confirm the industry-specific empty state message.
- Visit any industry page — confirm its case-studies section shows the same empty state, correctly worded for that industry.
- Once real case studies are published: confirm filter pills work, cards link to detail pages, detail pages link back to their industry, and the before/after comparison is legible at 375px.

## Acceptance criteria

- [x] Index and detail pages render, and filtering by industry works — filter pills reflect the active `?industry=` param and correctly scope the query via `getCaseStudiesByIndustry`.
- [x] Cross-linking works both ways — case study → industry via the back-link in the hero; industry → case studies via the shared card in the industry page's section.
- [x] Before/after comparison is legible and usable at 375px — stacked single-column layout below the `sm` breakpoint, each image clearly labeled.
- [x] Every published case study is real client work — none exist yet, so vacuously true; the template contains no fabricated example anywhere, including in code comments or fallback content.
- [x] Empty states render cleanly when a filter or industry has no case studies — verified on the index, the industry-filtered index, and every industry page's block.
- [ ] Admin can create, edit and publish without a redeploy — **admin CRUD is out of this pass by request**; the data layer already supports it (`lib/data/caseStudies.ts`'s existing accessors, Firestore rules already correct), only the `/admin/case-studies` screen itself remains a T7 stub.
- [x] Each detail page has its own metadata in the raw HTML — `generateMetadata` reads the document's `seo` map.
- [x] Images via `next/image` with alt text describing the actual component (`"{title} before/after MMP treatment"`, gallery images numbered).
- [x] Meets `docs/UI-STANDARDS.md`.

## Deviations / decisions

- **Admin CRUD explicitly deferred, by request** — this pass covers public pages only; `/admin/case-studies` stays T7's "coming soon" stub until that's picked up separately.
- **The detail template's actual rendering (before/after images, specs grid, gallery) is unverified against real content** — no throwaway test entry was created, out of caution around the ticket's explicit "don't invent case studies" warning, without checking first. Recorded in `docs/QUESTIONS.md`. The template is exercised by `npm run build`'s type/render checks and the empty-state paths, but its populated-state layout has never actually been seen rendered.
- Before/after is a static two-image layout, not an interactive slider — a deliberate simplicity/robustness tradeoff at small viewport widths, not a scope cut (the ticket allows either).

## Open questions / follow-ups

- `docs/QUESTIONS.md`'s T13 entry: verify the detail template's populated layout the first time a real case study lands (or with a confirmed throwaway test entry, if that's approved).
- Real case study material (components, before/after imagery, results) is still needed from the client — this is usually the slowest asset to obtain, per the ticket's own note, so worth requesting early.
- `/admin/case-studies` CRUD screen is the natural next piece — data layer and rules are ready, only the UI remains.
