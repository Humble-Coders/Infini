**Ticket:** #2 — Build the INFINI design system (red/black/white) + `/styleguide` route

## Summary

Replaces the boilerplate's dark charcoal + gold (`#c9a227`) + Playfair Display hospitality theme with a considered red/black/white system built around INFINI's brand identity — designed in-code against no Figma, per the ticket's documented exception. Every color, spacing, radius, and interaction-state value lives as a semantically-named CSS variable in `app/globals.css` (`--color-primary`, `--color-accent`, `--surface`-style tokens, not literal names), consumed through `tailwind.config.js`'s existing variable mapping rather than any new hardcoded values. Typography loads via `next/font` (Manrope, self-hosted, no external stylesheet, no render-blocking request). A `/styleguide` route renders every token and component state on one page for design-direction review.

Red-on-black contrast was the specific risk flagged in the ticket — `--color-primary` (buttons/fills) and `--color-accent` (text/links on dark backgrounds) are deliberately two different reds, not one value doing both jobs, because a single red can't clear WCAG AA in both a filled-button context and a text-on-black context simultaneously.

## Files changed

- `app/globals.css` — full token set: background/surface/foreground layers, primary/secondary/accent/destructive colors with explicit WCAG-AA-clearing values (commented inline explaining the primary/accent split), border/input tokens, spacing and radius scale.
- `app/layout.tsx` — Manrope via `next/font/google`, wired as the `--font-sans-loaded` variable `--font-sans` resolves to.
- `app/styleguide/page.tsx` — renders every color token, the type scale, and every button/form/card state.
- `components/ui/*.tsx` — button variants (`default`, `inverse`, `destructive`, `outline`, `secondary`, `ghost`, `link`) and form/card primitives styled against the new tokens.
- `app/icon.svg` — INFINI mark replacing the unrelated placeholder favicon.

## How to test

```bash
npm run dev
```

Visit `/styleguide` and confirm every token, button variant, and form/card state renders. Then:

```bash
grep -ri "playfair\|c9a227" --exclude-dir=node_modules --exclude-dir=.git .   # empty
grep -rn "#[0-9a-fA-F]\{3,8\}" components/ app/ --include=*.tsx   # no arbitrary hex outside globals.css
```

Check contrast on red-on-black text/link combinations specifically (`--color-accent` on `--color-background`) with a contrast checker.

## Acceptance criteria

- [x] `/styleguide` renders every color token, the full type scale, and every button/form/card state on one page.
- [x] `grep -ri "playfair\|c9a227"` returns nothing.
- [x] No hardcoded hex or arbitrary `[#...]` Tailwind values in `components/`/`app/` — everything resolves to a token (confirmed via grep across the codebase this and every subsequent ticket).
- [x] `tailwind.config.js` unchanged apart from token names, no literal color values added.
- [x] Every text/background pair meets WCAG AA — `--color-primary`/`--color-accent` split specifically addresses red-on-black.
- [x] Fonts load via `next/font` with no external stylesheet request.
- [x] Token names are semantic (`--color-primary`, `--color-accent`), not literal.
- [x] Reads as a credible premium industrial brand in red/black/white, distinct from the MMP Technology benchmark site.
- [x] Meets `docs/UI-STANDARDS.md`.

## Deviations / decisions

- Interim brand assets (icon/favicon) drawn from what's available rather than official client-supplied assets, per the ticket's "don't wait" instruction — flagged as a placeholder pending real brand assets from the client.
- Dark mode explicitly out of scope per the ticket and `docs/UI-STANDARDS.md` — single brand theme only.

## Open questions / follow-ups

- Official INFINI brand assets (logo vector, guidelines, photography) are still pending from the client — current assets are interim, extracted/approximated from the live site per the ticket's explicit instruction not to block on this.
- `/styleguide` is the design-direction review checkpoint — T9 (homepage) should not start before that review happens, per this ticket's dependency note.
