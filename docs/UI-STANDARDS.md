# UI standards — the visual & interaction Definition of Done

Every UI-facing ticket on this project must satisfy these. Tickets link here rather than pasting the list, and fold the load-bearing items into their own Acceptance Criteria. Web-adapted from the team standard.

## Design fidelity
- [ ] **If a design is attached to the ticket, it is the source of truth** — reproduce spacing, sizing, colour, type, hierarchy and every state faithfully. Do not approximate or silently "improve" it.
- [ ] Designs are usually provided by the PM and are **not** attached to the issue. At `/start-ticket`, **ask for the design assets before building.**
- [ ] **Exception:** where a ticket explicitly says *no design — build it yourself*, design against the brand rules and the design system. On this project, ticket T2 establishes that system; everything after inherits it.
- [ ] All colour, spacing and radius values come from **design tokens**. No hardcoded hex, no arbitrary `[#ff0000]` Tailwind values in components.
- [ ] Reuse and extend `components/ui/*`. Never hand-roll a second button.

## Theming
- [ ] **Single brand theme — no dark mode on this project.** Deliberately descoped: the client never requested it and it roughly doubles design QA across ~20 page types.
- [ ] Still name tokens **semantically** (`--surface`, `--text-primary`) rather than literally (`--black`), so a future theme is a variable swap and not a rewrite.

## Components
- [ ] Prefer existing Radix primitives and semantic HTML over hand-rolled widgets. Real `<button>`, `<nav>`, `<header>`, `<main>`, `<footer>`.
- [ ] Where a design idea can't be built accessibly with a native/Radix component, say so in the ticket thread with the trade-off, then proceed with the closest accessible approach. Don't silently diverge.

## Layout & responsiveness
- [ ] Responsive from **320px to 1920px+**. Fluid layouts, not fixed pixel positions. Cap content width and centre on large screens.
- [ ] Full-bleed sections respect **iOS safe-area insets** so hero content isn't lost under a notch in mobile Safari.
- [ ] Overflowing text **ellipsizes cleanly** on the intended number of lines — never clips, overlaps, or pushes the layout.
- [ ] Mobile is designed, not squeezed. A shrunken desktop layout is a failed ticket.

## Input & keyboard
- [ ] Correct input types and `inputmode` per field (`email`, `tel`, numeric), sensible `autocomplete` hints, appropriate `enterkeyhint`.
- [ ] The focused field stays visible when the mobile keyboard opens.
- [ ] Phone numbers are **tap-to-call** (`tel:` links) on mobile.

## States & feedback
- [ ] Define **loading, empty, error and disabled** states for anything that fetches or submits. Disable controls during async work. No silent failures, no raw error dumps.
- [ ] Consistent hover/focus/active feedback from the design system. Motion is purposeful and **respects `prefers-reduced-motion`**.
- [ ] Don't lose form input or scroll position on resize or re-render.

## Accessibility & content
- [ ] Semantic HTML, logical focus order, visible focus indicators, fully keyboard navigable.
- [ ] Layouts survive browser font-size increases — use `rem` for type, not fixed `px`.
- [ ] Touch targets ≥ **44px**. Colour contrast meets **WCAG AA** — check red-on-black early, it is the most likely place this palette fails.
- [ ] Every image has meaningful `alt`. Use **`next/image`** everywhere; no raw `<img>`.
- [ ] No hardcoded user-facing strings scattered through components — centralise shell/chrome copy. *(English-only for v1; a full i18n layer is out of scope, but don't make one impossible.)*
- [ ] Content that is admin-editable comes from Firestore, never hardcoded. See `CLAUDE.md`.

## Verification
- [ ] Verify at **375px, 768px, 1280px, 1920px**, at increased browser font size, and in **Chrome + Safari** before marking the ticket done.
- [ ] Verify every state the ticket specifies — not just the happy path.
