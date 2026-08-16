**Tickets:** #9 (Homepage), #10 (Industry pages), #11 (Company & Capabilities) — Firestore data-layer fix

This isn't a new ticket; it's a correction to three tickets already marked done in an earlier session, discovered while scoping T12.

## Summary

T9, T10, and T11 were previously reported complete, but the actual pages all rendered from the original Vite boilerplate's static `/data/*.ts` files, not from the typed `lib/data/*` Firestore accessors T5 built. This is a direct violation of two non-negotiable rules in `CLAUDE.md`: all Firestore queries must live in `lib/data/` (implying pages use it — they used none of it), and nothing admin-editable may be hardcoded. In practice, an admin publishing a change in Firestore would have changed nothing on the live site. Found because T12's "reusable certifications block for industry pages" needs a real `industries` collection to attach to via `relatedCertIds`, and there wasn't one being read.

Every public page and section component that read from `/data/*` now reads from Firestore instead: Navbar/Footer from `settings`, the homepage from `pages/home`'s flexible `sections[]` plus the `industries`/`testimonials`/`news`/`caseStudies` collections, industry pages from `industries`, and company/capabilities from `pages/company`/`pages/capabilities`. The 10 static `/data/*.ts` files are deleted. Real launch content (the actual industry copy, corrected certifications list, settings, page sections) is seeded into `infini-2fdec` via a new script, and the emulator seed script shares the same content source so local dev and the real project can't describe INFINI differently.

## Files changed

**Schema extensions** (additive — nothing published yet, no migration cost)
- `lib/types/industry.ts` — `IndustryHero` gained `eyebrow`; `capabilities` changed from `string[]` to `{title, description}[]`; added `relevance: string`. The static file's copy was richer than T5's original schema; extended to match rather than lose content.
- `lib/types/settings.ts` — `NavLink` gained optional `children?: NavLink[]` (the existing dropdown nav structure had nowhere to live in the flat original type); added `footerLegalLinks: NavLink[]`.
- `lib/types/homeSections.ts` (new) — typed shapes (`HeroCopy`, `StatItemData`, `TechnologyStep`, `TeaserCopy`) for `pages/home`'s section `fields`, narrowed via a new `getSection<T>()` helper in `lib/data/pages.ts`.

**Content source**
- `backend/scripts/content.ts` (new) — the single source of the actual industry/certification/settings/pages copy, shared between `seed.ts` (emulator) and `seed-real-content.ts` (new — targets the real project directly, same project-ID safety-guard pattern as `bootstrap-super-admin.ts`). Corrected the certifications list to the five T12 actually names (ISO 9001:2015, ISO 13485:2016, ISO 14001:2015, ISO 45001:2018, Udyam Registration) — the previous seed data had four certs including an AS9100D that isn't on T12's confirmed list.

**Pages rewired to fetch from Firestore** — `app/(public)/layout.tsx`, `app/(public)/page.tsx`, `app/(public)/industries/page.tsx`, `app/(public)/industries/[slug]/page.tsx`, `app/(public)/company/page.tsx`, `app/(public)/capabilities/page.tsx`.

**Section components converted from static-import to props** — `components/layout/{Navbar,Footer}.tsx`; `components/sections/hero/{Hero,HeroContent,HeroShowcase,ShowcaseCard}.tsx`; `components/sections/stats/{StatsSection,StatItem}.tsx`; `components/sections/technology/TechnologySection.tsx`; `components/sections/industries/{IndustriesSection,IndustryCard}.tsx`; `components/sections/case-studies/CaseStudiesSection.tsx`; `components/sections/testimonials/TestimonialsSection.tsx`; `components/sections/news/NewsSection.tsx`; `components/sections/contact/{ContactSection,ContactForm}.tsx`.

**New**
- `lib/constants/industryIcons.tsx` — per-industry icon choice stays a code-level lookup (Firestore can't store a React component; this is a design decision, not admin content). Deliberately a component (`<IndustryIcon slug={...} />`), not a `const Icon = getIndustryIcon(slug)` lookup used directly as a JSX tag — the latter trips the React Compiler eslint rule (`react-hooks/static-components`) that flags a capitalized variable assigned from a function call and used as a component, since it can't statically prove the returned reference is stable across renders.

**Deleted** — `data/{capabilities,case-studies,company,contact,home-hero,industries,nav,news,technology,testimonials}.ts` (10 files, nothing imports them anymore).

## How to test

1. `npx tsc --noEmit`, `npx eslint .`, `npm run build` — all clean; all 7 industry pages statically generate against real Firestore data (`generateStaticParams` hits the live project during build).
2. `curl http://localhost:3100/` and `/company` — confirmed rendering real seeded copy ("A finish that performs", "Cutting Tools", "Parwanoo", "specialist surface-finishing partner"), not the old static placeholder text.
3. Load each industry page and confirm its "Relevant certifications" section shows real certificate names (via `relatedCertIds`), not the old hardcoded text badges.
4. Compare `/company` and `/capabilities`'s "Certifications" line against the live `certifications` collection — it's generated from `getPublishedCertifications()`, not a hardcoded sentence, so adding/removing a cert in Firestore should change this text without a deploy (not manually verified this session).

## Acceptance criteria

There's no formal acceptance-criteria list for a cross-ticket fix like this — the bar is "T9/T10/T11 actually satisfy `CLAUDE.md` rules 1 and 7, which they didn't before." Confirmed via the build succeeding against live Firestore data and the smoke test above.

## Deviations / decisions

- **Scope was deliberately widened at your direction.** I first proposed narrowing the fix to just industries + company/capabilities (what T12 strictly needs); you asked for everything (nav, footer, hero, stats, technology, testimonials, news, contact form) wired properly instead. This handoff covers the full scope actually built.
- **Section "chrome" copy (eyebrow labels, short section headings like "The MMP process") stays in code, not Firestore.** Drew a line between genuine editorial content (hero copy, stats, technology description, company facts/summaries, capabilities descriptions — all moved to `pages/*`) and structural/taxonomy labels that are low business value to make admin-editable and would have expanded this fix further. Flagging explicitly rather than deciding silently — worth confirming this line is in the right place.
- **`CaseStudiesSection`/industry-detail case-study cards use `caseStudy.challenge` as the summary text**, since the real `CaseStudyDoc` schema (T5) has no `summary`/`industry`-name field the way the old static shape did. Cosmetic only — no case studies exist yet (T13), so this renders the empty state everywhere today; T13 will design this properly.
- **Industry detail page's certifications section is a minimal badge list** (name + link to `/certifications`), not the full card-with-logo-and-download block — that's explicitly T12's scope ("reusable certifications block"), not this fix's. This fix only makes sure the *data* (`relatedCertIds` → real `Certification` docs) is real; T12 builds the rich display.
- **Live infra actions taken this session, approved:** deployed the Firestore composite indexes in `backend/firestore.indexes.json` (committed since T5, never actually deployed — the `published`+`order` queries were failing without them, which is what surfaced this during the build); ran `seed-real-content` against `infini-2fdec`.

## Open questions / follow-ups

- This handoff doesn't get its own GitHub issue/PR number — it's filed alongside T7 and T8's handoffs since all three landed in the same session. Worth deciding whether to retroactively note this fix against issues #9/#10/#11 or just reference this file.
- `docs/tickets/T9-*.md` doesn't exist as a file (T9 was never drafted as a separate ticket doc the way T10/T11 were) — if a T9 ticket doc gets created later, it should note this fix.
- Section eyebrow/heading copy being code-level (see Deviations) is a judgment call, not a hard rule from `CLAUDE.md` — revisit if the client specifically asks to edit those.
