**Issue:** [#3](https://github.com/Humble-Coders/Infini/issues/3)
**Milestone:** M1 — Foundation
**Blocked by:** T2 (design system)
**Blocks:** every public page ticket.

## 📖 Story / Why

The header, navigation and footer appear on every page of the site, so they get built once, properly, before any page is built on top of them.

The most important element here is the **Request a Quote CTA**. It is the site's primary conversion path, and the client's brief is explicit that it must be reachable from **every page**, not buried on Contact. That makes it a property of the shell, not of individual pages — build it here and no page can forget it.

The old site's navigation is not a template to copy. It's organised around the old content, and the new site's information architecture is different.

## 🧭 Context

**Navigation structure** (final labels are open item O4 — build with these and expect wording to change):

```
Home · Company · Capabilities · Industries (7-item dropdown) ·
Case Studies · Certifications · News · Contact · [Request a Quote]
```

The Industries dropdown covers: Cutting Tools · Forge, Stamping & Die · Plastic Injection Molds · Medical Implants · Aerospace · Additive Manufacturing · Gears & Transmission.

Routes don't exist yet — link them anyway. Next.js will 404 until later tickets land, and that's expected.

**Mobile navigation must be a designed mobile pattern**, not a shrunken desktop menu. This is called out specifically in the client brief. A 9-item nav plus a 7-item dropdown does not collapse gracefully by accident.

**Nav items are eventually admin-editable** (`settings.nav` in Firestore, per the PRD data model). Firestore isn't wired until T4/T5, so for now source them from a **single typed constant** — one file, easy to swap for a Firestore read later. Do not scatter nav labels through JSX.

## 🔑 Access & prerequisites

- [ ] T2 merged — the design system exists.
- [ ] Branch `feature/<issue#>-app-shell` off `main`.

## ✅ Scope / What to build

- [ ] Root `app/layout.tsx` with default metadata: title template, description, Open Graph defaults, favicon.
- [ ] Responsive **header** with primary navigation and the Industries dropdown.
- [ ] **Mobile navigation** — a real mobile pattern with accessible open/close, focus trapping, and body-scroll lock.
- [ ] **Request a Quote CTA** in the shell, visible on every viewport including mobile.
- [ ] **Footer** with navigation, contact details, and legal-page slots (Privacy, Terms) wired but unpopulated.
- [ ] **Tap-to-call** `tel:` link on the phone number.
- [ ] Nav structure in a single typed constant, ready to swap for a Firestore read.
- [ ] A placeholder home page proving shell, tokens and fonts render together end-to-end.

## 🎯 Acceptance Criteria

- [ ] Header, nav, mobile menu and footer are correct at **375px, 768px, 1280px and 1920px**.
- [ ] Request a Quote is visible and reachable on every viewport — **including mobile, where it must not be hidden inside the burger menu.**
- [ ] Mobile menu is fully keyboard operable: opens, traps focus, closes on Escape, returns focus to the trigger.
- [ ] Industries dropdown works by keyboard and on touch, not hover alone.
- [ ] Background scroll is locked while the mobile menu is open.
- [ ] Phone number opens the dialer on a real mobile device.
- [ ] Nav labels come from one constant — `grep` finds no nav label hardcoded in a component.
- [ ] Default metadata renders in the raw HTML (`curl`, not DevTools).
- [ ] Meets [`docs/UI-STANDARDS.md`](../UI-STANDARDS.md).

## 🚫 Out of scope

- Real homepage content and sections — **T9**.
- The Request a Quote form itself — **T17**. This ticket builds the CTA that links to it.
- Legal page content — **T22**.
- Making nav admin-editable — later, once Firestore is wired.

## 📚 References

- [`docs/UI-STANDARDS.md`](../UI-STANDARDS.md)
- [`docs/PRD.md`](../PRD.md) §5.2 homepage, §5.10 Request a Quote, §9 open item **O4** (nav labels).

## 🤖 Kickoff prompt

```
/start-ticket 3
```
