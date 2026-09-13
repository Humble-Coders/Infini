# DATA-MODEL — Firestore collections, types, and accessors

Companion to `docs/PRD.md` §4.3/§4.4. This is the practical map: which type
lives where, which accessor to call, what's admin-editable, and how each
collection's access is enforced. Update this file whenever a collection's
shape or rules change — it's the reference for T6+ (auth), T7+ (admin CRUD),
and everyone writing a page against `lib/data/`.

See also `lib/types/index.ts` (types), `lib/data/*.ts` (accessors),
`backend/firestore.rules` / `backend/storage.rules` (enforcement),
`backend/scripts/seed.ts` (sample data for local dev).

## Collections

| Collection | Type | Accessor module | Public read | Admin write |
|---|---|---|---|---|
| `industries` | `IndustryDoc` (`lib/types/industry.ts`) | `lib/data/industries.ts` | `published == true` | Super Admin, Content Editor |
| `pages` | `PageDoc` (`lib/types/page.ts`) | `lib/data/pages.ts` | always (no draft state) | Super Admin, Content Editor |
| `caseStudies` | `CaseStudyDoc` (`lib/types/caseStudy.ts`) | `lib/data/caseStudies.ts` | `published == true` | Super Admin, Content Editor |
| `certifications` | `CertificationDoc` (`lib/types/certification.ts`) | `lib/data/certifications.ts` | `published == true` | Super Admin, Content Editor |
| `news` | `NewsDoc` (`lib/types/news.ts`) | `lib/data/news.ts` | `status == "published"` | Super Admin, Content Editor |
| `testimonials` | `TestimonialDoc` (`lib/types/testimonial.ts`) | `lib/data/testimonials.ts` | `published == true` | Super Admin, Content Editor |
| `events` | `EventDoc` (`lib/types/event.ts`) | `lib/data/events.ts` | `published == true` | Super Admin, Content Editor |
| `media` | `MediaDoc` (`lib/types/media.ts`) | `lib/data/media.ts` | no (URLs are copied into content fields) | Super Admin, Content Editor |
| `settings` | `SettingsDoc` (`lib/types/settings.ts`) | `lib/data/settings.ts` | always | Super Admin only |
| `users` | `UserDoc` (`lib/types/user.ts`) | `lib/data/users.ts` | no (self or Super Admin) | Super Admin only |
| `leads` | `LeadDoc` (`lib/types/lead.ts`) | **none** — server-only | never | never (Admin SDK only, via the T17 Cloud Function) |

Roles (`superAdmin` / `contentEditor` / `leadsManager`) come from the Firebase
Auth custom claim `role`, set server-side in T6 — rules read
`request.auth.token.role`, never a Firestore-stored role field, so a client
can't forge access by writing to its own `users` document.

## `leads` — why there's no accessor

Every other collection gets a `lib/data/*.ts` module. `leads` deliberately
doesn't: `backend/firestore.rules` denies read and write to every client
identity, including an authenticated Super Admin. The RFQ Cloud Function
(T17) writes via the Admin SDK, which bypasses rules entirely. The T18 leads
dashboard reads the same way — server-side, through `backend/firebase/admin.ts`,
never through a browser Firestore call. If a `lib/data/leads.ts` ever
appears, that's a sign the boundary got crossed; it shouldn't exist.

## SEO

`seo: SeoMap` (`lib/types/seo.ts`) is embedded on `industries`, `pages`,
`caseStudies`, and `news` documents — never a separate collection, so it's
always fetched with the content it describes and can't drift out of sync.

## Admin-editable fields

Per CLAUDE.md rule 7 ("nothing admin-editable may be hardcoded"), every field
listed in the "Key fields" column of PRD §4.3 is admin-editable through the
future admin CRUD screens (T10–T15). The exceptions, which stay in code:

- Document **IDs / slugs** are set once at creation, not freely re-editable
  after publish (changing a slug breaks the T20 redirect map and any inbound
  links) — the admin UI should treat slug as edit-with-warning, not a plain
  text field.
- `industries[].slug` values are fixed to the 7 already in the URL structure
  (`cutting-tools`, `forge-stamping-die`, `plastic-injection-molds`,
  `medical-implants`, `aerospace`, `additive-manufacturing`,
  `gears-transmission`) — the set of industries is not admin-extensible in v1.
- `pages[].id` is one of the 4 fixed singleton IDs (`home`, `company`,
  `capabilities`, `contact`) — sections within a page are editable, the page
  list itself is not.

## Composite indexes

Every accessor query combining an equality filter with a second field
(another equality filter, or an `orderBy`) has a matching entry in
`backend/firestore.indexes.json`. If you add a new accessor query shape,
add its index here first — Firestore will otherwise fail at read time with
a console link to auto-generate it, which is a worse way to notice.

## Seeding local data

```bash
npm run seed
```

Runs `backend/scripts/seed.ts` inside `firebase emulators:exec`, which
starts the Firestore emulator, sets `FIRESTORE_EMULATOR_HOST` for the
script, seeds the 7 industries + 4 certifications + sample testimonials/
events/news, then tears the emulator down. The script refuses to run
without `FIRESTORE_EMULATOR_HOST` set, so it can't accidentally target a
real project.

> **Not yet verified against a live emulator run** — this machine has Java 17
> and the Firestore emulator requires Java 21+. The script has been
> reviewed and type-checks cleanly, but running `npm run seed` end-to-end
> and confirming the Rules Playground denies unpublished/`leads` reads as
> expected are still open verification steps once a JDK 21 is available.
