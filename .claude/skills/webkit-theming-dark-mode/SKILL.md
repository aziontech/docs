---
name: webkit-theming-dark-mode
description: Every screen in a @aziontech/webkit app works in BOTH light and dark with zero per-theme edits, because it is styled only through semantic tokens (var(--bg-surface), var(--text-default), var(--primary)…) that carry a role and swap value per theme — never a hex, rgb/hsl, Tailwind palette color, or a value that reads in one theme only. Use when building or reviewing any screen, and before calling one done. Covers the data-theme mechanism, elevation-in-dark, and the two-theme check.
status: active
last_updated: 2026-07-20
scope: general
enforced_by: [webkit-tokens, ui-verify]
---

# Skill: webkit-theming-dark-mode

## Purpose

A screen that "looks right" is only half-verified — it looks right in the theme you happened to open.
The `@aziontech/theme` tokens make both themes free **if** you style through them: a token names a
**role** (`--bg-surface`, `--text-default`, `--border-default`), and its value flips per theme
automatically. The moment a hex, an `rgb()`, or a Tailwind palette color (`bg-zinc-900`,
`text-white`) lands on an element, you have hard-coded one theme and broken the other. This skill
fixes the discipline that keeps every screen theme-correct with no per-theme branches.

## How to use

- `/webkit-theming-dark-mode` — apply the token discipline to any screen you build in this
  conversation, and switch to the dark check before declaring it done.
- `/webkit-theming-dark-mode <file>` — review the file and report, per gap: the quoted line, the
  hard-coded color, and the semantic token that replaces it.

## How to find the tokens and components

Never guess a token or an import path. Resolve both from the contract, not from memory:

- Token names: read **`node_modules/@aziontech/theme`** (the semantic color set) — a name that is not
  defined there does not exist. Roles you will reach for most: `--bg-canvas`, `--bg-surface`,
  `--bg-surface-raised`, `--bg-surface-overlay`, `--text-default`, `--text-secondary`,
  `--border-default`, `--primary`, `--primary-contrast`.
- Components: ask the **webkit MCP** (`suggest_component`) or read
  **`node_modules/@aziontech/webkit/catalog.json`** — every key under `imports` is a real subpath.

## How theming works — light is default, dark is opt-in

The tokens default to **light**: the light values live in `:root` (and `[data-theme=light]`). **Dark
is opt-in** — set `data-theme="dark"` on the `<html>` element (the tokens also respond to a `.dark`
class on any ancestor). Nothing else changes; the same `var(--bg-surface)` now resolves to its dark
value.

```html
<!-- dark from the first paint -->
<html data-theme="dark"></html>
```

A runtime toggle is just a write to that attribute — the whole tree re-themes with no re-render:

```ts
function toggleTheme() {
  const el = document.documentElement
  el.dataset.theme = el.dataset.theme === 'dark' ? 'light' : 'dark'
}
```

## The core rule — style through the role, never the value

A token carries the role; its value is the theme's job. Reference the role and both themes are handled
at once. Bind a raw color and you have pinned one theme.

```vue
<!-- ✅ role-based: correct in both themes, no branches -->
<div class="bg-(--bg-surface) text-(--text-default) border border-(--border-default)">
  <span class="text-(--primary)">Active</span>
</div>

<!-- ❌ value-based: legible in one theme, broken in the other -->
<div class="bg-white text-[#1a1a1a] border border-zinc-200">
  <span class="text-blue-600">Active</span>
</div>
```

This is the same token catalog the design-system components render with, so a screen built on tokens
sits seamlessly next to `<Button>`, `<Card>`, and the rest in either theme.

## Elevation in dark = a lighter surface, not a heavier shadow

Shadows barely read on a dark ground — stacking depth comes from **surface lightness**, not from a
bigger `box-shadow`. That is exactly what the surface tokens encode: `--bg-surface-raised` and
`--bg-surface-overlay` are _lighter_ than `--bg-surface` in dark, and correctly _shadowed/tinted_ in
light. Use the role for the layer and both themes get the right depth cue. Discover the exact surface
names from the theme package; never invent a `surface-3`.

```vue
<!-- page → card → menu: each layer is a role, depth reads in both themes -->
<div class="bg-(--bg-canvas)">
  <div class="bg-(--bg-surface)">...</div>
  <div class="bg-(--bg-surface-raised)">popover / menu</div>
</div>
```

## Loading placeholders use a translucent role, not a surface

A surface token is opaque and tuned for one background, so a skeleton built from one is only legible on
the surface it was picked against — and it inverts badly across themes. `--bg-placeholder` (the fill)
and `--bg-placeholder-highlight` (the sweep) are **translucent**: they composite over whatever layer
they sit on, so the same token holds its contrast on canvas, surface, raised and overlay alike, in both
themes. Keep the fill as `background-color` and put the sweep in a gradient whose other stops are
`transparent`, so the animated and static states share one base tone.

```vue
<!-- ❌ opaque surface as a placeholder: near-invisible on a card in light -->
<div class="bg-(--bg-surface-overlay)" />
<!-- ✅ translucent placeholder role, correct on any layer in both themes -->
<div class="bg-(--bg-placeholder)" />
```

Prefer the design system's `Skeleton` component over hand-rolling this — it already pairs the tokens
with the shimmer animation and its reduced-motion fallback.

## Don't fight the tokens with `dark:` overrides

If a role has a token, the token already handles both themes — adding `dark:bg-…` on top is redundant
at best and drifts the two themes apart at worst. Reach for Tailwind's `dark:` variant **only** for
the rare property no token expresses (and even then, prefer proposing the missing token). A screen
full of `dark:` overrides is a screen that stopped trusting the tokens.

```vue
<!-- ❌ re-implements what --bg-surface already does per theme -->
<div class="bg-white dark:bg-zinc-900 text-black dark:text-white">
<!-- ✅ one role, no per-theme branch -->
<div class="bg-(--bg-surface) text-(--text-default)">
```

## A card that needs zero changes across themes

Every color here is a role. Toggle `data-theme` and it re-themes with no edit — surface, text, border,
and accent all move together.

```vue
<script setup lang="ts">
  function toggleTheme() {
    const el = document.documentElement
    el.dataset.theme = el.dataset.theme === 'dark' ? 'light' : 'dark'
  }
</script>

<template>
  <article
    class="rounded-(--shape-card) p-(--spacing-md)
           bg-(--bg-surface) text-(--text-default)
           border border-(--border-default)"
  >
    <h3 class="text-(--text-default)">Workload health</h3>
    <p class="text-(--text-secondary)">Requests are within normal range.</p>
    <span class="text-(--primary)">View details</span>
    <button
      class="mt-(--spacing-sm) text-(--primary)"
      @click="toggleTheme"
    >
      Toggle theme
    </button>
  </article>
</template>
```

## Accents that appear on both grounds

A brand accent tuned for a white page can vibrate or wash out on a dark one. Use the theme's own
accent tokens (`--primary` and friends), which are already balanced per theme; if you must introduce a
new accent, verify its **contrast against both** `--bg-canvas` values and desaturate it until it reads
on both — do not ship a single saturated hex for both grounds.

## Validate BOTH themes before "done"

A screen tested in one theme is **not done**. The `webkit-ui-verify` runtime check screenshots the
view in light **and** dark — run it, look at both, and confirm text contrast, surface separation, and
accents all hold. A regression that only shows in dark is invisible until someone opens dark mode in
production; the two-theme screenshot is what catches it first.

## Hard rules

- Style through **semantic tokens** only — no hex, `rgb()`/`hsl()`, or Tailwind palette color
  (`bg-white`, `text-zinc-900`, `border-slate-200`) anywhere on the screen.
- Dark is `data-theme="dark"` on `<html>` (or a `.dark` ancestor); light is the default `:root`. Don't
  ship a second stylesheet or a JS color map for dark.
- Depth in dark comes from **lighter surface tokens** (`--bg-surface-raised` / `--bg-surface-overlay`),
  not a heavier shadow.
- No `dark:` override for a role a token already covers; reserve `dark:` for the property no token
  expresses, and prefer proposing the token.
- Every new accent is contrast-checked and desaturated for **both** grounds.
- A screen is done only after it is verified in **both** themes (`webkit-ui-verify` two-theme
  screenshots).

## Review output

For `/webkit-theming-dark-mode <file>`, list gaps grouped by element. Each:

```
✗ WorkloadCard.vue:14  class="bg-white text-zinc-900 border-slate-200"
  theme: hard-coded light values — dark renders white-on-dark, unreadable.
  fix: bg-(--bg-surface) text-(--text-default) border-(--border-default)
```

End with: `theme-safe (both themes)` or `N gaps — fix before verifying`.

## Definition of Done

- [ ] Every color on the screen is a semantic token — zero hex / rgb / palette / one-theme values.
- [ ] Dark is driven by `data-theme` / `.dark`, not a duplicate stylesheet or JS color branch.
- [ ] Stacked layers use surface-role tokens; depth reads correctly in dark without heavier shadows.
- [ ] No `dark:` override stands in for a role a token already carries.
- [ ] The screen was screenshotted and checked in **both** light and dark before being called done.
