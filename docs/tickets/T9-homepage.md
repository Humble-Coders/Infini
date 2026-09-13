**Issue:** [#9](https://github.com/Humble-Coders/Infini/issues/9)
**Milestone:** M3 — Public content
**Blocked by:** T3 (app shell), T8 (media)
**🚩 Also blocked by the design-direction review from T2.** Do not start until the manager has signed off `/styleguide`.

## 📖 Story / Why

Most visitors form their judgement of INFINI here, in a few seconds. The client's central complaint about the current site is that **it does not communicate what INFINI does clearly enough** — a visitor can land on it and still not know what the company actually offers.

The bar: within the first screen or two, a procurement lead or design engineer should understand who INFINI is, what it does, which industries it serves, why it's credible, and what to do next.

## 🧭 Context

**INFINI is a precision surface-finishing company.** It applies the MMP (Micro Machining Process) treatment to components its customers manufacture — a mechanical-physical-chemical process performed in treatment tanks that selectively removes frequencies of roughness to deliver controlled finishes up to mirror-like quality. **It does not manufacture parts.** Any copy calling INFINI a manufacturer is wrong.

**Sections** (order and treatment are yours to design):
hero with clear value proposition · MMP technology explainer · industries grid (7) · credibility band — certifications and capability stats · selected case studies · testimonials · latest news · closing CTA.

**Copy is yours to draft** (PRD decision D2) — client edits and approves. Write it SEO-structured and specific. Avoid the generic manufacturing-website register: "quality solutions for your needs" says nothing and is exactly what the client is trying to move away from.

Sections that depend on later tickets (case studies, news, testimonials) should render from the data layer with graceful empty states, so the page works before that content exists.

The current homepage is also a known performance problem — heavy and image-laden. This is the most image-dense page on the site; treat performance as a requirement of the ticket, not a cleanup pass later.

## 🔑 Access & prerequisites

- [ ] T3, T8 merged. Design direction signed off.
- [ ] Branch `feature/<issue#>-homepage` off `main`.
- [ ] Best available imagery from the client asset pack or the live site.

## ✅ Scope / What to build

- [ ] Full homepage composed from the design system.
- [ ] Draft all homepage copy, structured for SEO with a correct heading hierarchy.
- [ ] Content sourced from Firestore (`pages/home`) where it should be admin-editable — not hardcoded.
- [ ] Industries grid linking all 7 industry routes.
- [ ] Case studies, testimonials and news sections reading live, each with a designed empty state.
- [ ] Page-level SEO metadata: title, description, Open Graph.
- [ ] Prominent Request a Quote CTA, plus the persistent shell CTA.

## 🎯 Acceptance Criteria

- [ ] Someone unfamiliar with INFINI can state what the company does after viewing only the first two screens. **Test this on an actual person.**
- [ ] No copy describes INFINI as a manufacturer.
- [ ] Renders correctly at 375px, 768px, 1280px, 1920px.
- [ ] Every section that reads live data has a working empty state — verify against an empty collection.
- [ ] Exactly one `<h1>`; heading order is correct below it.
- [ ] Title, description and OG tags present in the **raw HTML** (`curl`, not DevTools).
- [ ] All images use `next/image` with meaningful alt text.
- [ ] **Lighthouse mobile performance ≥ 90 and accessibility ≥ 95.**
- [ ] Admin-editable text is editable in Firestore, not hardcoded.
- [ ] Meets [`docs/UI-STANDARDS.md`](../UI-STANDARDS.md).

## 🚫 Out of scope

- The RFQ form itself — T17. Industry page interiors — T10. Sitemap and structured data — T19.

## 📚 References

- [`docs/PRD.md`](../PRD.md) §1 positioning, §5.2 homepage, §10 decision **D2**.
- `https://mmptechnology.com/` — quality benchmark, do not copy.

## 🤖 Kickoff prompt

```
/start-ticket 9
```
