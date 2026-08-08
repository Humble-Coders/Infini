**Issue:** [#13](https://github.com/Humble-Coders/Infini/issues/13)
**Milestone:** M3 — Public content
**Blocked by:** T10 (industry pages), T8 (media)

## 📖 Story / Why

Capability claims are cheap; proof is not. Case studies are how INFINI shows actual work rather than describing what it could do — and for a technical buyer, a before/after on a real component is worth more than a page of adjectives.

They also do double duty for SEO: cross-linked from industry pages, they add the content depth that makes those pages rank.

## 🧭 Context

**Per case study** (PRD §5.6): component/project · industry · challenge · prior situation · INFINI's solution · process detail · measurable result · **before/after comparison** · imagery · technical data.

**The cross-linking is a requirement, not a nice-to-have:** `Industry page → related case studies → case study detail`. Both directions — a case study names its industry, and industry pages list their case studies. This is explicitly called out in the proposal for both UX and SEO.

**Before/after imagery is the whole point.** Surface finishing is a visual result — a mirror finish on a mold cavity is immediately legible in a photograph in a way no prose achieves. Design the comparison properly (side-by-side or a slider), and make sure it works on mobile, where most side-by-side layouts fall apart.

**Content depends entirely on the client.** Real components, real results, real images. Draft the structure and the template, then request specific case study material in the ticket thread. **Do not invent case studies** — fabricated customer work is a serious commercial and legal problem, not a placeholder decision. Ship with however many real ones exist, even if that's two.

## 🔑 Access & prerequisites

- [ ] T10, T8 merged. Branch `feature/<issue#>-case-studies` off `main`.
- [ ] Real case study material from the client: components, before/after imagery, results. **Request early — this is usually the slowest asset to obtain.**

## ✅ Scope / What to build

- [ ] `/case-studies` index with industry filtering.
- [ ] `/case-studies/[slug]` detail template.
- [ ] Before/after comparison component that works on mobile.
- [ ] Related-case-studies block on industry pages, driven by `industryId`.
- [ ] Industry link back from each case study.
- [ ] Admin CRUD: all fields, industry relation, image management, publish/unpublish.
- [ ] Per-page SEO metadata from the `seo` map.
- [ ] Designed empty states for both index and the industry-page block.

## 🎯 Acceptance Criteria

- [ ] Index and detail pages render, and filtering by industry works.
- [ ] **Cross-linking works both ways**: industry pages list their case studies, and each case study links back to its industry.
- [ ] Before/after comparison is legible and usable at 375px — not just on desktop.
- [ ] Every published case study is **real client work**. No invented examples.
- [ ] Empty states render cleanly when a filter or industry has no case studies.
- [ ] Admin can create, edit and publish without a redeploy.
- [ ] Each detail page has its own metadata in the raw HTML.
- [ ] Images via `next/image` with meaningful alt describing the actual component.
- [ ] Meets [`docs/UI-STANDARDS.md`](../UI-STANDARDS.md).

## 🚫 Out of scope

- Structured data — T19. Industry page copy — T10.

## 📚 References

- [`docs/PRD.md`](../PRD.md) §5.6 case studies.

## 🤖 Kickoff prompt

```
/start-ticket 13
```
