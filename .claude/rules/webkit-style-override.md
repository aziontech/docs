# Rule: never restyle a webkit component with class/style

The design system owns each component's appearance. Putting `class`, `:class`, `style`, or
`:style` on a webkit component tag overrides its tokens, breaks light/dark theming, and
makes upgrades unpredictable. The `webkit/no-style-override` ESLint rule blocks it as an
**error** — this rule is why, and what to do instead.

## Do

- Compose your own markup **inside the component's slots** — your elements, your classes:
  the component's own surface stays untouched.
- Use a component that is **built to be personalized** (`styleSeam` in the catalog, e.g.
  `CardBox`) when a container must accept your classes.
- Change behavior/appearance through the component's **props** (`kind`, `size`, `severity`).
- If no prop or slot covers a legitimate need, request the variant in the design system —
  do not patch it locally.

## Do not

- Never `<Button class="p-8" />` or `<Button :class="cls" />` — blocked by lint.
- Never `<Dialog style="width: 800px" />` — same.
- Never wrap a webkit component in a styled element just to force different spacing/colors
  through inheritance or CSS descendant selectors targeting its internals.
- Never `!important` against a webkit class, and never target its `data-testid`/internal
  markup from your stylesheets.

## Correct

<!-- prettier-ignore -->
```html
<!-- compose in the slot: your markup, your classes -->
<Button kind="primary" @click="submit">
  <span class="inline-flex items-center gap-(--spacing-xs)">Create account</span>
</Button>

<!-- a styleSeam component accepts consumer classes by design -->
<CardBox class="bg-(--bg-canvas)">…</CardBox>
```

## Wrong

<!-- prettier-ignore -->
```html
<Button class="p-8 bg-[#0a0a0a]" @click="submit">Create account</Button>
<Dialog :style="{ width: '800px' }" />
```
