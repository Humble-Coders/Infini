**Issue:** [#24](https://github.com/Humble-Coders/Infini/issues/24)
**Milestone:** M6 — Hardening & launch
**Blocked by:** all M3 content tickets

## 📖 Story / Why

The current site has known performance problems — a heavy homepage and oversized images. A premium-feeling site that takes six seconds to load on a phone isn't premium, and most of INFINI's visitors will arrive on mobile.

**Mobile is the bar, not desktop.** A site that scores 95 on a desktop connection and 45 on a mid-range Android phone has failed this ticket.

## 🧭 Context

Individual tickets each carry a Lighthouse ≥ 90 requirement, so this shouldn't be a rescue mission. It's the system-wide pass now that everything is assembled — where third-party scripts, font loading, and the combined weight of real content show their true cost.

**The usual culprits, in order:**
1. **Images.** Biggest lever on a site like this. `next/image` handles format and sizing, but only if it's actually used everywhere and the source assets aren't absurd.
2. **Third-party scripts.** GTM, GA4 and reCAPTCHA are all render-blocking risks. reCAPTCHA especially — it should not load on pages with no form.
3. **Fonts.** `next/font` should already prevent layout shift; verify it does.
4. **JavaScript.** Server components by default means client JS should be small. If it isn't, something is marked `"use client"` that shouldn't be.

**Measure on throttled mobile**, not on a laptop on office wifi. Lighthouse mobile with 4x CPU throttling is the closest cheap proxy for the device a procurement engineer actually holds.

Don't fix performance by removing the design. The point is a site that is both premium and fast — if an animation genuinely costs too much, replace it with something cheaper rather than deleting the moment.

## 🔑 Access & prerequisites

- [ ] All M3 tickets merged. Branch `feature/<issue#>-performance` off `main`.
- [ ] A deployed staging build — never measure performance in dev mode.

## ✅ Scope / What to build

- [ ] Audit every page with Lighthouse mobile, throttled. Record baselines.
- [ ] Verify `next/image` everywhere with correct `sizes`, and `priority` only on genuine LCP images.
- [ ] Re-compress any oversized source assets.
- [ ] Lazy-load below-the-fold images and heavy components.
- [ ] Defer third-party scripts; **load reCAPTCHA only on pages with a form.**
- [ ] Confirm fonts cause no layout shift.
- [ ] Audit `"use client"` usage — remove any that isn't needed.
- [ ] Check bundle size and split anything oversized.
- [ ] Verify caching and CDN behaviour on App Hosting.
- [ ] Confirm ISR is working — pages should not re-render per request.
- [ ] Respect `prefers-reduced-motion` throughout.
- [ ] Record before/after figures in `docs/PERFORMANCE.md`.

## 🎯 Acceptance Criteria

- [ ] **Lighthouse mobile performance ≥ 90 on every public page**, measured against the deployed staging build with throttling.
- [ ] Accessibility ≥ 95, best practices ≥ 95, SEO 100 on every public page.
- [ ] **Core Web Vitals in the green:** LCP < 2.5s, CLS < 0.1, INP < 200ms.
- [ ] No image is served materially larger than its display size.
- [ ] reCAPTCHA does not load on pages without a form. Verify in the Network tab.
- [ ] No layout shift from font loading.
- [ ] Client JS bundle is justified — no accidental `"use client"` on a static page.
- [ ] The site remains usable on a throttled 3G connection.
- [ ] `docs/PERFORMANCE.md` records before/after per page.
- [ ] **No design was removed to hit these numbers** — if something was cut, it's flagged in the ticket thread for the manager to approve.

## 🚫 Out of scope

- Redesigning pages. Security — T23.

## 📚 References

- [`docs/PRD.md`](../PRD.md) §6 performance.

## 🤖 Kickoff prompt

```
/start-ticket 24
```
