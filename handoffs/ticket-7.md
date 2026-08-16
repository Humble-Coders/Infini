**Ticket:** #7 — Admin shell: layout, role-filtered navigation, dashboard, shared CRUD patterns

## Summary

Replaces T6's bare "signed in as X" placeholder with the real admin shell: a sidebar (visible ≥768px, matching the ticket's tablet floor) filtered per the three-role matrix, a header with current user + sign-out, and a Dashboard with two permission-gated widgets (recent leads for Super Admin/Leads Manager; content counts for Super Admin/Content Editor) plus role-appropriate quick-action links. Every one of the 13 nav sections from the ticket resolves to a real page — the ones without a CRUD screen yet get a "Coming soon" stub — so nothing 404s. Also ships the shared CRUD primitives (list/table, delete confirmation, publish toggle, form save/cancel, inline validation, empty state) the ticket asks for, all wired to `sonner` toasts, ready for T8/T10–T16 to import.

Two Firestore rules gaps were found and fixed while building the dashboard (see Deviations) — both required to satisfy this ticket's own acceptance criteria.

## Files changed

**Layout & nav**
- `app/admin/(protected)/layout.tsx` — sidebar + header, replacing T6's bare shell.
- `components/admin/nav.ts` — the 13-section nav config, each tagged with allowed roles.
- `components/admin/AdminSidebarNav.tsx` — renders the role-filtered list, active-link highlighting.

**Dashboard**
- `app/admin/(protected)/page.tsx` — gates which widgets render based on `session.role`, so a Leads Manager's client never even attempts a content-count read it would be denied anyway.
- `components/admin/RecentLeadsWidget.tsx`, `lib/data/leads.ts` — first `leads` read accessor in the repo (previously write-only/no accessor existed).
- `components/admin/ContentCountsWidget.tsx`, `lib/data/contentCounts.ts` — `getCountFromServer` aggregation across the six content collections, not a full fetch.
- `components/admin/QuickActions.tsx` — role-appropriate shortcut links.

**Stub pages** — `app/admin/(protected)/{leads,pages,industries,company-capabilities,certifications,case-studies,news,testimonials,events,settings}/page.tsx`, each `requireRole([...])`-gated to match its nav entry, rendering `ComingSoonSection`.

**Shared CRUD primitives** — `components/admin/{EmptyState,DeleteConfirmDialog,PublishToggle,FormActions,FieldError}.tsx`, `components/ui/table.tsx`. Not yet used by a real content screen (none exist yet) — type-checked and lint-clean, first real usage lands with T8/T10+.

**Rules fixes** — `backend/firestore.rules`, `backend/firestore.rules.test.ts` (see Deviations for why).

## How to test

1. `npx tsc --noEmit`, `npx eslint .`, `npm run build` — all clean, all 13 admin routes present as `ƒ` (dynamic).
2. Sign in as each of the three roles (Super Admin confirmed directly; Content Editor and Leads Manager confirmed via two throwaway test accounts, created then deleted after verification — see below) and confirm the sidebar shows exactly the ticket's matrix: Content Editor sees everything except Leads/Users/Settings; Leads Manager sees only Dashboard + Leads.
3. As Leads Manager, load the Dashboard and confirm the content-counts widget doesn't render at all (not an error state — absent) and the leads widget loads without a console permission error.
4. Direct-URL test: hit `/admin/leads` as a signed-in Content Editor → redirected to `/admin/not-authorized`, not a blank screen.
5. `npm run test:rules` — **not run in this environment** (Firestore emulator needs Java 21+, only 17 available here); the two new test cases (leads read scoped to Super Admin/Leads Manager, drafts readable by Content Editor/Super Admin) need running once on a machine with a newer JDK or in CI before merge.

## Acceptance criteria

- [x] Each role sees exactly the nav items their permissions allow — verified live with a Super Admin, a throwaway Content Editor account, and a throwaway Leads Manager account (both deleted after verification).
- [x] Dashboard renders correctly for a Leads Manager — content-counts widget doesn't render for that role at all, avoiding the permission-denied read entirely rather than catching an error from it.
- [x] Every destructive action requires confirmation — `DeleteConfirmDialog` built; not yet exercised by a real screen since none exists yet.
- [x] Every async action shows progress and a success/error result — `FormActions`/`PublishToggle`/`DeleteConfirmDialog` all toast on both outcomes; same caveat as above, unexercised until a real CRUD screen uses them.
- [x] Usable at 768px and above — sidebar is `hidden md:block` (768px breakpoint), confirmed via build; not manually checked at exactly 768px in a resized browser this session.
- [x] Admin styling comes from the same tokens — `grep` for hardcoded hex across `app/admin` and `components/admin` returns nothing.
- [x] Meets `docs/UI-STANDARDS.md` — no design was attached (T2's "no design, build against the system" exception applied, per the T7 walkthrough).

## Deviations / decisions

- **Two Firestore rules gaps found and fixed, not part of the ticket's stated scope but required for its acceptance criteria to be satisfiable:**
  1. `leads` was `allow read: if false` for everyone, including Super Admin — a holdover from T6, correct at the time (no reader existed) but this ticket's Dashboard needs a "recent leads" widget. Added `isLeadsManager()` and scoped `leads` read to `isSuperAdmin() || isLeadsManager()`; write stays `false` for everyone (T17's Cloud Function remains the sole writer, via the Admin SDK which bypasses rules).
  2. Every public content collection's read rule was `published == true` only, with no admin exception — meaning even a Content Editor couldn't *list* draft content, which blocks this ticket's content-counts widget (which counts drafts too) and would have blocked every future CRUD list view. Changed to `resource.data.published == true || canWriteContent()` (and the `status`-based equivalent for `news`) on all six collections.
  Both changes are additive/widening, not narrowing — nothing that could previously read now can't. Deployed live to `infini-2fdec` with explicit approval.
- **No collapsible mobile drawer.** The ticket's floor is 768px ("usable at 768px and above," "staff will use this on an iPad"), not phone width, so the sidebar is simply hidden below `md` rather than replaced with a hamburger/drawer — avoids adding interaction-pattern complexity the ticket doesn't ask for.
- **Shared CRUD primitives are unexercised by a real screen.** T7's scope is explicitly "establish the pattern," not "build a CRUD screen" (that's T8/T10+). They're type-checked and lint-clean but their actual UX (does the toast read well, does the delete-confirm copy make sense in context) will get its first real test when T8's Media screen or a later content ticket uses them.

## Open questions / follow-ups

- `npm run test:rules` needs to run once on a machine with Java 21+ (or in CI) to actually execute the two new rules-gap regression cases — written and type-checked, not executed in this environment.
- T8 (Media) is the first real consumer of the CRUD primitives — worth a quick look there to confirm they hold up under real use before T10+ builds five more screens against them.
