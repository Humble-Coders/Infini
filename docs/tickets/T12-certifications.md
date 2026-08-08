**Issue:** [#12](https://github.com/Humble-Coders/Infini/issues/12)
**Milestone:** M3 — Public content
**Blocked by:** T8 (media library — PDF support)

## 📖 Story / Why

For a supplier in aerospace and medical, certifications aren't decoration — they're a procurement gate. A buyer needs to confirm INFINI holds a valid certificate and often needs to download it for their own supplier file.

The client's requirement is that certifications be treated as **proper content rather than just logos**, and that it be immediately obvious certificates can be viewed and downloaded.

## 🧭 Context

INFINI currently holds: **ISO 9001, ISO 13485, ISO 14001, ISO 45001**, plus Udyam registration. Confirm the current set against the client's asset pack — certificates expire, and a lapsed one displayed as current is a genuine commercial problem.

**Per certificate:** name · logo · description · certificate number where available · issue date · renewal/validity date · **download**.

**ISO 13485 must also be referenced on the Medical Implants industry page** (T10) — this is called out specifically in the proposal, because it's the certification a medical buyer looks for first.

**Renewal dates are the trap.** Certificates expire and nobody remembers to update a website. Store `validUntil` and surface an expiry state in the **admin panel** so staff can see what's lapsing. Whether an expired certificate should hide itself from the public page is a client decision — **ask in the ticket thread rather than assuming.** Silently hiding a certificate could be worse than showing a stale one.

Certificate PDFs go through the T8 media library.

## 🔑 Access & prerequisites

- [ ] T8 merged. Branch `feature/<issue#>-certifications` off `main`.
- [ ] Certificate PDFs and logo files from the client. **Confirm each certificate is current before publishing it.**

## ✅ Scope / What to build

- [ ] `/certifications` page presenting each certificate as a full content item.
- [ ] Obvious, accessible **download** action per certificate.
- [ ] Reusable certifications block for industry pages and Company/Capabilities.
- [ ] Admin CRUD: all fields, ordering, publish/unpublish, PDF upload via `<MediaPicker>`.
- [ ] **Expiry visibility in the admin panel** — flag certificates approaching or past `validUntil`.
- [ ] Page-level SEO metadata.

## 🎯 Acceptance Criteria

- [ ] All current certifications display with name, number, dates and description.
- [ ] Download works and serves the correct file — **open each one and confirm it's the right certificate**, not just that a file downloads.
- [ ] ISO 13485 appears on the Medical Implants page via the shared block.
- [ ] Admin can add, edit, reorder and unpublish certificates.
- [ ] Certificates near or past expiry are visibly flagged in admin.
- [ ] The expired-certificate display question has been asked and answered in the ticket thread.
- [ ] Download links are keyboard accessible and clearly labelled for screen readers.
- [ ] Responsive at the four breakpoints.
- [ ] Meets [`docs/UI-STANDARDS.md`](../UI-STANDARDS.md).

## 🚫 Out of scope

- Industry page content — T10. Structured data — T19.

## 📚 References

- [`docs/PRD.md`](../PRD.md) §5.5 certifications.

## 🤖 Kickoff prompt

```
/start-ticket 12
```
