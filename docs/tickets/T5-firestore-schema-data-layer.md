**Issue:** [#5](https://github.com/Humble-Coders/Infini/issues/5)
**Milestone:** M2 — Data & Admin
**Blocked by:** T4 (Firebase wiring)
**Blocks:** T6 and every content ticket.

## 📖 Story / Why

Every page and every admin screen after this reads through the layer built here. If the shapes are wrong, twenty tickets inherit the mistake — so this one is worth slowing down for.

The rule that matters most: **all Firestore queries live in `lib/data/`.** No `getDocs` or `collection` calls inside components or pages. When a field gets renamed in month three, there is exactly one place to change it.

## 🧭 Context

The full data model is in [`docs/PRD.md`](../PRD.md) §4.3 — 12 collections: `users`, `industries`, `pages`, `caseStudies`, `certifications`, `news`, `testimonials`, `events`, `leads`, `media`, `settings`.

Three non-obvious rules:

**1. SEO metadata is a `seo` map on each document**, not a separate collection. It's always fetched with its content, so it can never drift out of sync with the page it describes.

**2. Every public query filters `published == true`.** Draft content must never leak to a public route. Enforce it in the accessor **and** in the security rules — both, not either. The accessor is convenience; the rule is the actual boundary.

**3. `leads` is server-only.** No client read, no client write, ever. The RFQ Cloud Function (T17) is the sole writer. Rules must reflect that now, before the collection exists.

## 🔑 Access & prerequisites

- [ ] T4 merged — Firebase project and deny-all rules exist.
- [ ] Branch `feature/<issue#>-data-layer` off `main`.

## ✅ Scope / What to build

- [ ] TypeScript types for all 12 collections in `lib/types/`, matching PRD §4.3.
- [ ] Typed accessors in `lib/data/` — one module per collection, covering the reads each later ticket needs (list, by-slug, by-industry, published-only variants).
- [ ] `firestore.rules`: public read on `published == true` for public collections; admin writes gated on a verified `role` custom claim; `leads` denied to all clients.
- [ ] `storage.rules`: public read on published asset paths; writes for Editor/Super Admin only; enforce content-type and size limits.
- [ ] `firestore.indexes.json` for every composite query the accessors need.
- [ ] A **seed script** that populates the 7 industries, 4 certifications, and sample content for local development.
- [ ] Document the model in `docs/DATA-MODEL.md`, including which fields are admin-editable.

## 🎯 Acceptance Criteria

- [ ] `grep -rn "getDocs\|collection(" app/ components/` returns nothing — all queries are in `lib/data/`.
- [ ] Unpublished documents are invisible to an unauthenticated read. **Prove it in the Rules Playground**, not just in the UI.
- [ ] `leads` reads and writes are denied to every client identity including an authenticated admin.
- [ ] Seed script runs clean against an empty emulator and produces all 7 industries with correct slugs.
- [ ] No `any` in the type definitions.
- [ ] Every composite query has a matching index — no runtime index errors.

## 🚫 Out of scope

- Admin UI — T7. Authentication — T6. Any public page.

## 📚 References

- [`docs/PRD.md`](../PRD.md) §4.3 data model, §4.4 security model.
- [`CLAUDE.md`](../../CLAUDE.md) — the data-accessor rule.

## 🤖 Kickoff prompt

```
/start-ticket 5
```
