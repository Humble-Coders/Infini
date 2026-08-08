**Issue:** [#15](https://github.com/Humble-Coders/Infini/issues/15)
**Milestone:** M3 — Public content
**Blocked by:** T8 (media), T7 (admin shell)

## 📖 Story / Why

Two smaller content types bundled because they share the same shape — a simple admin-managed list with ordering and publish control — and neither justifies its own ticket.

**Testimonials** are social proof for a buyer weighing an unfamiliar supplier. **Events** let INFINI publish trade show appearances and announcements without calling a developer.

## 🧭 Context

**Testimonials** (PRD §5.8): quote · person name · designation · company · logo · display order · publish/unpublish. Displayed on the homepage and reusable elsewhere.

**Events** (PRD §5.9): title · start and end dates · location · description · images · optional link · publish/unpublish.

**The events question worth asking:** should past events disappear automatically, or stay as an archive? An empty events page because the last trade show ended reads as neglect; an archive of past appearances reads as an active company. Recommendation is upcoming-first with past events retained below, but **confirm with the manager in the ticket thread** — it's a content-strategy call, not a technical one.

Both need real content from the client. Publish only genuine testimonials — **do not write placeholder quotes attributed to real companies**, even temporarily. A fabricated testimonial that reaches staging and gets screenshotted is a serious problem.

## 🔑 Access & prerequisites

- [ ] T8, T7 merged. Branch `feature/<issue#>-testimonials-events` off `main`.
- [ ] Real testimonials and company logos from the client. Request early; permission to use a customer's name and logo often needs their sign-off.

## ✅ Scope / What to build

**Testimonials**
- [ ] Admin CRUD: quote, name, designation, company, logo, order, publish/unpublish.
- [ ] Drag-or-numeric ordering control.
- [ ] Display component for the homepage and reuse elsewhere.
- [ ] Empty state that degrades gracefully — the homepage section should hide, not show an empty box.

**Events**
- [ ] `/events` listing, upcoming and past.
- [ ] Detail view or expandable entry, depending on content depth.
- [ ] Admin CRUD: title, dates, location, description, images, link, publish/unpublish.
- [ ] Date handling that's correct for multi-day events and for the past/upcoming split.
- [ ] Page-level SEO metadata.

## 🎯 Acceptance Criteria

- [ ] Testimonials display in the admin-set order, and reordering is reflected on the public site.
- [ ] With zero published testimonials, the homepage section hides cleanly rather than rendering an empty container.
- [ ] Events correctly separate upcoming from past, including a multi-day event that is currently running.
- [ ] The past-events behaviour has been confirmed with the manager and matches what was agreed.
- [ ] No fabricated testimonials exist in any environment, including staging.
- [ ] Company logos render at consistent sizes despite varying source dimensions.
- [ ] A Content Editor can manage both; a Leads Manager cannot.
- [ ] Meets [`docs/UI-STANDARDS.md`](../UI-STANDARDS.md).

## 🚫 Out of scope

- Event registration or ticketing. Calendar export — only if trivial.

## 📚 References

- [`docs/PRD.md`](../PRD.md) §5.8 testimonials, §5.9 events.

## 🤖 Kickoff prompt

```
/start-ticket 15
```
