# Open questions for the client

Decisions a ticket explicitly calls out as needing client/manager sign-off rather than an engineering guess. Each entry: the question, why it matters, the interim decision taken so work isn't blocked, and its status.

---

## T12 — Expired certificate display

**Question:** Should a certificate whose `validUntil` date has passed be hidden from the public `/certifications` page, or still shown (e.g. with an "expired" indicator)?

**Context:** `docs/tickets/T12-certifications.md` flags this explicitly: *"Renewal dates are the trap. Certificates expire and nobody remembers to update a website... Whether an expired certificate should hide itself from the public page is a client decision — ask in the ticket thread rather than assuming. Silently hiding a certificate could be worse than showing a stale one."* The ticket deliberately does not answer this itself.

**Interim decision (unconfirmed):** Hide expired certificates from the public page automatically. The admin panel still surfaces them (flagged as lapsed/expiring) so staff can renew or remove them — the ticket's other requirement, "expiry visibility in the admin panel," holds regardless of which way this question resolves.

**Status:** 🟡 Open — built against the interim decision above; needs actual client/manager confirmation before launch. If the answer is "show with an expired badge" instead, the fix is small (drop the `validUntil` filter on the public query, add a badge component).

---

## T13 — Case study detail template, unverified against real content

**Question:** Should a throwaway, unpublished test case study be created (then deleted) to visually verify the `/case-studies/[slug]` detail template — before/after comparison, specs table, gallery — actually renders correctly?

**Context:** `docs/tickets/T13-case-studies.md` is explicit: *"Do not invent case studies — fabricated customer work is a serious commercial and legal problem, not a placeholder decision. Ship with however many real ones exist, even if that's two."* There is currently zero real case study content from the client, so the detail template has only been verified by `npm run build` succeeding and the empty states rendering correctly on the index page, industry pages, and homepage teaser — the actual per-case-study layout (before/after images, specs grid, gallery) has never been rendered with real data, even temporarily.

**Interim decision:** Skipped — did not create even an unpublished test entry, out of caution around the ticket's explicit warning, without checking first.

**Status:** 🟡 Open — the detail template's actual visual correctness is unverified. Should be checked the first time a real case study is added, or a throwaway unpublished entry can be used to verify then deleted, if that's confirmed as acceptable.
