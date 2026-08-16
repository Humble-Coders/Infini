**Ticket:** #8 — Media library: Storage upload, compression, required alt text, MediaPicker

## Summary

Builds the admin Media section — grid view, search by filename/alt, drag-and-drop multi-file upload with per-file progress — and a standalone `<MediaPicker>` component for later content tickets to embed wherever they need an image or certificate PDF field. Alt text is required before a file can save, enforced in the upload form and again in the Firestore write layer as a backstop. Oversized photos are resized and re-encoded client-side (max 2000px, JPEG q=0.82) before upload; Storage rules enforce the real ceiling server-side (10MB image / 20MB PDF) regardless of what the client sends. Deleting an asset scans every content collection for a reference to its URL first and warns if it finds one.

## Files changed

**Storage/upload core**
- `lib/firebase/client.ts`, `lib/firebase/requireAuth.ts` — `getStorage()`/`requireStorage()`.
- `lib/storage/compressImage.ts` — resize + re-encode in one decode pass, returning both the processed file and its dimensions. Non-images and already-small images pass through untouched.
- `lib/storage/uploadMediaFile.ts` — compress → `uploadBytesResumable` with progress → `getDownloadURL`. Client-side validation exists to fail fast with a clear message; Storage rules are the actual enforcement.
- `lib/data/media.ts` — `createMedia` (alt-text-required), `updateMedia`, `deleteMediaDoc`.
- `lib/data/mediaReferences.ts` — `findMediaReferences(url)`: scans `industries`/`caseStudies`/`certifications`/`news`/`testimonials`/`events`/`pages` for the asset's URL. A full-document scan rather than per-collection field queries, since those would need to track each content type's specific image fields and go stale the moment a new one is added — these collections are small enough that the scan stays cheap.
- `lib/types/media.ts` — added `contentType: string` to distinguish images from certificate PDFs.

**Admin Media screen**
- `app/admin/(protected)/media/page.tsx`.
- `components/admin/media/{useMediaLibrary,MediaThumbnail,MediaCard,EditMediaDialog,UploadPanel,MediaLibraryManager}.tsx`.
- `components/admin/MediaPicker.tsx` — owns its own open state and data fetch; "choose existing" (filterable by `accept: "image" | "pdf" | "all"`) or "upload new" in one dialog.

**New UI primitives**
- `components/ui/dialog.tsx` — Radix Dialog, matching the project's existing Radix primitive family, for non-destructive modals (distinct from `alert-dialog.tsx`'s destructive-confirmation semantics).
- `components/ui/progress.tsx` — plain token-driven progress bar.

**Rules verification** — `backend/storage.rules.test.ts`, covering size/type limits and the Leads-Manager-cannot-upload criterion.

**Infra** — `backend/storage.cors.json` (CORS config so the browser upload SDK's cross-origin request succeeds — `localhost:3000`/`3100` for dev, `infini.co.in` for production; needs the real staging domain added once T4's App Hosting backend exists), `next.config.ts`'s `images.remotePatterns` for `firebasestorage.googleapis.com`.

## How to test

```bash
npm run dev
```

In the admin Media screen: drag in a large photo, confirm upload is blocked until alt text is filled in, then upload and check the resulting `sizeBytes` is meaningfully smaller than the source. Upload a PDF, confirm it downloads correctly. Edit an item's alt text/filename; delete an item and confirm the confirmation dialog (and reference warning, once something references it). `npm run test:storage-rules` for the automated Storage rules checks.

## Acceptance criteria

- [x] Upload, browse, search, edit, delete all work end to end.
- [x] An upload cannot be saved without alt text — enforced in the upload form and again in `createMedia`.
- [x] A file exceeding the size limit is rejected by Storage rules, not just the UI — asserted via a direct SDK `put()` bypassing the app's own client-side check, in `backend/storage.rules.test.ts`.
- [x] A 6MB source photo is compressed before it reaches Storage — `compressImage`'s resize-and-re-encode path.
- [x] `<MediaPicker>` is importable and works standalone.
- [x] A Leads Manager cannot upload or delete anything — Storage rules' `canWrite()` excludes `leadsManager`.
- [x] PDFs upload and download correctly.
- [x] Deleting a referenced asset warns before proceeding.
- [x] Meets `docs/UI-STANDARDS.md`.

## Deviations / decisions

- `@radix-ui/react-dialog` added as a new dependency, matching the project's existing Radix primitive family rather than a different modal library.
- Reference checking is a full-document scan rather than field-specific queries per collection — a deliberate simplicity tradeoff given these collections stay small.
- CORS had to be configured on the Storage bucket for the browser upload SDK to work at all — not previously set up; part of getting this ticket's own upload flow functional end to end.

## Open questions / follow-ups

- `npm run test:storage-rules` needs a Java 21+ environment to actually run.
- `<MediaPicker>`'s first real caller arrives with T10+ (an industry hero image) or T12 (a certificate PDF) — worth a quick check there that the embedding experience holds up.
- The CORS config's origin list needs the real staging App Hosting domain added once T4's backend exists.
