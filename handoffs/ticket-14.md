**Ticket:** #14 — News / blog with draft and published states

## Summary

Builds `/news` (paginated index, 9 posts per page, designed empty state) and `/news/[slug]` (detail template rendering the post body as Markdown). Post content is authored as Markdown and rendered through `react-markdown`, mapped to the site's own design-token-styled components rather than a generic typography plugin's defaults — headings, paragraphs, lists, quotes, and links all inherit the same typography system as the rest of the site. This is also what makes rendering safe by construction: `react-markdown` parses content into React elements and never executes raw HTML embedded in the source, so there's no `dangerouslySetInnerHTML` anywhere in the render path, satisfying the ticket's sanitization requirement without a separate sanitizer library.

Drafts are invisible on public routes — `lib/data/news.ts`'s `getNewsBySlug`/`getPublishedNews` (from T5) already filter on `status == "published"`, so a draft's URL 404s the same way any unpublished document does across the site. Public pages only, by request — admin CRUD, including the rich-text editor the ticket explicitly flags as needing sign-off before building, is separate scope.

## Files changed

- `app/(public)/news/page.tsx` — index; in-memory pagination (fetches all published posts, slices by `?page=N`) rather than Firestore cursor pagination, which needs composite indexes and doesn't suit a page-number URL pattern well — simpler and correct at the scale a company blog actually reaches.
- `app/(public)/news/[slug]/page.tsx` — detail template: cover image, tags, publish date, `generateMetadata` reading the post's `seo` map (including `ogImage` with a `coverImage` fallback).
- `components/news/NewsBody.tsx` — the Markdown renderer, `react-markdown` with a `components` map so every element renders through the site's own tokens.
- `components/sections/news/NewsSection.tsx` — homepage teaser, now links each card to its post (previously an unlinked static block).

## How to test

```bash
npm run build   # /news/[slug] statically generates the one seeded post
npm run dev
```

- Visit `/news` — confirm the seeded post renders with cover image, date, and excerpt.
- Visit `/news/sample-first-post` — confirm the Markdown body renders through the site's typography.
- Visit `/news/does-not-exist` — confirm a 404, not an error page or blank screen.
- With more than 9 published posts, confirm pagination links appear and each page slices correctly.

## Acceptance criteria

- [x] Drafts are invisible on public routes — enforced by the existing `status == "published"` filter in `lib/data/news.ts`; a draft's direct URL 404s the same way an unpublished doc does elsewhere.
- [~] Publishing makes a post live without a redeploy — true of the read path (no code change needed for new content to appear), but there's no admin publish action to trigger revalidation from yet, since CRUD is out of this pass.
- [ ] Slug collision prevention / safe title editing — this is an admin-CRUD-time concern (uniqueness needs to be enforced at write time); nothing to do on the public-page side, deferred with the rest of CRUD.
- [x] Rendered post content is sanitized — `react-markdown` never executes embedded raw HTML by construction (no `rehype-raw` plugin added).
- [x] Post content inherits design-system typography — every Markdown element maps to a token-styled component in `NewsBody.tsx`, not a generic prose stylesheet.
- [x] Each post has its own metadata and OG image in the raw HTML.
- [ ] A Content Editor can publish; a Leads Manager cannot — Firestore rules already enforce this correctly (unchanged from T5/T7), but there's no admin UI yet to exercise it through.
- [x] Index paginates correctly and has an empty state.
- [x] Meets `docs/UI-STANDARDS.md`.

## Deviations / decisions

- **Body format is Markdown, decided explicitly before building** (per the ticket's own instruction to raise the rich-text approach before starting) rather than plain text or raw HTML — supports headings/lists/quotes/links out of the box, safe by default, and doesn't lock in a block-JSON schema the eventual admin editor ticket hasn't designed yet.
- **Admin CRUD (including the rich-text editor) is explicitly deferred, by request** — this pass covers public pages only.
- Tags render as plain badges if present; nothing enforces or manages them since the admin screen doesn't exist yet — the ticket allows skipping tags entirely if they don't earn their place, so this is intentionally minimal.

## Open questions / follow-ups

- `/admin/news` needs the actual CRUD screen — data layer and rules are ready; the constrained-block editor decision (headings/paragraphs/lists/images/quotes/links only, not free-form HTML) still needs to be designed and should be raised with the manager before building, per the ticket's explicit instruction.
- Slug uniqueness enforcement and title-edit-without-breaking-URLs are both write-time concerns that land with that admin screen.
- Only one sample post exists (seeded placeholder content) — real editorial content is a client/manager task, not something to fabricate here.
