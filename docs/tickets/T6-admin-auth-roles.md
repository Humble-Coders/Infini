**Issue:** [#6](https://github.com/Humble-Coders/Infini/issues/6)
**Milestone:** M2 — Data & Admin
**Blocked by:** T5 (data layer)
**Blocks:** T7, T8, and all admin CRUD.

## 📖 Story / Why

The admin panel controls the client's public website and holds their sales leads. This is the security boundary of the entire project — the one ticket where "it works" is not the same as "it's correct."

The client's brief is explicit that the system must never assume one admin or one permission level.

## 🧭 Context

**Three roles** (PRD decision D6):

| Role | Content CRUD | Media | Leads | Users & Settings |
|---|---|---|---|---|
| Super Admin | ✅ | ✅ | ✅ | ✅ |
| Content Editor | ✅ | ✅ | ❌ | ❌ |
| Leads Manager | ❌ | ❌ | ✅ | ❌ |

**Roles live in Firebase Auth custom claims**, mirrored on the user document for display. Firestore rules read the claim — never a client-supplied value.

**The failure mode to design against:** hiding a nav item is not access control. A Leads Manager who types `/admin/news/new` into the address bar must be stopped by the *rules*, not by the absence of a button. Assume every admin route will be visited directly by someone who shouldn't be there.

**No public signup.** There is no customer-facing login anywhere in this project. Admin accounts are created by a Super Admin only. If a signup form exists at the end of this ticket, something has gone wrong.

## 🔑 Access & prerequisites

- [ ] T5 merged.
- [ ] Branch `feature/<issue#>-admin-auth` off `main`.
- [ ] Enable Email/Password auth in the Firebase console. Record it in `docs/INFRA.md`.
- [ ] Ask the manager for the initial Super Admin email — **never commit a password.** Bootstrap the first account via console or a one-off script.

## ✅ Scope / What to build

- [ ] Firebase Auth email/password sign-in for admins.
- [ ] A Cloud Function that sets the `role` custom claim, callable by Super Admin only.
- [ ] Next.js middleware guarding `/admin/**` — unauthenticated users are redirected to sign-in.
- [ ] Per-role route authorization: a signed-in user without the right role gets a clear "not authorized" response, not a blank screen.
- [ ] Firestore rules updated to enforce the role matrix on every collection.
- [ ] Sign-in page, sign-out, session persistence, and password reset.
- [ ] Users admin screen: list, invite, change role, deactivate — **Super Admin only**.
- [ ] Handle claim propagation — a role change must not require the user to work out that they need to sign out and back in.

## 🎯 Acceptance Criteria

- [ ] `/admin/**` is unreachable while signed out — verify by direct URL, not by clicking.
- [ ] **A Content Editor hitting `/admin/leads` directly is denied**, and the underlying Firestore read fails at the rules layer even if the UI is bypassed.
- [ ] **A Leads Manager cannot write content**, verified in the Rules Playground with their claim.
- [ ] A non-Super-Admin cannot call the role-setting function. Test it directly.
- [ ] No signup route exists anywhere in the app.
- [ ] Role changes take effect without the user having to guess at a fix.
- [ ] `/admin/**` is `noindex`.
- [ ] No credentials, tokens, or role logic that matters are held client-side.

## 🚫 Out of scope

- Admin layout and dashboard — T7. Media — T8. Any content CRUD screen.

## 📚 References

- [`docs/PRD.md`](../PRD.md) §3B roles, §4.4 security, §10 decisions **D6**, **D8**.
- [`docs/UI-STANDARDS.md`](../UI-STANDARDS.md)

## 🤖 Kickoff prompt

```
/start-ticket 6
```
