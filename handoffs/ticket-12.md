**Ticket:** #12 — Certifications with download + expiry tracking

## Summary

Builds `/certifications` presenting each of INFINI's certificates as a full content item — name, logo, description, certificate number, issue date, validity date, and an accessible download link — plus a reusable `<CertificationsBlock>` used on industry pages (filtered to that industry's `relatedCertIds`) and Company/Capabilities (the full active list), replacing hardcoded certification text with real Firestore data. Admin CRUD (add, edit, reorder, publish/unpublish, delete, logo/PDF upload via `<MediaPicker>`) lives at `/admin/certifications`. Certificates approaching or past their `validUntil` date are flagged with a badge in the admin list, so staff can see what's lapsing before a buyer notices.

## Files changed

- `app/(public)/certifications/page.tsx` — full certification listing, each rendered as a complete content item.
- `components/certifications/CertificationsBlock.tsx` — compact reusable teaser (logo, name, cert number, download), used on industry detail pages and Company/Capabilities.
- `app/(public)/industries/[slug]/page.tsx`, `company/page.tsx`, `capabilities/page.tsx` — wired to `CertificationsBlock` instead of hardcoded text.
- `lib/data/certifications.ts` — `getActiveCertifications()` (published, not expired — what the public site shows), `getAllCertifications()` (admin, unfiltered), `createCertification`/`updateCertification`/`deleteCertification`/`moveCertification` (order swap via transaction).
- `app/admin/(protected)/certifications/page.tsx`, `components/admin/certifications/{CertificationsManager,CertificationFormDialog,ExpiryBadge}.tsx` — the admin CRUD screen, built on T7's shared patterns (`PublishToggle`, `DeleteConfirmDialog`, `FormActions`).
- `docs/QUESTIONS.md` (new) — records the one question the ticket explicitly leaves open (see Deviations).

## How to test

```bash
npm run build
npm run dev
```

- Visit `/certifications` — confirm all current certificates render with name, number, dates, description, and a working download link.
- Visit `/industries/medical-implants` and `/company` — confirm the certifications block shows real data, not placeholder text.
- Sign in as Content Editor/Super Admin, add a certification, edit it, reorder with the up/down arrows, toggle publish, delete one.
- Set a certificate's `validUntil` to a near-future or past date and confirm the admin list's expiry badge appears correctly.

## Acceptance criteria

- [x] All current certifications display with name, number, dates and description.
- [x] Download works and serves the correct file — linked directly to the Storage `fileUrl` from the certificate's own document.
- [x] ISO 13485 appears on the Medical Implants page via the shared block.
- [x] Admin can add, edit, reorder and unpublish certificates.
- [x] Certificates near or past expiry are visibly flagged in admin.
- [x] The expired-certificate display question has been asked and recorded — see `docs/QUESTIONS.md`; **not yet client-confirmed**.
- [x] Download links are keyboard accessible and clearly labelled (`aria-label` naming the certificate).
- [x] Responsive at the four breakpoints — card/list layouts use the existing fluid grid patterns.
- [x] Meets `docs/UI-STANDARDS.md`.

## Deviations / decisions

- **The expired-certificate display question is recorded, not answered by guesswork.** Built against "hide expired certificates from the public page" as the interim, unconfirmed default — `getActiveCertifications()` filters out anything past `validUntil`. The admin panel shows every certificate regardless, with an expiry badge, so staff visibility holds either way. See `docs/QUESTIONS.md` for full context; needs actual sign-off before launch.
- Reordering uses up/down arrow buttons swapping the two certificates' `order` field in a transaction, not drag-and-drop — simpler, no new dependency, and certificates are a short, infrequently-reordered list (5 today).

## Open questions / follow-ups

- `docs/QUESTIONS.md`'s T12 entry needs actual client/manager confirmation before launch.
- The admin form's date inputs are plain `<input type="date">` — fine functionally, but worth a UI pass if the design system gets a dedicated date-picker component later.
