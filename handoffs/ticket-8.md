**Ticket:** #8 — Media library: Storage upload, compression, required alt text, MediaPicker

## Summary

Builds the admin Media section (grid view, search by filename/alt, drag-and-drop multi-file upload with per-file progress) and a standalone `<MediaPicker>` component for later content tickets to embed wherever they need an image or certificate PDF field. Alt text is required before a file can save, enforced both in the upload form UI and again in the Firestore write layer as a backstop. Oversized photos are resized and re-encoded client-side before upload; the real ceiling is enforced server-side by Storage rules (already correct from T5, unchanged by this ticket) regardless of what the client sends. Deleting an asset scans every content collection for a reference to its URL first and warns if it finds one.

A real prerequisite gap was found and fixed along the way: the Storage bucket had no CORS configuration, which silently breaks every browser-based upload.

## Files changed

**Storage/upload core**
- `lib/firebase/client.ts`, `lib/firebase/requireAuth.ts` — add `getStorage()`/`requireStorage()`, matching the existing `requireAuth`/`requireFunctions` pattern.
- `lib/storage/compressImage.ts` — canvas-based resize (max 2000px long edge) + re-encode (JPEG, q=0.82) in one pass, so it and the resulting dimensions come from a single decode. Non-images and already-small images pass through untouched.
- `lib/storage/uploadMediaFile.ts` — compress → `uploadBytesResumable` with progress callback → `getDownloadURL`. Client-side size/type validation exists only to fail fast with a clear message; Storage rules are the actual enforcement.
- `lib/data/media.ts` — added `createMedia` (alt-text-required), `updateMedia`, `deleteMediaDoc` (Firestore index writes; the existing read accessors from T5 were untouched).
- `lib/data/mediaReferences.ts` — `findMediaReferences(url)`: full-document scan across `industries`/`caseStudies`/`certifications`/`news`/`testimonials`/`events`/`pages` for the asset's URL. Chosen over per-collection field queries because those would need to track each content type's specific image fields and go stale the moment a new one is added; these collections are small enough that a full scan is simpler and can't drift.
- `lib/types/media.ts` — added `contentType: string` (needed to distinguish images from certificate PDFs in the grid/picker).

**Admin Media screen**
- `app/admin/(protected)/media/page.tsx` — replaces T7's stub.
- `components/admin/media/{useMediaLibrary,MediaThumbnail,MediaCard,EditMediaDialog,UploadPanel,MediaLibraryManager}.tsx`.
- `components/admin/MediaPicker.tsx` — the reusable piece; owns its own open state and data fetch, "choose existing" (filterable by `accept: "image" | "pdf" | "all"`) or "upload new" in one dialog.

**New UI primitives**
- `components/ui/dialog.tsx` — Radix Dialog (new dependency `@radix-ui/react-dialog`, matching the project's existing Radix primitive family), used for non-destructive modals (edit, picker) — distinct from `alert-dialog.tsx`'s destructive-confirmation semantics.
- `components/ui/progress.tsx` — plain token-driven progress bar, no new dependency.

**Rules verification**
- `backend/storage.rules.test.ts` — emulator test covering the acceptance criteria: oversized image/PDF rejected, wrong content-type rejected, Leads Manager cannot upload, public can read.

**Infra**
- `backend/storage.cors.json`, `docs/INFRA.md` — CORS config (see Deviations), applied and verified live.
- `next.config.ts` — `images.remotePatterns` for `firebasestorage.googleapis.com`, needed for `next/image` to serve uploaded assets at all.

## How to test

1. `npx tsc --noEmit`, `npx eslint .`, `npm run build` — all clean.
2. In the admin Media screen: drag in a large (multi-MB) photo, confirm it's blocked from uploading until alt text is filled in, then upload and check the resulting Firestore `media` doc's `sizeBytes` is meaningfully smaller than the source file.
3. Upload a PDF, confirm it uploads and the resulting `fileUrl`/`url` downloads the correct file.
4. Edit an existing item's alt text/filename; delete an item (confirm the dialog requires confirmation, and shows a reference warning if — once T10+ actually wires media into content — it's in use somewhere).
5. `npm run test:storage-rules` — **not run in this environment** (same Java 21+ constraint as `test:rules`); written and type-checks, unexecuted.

## Acceptance criteria

- [x] Upload, browse, search, edit, delete all work end to end — built and type-checked; **not yet manually exercised in a browser** by anyone this session (see Open questions).
- [x] An upload cannot be saved without alt text — enforced in `UploadPanel` (blocks the Upload button, shows inline error) and in `createMedia` as a backstop.
- [x] A file exceeding the size limit is rejected by Storage rules, not just the UI — `backend/storage.rules` (unchanged, already correct from T5) enforces 10MB image / 20MB PDF server-side; `backend/storage.rules.test.ts` asserts an 11MB image and a 21MB PDF are rejected via a direct SDK `put()` bypassing the app's own client-side check. **Not executed** in this environment.
- [x] A 6MB source photo is compressed before it reaches Storage — `compressImage`'s resize-and-re-encode path triggers for anything over 2000px or 2MB; not manually verified against an actual 6MB file and its resulting `sizeBytes` in this session.
- [x] `<MediaPicker>` is importable and works standalone — owns its own state/fetch, takes only `trigger`/`accept`/`onSelect` props; not yet embedded in a real content form since none exist yet.
- [x] A Leads Manager cannot upload or delete anything — `backend/storage.rules`' `canWrite()` already excluded `leadsManager` (from T5); asserted in the new rules test, **not executed** here.
- [x] PDFs upload and download correctly — code path handles `application/pdf` explicitly (no compression, correct size limit); not manually verified end-to-end.
- [x] Deleting a referenced asset warns before proceeding — `findMediaReferences` runs before the delete-confirm dialog opens; since no content ticket has wired real media references into Firestore documents yet, this is mechanically correct but has nothing to actually find right now.
- [x] Meets `docs/UI-STANDARDS.md` — no design attached, built against the T2 system per the same exception as T7.

## Deviations / decisions

- **Storage bucket had no CORS configuration at all** — not caused by this ticket, but a real prerequisite gap (the ticket itself lists "CORS configured" as an access prerequisite). Without it, the browser upload SDK's cross-origin `PUT` fails CORS preflight and every upload attempt fails silently from the UI's perspective. Fixed via `backend/storage.cors.json` (`localhost:3000`/`3100` for dev, `infini.co.in` for production — GCS CORS `origin` entries must be exact strings, no wildcards, so **the actual staging App Hosting domain needs adding once T4's backend exists**), applied with `gsutil cors set` and verified via `gsutil cors get`.
- **`@radix-ui/react-dialog` added as a new dependency.** Matches the project's existing Radix primitive family (`react-accordion`, `react-alert-dialog`, `react-label`, `react-select`, `react-slot`, `react-switch` are already dependencies) rather than introducing a different modal library — not the kind of "heavy new UI library" `CLAUDE.md` asks to flag first.
- **Full-document-scan reference check, not field-specific queries.** See `lib/data/mediaReferences.ts`'s file comment — a pragmatic tradeoff given these collections are small and their image-bearing fields vary in shape (nested `hero.image`, arrays like `gallery`/`images`, etc.).
- **Deactivating semantics inherited from T6 unaffected; no rules changes needed this ticket** — Storage rules were already correctly scoped by T5, which is why T8 shipped with zero rules changes of its own (only the CORS gap, which is infra config, not a rules file).

## Open questions / follow-ups

- **The full upload/browse/edit/delete flow has not been manually clicked through in a browser this session** — it was still pending your test when we moved to fixing T9/T10/T11's data-layer issue. Worth doing before considering T8 fully closed.
- `npm run test:storage-rules` needs a Java 21+ environment (or CI) to actually run.
- `<MediaPicker>` has no real caller yet — its first genuine integration test comes with T10+ (an industry hero image) or T12 (a certificate PDF).
