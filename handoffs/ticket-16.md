**Ticket:** #16 — Legacy capability pages, exact slugs preserved

## Summary

Builds `/technology`, `/validation`, `/deburring-polishing`, and `/mirror-like-finish` at their exact legacy URLs — no `/capabilities/` prefix, per PRD decision D7, since each independently ranks for its own search terms and a redirect into a generic hub would throw that ranking away. Content is drafted from the equivalent pages on the live `infini.co.in` site (fetched as source material, per the ticket's own instruction), then genuinely expanded — deeper technical explanation, restructured into clear sections, with no page substantially duplicating another's copy. `/technology` is the canonical deep-dive on how MMP actually works; the other three build on it from their own angle (validation process, comparison to traditional methods, mirror-finish specifics) rather than re-explaining the same ground.

All four are Firestore-backed (`pages/technology`, `pages/validation`, `pages/deburring-polishing`, `pages/mirror-like-finish`), share a common presentational layout, and cross-link to the industries each is actually relevant to.

## Files changed

- `lib/types/page.ts` — `PageId` extended with the four legacy slugs.
- `lib/types/pageSections.ts` (new) — `PageHeroCopy`, `TextBlockCopy`, `ListCopy`: generic section-field shapes shared across `pages/*` documents (distinct from `homeSections.ts`'s homepage-specific shapes — the homepage's hero has no eyebrow, these do).
- `lib/data/pages.ts` — `getContentBlocks(page)`: reads a page's non-hero sections generically (`textBlock` / `list` types, in document order) so each of the four route files doesn't pull sections out by name one at a time.
- `components/legacy-capability/LegacyCapabilityContent.tsx` — the shared layout (hero, content blocks, industry cross-links, RFQ CTA) all four pages render through.
- `app/(public)/{technology,validation,deburring-polishing,mirror-like-finish}/page.tsx` — one route file per slug; each fetches its own `pages/{id}` document plus a fixed, page-relevant subset of industries to cross-link.
- `backend/scripts/content.ts` — the actual drafted copy for all four pages.

## How to test

```bash
npm run build   # all four render as static (○) routes at their exact slugs
```

Visit each of the four URLs directly (no prefix) and confirm:
- Distinct heading/body content, not a copy-pasted template with the name swapped.
- Cross-linked industries are actually relevant (e.g. `/mirror-like-finish` links to Medical Implants and Plastic Injection Molds, not all seven).
- `view-source:` on each shows its own `<title>` and OG tags.

## Acceptance criteria

- [x] All four resolve at exactly `/technology`, `/validation`, `/deburring-polishing`, `/mirror-like-finish` — no prefix, confirmed via the build output's route list.
- [x] Each page's content is materially deeper than a reformat — every page expands on facts pulled from the live site with additional technical framing (frequency-based removal mechanics on `/technology`, the three validation stages spelled out individually on `/validation`, a traditional-technique list contrasted against MMP on `/deburring-polishing`, the strengths-and-constraints framing on `/mirror-like-finish`).
- [x] No two of the four share substantially duplicated copy — `/technology` owns the core mechanism explanation; the other three reference it briefly and focus on their own angle instead of re-explaining frequency-based removal each time.
- [x] Each has its own title, description and OG tags via `generateMetadata` reading the live document's `seo` map.
- [x] Cross-links to industries work and are relevant — each page links only to the industries its content actually names or clearly applies to, not a blanket list (except `/technology`, which legitimately links to all seven as the foundational explainer).
- [ ] Responsive at the four breakpoints; Lighthouse mobile ≥ 90 — not verified in an actual browser this session.
- [x] Meets `docs/UI-STANDARDS.md` on statically-checkable points — reuses the same design tokens and layout patterns as every other public page (no hardcoded hex, confirmed via grep).

## Deviations / decisions

- **Source material was fetched from the live `infini.co.in` pages** (the ticket's own prerequisite: "existing content from the four live pages as source material") rather than invented — the underlying technical facts (mechanical-physical-catalyst process, frequency-based selective removal, the three-stage validation model, the traditional-technique comparison list, mirror-finish applications and constraints) all trace back to that source, then expanded with additional structure and explanation, not fabricated.
- **Cross-links to case studies are not built yet** — `getCaseStudiesByIndustry`/similar exists, but no case studies are published (T13 shipped its template against zero real content). Industry cross-links carry the "relevant, working links" requirement for now; case-study links can be added to `LegacyCapabilityContent` once T13 has real content to link to.
- **`/technology` cross-links to all seven industries**, not a filtered subset like the other three — it's the foundational page every industry's treatment depends on, so this is a deliberate exception, not an oversight.

## Open questions / follow-ups

- Lighthouse mobile score and live cross-breakpoint/cross-browser verification haven't been run.
- Process and equipment imagery, listed as a ticket prerequisite, wasn't supplied — all four pages are currently text-only, same gap as T9/T10/T11.
- Once T13 has real case studies, add case-study cross-links to `LegacyCapabilityContent` alongside the existing industry links.
