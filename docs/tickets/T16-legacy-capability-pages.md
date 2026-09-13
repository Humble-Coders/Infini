**Issue:** [#16](https://github.com/Humble-Coders/Infini/issues/16)
**Milestone:** M3 — Public content
**Blocked by:** T11 (company & capabilities)
**⚠️ SEO-critical. Read the slug rule before starting.**

## 📖 Story / Why

Four pages on the current site target search intent independent of any industry: `/technology/`, `/validation/`, `/deburring-polishing/` and `/mirror-like-finish/`. People search for "mirror like finish" and "deburring polishing" directly, and these pages have been accumulating ranking for as long as the site has existed.

The obvious-looking move — folding them into a general Capabilities page — would throw that away. A 301 into a generic hub tells search engines the specific page is gone, and the ranking does not transfer.

**So these four keep their exact URLs.** That's PRD decision **D7**, and it's the reason this is a separate ticket rather than a section of T11.

## 🧭 Context

The four legacy URLs and their treatment:

| URL | Content | Action |
|---|---|---|
| `/technology` | MMP process explainer — the core technology | **Keep exact slug** |
| `/validation` | Measurement and validation of results | **Keep exact slug** |
| `/deburring-polishing` | Deburring and polishing application | **Keep exact slug** |
| `/mirror-like-finish` | Mirror finish capability | **Keep exact slug** |

No `/capabilities/` prefix. No trailing-slash change beyond the site-wide normalization in T20. The URL you ship is the URL that already ranks.

**Content should be genuinely expanded, not copied across.** Pull what's useful from the existing pages, then deepen it — these are technical explainer pages and a specific, well-written explanation of the MMP process is exactly the kind of content that both ranks and convinces an engineer.

`/technology` is the most important of the four: it explains the process the entire company is built on, and it's linked from the main navigation.

## 🔑 Access & prerequisites

- [ ] T11 merged. Branch `feature/<issue#>-capability-pages` off `main`.
- [ ] Existing content from the four live pages as source material.
- [ ] Process and equipment imagery where available.

## ✅ Scope / What to build

- [ ] `/technology` — MMP process explainer, expanded from the existing page.
- [ ] `/validation` — measurement and validation approach.
- [ ] `/deburring-polishing` — the application, its uses, results.
- [ ] `/mirror-like-finish` — the capability, applications, results.
- [ ] Draft expanded copy for each, structured for SEO.
- [ ] Content from Firestore where it should be admin-editable.
- [ ] Cross-links to relevant industries and case studies.
- [ ] Per-page SEO metadata.
- [ ] Request a Quote CTA on each.

## 🎯 Acceptance Criteria

- [ ] All four resolve at **exactly** `/technology`, `/validation`, `/deburring-polishing`, `/mirror-like-finish`. No prefix, no rename.
- [ ] Each page's content is **materially deeper** than the current site's version — not a reformat.
- [ ] No two of the four share substantially duplicated copy.
- [ ] Each has its own title, description and OG tags in the raw HTML.
- [ ] Cross-links to industries and case studies work and are relevant.
- [ ] Responsive at the four breakpoints; Lighthouse mobile ≥ 90.
- [ ] Meets [`docs/UI-STANDARDS.md`](../UI-STANDARDS.md).

## 🚫 Out of scope

- Redirects and trailing-slash normalization — T20. Company/Capabilities — T11.

## 📚 References

- [`docs/PRD.md`](../PRD.md) §7 URL migration, §10 decision **D7**.
- Current pages at `https://infini.co.in` — source material.

## 🤖 Kickoff prompt

```
/start-ticket 16
```
