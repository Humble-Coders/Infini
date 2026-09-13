**Ticket:** #7 — Admin shell: layout, role-filtered navigation, dashboard, shared CRUD patterns

## Summary

Builds the shell every later admin section drops into: a sidebar filtered per the three-role matrix, a header with the current user and sign-out, and a Dashboard with two permission-gated widgets — recent leads for Super Admin/Leads Manager, content counts across the six content collections for Super Admin/Content Editor — plus role-appropriate quick-action links. Every one of the 13 nav sections resolves to a real page; the ones without a full CRUD screen yet show a "coming soon" placeholder rather than 404ing. Also ships the shared CRUD primitives the ticket asks for — list/table, delete confirmation, publish/unpublish toggle, form save/cancel, inline validation, empty state — wired to `sonner` toasts, ready for every content ticket after this to import rather than reinvent.

Firestore rules gained two additions needed for the dashboard's own widgets to work: `leads` reads are now scoped to Super Admin and Leads Manager (previously denied to everyone, correct at the time but incompatible with a "recent leads" widget), and every public content collection's read rule now has an admin-visible branch so a Content Editor or Super Admin can see draft content, not just published — needed for the content-counts widget to count drafts, and for every future CRUD list view to be able to show them at all.

## Files changed

**Layout & nav**
- `app/admin/(protected)/layout.tsx` — sidebar + header.
- `components/admin/nav.ts` — the 13-section nav config, each tagged with allowed roles.
- `components/admin/AdminSidebarNav.tsx` — role-filtered nav list with active-link highlighting.

**Dashboard**
- `app/admin/(protected)/page.tsx` — gates which widgets render based on the signed-in user's role, so a Leads Manager's client never attempts a read it would be denied anyway.
- `components/admin/RecentLeadsWidget.tsx`, `lib/data/leads.ts` — the first `leads` read accessor in the repo.
- `components/admin/ContentCountsWidget.tsx`, `lib/data/contentCounts.ts` — `getCountFromServer` aggregation across the six content collections, not a full document fetch.
- `components/admin/QuickActions.tsx` — role-appropriate shortcut links.

**Stub pages** — `app/admin/(protected)/{leads,pages,industries,company-capabilities,certifications,case-studies,news,testimonials,events,settings}/page.tsx`, each gated to match its nav entry.

**Shared CRUD primitives** — `components/admin/{EmptyState,DeleteConfirmDialog,PublishToggle,FormActions,FieldError}.tsx`, `components/ui/table.tsx`.

**Rules** — `backend/firestore.rules`, `backend/firestore.rules.test.ts` — the leads-read and admin-draft-read additions described above, with new regression cases covering both.

## How to test

```bash
npm run build
npm run dev
```

Sign in as each of the three roles and confirm the sidebar shows exactly the ticket's matrix: Content Editor sees everything except Leads/Users/Settings; Leads Manager sees only Dashboard + Leads. As Leads Manager, load the Dashboard and confirm the content-counts widget doesn't render at all (not an error — absent), and the leads widget loads cleanly. Direct-URL a route outside your role (e.g. `/admin/leads` as Content Editor) and confirm a redirect to "not authorized," not a blank screen. `npm run test:rules` for the automated rules regression cases.

## Acceptance criteria

- [x] Each role sees exactly the nav items their permissions allow.
- [x] Dashboard renders correctly for a Leads Manager — content-counts widget doesn't render for that role at all.
- [x] Every destructive action requires confirmation — `DeleteConfirmDialog` in place for every future content screen to use.
- [x] Every async action shows progress and a success/error result — `FormActions`/`PublishToggle`/`DeleteConfirmDialog` all toast on both outcomes.
- [x] Usable at 768px and above — sidebar visible from the `md` breakpoint up.
- [x] Admin styling comes from the same tokens as the public site — confirmed via grep, no hardcoded hex.
- [x] Meets `docs/UI-STANDARDS.md` — no design attached; built against the T2 system, the documented exception for tickets without one.

## Deviations / decisions

- No collapsible mobile drawer below 768px — the ticket's own floor is tablet ("usable at 768px and above," "staff will use this on an iPad"), not phone width, so the sidebar is simply hidden below `md` rather than replaced with a hamburger pattern the ticket doesn't ask for.
- The shared CRUD primitives are built and type-checked here but get their first real exercise from T8's Media screen and the content tickets after it — this ticket's job was establishing the pattern, not shipping a content screen against it.

## Open questions / follow-ups

- `npm run test:rules` needs a Java 21+ environment to actually run the Firestore emulator.
- T8 is the first real consumer of the CRUD primitives — worth a check-in there to confirm they hold up under real use.
