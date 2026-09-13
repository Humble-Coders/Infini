**Issue:** [#22](https://github.com/Humble-Coders/Infini/issues/22)
**Milestone:** M5 — SEO, analytics & legal
**Blocked by:** T3 (footer slots)
**Blocks:** T21 — consent must exist before analytics can respect it.

## 📖 Story / Why

Privacy Policy, Terms & Conditions and cookie consent are required deliverables, reachable from the footer. INFINI serves aerospace and medical customers in Europe and elsewhere, so visitors will arrive from jurisdictions with real consent requirements.

The part that's usually done wrong: a banner that appears while the tracking has **already fired**. That's not consent, it's notification — and it's worse than having no banner, because it documents that you knew consent was required.

## 🧭 Context

**Consent must genuinely gate tracking.** Default state is denied. Analytics loads only after the user accepts. Declining must be as easy as accepting — a banner with a prominent "Accept" and a buried "Manage preferences" is a dark pattern and, in the EU, not valid consent.

**Legal copy is not the developer's to write.** Draft the structure and standard sections, but the actual policy depends on INFINI's data handling, jurisdiction and retention practices. **Flag clearly in the ticket thread that the client must review and approve the final text** — ideally with their own legal advisor. Shipping generated policy text as though it were reviewed is a real liability, and it's the kind of thing that goes unnoticed until it matters.

The policies must actually describe what this site does: a Firestore-stored enquiry form, email notifications, GA4 analytics, and reCAPTCHA Enterprise (which is itself a Google data transfer that a privacy policy needs to mention).

Consent preference persists across sessions and must be changeable later — a footer link to reopen preferences.

## 🔑 Access & prerequisites

- [ ] T3 merged. Branch `feature/<issue#>-legal-consent` off `main`.
- [ ] Client input on data handling, retention and jurisdiction. Request early.

## ✅ Scope / What to build

- [ ] `/privacy-policy` — covering enquiry data, Firestore storage, email notification, GA4, reCAPTCHA.
- [ ] `/terms` — Terms & Conditions.
- [ ] Cookie consent banner: **accept and decline equally prominent**, plus a preferences option.
- [ ] Consent state persisted and respected on return visits.
- [ ] A consent API the analytics tags in T21 read before firing.
- [ ] Footer links to both policies and a "Cookie preferences" link that reopens the chooser.
- [ ] Both pages admin-editable, so the client can update policy text without a developer.
- [ ] A short note in the enquiry form linking the privacy policy at the point data is collected.

## 🎯 Acceptance Criteria

- [ ] **No analytics or tracking request fires before consent is granted.** Verify in the Network tab from a clean profile — this is the acceptance test for the whole ticket.
- [ ] Declining is as easy and as visible as accepting.
- [ ] Consent persists across sessions and is changeable from the footer at any time.
- [ ] Both policies reachable from the footer on every page.
- [ ] Policy content accurately describes **this site's** actual data handling, including reCAPTCHA.
- [ ] Both pages editable by an admin.
- [ ] **The ticket thread records that the client must have the legal text reviewed**, and the manager has acknowledged it.
- [ ] Banner is keyboard accessible, announced to screen readers, and doesn't trap focus.
- [ ] Banner doesn't obscure critical content or break mobile layout.
- [ ] Meets [`docs/UI-STANDARDS.md`](../UI-STANDARDS.md).

## 🚫 Out of scope

- Analytics configuration — T21. Legal advice — the client's responsibility.

## 📚 References

- [`docs/PRD.md`](../PRD.md) §5.12 legal.

## 🤖 Kickoff prompt

```
/start-ticket 22
```
