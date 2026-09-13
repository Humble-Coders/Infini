**Issue:** [#14](https://github.com/Humble-Coders/Infini/issues/14)
**Milestone:** M3 — Public content
**Blocked by:** T8 (media), T7 (admin shell)

## 📖 Story / Why

Two jobs: keep the site from looking abandoned, and give it a way to publish ongoing SEO content without a developer. Blog publishing is explicitly part of the contracted SEO foundation.

The measure of success is whether INFINI staff actually publish. If the editor is awkward, they won't — and the site will still show a two-year-old post at handover-plus-six-months.

## 🧭 Context

**Admin capabilities** (PRD §5.7): create, edit, upload images, title, body, metadata, publish/unpublish, and **draft state**. Draft matters — staff need to write something over several sittings without it being live.

**The rich text editor is the real decision in this ticket.** Options range from a plain markdown textarea to a full WYSIWYG. Recommendation: something structured and constrained rather than a free-form HTML editor — a WYSIWYG that permits arbitrary HTML and inline styles will, over time, produce posts that don't match the design system and can't be restyled. Constrain it to the block types the design supports: headings, paragraphs, lists, images, quotes, links.

**Whatever you choose, raise it in the ticket thread before building.** It's a decision the manager should see, because it directly determines whether staff enjoy using the panel.

Sanitize rendered content. Admin-authored HTML is lower risk than public input, but it's still untrusted at render time.

## 🔑 Access & prerequisites

- [ ] T8, T7 merged. Branch `feature/<issue#>-news-blog` off `main`.

## ✅ Scope / What to build

- [ ] `/news` index with pagination.
- [ ] `/news/[slug]` detail.
- [ ] Admin CRUD with **draft and published states**.
- [ ] Rich text editing — approach agreed in the ticket thread first.
- [ ] Cover image and inline images via `<MediaPicker>`.
- [ ] Per-post SEO metadata (title, description, OG image), editable in admin.
- [ ] Slug generated from the title, editable, with uniqueness enforced.
- [ ] Tags, if they earn their place — skip if they add complexity without use.
- [ ] Latest-news block for the homepage.
- [ ] Published date display and correct ordering.

## 🎯 Acceptance Criteria

- [ ] **Drafts are invisible on public routes** — verify by requesting a draft's URL directly while signed out, not just by checking it's absent from the index.
- [ ] Publishing makes a post live **without a redeploy** (revalidation works).
- [ ] Slug collisions are prevented, and editing a title doesn't silently break an existing published URL.
- [ ] Rendered post content is sanitized.
- [ ] Post content inherits design-system typography — a published post looks like it belongs to the site.
- [ ] Each post has its own metadata and OG image in the raw HTML.
- [ ] A Content Editor can publish; a Leads Manager cannot.
- [ ] Index paginates correctly and has an empty state.
- [ ] Meets [`docs/UI-STANDARDS.md`](../UI-STANDARDS.md).

## 🚫 Out of scope

- Sitemap inclusion and `Article` structured data — T19. Scheduled publishing — not in v1 unless it's free with the chosen approach.

## 📚 References

- [`docs/PRD.md`](../PRD.md) §5.7 news/blog, §6 SEO.

## 🤖 Kickoff prompt

```
/start-ticket 14
```
