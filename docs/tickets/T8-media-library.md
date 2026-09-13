**Issue:** [#8](https://github.com/Humble-Coders/Infini/issues/8)
**Milestone:** M2 — Data & Admin
**Blocked by:** T7 (admin shell)
**Blocks:** every content ticket that has images — which is nearly all of them.

## 📖 Story / Why

Every content type on this site carries images: industry heroes, case study before/after pairs, certificate scans, news covers, testimonial logos, event photos. Without a shared library, each of those tickets would build its own upload widget and INFINI staff would have no way to reuse an image they already uploaded.

There's a performance dimension too. The current site has known image problems — a heavy homepage and oversized assets. If staff can upload a 6MB phone photo straight into a hero slot, the performance work in T24 gets undone the first time someone publishes.

## 🧭 Context

**Storage rules** (from T5): public read on published paths, writes for Editor and Super Admin only, with content-type and size limits enforced **in the rules** — not just in the UI, which is trivially bypassed.

The `media` collection indexes uploads with `url`, `path`, `filename`, `alt`, `width`, `height`, `sizeBytes`, `uploadedBy`, `uploadedAt`.

**Alt text is required at upload**, not optional and not deferred. It's an accessibility requirement and an SEO deliverable, and it will never be backfilled later — nobody has ever gone back to add alt text to 200 images. Making it a required field at the one moment someone is looking at the image is the only approach that works.

Serving happens through `next/image`, so the app handles format negotiation and responsive sizes. The library's job is to stop genuinely oversized originals from getting in, and to make reuse easy.

## 🔑 Access & prerequisites

- [ ] T7 merged. Branch `feature/<issue#>-media-library` off `main`.
- [ ] Firebase Storage enabled; CORS configured. Record both in `docs/INFRA.md`.

## ✅ Scope / What to build

- [ ] Media admin section: grid view, search by filename/alt, sort by date.
- [ ] Upload with drag-and-drop, multi-file, and visible progress.
- [ ] **Client-side compression/resize before upload**, with a sensible maximum dimension.
- [ ] Enforce file-type and size limits, with a clear error explaining the limit when rejected.
- [ ] **Alt text required on upload** — the save is blocked without it.
- [ ] Edit alt text and filename after upload.
- [ ] Delete, with confirmation **and a warning if the asset is referenced by published content**.
- [ ] A reusable `<MediaPicker>` component — choose existing or upload new — for later tickets to drop in.
- [ ] Non-image support for **certificate PDFs** (needed by T12).

## 🎯 Acceptance Criteria

- [ ] Upload, browse, search, edit and delete all work end to end.
- [ ] **An upload cannot be saved without alt text.**
- [ ] A file exceeding the size limit is rejected by the **Storage rules**, not merely by the UI. Verify by attempting a direct SDK upload.
- [ ] A 6MB source photo is compressed before it reaches Storage — check the stored `sizeBytes`.
- [ ] `<MediaPicker>` is importable and works standalone.
- [ ] A Leads Manager cannot upload or delete anything.
- [ ] PDFs upload and download correctly.
- [ ] Deleting a referenced asset warns before proceeding.
- [ ] Meets [`docs/UI-STANDARDS.md`](../UI-STANDARDS.md).

## 🚫 Out of scope

- Wiring media into specific content types — each content ticket does its own.
- Site-wide image performance work — T24.

## 📚 References

- [`docs/PRD.md`](../PRD.md) §4.3 `media`, §4.4 storage rules, §6 performance.

## 🤖 Kickoff prompt

```
/start-ticket 8
```
