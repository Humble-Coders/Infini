**Issue:** [#20](https://github.com/Humble-Coders/Infini/issues/20)
**Milestone:** M5 — SEO, analytics & legal
**Blocked by:** T16, T19
**⚠️ LAUNCH-BLOCKING. The site must not go live without this.**

## 📖 Story / Why

`infini.co.in` has existing URLs with accumulated search value. Replacing the site without redirects means every one of those becomes a 404: rankings lost, inbound links broken, and anyone arriving from an old search result or a bookmark hitting a dead end.

This is the single highest-risk moment of the whole project, and it's entirely preventable. It's also unforgiving — the damage happens at cutover and takes months to undo.

## 🧭 Context

**The mapping**, recovered from the legacy WordPress sitemap (PRD §7):

| Old URL | New URL | Action |
|---|---|---|
| `/aero/` | `/industries/aerospace` | **301** |
| `/forge-stamping-die/` | `/industries/forge-stamping-die` | **301** |
| `/additive-fabrication/` | `/industries/additive-manufacturing` | **301** |
| `/medical/` | `/industries/medical-implants` | **301** |
| `/plastic-injection-molds/` | `/industries/plastic-injection-molds` | **301** |
| `/cutting-tools/` | `/industries/cutting-tools` | **301** |
| `/transmissions/` | `/industries/gears-transmission` | **301** |
| `/technology/` | `/technology` | Keep slug — normalize trailing slash |
| `/validation/` | `/validation` | Keep slug |
| `/deburring-polishing/` | `/deburring-polishing` | Keep slug |
| `/mirror-like-finish/` | `/mirror-like-finish` | Keep slug |
| `/contact/` | `/contact` | Keep slug |

**This table came from the sitemap, which is not necessarily complete.** WordPress sites accumulate indexed URLs that no sitemap lists — old posts, attachment pages, category archives, paginated listings. **Before implementing, pull the actual indexed URL list from Google Search Console (open item O8) and reconcile it against this table.** Anything indexed and missing from the map needs a decision, not a 404.

**301, not 302.** A 302 tells search engines the move is temporary and passes no ranking value. This distinction is the entire point of the ticket.

Redirects go in `next.config.js` so they're versioned with the code and survive any hosting change.

## 🔑 Access & prerequisites

- [ ] T16, T19 merged. Branch `feature/<issue#>-redirects` off `main`.
- [ ] **Google Search Console access (O8)** — genuinely required here, to find indexed URLs the sitemap omits.

## ✅ Scope / What to build

- [ ] Pull the full indexed URL list from Search Console and reconcile against the table above.
- [ ] Document the final mapping in `docs/REDIRECTS.md`, including anything discovered beyond the sitemap.
- [ ] Implement all 301s in `next.config.js`.
- [ ] Consistent trailing-slash handling site-wide — pick one convention and normalize.
- [ ] A designed **404 page** that helps rather than dead-ends: navigation, search or key links.
- [ ] An automated test asserting every mapped old URL returns 301 to the right target.
- [ ] A post-launch check plan for Search Console crawl errors.

## 🎯 Acceptance Criteria

- [ ] **Every URL in the final map returns `301`** — verify with `curl -I` for each, and confirm the status code is 301 and not 302.
- [ ] Each redirect lands on the correct new page, not a generic hub.
- [ ] The four legacy capability slugs resolve directly with **no redirect chain**.
- [ ] No redirect chains anywhere — old URL goes to final destination in one hop.
- [ ] Trailing-slash handling is consistent across the whole site.
- [ ] The Search Console reconciliation is done and documented, including any URL found beyond the sitemap.
- [ ] `docs/REDIRECTS.md` is complete and matches what's implemented.
- [ ] The 404 page is designed and offers a useful path forward.
- [ ] Automated redirect test passes in CI.

## 🚫 Out of scope

- The production DNS cutover — T26.

## 📚 References

- [`docs/PRD.md`](../PRD.md) §7 URL migration, §10 decision **D7**.

## 🤖 Kickoff prompt

```
/start-ticket 20
```
