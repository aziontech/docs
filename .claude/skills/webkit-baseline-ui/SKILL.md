---
name: webkit-baseline-ui
description: Fast deslop pass for UI built on @aziontech/webkit — enforce components-only, tokens-only (typography/color/shape/spacing/shadow), correct typography hierarchy, and consistent spacing rhythm. Use for a quick cleanup or polish review.
status: active
last_updated: 2026-07-21
scope: general
enforced_by: [webkit-tokens, webkit-prefer-over-custom, webkit-styling]
---

# Skill: webkit-baseline-ui

## Purpose

Remove AI-generated UI slop from product code built on `@aziontech/webkit`. This is the opinionated
baseline: real components, real tokens, real typography hierarchy, real spacing rhythm — nothing
hand-rolled, nothing hardcoded.

## How to use

- `/webkit-baseline-ui`
  Apply the constraints below to any UI work in this conversation.
- `/webkit-baseline-ui <file>`
  Review the file against every constraint and output, per violation:
  - the exact line / snippet (quoted),
  - why it matters (1 short sentence),
  - a concrete code-level fix.

## When to invoke

- The user asks to "clean up", "deslop", "polish", or "review" a screen / prototype.
- Before shipping any UI composed on top of webkit.
- After scaffolding a screen quickly and wanting a correctness sweep.

## Constraints

### Components

- **MUST** compose from `@aziontech/webkit` whenever a primitive exists. To find a component and its
  flat import path, ask the webkit MCP `suggest_component`, or read
  `node_modules/@aziontech/webkit/catalog.json` (`imports`) — every key is a real subpath (e.g.
  `@aziontech/webkit/button`, `@aziontech/webkit/input-text`, `@aziontech/webkit/dialog`,
  `@aziontech/webkit/dropdown-menu`).
- **NEVER** hand-roll a `<button>`, input, modal, tooltip, dropdown, tabs, **or divider** that webkit
  ships — this includes a separator. A horizontal/vertical rule is **`@aziontech/webkit/divider`**
  (`<Divider />` / `<Divider orientation="vertical" />`), **never** a hand-rolled `<hr>` or a
  `<div class="border-t …">` / `<div class="h-px bg-…">`. If you're reaching for a border utility to draw
  a line between sections, that's the Divider component. (A real, observed failure: a `<div>` with border
  classes standing in for the Divider — do not.)
- **NEVER** mix another component library's primitives onto the same surface.
- **MUST** use `@aziontech/webkit/icon-button` with an `aria-label` for icon-only actions.
- **MUST** use `@aziontech/webkit/utils/cn` (clsx + tailwind-merge) for any class composition.

### Color — tokens only

- **MUST** use `@aziontech/theme` semantic vars: `bg-(--bg-surface)`, `text-(--text-default)`,
  `text-(--text-muted)`, `bg-(--primary)`, `text-(--primary-contrast)`,
  `border-(--border-default)`, `ring-(--ring-color)`, feedback `var(--success|--warning|--danger|--info)`.
- **NEVER** HEX (`#0af`), `rgb()/rgba()/hsl()`, or Tailwind palette names (`bg-blue-500`, `text-gray-700`).
- **SHOULD** limit accent color to one per view; the rest carries on surface + text + border tokens.

### Typography — tokens + hierarchy (non-negotiable)

- **MUST** use only the `text-*` typography tokens (the webkit MCP lists them; they ship in
  `@aziontech/theme`): `text-heading-2xl … text-heading-sm`, `text-body-lg … text-body-xxs`,
  `text-label-sm/md/lg`, `text-overline-xs/sm/md`, `text-button-md/lg`, `text-link`,
  `text-big-number-*`.
- **NEVER** raw `text-xs/sm/base/lg`, `leading-*` (except `leading-none` on an icon set to
  `text-[length:inherit]`), or `tracking-*` overrides — line-height and tracking are baked into the token.
- **NEVER** make a heading visually smaller than a label. Respect the order
  `text-heading-* > text-body-* > text-label-* > text-overline-*`, and don't skip levels arbitrarily.
- **MUST** use `text-balance` on headings and `text-pretty` on body/paragraph copy.
- **MUST** use `tabular-nums` for numeric / data columns.

### Section titles — a small heading, optically inset

A **content section** (a titled block sitting above a `CardBox`, an `Item.List`, or a table) is
labelled with a **small heading**, not an overline:

- **MUST** title the section with `text-heading-xxs text-(--text-default)` — the smallest heading
  token. `text-overline-*` is **reserved for compact menu / popover group labels** (e.g.
  `Dropdown.Group`, a Popover section), **not** page section titles.
- **MUST** give the title an optical inset of `px-(--spacing-xs)` so it lines up with the card's
  inner content directly below it (the card body pads at `--spacing-md`; the smaller `--spacing-xs`
  title inset reads as aligned, not indented).
- **MUST** separate the title from the card it labels by `--spacing-sm` — the section wrapper is
  `flex flex-col gap-(--spacing-sm)`.
- **SHOULD**, when the title row also carries a control (a filter dropdown, an action button), wrap it in
  a `flex min-h-(--size-8) items-center` row so the title baseline matches sibling section titles in
  other columns (e.g. a two-column page where one title stands alone and the other sits beside a control).

This is the canonical section-title treatment. A section title written as
`text-overline-sm text-(--text-muted)` is **legacy** — bring it to this pattern when you touch it.

### Shape & elevation — tokens only

- **MUST** use `rounded-(--shape-button)` (buttons), `rounded-(--shape-elements)` (inputs,
  chips), `rounded-(--shape-card)` (cards), `rounded-(--shape-flat)` (none).
- **NEVER** `rounded-md/lg` or a numeric radius.
- **MUST** use `shadow-(--shadow-*)` for elevation (`--shadow-sm` cards, `--shadow-md` overlays);
  never a bare Tailwind `shadow-md` or a hardcoded `box-shadow`.

### Spacing rhythm — one scale

- **MUST** use only `--spacing-xxs … --spacing-xxl` for padding, gap, and margin:
  `p-(--spacing-md)`, `gap-(--spacing-sm)`, `mt-(--spacing-xs)`.
- **NEVER** arbitrary values (`p-[13px]`, `gap-[7px]`), Tailwind's default scale (`p-4`, `gap-3`), or
  the primitive `--spacing-1 … --spacing-96`.
- **SHOULD** keep one consistent step between sibling elements; don't alternate `--spacing-xs` and
  `--spacing-md` between rows of the same list.

### Layout

- **NEVER** `h-screen` — use `h-dvh`.
- **MUST** respect `safe-area-inset` (`env(safe-area-inset-*)`) for fixed / sticky elements.
- **SHOULD** use `size-*` for square elements instead of `w-* + h-*`.
- **SHOULD** drive variant styling from `data-*` attributes (a `data-[state=...]:` Tailwind variant),
  not from JS class-preset objects — so the switch reads in one place in the markup.

### Width & containers — fluid-first shell, cap only reading width

This section is the **canonical container / max-width doctrine** for webkit apps — the umbrella
`/webkit-ui-craft` skill defers here, so treat this as the authoritative and complete source.

The default is **fluid**: content fills the space the shell gives it. A container
(`max-w-(--container-*)`) is the exception, applied only where unbounded width hurts legibility or
balance. Reach for it in this order.

- **MUST** keep the **app shell fluid-first** — never cap it with a container. The **sidebar**, the
  **global header**, the **page heading**, and the **main content spacing** (the content zone's
  `p-(--spacing-*)` inset) all stay full-width and stretch with the viewport. These are chrome; a
  max-width on them only creates dead gutters.
- **MUST** cap **reading / input width** with `max-w-(--container-2xs … xl)`: form fields, text
  columns, focused auth/save cards, fixed side rails. Pick the tight end (`2xs … sm`) for compact
  settings rows and the loose end (up to `xl`, 576px) for a control column that must fit a longer value.
  A form input that spans a 2560px screen is a legibility bug, not a feature.
- **MUST** give **focused create/edit flows** a centered page container — `mx-auto
max-w-(--container-7xl)` on the flow's content wrapper — so the column sits centered instead of
  drifting to the left edge on wide screens. This is the one place the _page section_ (not just a field)
  is capped.
- **SHOULD** center a **landing / browse / catalog page** — a page of stacked sections, card grids, and
  tabs (e.g. a Home or Marketplace page) — in a `mx-auto w-full max-w-(--container-7xl)` container on
  its root `main`, so the content sits centered instead of drifting to the left edge on wide screens; add
  the page's top breathing room with `pt-(--spacing-*)`. Keep the width **identical across sibling
  pages of the same kind** so moving between them never reflows the column. The shell around it (sidebar,
  header, content-zone inset) stays fluid per the first bullet — the cap lives on the page's own `main`,
  not the app layout content zone.
- **MUST** cap a **wizard / multi-step deployment flow** tighter than a general create/edit page —
  `mx-auto max-w-(--container-2xl)` (672px) on the flow's content wrapper. A wizard is a single
  guided task with one thing to look at per step, so the step column stays narrow and centered; the `7xl`
  cap above is for broader create/edit pages, not step-by-step wizards.
- **SHOULD** keep **data-dense surfaces fluid** — tables, dashboards, log/grid views breathe to the full
  content width; don't box them into a narrow container.
- **MUST** express every cap as `max-w-(--container-<size>)` — the `@aziontech/theme` container
  tokens, `--container-3xs … --container-7xl`. **NEVER** a raw `max-w-5xl` / `max-w-[768px]`, and never a
  legacy helper (`.max-container-width`, `--container-max-width`).

### Control size rhythm — same size on a horizontal line

- **MUST** give buttons and fields sitting on the **same horizontal line** the **same `size`**. When a
  `@aziontech/webkit/button` sits beside an `@aziontech/webkit/input-text` (search bar + submit, filter
  row, toolbar, inline form), both take the same size token so their heights match and the row shares one
  baseline. A `medium` input next to a `large` button breaks the rhythm.
- **MUST** keep that one size consistent across every control in the group — inputs, selects, buttons,
  icon-buttons in the same toolbar all share it. Don't mix a `small` icon-button into a row of `medium`
  controls.
- **SHOULD** align them on a shared baseline (`items-center` / `items-end`) so equal heights actually
  read as one line, not stacked boxes.
- Vertical stacks are exempt — this is about controls that sit **side by side**.

### Design restraint

- **NEVER** gradients, glow effects, or multicolor fills unless explicitly requested.
- **MUST** give every empty state one clear next action.
- **NEVER** block paste in `input` / `textarea`.

## Review output

For `/webkit-baseline-ui <file>`, group findings by constraint section. Each finding:

```
✗ <file>:<line>  `bg-[#0a0a0a] text-blue-500`
  why: hardcoded HEX + palette color bypass the theme; break dark mode and brand.
  fix: bg-(--bg-surface) text-(--primary)
```

End with a one-line verdict: `clean` or `N violations across <sections>`.

## References

- Token catalog: the `@aziontech/theme` tokens (typography, spacing, color, shape, shadow); the webkit
  MCP lists the `text-*` typography tokens.
- Component discovery: ask the webkit MCP `suggest_component`, or read
  `node_modules/@aziontech/webkit/catalog.json` (`imports`) — every key is a real subpath.
- Variant / styling discipline: drive variants from `data-*` attributes, and compose classes with
  `@aziontech/webkit/utils/cn` — never a JS class-preset object.
- For deeper UX (states, heuristics) → `/webkit-ux-heuristics`; for motion → `/webkit-motion-polish`;
  for final sign-off → `/webkit-impeccable-polish`.

## Definition of Done

- [ ] Every interactive primitive is a `@aziontech/webkit` component.
- [ ] No HEX / rgb / Tailwind palette / arbitrary spacing / `rounded-md|lg` / raw `text-*` size remains.
- [ ] Typography uses `text-*` tokens with correct hierarchy; spacing uses only `--spacing-*`.
- [ ] Section titles use `text-heading-xxs text-(--text-default)` with a `px-(--spacing-xs)` optical inset (and `--spacing-sm` above the card) — not `text-overline-*`, which is reserved for menu/popover group labels.
- [ ] `h-dvh` not `h-screen`; one accent per view; empty states have an action.
- [ ] Shell (sidebar, global header, page heading, content-zone spacing) is fluid; only reading width, focused flows, and landing/browse pages are capped, always via `max-w-(--container-*)` — wizards/deployment flows at `max-w-(--container-2xl)`, broader create/edit and landing/browse pages centered at `7xl`.
- [ ] Buttons and fields on the same horizontal line share one `size` token and a common baseline.
- [ ] (File mode) Every violation has a quoted line, a why, and a concrete fix.
