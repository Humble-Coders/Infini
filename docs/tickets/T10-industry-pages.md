**Issue:** [#10](https://github.com/Humble-Coders/Infini/issues/10)
**Milestone:** M3 — Public content
**Blocked by:** T9 (homepage), T8 (media)
**Note:** the largest ticket in the project. Flag early if it should be split by industry.

## 📖 Story / Why

The seven industry pages are where most organic search traffic will land — someone searching for surface finishing for injection molds arrives here, not on the homepage.

The client's requirement is explicit and worth taking literally: **each page must have genuinely unique content, not a copy of another page with the industry name swapped.** Seven near-identical pages is the single most common failure mode for this kind of site, it reads as lazy to a technical buyer, and search engines treat it as duplicate content — which would waste the entire SEO budget.

## 🧭 Context

The seven industries, with their final slugs:

| Slug | Industry | Priority |
|---|---|---|
| `cutting-tools` | Cutting Tools | 🔴 India priority |
| `forge-stamping-die` | Forge, Stamping & Die | 🔴 India priority |
| `plastic-injection-molds` | Plastic Injection Molds | 🔴 India priority |
| `medical-implants` | Medical Implants | **ISO 13485 must appear here** |
| `aerospace` | Aerospace | |
| `additive-manufacturing` | Additive Manufacturing | |
| `gears-transmission` | Gears & Transmission | |

The three priority industries are the client's focus for the Indian market — give them the deepest content and the most attention.

**Per-page content:** industry overview · INFINI's relevance to it · applicable capabilities · products/applications · materials · relevant certifications · linked case studies · imagery · Request a Quote CTA.

**These pages carry 301s from the old site** (PRD §7). The redirects are implemented in T20, but the slugs above are fixed by that mapping — **do not change them.**

Write the copy yourself, client approves. Research each industry properly: what components get finished, why surface finish matters in that application, what a buyer in that sector actually cares about. A cutting-tools buyer and a medical-implant buyer have different concerns, and the pages should show it.

## 🔑 Access & prerequisites

- [ ] T9, T8 merged. Branch `feature/<issue#>-industry-pages` off `main`.
- [ ] Industry imagery from the client pack or the live site.

## ✅ Scope / What to build

- [ ] `app/(public)/industries/page.tsx` — index of all 7.
- [ ] `app/(public)/industries/[slug]/page.tsx` — detail template, statically generated for all 7.
- [ ] Draft genuinely distinct content for each of the 7.
- [ ] Related certifications block, driven by `relatedCertIds`.
- [ ] Related case studies block, driven by `relatedCaseStudyIds`, with an empty state until T13.
- [ ] Per-page SEO metadata from each document's `seo` map.
- [ ] **Admin CRUD** for industries: edit all fields, manage relations, reorder, publish/unpublish. Reuse `<MediaPicker>`.
- [ ] Request a Quote CTA with the industry pre-selected where the form supports it.

## 🎯 Acceptance Criteria

- [ ] All 7 pages exist at the exact slugs in the table above. **Any change breaks the T20 redirect map.**
- [ ] **No two pages share substantially the same body copy.** Read them side by side; if swapping the industry name would make one read as another, it fails.
- [ ] ISO 13485 is referenced on the Medical Implants page.
- [ ] Each page has its own title, description and OG tags in the raw HTML.
- [ ] Case-study blocks render an empty state cleanly while T13 is outstanding.
- [ ] Admin can edit every field and see changes live without a redeploy.
- [ ] A Content Editor can edit; a Leads Manager cannot.
- [ ] All 7 responsive at the four breakpoints; Lighthouse mobile ≥ 90.
- [ ] Meets [`docs/UI-STANDARDS.md`](../UI-STANDARDS.md).

## 🚫 Out of scope

- The 301 redirects themselves — T20. Case study content — T13. Sitemap — T19.

## 📚 References

- [`docs/PRD.md`](../PRD.md) §5.3 industry pages, §7 URL migration.

## 🤖 Kickoff prompt

```
/start-ticket 10
```
