**Issue:** [#19](https://github.com/Humble-Coders/Infini/issues/19)
**Milestone:** M5 — SEO, analytics & legal
**Blocked by:** all M3 content tickets

## 📖 Story / Why

SEO is a contracted deliverable, not a bonus. The client is paying for a site that ranks and that presents properly when shared — and unlike a broken button, SEO failures are invisible until months of lost traffic have already happened.

This ticket is the sweep that verifies it across every page now that the content exists.

## 🧭 Context

Next.js was chosen specifically so metadata renders server-side (PRD decision **D1**). Individual page tickets each set their own metadata; this ticket makes it systematic, fills the gaps, and adds the site-wide pieces.

**Verify with `curl`, never DevTools.** DevTools shows the post-JavaScript DOM. A crawler sees the raw response. Every check in this ticket must be against raw HTML — this is the exact failure the framework decision exists to prevent, and checking it the wrong way would let it ship anyway.

**Where content is admin-managed, its metadata must be admin-editable** — that's an explicit requirement. The `seo` map already exists on each document from T5; this ticket makes sure every admin form exposes it and every page consumes it.

**AI/search-agent readiness** is also contracted: clear hierarchy, semantic markup, explicit relationships between industries, capabilities and case studies, crawlable server-rendered content. Next.js gives the structure; this ticket confirms the content doesn't undermine it.

## 🔑 Access & prerequisites

- [ ] All M3 tickets merged. Branch `feature/<issue#>-seo` off `main`.
- [ ] Google Search Console access (open item **O8**) — needed for submission, not for the build.

## ✅ Scope / What to build

- [ ] Audit every route for title, description and Open Graph tags. Fill every gap.
- [ ] Ensure `seo` map fields are editable in every admin form for admin-managed content.
- [ ] Dynamic `sitemap.xml` covering all published content, updating as content publishes.
- [ ] `robots.txt` for production — allow crawling, disallow `/admin`, reference the sitemap.
- [ ] Canonical URLs on every page.
- [ ] Structured data: `Organization` site-wide, `Article` on news, `BreadcrumbList` on nested pages.
- [ ] Default OG image, plus per-page overrides where set.
- [ ] Verify heading hierarchy across every page — one `<h1>`, correct order below.
- [ ] Verify alt text coverage on every image.
- [ ] Internal linking between industries, capabilities and case studies.
- [ ] Submit the sitemap to Google Search Console.

## 🎯 Acceptance Criteria

- [ ] **`curl` on every public route returns title, description and OG tags in the raw HTML.** Script this across all routes rather than spot-checking.
- [ ] `sitemap.xml` lists every published page and excludes drafts, `/admin` and `/styleguide`.
- [ ] Publishing new content adds it to the sitemap without a redeploy.
- [ ] `robots.txt` is correct for production and still disallows everything on staging.
- [ ] Structured data passes Google's Rich Results Test with no errors.
- [ ] OG tags render a correct preview — **test by pasting a real URL into WhatsApp and LinkedIn.** This is the check that catches what nothing else does.
- [ ] Every page has exactly one `<h1>` and a correct heading order.
- [ ] No image is missing meaningful alt text.
- [ ] Admin can edit SEO metadata for every admin-managed content type.
- [ ] Sitemap submitted to Search Console.

## 🚫 Out of scope

- 301 redirects — T20. Analytics — T21.

## 📚 References

- [`docs/PRD.md`](../PRD.md) §6 SEO and AI-readiness, §10 decision **D1**, §9 open item **O8**.

## 🤖 Kickoff prompt

```
/start-ticket 19
```
