**Issue:** [#25](https://github.com/Humble-Coders/Infini/issues/25)
**Milestone:** M6 — Hardening & launch
**Blocked by:** T23, T24

## 📖 Story / Why

Cross-browser and cross-device testing is a contracted deliverable. It's also the last chance to catch the class of bug that only appears on someone else's hardware — and the client's buyers are on corporate Windows machines and iPhones, not the developer's laptop.

The most common source of embarrassment at launch is Safari. It lags on CSS features, handles dates differently, and has its own ideas about form inputs and scrolling.

## 🧭 Context

**Required matrix** (PRD §6):

| Browsers | Operating systems | Sizes |
|---|---|---|
| Chrome, Safari, Edge, Firefox | Windows, macOS, Android, iOS | Mobile, tablet, desktop |

**Test on real devices where possible**, particularly a real iPhone. Simulators miss keyboard behaviour, scroll physics, safe-area handling and tap-to-call.

**Functional coverage** (from the proposal): navigation · forms · Request a Quote · admin login · admin permissions · CRUD operations · image uploads · certificate downloads · case studies · news · testimonials · events · leads · email notifications.

**Test as all three roles, not just Super Admin.** Permission bugs only appear when you're the restricted user, and Super Admin sees everything working perfectly by definition.

**Log findings as separate issues rather than fixing inline.** This ticket produces a verified inventory of what's broken; fixes get triaged so a two-day scope discovery doesn't hide inside a QA ticket.

## 🔑 Access & prerequisites

- [ ] T23, T24 merged. Branch `feature/<issue#>-qa` off `main`.
- [ ] Deployed staging build.
- [ ] Test accounts for all three roles.
- [ ] Access to real devices — at minimum a real iPhone and a real Android phone.

## ✅ Scope / What to build

- [ ] Write a test plan in `docs/QA-CHECKLIST.md` covering the matrix and every functional area.
- [ ] Execute across all browser/OS combinations.
- [ ] Test every functional area listed above.
- [ ] Test the admin panel as **each of the three roles**.
- [ ] Verify Request a Quote end to end on real mobile hardware, including the email arriving.
- [ ] Verify certificate downloads on iOS Safari — a common failure point.
- [ ] Verify tap-to-call on a real phone.
- [ ] Verify forms with the on-screen keyboard: correct keyboard type, field stays visible, submission works.
- [ ] SEO checks: metadata, sitemap, robots, canonicals, redirects, broken links.
- [ ] Verify at increased browser font size and with keyboard-only navigation.
- [ ] Log every defect as its own issue with reproduction steps, environment and severity.
- [ ] Re-test after fixes land.

## 🎯 Acceptance Criteria

- [ ] Every browser/OS combination in the matrix has been exercised and recorded.
- [ ] Every functional area has been tested and its result logged.
- [ ] The admin panel has been tested as all three roles, with permission boundaries confirmed.
- [ ] Request a Quote verified end to end on a **real** iOS device and a **real** Android device, with the notification email confirmed received.
- [ ] Certificate download works on iOS Safari.
- [ ] Tap-to-call works on real hardware.
- [ ] No broken internal links — verify with a crawler, not by clicking.
- [ ] All redirects verified post-implementation.
- [ ] Every defect found is logged as an issue with reproduction steps.
- [ ] All **critical and high-severity** defects are fixed and re-tested. Lower-severity items are logged and triaged with the manager.
- [ ] `docs/QA-CHECKLIST.md` is complete and reusable for future releases.

## 🚫 Out of scope

- Fixing low-severity issues — triage with the manager. Production deployment — T26.

## 📚 References

- [`docs/PRD.md`](../PRD.md) §6 QA requirements.
- [`docs/UI-STANDARDS.md`](../UI-STANDARDS.md)

## 🤖 Kickoff prompt

```
/start-ticket 25
```
