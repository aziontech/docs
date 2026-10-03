# Rule: styles live on the root element's class — never as JS presets or local CSS

When authoring your own components alongside @aziontech/webkit, styles go on the
**template root element's `class` attribute** — not in JavaScript variables, not in
`<style>` blocks, not in component-local CSS files. Variants are driven by `data-*`
attributes on the same root, consumed by Tailwind's `data-[attr=value]:` variants.
Hardcoded colors are blocked mechanically by the `webkit/no-hardcoded-color` ESLint rule
and the shipped stylelint config; the inline-class + `data-*` shape itself is convention,
enforced in code review.

## Do

- Put **all** utilities inline on the root's single `class` attribute.
- Mirror props as `data-*` attributes (`data-kind`, `data-size`, `data-disabled`,
  `data-state`) and let Tailwind variants do the switching:
  `data-[kind=primary]:bg-(--primary)` is one utility, not a JS branch.
- Use `v-bind="$attrs"` so a caller-passed `class` merges onto the root (Vue merges
  class strings automatically). When caller classes must **win** over internal ones, use
  `cn` from `@aziontech/webkit/utils/cn` (clsx + tailwind-merge) — the only acceptable
  class-composition helper, and even then pass it a flat literal string.
- Use design tokens for every value: `var(--primary)`, `var(--bg-surface)`,
  `var(--spacing-xs|sm|md|lg)`, `var(--shape-button)` — never raw hex or pixel guesses.
- For conditional styling, set a `data-*` attribute and style it with a variant
  (`:data-loading="loading || null"` + `data-[loading]:opacity-80`). The decision lives
  in HTML, not in JS.
- Reserve `computed` for derived state (`isAnchor`, `testId`) — never for classes.

## Do not

- No class-preset objects in the script: `const kindClasses = {...}`,
  `const sizeClasses = {...}`, `const sharedClasses = [...]`, or a
  `const rootClasses = computed(...)` that only composes classes.
- No `<style>` blocks (scoped or not), no `.css`/`.scss` files next to a component,
  no CSS-in-JS, no `styled()` helpers, no tagged css template literals.
- No `:class="loading ? 'opacity-80' : ''"` ternaries and no `:class="[a, b, c]"`
  arrays when a flat string + `data-*` variant would do.
- No backtick multiline template literals inside `:class` in the template — the Vue SFC
  parser runs before JavaScript and fails with a misleading "Element is missing end tag"
  error. Use a plain multiline `class` attribute, or a single-quoted constant in
  `<script setup>` passed to `cn`.
- No hardcoded colors (`#0a0a0a`, `bg-blue-600`) — lint blocks them; use tokens.

## Token value syntax — the canonical `prop-(--token)` form

Write a token value with Tailwind v4's **paren shorthand**, not the bracket form. This is the single canonical spelling the toolkit standardizes on — it matches what upstream v4 canonicalizes to, so your editor stops flagging every styled line.

- **Whole-value var:** `bg-(--primary)`, `text-(--text-default)`, `rounded-(--shape-card)` — **not** `bg-[var(--primary)]`. Variants compose: `data-[disabled]:bg-(--bg-disabled)`.
- **Typed value:** `text-(length:--text-body-md)`, `border-(color:--border-default)`, `font-(family-name:--font-sora)`.
- **Numeric arbitrary:** `z-1`, not `z-[1]`.

Two cases **stay in brackets** — the paren form silently emits no CSS for them:

- **Custom-property declarations:** `[--row-bg:var(--bg-surface)]` (there is no paren shorthand for declaring a property).
- **Expression values:** anything more than a lone var — `w-[calc(var(--a)*2)]`, gradients, box-shadows, or a **var with a fallback** (`bg-[var(--x,var(--y))]`). Leave these bracketed; converting them drops the style with no error.

## Correct

<!-- prettier-ignore -->
```vue
<template>
  <button
    v-bind="$attrs"
    :data-kind="kind"
    :data-size="size"
    :data-disabled="disabled || null"
    :disabled="disabled"
    class="
      inline-flex items-center justify-center rounded-(--shape-button)
      transition-colors duration-150 ease-out motion-reduce:transition-none
      data-[kind=primary]:bg-(--primary) data-[kind=primary]:text-(--primary-contrast)
      data-[kind=outlined]:border data-[kind=outlined]:border-(--border-default) data-[kind=outlined]:bg-transparent
      data-[size=small]:h-7 data-[size=small]:px-(--spacing-xs)
      data-[size=large]:h-10 data-[size=large]:px-(--spacing-md)
      data-[disabled]:cursor-not-allowed data-[disabled]:bg-(--bg-disabled)
    "
  >
    <slot />
  </button>
</template>
```

## Wrong

<!-- prettier-ignore -->
```vue
<script setup>
  const kindClasses = {
    primary: 'bg-(--primary) text-(--primary-contrast)',
    outlined: 'border border-(--border-default) bg-transparent'
  }
  const sizeClasses = { small: 'h-7 px-(--spacing-xs)', large: 'h-10 px-(--spacing-md)' }
  const rootClasses = computed(() => [kindClasses[props.kind], sizeClasses[props.size]])
</script>

<template>
  <button :class="rootClasses" />
</template>

<style scoped>
  .button--primary { /* never */ }
</style>
```
