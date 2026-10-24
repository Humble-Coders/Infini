# CLAUDE.md — INFINI

Read this before writing any code. It encodes decisions already made; re-litigating them in a ticket wastes everyone's time. The full spec is [`docs/PRD.md`](./docs/PRD.md).

---

## What this project is

A complete revamp of `infini.co.in` — a modern, premium corporate website for **INFINI**, plus a role-based admin panel and leads system, on Firebase. Ships as one production site that replaces the existing WordPress build.

> **INFINI does not manufacture parts.** It is a precision **surface-finishing** company: it applies the MMP (Micro Machining Process) treatment to components its customers manufacture. Any copy, heading, alt text or meta description calling INFINI a "manufacturer" is factually wrong and will be sent back. The correct frame: *a specialist surface-finishing partner to precision manufacturers.*

---

## Current state vs target

**The repo is still the original Vite SPA boilerplate.** The Next.js migration is the first ticket. Until it lands, the tree below is the target, not the reality — don't be surprised by the mismatch, and don't build new features on the Vite shell.

| | Now | Target |
|---|---|---|
| Framework | Vite 8 SPA | **Next.js (App Router)** |
| Language | `.jsx`, plain JS | **TypeScript** |
| Routing | none | App Router file routes |
| Rendering | client-only | SSG + ISR, server components by default |

Ported forward as-is: `tailwind.config.js` (already fully token-driven), the `components/ui/*` Radix primitives, and `src/index.css`'s variable structure — **but not its values** (see Design system).

---

## Architecture

```
app/
  (public)/            # public site — server components, indexable
    page.tsx                        # home
    industries/page.tsx
    industries/[slug]/page.tsx      # 7 industries, Firestore-driven
    case-studies/[slug]/page.tsx
    news/[slug]/page.tsx
    certifications/ company/ capabilities/ events/ contact/
    request-a-quote/
    technology/ validation/ deburring-polishing/ mirror-like-finish/
  admin/               # private — client-side, auth-gated, noindex
    layout.tsx                      # auth + role gate
    leads/ industries/ case-studies/ news/ testimonials/
    events/ certifications/ media/ users/ settings/
components/
  ui/                  # Radix primitives — presentational only, no data fetching
  sections/            # composed page sections
  admin/               # admin-only components
lib/
  firebase/client.ts   # browser SDK — safe for client bundles
  data/                # typed Firestore accessors — the ONLY place queries live
  types/               # shared document types
backend/               # everything server-only lives here, never imported by client bundles
  firebase/admin.ts    # Admin SDK — SERVER ONLY, must `import "server-only"`
  functions/           # Cloud Functions: RFQ handler, email, claims, revalidate
  firestore.rules firestore.indexes.json storage.rules
```

**Data flow.** Public pages render on the server from `lib/data/*` accessors → Firestore. The admin panel writes through the client SDK, gated by rules. Form submissions go to a Cloud Function, never straight to Firestore from the browser.

### Rules that are not negotiable

1. **All Firestore queries live in `lib/data/`.** No `getDocs`/`collection` calls inside components or pages. One typed accessor per read, so a schema change has one blast radius.
2. **Every public query filters `published == true`.** Draft content must never leak to a public route. Enforce it in the accessor *and* in the security rules — both, not either.
3. **`backend/firebase/admin.ts` is server-only.** It must start with `import "server-only"`. The Admin SDK bypasses all security rules; if it reaches a client bundle the database is effectively public.
4. **Leads are write-only, server-side.** The browser never reads or writes `leads`. The RFQ Cloud Function is the sole writer. Only Super Admin and Leads Manager read them, through rules.
5. **RFQ submission order is fixed:** validate → verify reCAPTCHA server-side → **write to Firestore** → send email → return success. Firestore is the system of record; email is a notification. Never make a lead's existence depend on SMTP succeeding. Log send failures and surface them in the admin dashboard so a silent outage is visible.
6. **Authorization is server-side.** Roles live in Firebase Auth **custom claims**, enforced in Firestore/Storage rules. Hiding a button is not access control. Never gate on a role read from client state alone.
7. **Nothing admin-editable may be hardcoded.** If an INFINI staffer could reasonably want to change it — copy, images, industry descriptions, certifications, SEO metadata — it comes from Firestore. Layout and structure stay in code.
8. **Server components by default.** Add `"use client"` only for genuine interactivity (forms, admin, menus), and push it as far down the tree as possible.
9. **Publishing triggers revalidation.** Admin publish → revalidate the affected paths. Content goes live without a redeploy.

---

## Key rules

### Secrets
- The Firebase **web** config is public by design — fine in `NEXT_PUBLIC_*`.
- **`NEXT_PUBLIC_` means shipped to the browser in plaintext.** SMTP credentials, the Google App Password, the reCAPTCHA **secret** key, and any service-account JSON must **never** carry that prefix and must never appear in `app/`, `components/` or `lib/` client code. They belong in Cloud Functions config / Secret Manager.
- Never commit a real `.env`. `.env.example` documents keys only — no values.

### Design system
The boilerplate shipped a **dark charcoal + gold (`#c9a227`) + Playfair Display** theme. **That is not the INFINI brand — delete it.** INFINI is **red / black / white**; build a considered palette around that core.

- All colour, spacing and radius values come from CSS variables in `index.css`. **No hardcoded hex, no arbitrary `[#ff0000]` values in components.**
- `tailwind.config.js` already maps every token to a variable — rebranding means editing variables, not the config.
- Reuse `components/ui/*`. Don't hand-roll a second button.
- Motion must be purposeful and must not cost mobile performance.

### SEO — this is a paid deliverable, treat it as load-bearing
- **Every route exports `metadata` or `generateMetadata`.** Dynamic pages pull title/description/OG from the document's `seo` map.
- Use **`next/image`** everywhere. No raw `<img>`. Every image needs meaningful `alt`.
- One `<h1>` per page; correct heading order below it.
- `/admin/**` is `noindex`.
- Structured data on the relevant types: `Organization`, `Article`, `BreadcrumbList`.
- **Don't change a public URL without adding its 301.** The legacy redirect map in `docs/PRD.md` §7 is a launch-blocking requirement — `/technology/`, `/validation/`, `/deburring-polishing/` and `/mirror-like-finish/` keep their exact slugs deliberately.

### Accessibility & responsive
Semantic HTML, keyboard navigable, visible focus, sufficient contrast. Mobile is designed, not squeezed — real mobile nav, touch-sized targets, **tap-to-call** phone number. Test at mobile, tablet and desktop before calling a ticket done.

### Never do these
- Commit secrets, `.env`, or service-account keys.
- Deploy anything unfinished to `infini.co.in`. Client review happens on the private staging URL.
- Delete or bulk-edit `leads`.
- Add a heavy animation or UI library without raising it in the ticket first.
- Copy `mmptechnology.com`. It is a quality benchmark and the global sibling brand — the output must be original INFINI.
- Auto-import old WordPress content. Content is refreshed, not migrated wholesale.

---

## How we work

Full process: [`docs/PROCESS.md`](./docs/PROCESS.md).

| Step | Command | Who |
|---|---|---|
| Ticket drafted from the spec | `/draft-ticket <what>` | Manager |
| Ticket reviewed against intent | `/review-ticket <#>` | Product Owner — **Gate 1** |
| Build it | `/start-ticket <#>` | Developer |
| Report from the real diff | `/handoff <#>` | Developer |
| Code reviewed vs acceptance criteria | `/manager-review <PR#>` | Manager — **Gate 2** |

**Git.** Branch per ticket off `main`: `feature/<issue#>-<slug>`. Open a PR with the handoff attached. `main` is protected by Gate 2 — no direct commits. Never force-push a branch under review.

**Definition of Ready.** A ticket a junior dev can run cold, without a call. If yours isn't, say so before starting rather than guessing.

---

## References

- Spec & decision log — [`docs/PRD.md`](./docs/PRD.md)
- Process — [`docs/PROCESS.md`](./docs/PROCESS.md)
- Current site being replaced — `https://infini.co.in` (WordPress)
- Quality benchmark, global MMP sibling brand — `https://mmptechnology.com/`
- Repo — `Humble-Coders/Infini` (private)
