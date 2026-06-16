# Spec: UI Components

Core components for the library UI. All values reference tokens from
[`ui-style.md`](./ui-style.md) — no hard-coded styling. Friendly/rounded:
default radius `--radius-md`, soft shadows, warm accent.

These map to a small primitives set under `src/components/ui/` plus the existing
pages. Each component lists structure, visual rules, states, and a11y.

---

## Layout / AppShell

- Centered column, `max-width: var(--container)`, gutters `--space-5`.
- `--color-bg` page, content on `--color-surface` cards.
- Header: app title (`--text-xl`, `--font-bold`) + nav, separated from content
  by `--space-6`.

## Nav

- Horizontal links; active link uses `--color-primary` text + `--font-medium`;
  inactive uses `--color-text-muted`.
- Active state driven by `NavLink` `aria-current="page"` (not color alone).
- Hover: `--color-text`. Focus: standard focus ring.
- On mobile (`< md`): wraps; links get `--space-3` hit padding.

## Button

Variants: `primary` (default), `secondary`, `ghost`, `danger`.

| Aspect | Rule |
|--------|------|
| Padding | `--space-2` `--space-4` |
| Radius | `--radius-md` |
| Font | `--text-sm`, `--font-medium` |
| Min height | 40px (hit target) |
| Transition | `background --transition`, `transform --transition` |

- **primary**: `--color-primary` bg, `--color-primary-contrast` text; hover
  `--color-primary-hover`; subtle press `transform: translateY(1px)`.
- **secondary**: `--color-surface` bg, `--color-border` border, `--color-text`.
- **ghost**: transparent bg, no border, `--color-primary` text.
- **danger**: `--color-danger` bg, white text.
- **disabled**: `opacity:.5`, `cursor:not-allowed`, no hover. Must use the
  native `disabled` attribute (e.g. Rent button when unavailable/no user).
- Focus ring per a11y rules.

## Input (text)

- Full width within its field; `--color-surface` bg, `1px solid
  --color-border`, `--radius-md`, padding `--space-2` `--space-3`.
- Placeholder `--color-text-muted`.
- Focus: border `--color-primary` + focus ring.
- Invalid (`aria-invalid="true"`): border `--color-danger`; helper text below in
  `--color-danger`, `--text-xs`.
- Disabled: `--color-surface-alt` bg, muted text.

## Select

- Same box styling as Input. Custom chevron via background SVG, `--space-5`
  right padding. Placeholder option ("Select user…") rendered `--color-text-muted`.

## Form / Field

- Vertical stack, `--space-3` between fields. Field = `<label>` (`--text-sm`,
  `--font-medium`, `--space-1` below) + control + optional helper/error.
- Inline forms (create user/book) may lay out horizontally at `md+` using flex
  with `--space-2` gaps; stack on mobile.
- Submit button right-aligned (or full-width on mobile).

## List / Card

- Lists render as stacked **cards**: `--color-surface`, `--radius-lg`,
  `--shadow-sm`, padding `--space-4`, gap `--space-3`.
- Hover (interactive rows): `--shadow-md` + `--color-surface-alt`.
- Row content: primary text `--color-text`; meta `--color-text-muted`
  `--text-sm`.
- Empty list shows a friendly empty state (muted text, `--space-6` padding),
  not a blank area.

## Status pill (book availability / rental state)

- Pill: `--radius-pill`, padding `--space-1` `--space-3`, `--text-xs`,
  `--font-medium`.
- **available / returned**: `--color-success` text on a tint of it.
- **rented / active**: `--color-warning` text on its tint.
- Always includes the text label (not color-only).

## Loading & Error states (AsyncBoundary)

- **Loading**: centered, `role="status"`, muted text or a simple spinner that
  respects `prefers-reduced-motion`.
- **Error**: `role="alert"`, `--color-danger` text/icon, the API error message,
  and a **Retry** ghost button calling the page's `reload`.
- Both occupy the content area without layout shift.

---

## Acceptance

- No component contains a raw color/hex/px where a token exists.
- Every interactive element has a visible focus state and ≥40px hit target.
- Light and dark both legible (AA contrast) with no per-component overrides.
- States (disabled, invalid, loading, error, empty) are all visually defined,
  not just the happy path.
