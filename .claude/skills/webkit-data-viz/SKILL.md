---
name: webkit-data-viz
description: The token adapter that maps charts onto @aziontech/theme — every series color derived from the --color-* families (never hex), computed tokens re-read on a data-theme change so a canvas re-themes (SVG re-themes for free), and the chart's loading/empty/error surface rendered with webkit components. For chart-form and palette theory, use the generic dataviz skill; this skill covers only mapping that onto theme tokens. Use when building or reviewing a chart, dashboard, or KPI tile in a webkit app.
status: active
last_updated: 2026-07-20
scope: general
enforced_by: [webkit-tokens, webkit-component-states, ui-verify]
---

# Skill: webkit-data-viz

## Purpose

A chart muddy in one theme, or spinning forever on an empty dataset, is broken the same way a
mis-tokened button is — and Azion Console is an observability product, so charts are a primary
surface, not decoration. This skill is the **token adapter**: it takes the charting decisions and
realizes them in `@aziontech/theme`. **For chart-form (which form answers which question) and palette
theory (categorical / sequential / diverging, contrast math, color-blind pairing), see the generic
`dataviz` skill; this skill covers only mapping that onto `@aziontech/theme` tokens** — deriving every
color from the `--color-*` families (never hex), re-reading computed tokens on a `data-theme` change so
a canvas re-themes (SVG re-themes for free), and rendering the chart's loading / empty / error surface
with webkit components. It does **not** pick your charting library — canvas or SVG rendering is a
consumer choice; the tokens below are not.

## How to use

- `/webkit-data-viz` — apply the token mapping to any chart, dashboard, or KPI tile you build in this
  conversation. Pick the form and the palette **kind** with the generic `dataviz` skill first, then map
  it onto tokens here.
- `/webkit-data-viz <file>` — review the file's charts and report, per gap: the quoted line, the token
  problem (off-token color, no theme re-read, missing state, non-tabular figures), and the concrete
  token-mapped fix. Form and palette-kind review belong to the generic `dataviz` skill.

## How to find the components + tokens

Never guess an import path or a hex value. Resolve both from the contract:

- **Components** (`Skeleton`, `EmptyState`, `Message`, `CardBox`, `StatusIndicator`): ask the **webkit
  MCP** — `suggest_component` in plain words ("empty state", "stat card") — or read the `imports` keys
  in **`node_modules/@aziontech/webkit/catalog.json`**. A subpath that is not a key there does not
  exist.
- **Tokens**: read the `tokens` tree in the same **`catalog.json`** (the `--color-*` families: `blue`,
  `violet`, `green`, `orange`, `yellow`, `red`, each `50`→`950`; plus `--success`, `--warning`,
  `--danger`, `--info`), or the human catalog in **`node_modules/@aziontech/webkit/docs/STYLEGUIDE.md`**.
  Derive every chart color from these — never a raw hex.

## Map the palette kind onto token families

The generic `dataviz` skill decides the palette **kind**; here is how you realize each kind in
`@aziontech/theme`:

- **Categorical** (distinct series, no order): a **mid step** (`400`/`500`) of distinct `--color-*`
  families in a fixed order, so each mark reads on both light and dark surfaces.
- **Sequential** (magnitude, e.g. a heatmap): one family's ramp, light→dark
  (`--color-blue-100` → `--color-blue-800`).
- **Diverging** (+/- around a midpoint): two families meeting at a neutral middle
  (`red` ↔ neutral ↔ `green`).
- **Semantic** (`--success` / `--warning` / `--danger`): status **only** — a failed region, a
  threshold breach. Never borrow a semantic token as a categorical accent, or a green series reads as
  "healthy" when it just means "series 3".

```ts
// Categorical palette wired from tokens — one fixed order.
// SVG marks: pass the var() string straight to fill/stroke — it re-themes for free.
const SERIES = [
  'var(--color-blue-400)',
  'var(--color-violet-400)',
  'var(--color-green-400)',
  'var(--color-orange-400)',
  'var(--color-yellow-400)',
  'var(--color-red-400)'
]

// Canvas libraries can't read CSS vars — resolve computed values, and RE-READ on data-theme
// change so the canvas repaints in the new theme (see /webkit-theming-dark-mode).
const read = (v: string) => getComputedStyle(document.documentElement).getPropertyValue(v).trim()
const seriesColors = () => SERIES.map((s) => read(s.slice(4, -1)))
```

## States — a chart is a data-backed view

A chart fetches, so it owns the full state surface, rendered **in the chart's own box** (never a
blank rectangle): **loading** → `Skeleton` sized to the chart area, reserving the layout so it doesn't
reflow; **empty** → `EmptyState` ("No requests in this window", + a range/filter action); **error** →
a `Message severity="danger"` with what failed and a retry. The trigger comes from the consuming app's
data layer; webkit ships the rendering of each state. Full matrix in `/webkit-ui-states`.

## Numbers — tabular figures, status via semantic tokens

**`tabular-nums`** on every figure that stacks in a column or updates in place, so digits don't jitter.
A delta's color encodes GOOD/BAD for the metric via a semantic token, not merely up/down — a rising
error rate is `--text-danger` even though the arrow points up.

```vue
<script setup lang="ts">
  import CardBox from '@aziontech/webkit/card-box'

  const stats = [
    { label: 'Requests', value: '3.4M', delta: '+12.4%', good: true },
    { label: 'Cache-hit rate', value: '96.2%', delta: '+0.8%', good: true },
    { label: 'Error rate', value: '0.42%', delta: '+0.30%', good: false }
  ] as const
</script>

<template>
  <div class="grid grid-cols-3 gap-(--spacing-md)">
    <CardBox
      v-for="s in stats"
      :key="s.label"
      class="flex flex-col gap-(--spacing-xs)"
    >
      <span class="text-body-sm text-(--text-muted)">{{ s.label }}</span>
      <span class="text-big-number-lg text-(--text-default) tabular-nums">{{ s.value }}</span>
      <span
        class="text-body-sm tabular-nums"
        :class="s.good ? 'text-(--text-success)' : 'text-(--text-danger)'"
        >{{ s.delta }}</span
      >
    </CardBox>
  </div>
</template>
```

## Theme

Because every color is a token, the chart works in light **and** dark with no per-theme branch. SVG
`var()` marks re-theme automatically; canvas marks only re-theme if you re-read the tokens on a
`data-theme` change (see `/webkit-theming-dark-mode`). Verify both.

## Enforcement (honest)

Only the hex ban is machine-checked: the **token lint** blocks any hex / rgb-hsl / Tailwind-palette
literal in a chart's colors, so an off-token series fails the build. The canvas theme re-read, the
state surface, and `tabular-nums` are **review**, not a hook — and form choice, palette kind, contrast,
and anatomy live in the generic `dataviz` skill and are review there. The `/webkit-ui-verify` skill
screenshots the chart in light and dark as the paired visual check; use it to confirm the theme claim
above rather than eyeballing one mode.

## Hard rules

- Every chart color is a theme token (`var(--color-*)` / semantic) — **never** a hex, rgb/hsl, or
  Tailwind-palette literal.
- SVG marks take the `var()` string directly; canvas marks resolve computed values and **re-read on a
  `data-theme` change** so the canvas repaints in the new theme.
- Semantic tokens (`--success` / `--warning` / `--danger`) mean status only — never a categorical
  accent.
- Every chart renders loading, empty, and error inside its own box (`Skeleton` / `EmptyState` /
  `Message`) — no blank async rectangle.
- `tabular-nums` on every figure that stacks in a column or updates in place.
- Pick the form and the palette kind with the generic `dataviz` skill **before** mapping onto tokens.

## Review output

For `/webkit-data-viz <file>`, list gaps grouped by chart. Each:

```
✗ TrafficChart.vue:42  stroke="#3b82f6" on the requests series
  token: hex literal — fails the token lint and won't re-theme in dark mode.
  fix: map the series to a token-derived palette (var(--color-blue-400)); resolve computed
       values for the canvas and re-read on the data-theme change.

✗ TrafficChart.vue:88  v-if="data.length" with no empty/error branch
  state: Empty + Error missing — a failed or empty range renders a blank canvas.
  fix: Skeleton sized to the chart box while loading; EmptyState + Message severity="danger" (retry).
```

End with: `charts token-mapped + complete` or `N gaps — fix before ship`.

## Definition of Done

- [ ] Every color is a theme token; the palette kind (chosen with the generic `dataviz` skill) is
      realized via the `--color-*` families; status tokens used for status only.
- [ ] SVG marks pass `var()` directly; canvas marks re-read computed tokens on a `data-theme` change.
- [ ] Loading (`Skeleton`), empty (`EmptyState`), and error (`Message`) render in the chart's box.
- [ ] `tabular-nums` on every stacked/updating figure.
- [ ] Verified in light and dark (`/webkit-ui-verify` screenshots both).
- [ ] Form and palette chosen with the generic `dataviz` skill before token mapping.
