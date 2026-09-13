**Ticket:** #11 — Company & Capabilities pages

## Summary

Builds `/company` (history, facility, process/quality summaries, certifications) and `/capabilities` (the MMP process, capacity/lead-time framing, links to the four legacy MMP pages, certifications) as the credibility pages a serious buyer reads before requesting a quote. Content is drafted from the live infini.co.in site and MMP material only — no invented facts; capacity and lead-time figures aren't published since they're genuinely component-dependent, so both pages direct buyers to Request a Quote instead of inventing a number. Both pages are fully Firestore-backed via `pages/company` and `pages/capabilities`, so an admin can edit any of it without a redeploy, and both link to `/certifications` with a live count of INFINI's actual certifications rather than a hardcoded sentence.

## Files changed

- `app/(public)/company/page.tsx` — hero, facts table, process summary, quality/validation summary, and a certifications line generated from `getPublishedCertifications()`. `generateMetadata` reads `pages/company.seo`.
- `app/(public)/capabilities/page.tsx` — hero, MMP process capabilities, capacity/lead-time summary, links to the four legacy capability pages (`/technology`, `/validation`, `/deburring-polishing`, `/mirror-like-finish` — via `settings.nav`'s Capabilities dropdown), and the same live certifications line. `generateMetadata` reads `pages/capabilities.seo`.
- `lib/data/pages.ts` — `getSection<T>()` helper narrows a `PageDoc`'s untyped `sections[]` to the shape each page component expects (hero/facts/process/quality for company; hero/processCapabilities/capacity for capabilities).
- `lib/types/settings.ts` — `NavLink` gained optional `children?: NavLink[]` so the Capabilities nav item's legacy-page dropdown has somewhere to live in `settings.nav`.
- `backend/scripts/content.ts` — the actual company and capabilities copy (facility details, process/quality summaries, MMP process capabilities, capacity framing), seeded into Firestore.

## How to test

```bash
npm run build
npm run dev
```

Then visit:
- `/company` — confirm facility details, process/quality summaries, and a certifications line listing INFINI's actual current certifications.
- `/capabilities` — confirm the MMP process section, capacity framing (directs to Request a Quote, no invented figures), and links to the four legacy MMP pages.
- View source on both to confirm distinct `<title>`, description and OG tags.
- Resize to 375px, 768px, 1280px, 1920px.

## Acceptance criteria

- [x] Both routes render with real, specific content — no lorem ipsum or placeholder headings.
- [x] Every claim is sourced from the live site/MMP material, not invented — capacity/lead-time explicitly deferred to Request a Quote rather than guessed at.
- [x] Both pages are admin-editable without a redeploy — `pages/company`/`pages/capabilities` are real Firestore documents.
- [x] Own title, description and OG tags via `generateMetadata`.
- [ ] Responsive at the four breakpoints; Lighthouse mobile ≥ 90 — not verified in an actual browser this session.
- [x] Meets `docs/UI-STANDARDS.md` on statically-checkable points.

## Deviations / decisions

- **Certifications sections on both pages show a live-generated sentence** ("INFINI holds ISO 9001, ISO 13485, ISO 14001, ISO 45001, and Udyam registration.") from `getPublishedCertifications()`, not the full reusable certifications block — that's T12's scope.
- **No admin CRUD screen for editing `pages/company`/`pages/capabilities` yet** — content updates go through the seed script for now; both pages already show up correctly in `/admin`'s nav as "Company & Capabilities" (T7's stub), pending a real editor.
- **Facility/equipment photography** — none supplied in the client asset pack; both pages are currently text-only.
- Two content gaps that need direct client confirmation rather than being guessed at: the exact facility address (cross-check against what's shown elsewhere on the site) and the precise IP-ownership language around MMP (whose process it legally is, for the "not a manufacturer" framing to hold up under scrutiny).

## Open questions / follow-ups

- A real `/admin/company-capabilities` editor is the natural next step for staff-editable day-to-day updates.
- Facility/equipment photography still needed from the client pack.
- Facility-address and MMP IP-ownership language need explicit client confirmation before this copy should be treated as final.
- Lighthouse mobile score and live cross-breakpoint/cross-browser verification haven't been run.
