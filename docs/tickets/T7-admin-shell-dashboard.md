**Issue:** [#7](https://github.com/Humble-Coders/Infini/issues/7)
**Milestone:** M2 — Data & Admin
**Blocked by:** T6 (auth + roles)
**Blocks:** every admin CRUD screen.

## 📖 Story / Why

Eight later tickets each add an admin section. They should all drop into a shell that already exists, rather than each inventing its own layout — otherwise the panel ends up looking like eight different products.

The people using this are INFINI staff, not developers. The whole point of the admin panel is that INFINI never needs to call a developer to change normal website content. If it's confusing, they'll stop using it and start emailing us instead — which is the outcome this project exists to prevent.

## 🧭 Context

Sections to accommodate (built later, but the nav is designed now): Dashboard · Leads · Pages · Industries · Company/Capabilities · Certifications · Case Studies · News · Testimonials · Events · Media · Users · Settings.

**Nav is filtered by role.** A Leads Manager sees Dashboard and Leads. A Content Editor sees everything except Leads, Users and Settings. Hiding is a usability nicety on top of the T6 rules — never a substitute for them.

**Reuse the public design system.** The admin panel is a different context, not a different brand — same tokens, same primitives. It can be denser and more utilitarian, but it should not look like it came from another project.

Establish the shared CRUD patterns here — list view, form layout, save/cancel, delete confirmation, publish toggle, validation display. Getting these right once saves eight repetitions of the same decisions.

## 🔑 Access & prerequisites

- [ ] T6 merged. Branch `feature/<issue#>-admin-shell` off `main`.
- [ ] A test account per role for verification.

## ✅ Scope / What to build

- [ ] `app/admin/layout.tsx` — sidebar navigation, header with current user and sign-out, content area.
- [ ] Role-filtered navigation.
- [ ] Dashboard: recent leads (permission-gated), content counts, quick actions.
- [ ] Reusable admin patterns: list/table view with empty state, form layout, save/cancel, **delete confirmation dialog**, publish/unpublish toggle, inline validation errors.
- [ ] Toast feedback for every save, publish and delete (`sonner` is already a dependency).
- [ ] Responsive down to tablet — staff will use this on an iPad.
- [ ] Loading and error states for every data-backed view.

## 🎯 Acceptance Criteria

- [ ] Each of the three roles sees exactly the nav items their permissions allow.
- [ ] The dashboard renders correctly for a Leads Manager, who sees leads but **no content counts they lack permission to read** — and no failed-permission errors in the console.
- [ ] Every destructive action requires confirmation. Nothing is deleted in one click.
- [ ] Every async action shows progress and a success or error result. No silent failures.
- [ ] Usable at 768px and above.
- [ ] Admin styling comes from the same tokens as the public site — `grep` finds no hardcoded hex.
- [ ] Meets [`docs/UI-STANDARDS.md`](../UI-STANDARDS.md).

## 🚫 Out of scope

- Any specific content CRUD screen — each ships with its content type.
- The leads dashboard itself — T18. Media library — T8.

## 📚 References

- [`docs/PRD.md`](../PRD.md) §5.11 admin panel, §3B roles.
- [`docs/UI-STANDARDS.md`](../UI-STANDARDS.md)

## 🤖 Kickoff prompt

```
/start-ticket 7
```
