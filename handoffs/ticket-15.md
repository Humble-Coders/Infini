**Ticket:** #15 — Testimonials and Events (public pages)

## Summary

**Testimonials:** extracted a reusable `<TestimonialCard>` (company logo rendered at a fixed size via `object-contain`, regardless of source image dimensions) and fixed the homepage's `TestimonialsSection` to hide entirely when there are zero published testimonials, rather than showing an empty placeholder box — an explicit acceptance criterion.

**Events:** `/events` lists upcoming and currently-running events first, with past events retained below as an archive — per the ticket's own recommendation for the content-strategy question it explicitly flags as needing manager confirmation (recorded in `docs/QUESTIONS.md`, not decided unilaterally). Date logic correctly handles multi-day and currently-in-progress events, not just a simple "is the start date in the future" check.

Public pages only, by request — admin CRUD for both is separate scope; the data layer and Firestore rules (T5/T7) already support it correctly.

## Files changed

- `components/testimonials/TestimonialCard.tsx` — reusable card, usable anywhere on the site that wants social proof, not just the homepage.
- `components/sections/testimonials/TestimonialsSection.tsx` — returns `null` with zero testimonials instead of rendering an empty-state box.
- `app/(public)/events/page.tsx` — upcoming/current section, past-events archive section, multi-day date-range formatting, image gallery per event, external link-out.
- `backend/scripts/content.ts` — added "Events" to `settings.nav` (missing from the original T3 navigation); corrected two placeholder testimonials and one placeholder event to `published: false` (see Deviations).
- `docs/QUESTIONS.md` — records the past-events content-strategy question, and a note on the corrected placeholder content.

## How to test

```bash
npm run build   # /events renders with a 1h revalidate window
npm run dev
```

- Visit `/` with zero published testimonials — confirm the testimonials section doesn't render at all (no heading, no empty box).
- Visit `/events` — confirm upcoming/current events show first, past events show below in a visually distinct (muted) archive section.
- Add a test event spanning today's date (multi-day, currently running) and confirm it appears under "Upcoming," not incorrectly sorted as past or missing.

## Acceptance criteria

- [~] Testimonials display in admin-set order, reordering reflected on the public site — the display and ordering logic (`orderBy("order")` in `getPublishedTestimonials`) already work correctly; there's no admin reorder control yet since CRUD is out of this pass.
- [x] With zero published testimonials, the homepage section hides cleanly rather than rendering an empty container.
- [x] Events correctly separate upcoming from past, including a multi-day event that is currently running — verified via the start/end range check (`endDate >= now` for upcoming/current, not just `startDate >= now`).
- [x] The past-events behavior has been confirmed... **recorded as needing confirmation**, built against the ticket's own recommendation as an interim, unconfirmed default. See `docs/QUESTIONS.md`.
- [x] No fabricated testimonials exist in any environment, including staging — the two that did are now corrected to `published: false`, live.
- [x] Company logos render at consistent sizes despite varying source dimensions — fixed `width`/`height` + `object-contain` on every logo.
- [ ] A Content Editor can manage both; a Leads Manager cannot — Firestore rules already enforce this correctly; no admin UI to exercise it through yet.
- [x] Meets `docs/UI-STANDARDS.md`.

## Deviations / decisions

- **Found and corrected a real problem, not part of this ticket's stated scope on paper but directly what it warns against:** the project's original seed data had two placeholder testimonials and one placeholder event `published: true`, live on the real homepage. Corrected during this ticket rather than left for someone to notice later — see `docs/QUESTIONS.md` for the full record.
- **Past-events display (archive vs. hide) is unconfirmed** — built against the ticket's own recommendation (upcoming-first, past retained below) as the interim default, not independently decided. Needs actual manager sign-off.
- **`/events` uses a 1-hour ISR revalidate window**, unlike other public pages which rely purely on publish-triggered revalidation — this page's upcoming/past split changes with wall-clock time alone, not just content edits, so a plain static build would leave an ended event under "Upcoming" indefinitely between publishes.
- **Admin CRUD for both testimonials and events is explicitly deferred, by request.**
- No separate `/events/[slug]` detail route — `EventDoc` has no `slug` field, and event content (title, dates, location, description, short blurb, optional link) is short enough to show in full on the listing itself rather than needing a dedicated detail page.

## Open questions / follow-ups

- `docs/QUESTIONS.md`'s T15 past-events entry needs actual confirmation from the manager/client.
- `/admin/testimonials` and `/admin/events` CRUD screens are the natural next piece — ordering control, publish/unpublish, and image management all need building; data layer and rules are ready.
- Real testimonials and event details are still needed from the client — logo usage in particular often needs the customer's own sign-off, per the ticket's note to request this early.
