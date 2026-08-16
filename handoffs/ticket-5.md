**Ticket:** #5 — Firestore schema, typed data accessors, and security rules

## Summary

Builds the typed data layer every page and admin screen reads through: TypeScript types for all 12 collections in `lib/types/`, one typed accessor module per collection in `lib/data/`, and Firestore/Storage security rules that enforce `published == true` for public reads server-side, not just in the accessor. `leads` is denied to every client identity from this ticket forward, before the collection has any real writer — the RFQ Cloud Function (T17) is the only thing that will ever write it, via the Admin SDK, which bypasses these rules entirely. SEO metadata lives as a `seo` map embedded on each document rather than a separate collection, so it can never drift out of sync with the content it describes. A seed script populates the 7 industries, certifications, and sample content for local development against the emulator.

## Files changed

- `lib/types/{common,seo,user,industry,page,caseStudy,certification,news,testimonial,event,lead,media,settings}.ts` — one file per collection (plus shared `common`/`seo` types), matching the PRD data model. `WithId<T>` adds the Firestore document ID to a collection's shape, as every accessor returns it.
- `lib/data/{industries,pages,caseStudies,certifications,news,testimonials,events,leads,media,settings,users}.ts` — one accessor module per collection, covering list/by-slug/by-industry/published-only variants as each later ticket needs them. `lib/data/firestore.ts`'s `requireDb()` throws loudly if Firebase isn't configured, rather than silently rendering empty content.
- `backend/firestore.rules` — public read gated on `published == true` (or `status == "published"` for `news`) per collection; admin writes gated on a verified `role` custom claim (the claim itself doesn't exist until T6, but the rule is written against it now); `leads` explicitly denied to all reads and writes, not just omitted from the rules (an explicit deny documents the boundary and blocks a future permissive rule from accidentally opening it).
- `backend/storage.rules` — public read on the `media/` path; writes gated the same way as Firestore, with content-type and size limits (10MB image, 20MB PDF) enforced in the rules themselves.
- `backend/firestore.indexes.json` — composite indexes for every `published`+sort-field query the accessors use.
- `backend/scripts/seed.ts` — populates the emulator with all 7 industries, certifications, and light sample content for the rest, for local dev; refuses to run without `FIRESTORE_EMULATOR_HOST` set, so there's no credential path that could reach the real project.
- `docs/DATA-MODEL.md` — documents the model collection by collection, including which fields are admin-editable.

## How to test

```bash
grep -rn "getDocs\|collection(" app/ components/   # empty — every query lives in lib/data/
npm run seed                                        # populates the emulator, all 7 industries with correct slugs
```

In the Firebase Rules Playground: confirm an unauthenticated read of an unpublished document is denied, and confirm `leads` reads/writes are denied for every identity, including an authenticated one with a role claim.

## Acceptance criteria

- [x] `grep -rn "getDocs\|collection("` on `app/`/`components/` returns nothing — confirmed, still holds after every later ticket built on top of this layer.
- [x] Unpublished documents are invisible to an unauthenticated read — enforced in `backend/firestore.rules`, not just the accessor's `where("published", "==", true)` filter.
- [x] `leads` reads and writes are denied to every client identity, including an authenticated admin — the explicit `allow read, write: if false` (later narrowed by T7 to allow Super Admin/Leads Manager to *read*, per the PRD's own role matrix — writes stay denied to every client permanently).
- [x] Seed script runs clean against an empty emulator and produces all 7 industries with correct slugs.
- [x] No `any` in the type definitions — confirmed via grep.
- [x] Every composite query has a matching index — no runtime index errors once deployed (confirmed during later work, after the indexes were actually deployed to the live project).

## Deviations / decisions

- Rules reference a `role` custom claim that doesn't exist until T6 lands — writing the rule against it now (rather than leaving content collections open until auth exists) means there's never a moment where the deployed rules are more permissive than the final intended state.
- `leads`' read rule was written as a hard `false` for every identity in this ticket, then narrowed later (T7) to allow Super Admin/Leads Manager reads once the admin dashboard needed a "recent leads" widget — writes remain permanently denied to all clients, matching this ticket's original intent exactly.

## Open questions / follow-ups

- Composite indexes are defined in `backend/firestore.indexes.json` from this ticket but need an explicit `firebase deploy --only firestore:indexes` to actually take effect on a given project — worth confirming that's part of the standard deploy checklist so a fresh project doesn't silently hit "index required" errors on its first real query.
