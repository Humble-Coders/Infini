**Issue:** [#11](https://github.com/Humble-Coders/Infini/issues/11)
**Milestone:** M3 — Public content
**Blocked by:** T9 (homepage), T8 (media)

## 📖 Story / Why

This is the page a serious buyer opens before requesting a quote. They've understood the service and now want to know whether INFINI can actually handle their volume, their materials and their timeline.

The client identified this as a specific gap: the current site does not sufficiently explain important company information. A procurement team evaluating a new supplier needs facility, capacity and lead-time facts, and today they can't find them.

Treat this as the **credibility page**, not an "About Us" afterthought.

## 🧭 Context

Content to cover (PRD §5.4): company history and background · the facility · manufacturing and treatment capabilities · production capacity · materials handled · typical lead times · process technologies.

**Much of this only INFINI can supply** — real capacity figures, real lead times, real facility details. Draft the structure and write what can be sourced from the existing site and MMP material, then **flag the specific gaps in the ticket thread as a list of questions for the client.** A vague page here is worse than an obviously incomplete one: a buyer who reads "fast turnaround times" learns nothing and trusts you less.

Capabilities may work better as its own route than as a section, depending on content volume. Your call — but `/company` and `/capabilities` are both in the planned navigation, so build both routes even if one is thin at first.

## 🔑 Access & prerequisites

- [ ] T9, T8 merged. Branch `feature/<issue#>-company-capabilities` off `main`.
- [ ] Facility and equipment photography from the client pack if available.

## ✅ Scope / What to build

- [ ] `/company` — history, background, facility, credentials.
- [ ] `/capabilities` — treatment capabilities, capacity, materials, lead times, process technologies.
- [ ] Draft copy for both; list open client questions in the ticket thread.
- [ ] Content sourced from Firestore (`pages/company`, `pages/capabilities`) so it stays admin-editable.
- [ ] Certifications summary linking to `/certifications`.
- [ ] Per-page SEO metadata.
- [ ] Request a Quote CTA on both.
- [ ] Admin editing for both pages.

## 🎯 Acceptance Criteria

- [ ] Both routes render with real, specific content — no lorem ipsum, no placeholder headings left behind.
- [ ] **Every claim on the page is either sourced or explicitly flagged as needing client confirmation.** Nothing invented — inventing a capacity figure for an industrial supplier is a real commercial risk.
- [ ] Open questions for the client are posted in the ticket thread as a concrete list.
- [ ] Both pages admin-editable without a redeploy.
- [ ] Own title, description and OG tags in the raw HTML.
- [ ] Responsive at the four breakpoints; Lighthouse mobile ≥ 90.
- [ ] Meets [`docs/UI-STANDARDS.md`](../UI-STANDARDS.md).

## 🚫 Out of scope

- Certification detail — T12. Case studies — T13.

## 📚 References

- [`docs/PRD.md`](../PRD.md) §5.4 company & capabilities.

## 🤖 Kickoff prompt

```
/start-ticket 11
```
