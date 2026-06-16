# Spec: UI Styling Standard

The styling standard for the frontend. Aesthetic: **friendly / rounded** —
generous radii, soft shadows, a warm accent, comfortable whitespace.

## Approach

- **CSS Modules** (`*.module.css`) scoped per component. No CSS-in-JS, no
  utility framework — zero runtime deps.
- **Design tokens** are CSS custom properties in `src/styles/tokens.css`,
  imported once in `src/main.tsx`. Components reference tokens via `var(--…)`
  and **never hard-code** colors, spacing, radius, or font sizes.
- One small global stylesheet `src/styles/global.css` for resets + base element
  styles. Everything else is component-scoped.

## Theming (light + dark)

Tokens are defined on `:root` (light) and overridden under
`@media (prefers-color-scheme: dark)`. No JS toggle in v1 — the OS preference
drives it. A future `[data-theme]` attribute on `<html>` can add a manual
toggle without touching components (they only read `var(--…)`).

```css
:root { --color-bg: #fbf8f4; /* … light tokens … */ }
@media (prefers-color-scheme: dark) {
  :root { --color-bg: #1a1714; /* … dark overrides … */ }
}
```

## Tokens

### Color — light (`:root`)

| Token | Value | Use |
|-------|-------|-----|
| `--color-bg` | `#FBF8F4` | page background (warm off-white) |
| `--color-surface` | `#FFFFFF` | cards, inputs |
| `--color-surface-alt` | `#F3EEE8` | subtle fills, hover rows |
| `--color-border` | `#E7DFD5` | borders, dividers |
| `--color-text` | `#2A2622` | primary text |
| `--color-text-muted` | `#6B635A` | secondary text, placeholders |
| `--color-primary` | `#E07A5F` | accent (terracotta), primary actions |
| `--color-primary-hover` | `#C9654B` | primary hover/active |
| `--color-primary-contrast` | `#FFFFFF` | text/icon on primary |
| `--color-success` | `#3D9A6E` | available, success |
| `--color-danger` | `#D1495B` | errors, destructive |
| `--color-warning` | `#E0A458` | warnings |
| `--color-focus` | `#E07A5F` | focus ring |

### Color — dark (`prefers-color-scheme: dark` overrides)

| Token | Value |
|-------|-------|
| `--color-bg` | `#1A1714` |
| `--color-surface` | `#241F1B` |
| `--color-surface-alt` | `#2E2823` |
| `--color-border` | `#3A322C` |
| `--color-text` | `#F0EAE3` |
| `--color-text-muted` | `#A89E93` |
| `--color-primary` | `#F2916F` |
| `--color-primary-hover` | `#F4A484` |
| `--color-primary-contrast` | `#1A1714` |
| `--color-success` | `#5FB98C` |
| `--color-danger` | `#E36B7B` |
| `--color-warning` | `#EBB877` |

### Spacing (4px base)

`--space-1:4px` · `--space-2:8px` · `--space-3:12px` · `--space-4:16px` ·
`--space-5:24px` · `--space-6:32px` · `--space-7:48px` · `--space-8:64px`.

### Radius (friendly = larger)

`--radius-sm:8px` · `--radius-md:12px` (default) · `--radius-lg:16px` ·
`--radius-pill:999px`.

### Typography

- `--font-sans`: `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.
- Sizes: `--text-xs:.75rem` · `--text-sm:.875rem` · `--text-base:1rem` ·
  `--text-lg:1.125rem` · `--text-xl:1.5rem` · `--text-2xl:2rem`.
- Weights: `--font-normal:400` · `--font-medium:500` · `--font-bold:700`.
- Line height: `--leading:1.5` (body), `--leading-tight:1.2` (headings).

### Shadow (soft, warm, low-opacity)

- `--shadow-sm: 0 1px 2px rgba(42,38,34,.06)`
- `--shadow-md: 0 4px 12px rgba(42,38,34,.10)`
- `--shadow-lg: 0 8px 24px rgba(42,38,34,.14)`

### Motion & layout

- `--transition: 150ms ease`.
- Breakpoints (min-width): `sm 480px` · `md 768px` · `lg 1024px`.
- `--z-nav:100` · `--z-overlay:200` · `--z-toast:300`.
- Content max width: `--container: 880px`, centered with `--space-5` gutters.

## Conventions

- **No magic values.** Every color/space/radius/size is a token. PR review
  rejects raw hex or px where a token exists.
- **Class naming** inside a module: `camelCase` (e.g. `s.bookRow`), semantic not
  presentational (`s.danger` not `s.redText`).
- **States** via modifier classes or `data-*` / `:disabled` / `aria-*`, e.g.
  `button:disabled`, `[aria-invalid="true"]`.
- One component → one `*.module.css` next to it. Shared primitives live in
  `src/components/ui/` with their own modules.

## Accessibility

- Color contrast ≥ WCAG AA (4.5:1 text, 3:1 large/UI). Token pairs above meet it.
- **Visible focus** on every interactive element: `outline: 2px solid
  var(--color-focus); outline-offset: 2px`. Never remove focus without a
  replacement.
- Hit target ≥ 40×40px for buttons/controls.
- Don't encode meaning with color alone — pair with text/icon (e.g. book status
  shows the word "available", not just green).
- Respect `prefers-reduced-motion: reduce` → disable non-essential transitions.

## Responsive

- Mobile-first: base styles target small screens; enhance at `md`/`lg`.
- Layout is single-column on mobile; forms stack; lists are full-width cards.
- No fixed pixel widths on containers — use `max-width` + fluid width.
