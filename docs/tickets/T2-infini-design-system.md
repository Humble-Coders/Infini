**Issue:** [#2](https://github.com/Humble-Coders/Infini/issues/2)
**Milestone:** M1 — Foundation
**Blocked by:** T1 (Next.js migration)
**Blocks:** T3 and every UI ticket after it.

## 📖 Story / Why

This ticket defines what INFINI looks like. Every page built after it inherits these decisions, so it's the highest-leverage design work on the project — and the hardest to change later.

The client's brief is explicit: the new site must not feel like a refreshed version of the old one. It should feel like a **completely modern digital presence for an established industrial company**. The current site is visually dated and undersells a company doing genuinely precise technical work.

**You have real creative freedom here.** There is no Figma and no approved mockup — you design this in-code (PRD decision **D3**). This is the documented exception to the usual "match the design exactly" rule.

## 🧭 Context

**Brand constraints — the boundary on that freedom:**
- INFINI's identity is **red / black / white**. Build a sophisticated palette *around* that core: supporting neutrals, tints, shades and restrained gradients are all welcome. Do not drift so far that it stops reading as INFINI.
- **Quality benchmark: `https://mmptechnology.com/`** — this is the **global sibling brand for the same MMP technology**, not a random inspiration link. Calibrate typography, spacing, motion and content presentation against it. **Do not copy it.** The output must be distinctly INFINI.
- Target feel: **industrial credibility + modern technology + premium presentation + usability.** Explicitly *not* a generic manufacturing template, not Bootstrap-grade corporate, not the current site recoloured.

**What you're replacing.** The boilerplate shipped a dark charcoal + gold `#c9a227` + **Playfair Display** theme. That belonged to a hospitality project, not INFINI. Delete it entirely — values, font, all of it.

**What survives.** `tailwind.config.js` already maps every colour, radius and font to a CSS variable. **You are changing variables in `app/globals.css`, not the Tailwind config.** If you find yourself editing `tailwind.config.js` to add a colour, stop and reconsider.

**Brand assets.** Official INFINI assets (logo vector, guidelines, photography) are being requested from the client. **Do not wait.** Extract interim assets from the live `infini.co.in` and proceed. **Flag in the ticket thread immediately if what you find is too low-resolution to build a premium site on** — that's a client conversation we need to start in week 1, not week 5.

## 🔑 Access & prerequisites

- [ ] T1 merged.
- [ ] Branch `feature/<issue#>-design-system` off `main`.
- [ ] Interim brand assets from `https://infini.co.in` (logo, any usable photography).

## ✅ Scope / What to build

- [ ] Define the complete token set as CSS variables in `app/globals.css`:
  - Primary, supporting, background, surface and border colours
  - Full typography scale and weights
  - Spacing scale, radii, shadows
  - Interaction states (hover, focus, active, disabled)
- [ ] Choose and wire typography via **`next/font`** — self-hosted, no render-blocking external stylesheet. **Playfair Display is out.**
- [ ] Style the base components against the tokens: buttons (every variant and state), form fields, cards, section containers.
- [ ] Replace the favicon with an INFINI mark.
- [ ] Build a **`/styleguide` route** rendering every token and every component state on one page. `noindex` it, or exclude it from production builds.

## 🎯 Acceptance Criteria

- [ ] `/styleguide` renders every colour token, the full type scale, and every button/form/card state on one page.
- [ ] `grep -ri "playfair\|c9a227" --exclude-dir=node_modules --exclude-dir=.git .` returns nothing.
- [ ] **No hardcoded hex values and no arbitrary `[#...]` Tailwind values anywhere in `components/` or `app/`.** Everything resolves to a token.
- [ ] `tailwind.config.js` is unchanged apart from genuinely new token *names* — no literal colour values added.
- [ ] **Every text/background pair meets WCAG AA contrast.** Check red-on-black first; it is the most likely place this palette fails.
- [ ] Fonts load via `next/font` with no layout shift and no external stylesheet request.
- [ ] Token names are semantic (`--surface`, `--text-primary`), not literal (`--black`).
- [ ] The result reads as a credible premium industrial brand in red/black/white — a reviewer unfamiliar with the project should not mistake it for a generic template.
- [ ] Meets [`docs/UI-STANDARDS.md`](../UI-STANDARDS.md).

## 🚫 Out of scope

- Header, navigation, footer — **T3**.
- Real page layouts or content.
- Dark mode — deliberately descoped, see UI standards.

## 🔗 Dependencies

**Checkpoint:** when this merges, `/styleguide` becomes the **design-direction review** with the manager. Because there is no Figma, this is the first time anyone sees the look. **Ticket T9 (homepage) must not start before that review happens** — this gate is what stops week 4 being the client's first sighting of the design.

## 📚 References

- [`docs/UI-STANDARDS.md`](../UI-STANDARDS.md)
- [`docs/PRD.md`](../PRD.md) §5.1 design system, §10 decision **D3**.
- `https://mmptechnology.com/` — benchmark, do not copy.
- `https://infini.co.in` — current site; interim asset source.

## 🤖 Kickoff prompt

```
/start-ticket 2
```
