# Rule: accessibility — role, keyboard, focus, and motion are built in, never bolted on

Webkit components are accessible by construction: drop in a `Dialog` or `Table` and its
role, keyboard model, focus management, and reduced-motion fallback come with it. Anything
you build around them — custom components, views, composed overlays — must hold the same
contract. In this project accessibility is **convention + code review**; the one part that
is mechanically enforced is color: raw colors (including focus rings) are blocked by the
stylelint config and the `webkit/no-hardcoded-color` ESLint rule.

## Do

- Use the **native element** whose semantics match before reaching for `role`
  (`<button>`, `<a href>`, `<input>`); add `role` only when no native element fits.
- Mirror ARIA state with the element's `data-*` state (`aria-expanded` with
  `data-state="open"`, `aria-disabled` with `data-disabled`, `aria-invalid` with
  `data-invalid`).
- On your own components, name the accessible-name prop **`ariaLabel`** (prefixed
  `xAriaLabel` for sub-parts) and bind it to the `aria-label` attribute internally.
- Give every interactive piece a **keyboard map** and implement exactly that
  (dialog: `Esc` closes, `Tab` is trapped; menu: arrows move, `Enter` selects,
  `Esc` closes). Anything clickable must be reachable and operable by keyboard.
- Generate ids with Vue's **`useId()`** for every `for` / `aria-labelledby` /
  `aria-describedby` association — stable across SSR.
- Style focus with a **`focus-visible`** ring using the ring token
  (`focus-visible:ring-(--ring-color)`).
- Make overlays **trap focus and restore it**: focus moves into the overlay on open,
  stays trapped while open, and returns to the trigger on close — use a focus-trap
  composable (e.g. VueUse), not a hand-written trap.
- Pair every motion-bearing class with **`motion-reduce:`**
  (`motion-reduce:transition-none` / `motion-reduce:animate-none`).

## Do not

- Never add `role`/ARIA to fake an interactive element when a native one fits.
- Never put `@click` on a non-interactive element without a matching key handler.
- Never hand-roll ids — use `useId()`.
- Never use a raw color for the focus ring — use the ring token; hardcoded colors are
  blocked by `webkit/no-hardcoded-color` and the stylelint config.
- Never open an overlay without trapping focus and restoring it to the trigger on close.
- Never ship a motion class without its `motion-reduce:` fallback.
- Never name the accessible-name prop `aria-label` — use `ariaLabel`.

## Correct

<!-- prettier-ignore -->
```vue
<script setup>
import { useId } from 'vue'
const hintId = useId() // stable id for the ARIA association
</script>

<template>
  <!-- native semantics, tokenized focus ring, reduced-motion fallback -->
  <button
    class="inline-flex items-center gap-(--spacing-xs)
           transition-colors duration-150 motion-reduce:transition-none
           focus-visible:ring-2 focus-visible:ring-(--ring-color)"
    :aria-expanded="open"
    :data-state="open ? 'open' : 'closed'"
    @click="toggle"
  >
    Save changes
  </button>

  <input type="email" :aria-describedby="hintId" />
  <p :id="hintId">We never share your email.</p>
</template>
```

## Wrong

<!-- prettier-ignore -->
```html
<!-- clickable div: fake semantics, unreachable by keyboard -->
<div role="button" @click="open">Open settings</div>

<!-- hand-rolled id, raw-color focus ring, motion without a reduced-motion fallback -->
<label for="email-1">Email</label>
<input id="email-1" class="transition-all focus-visible:ring-[#f3652b]" />

<!-- overlay that neither traps focus nor restores it to the trigger on close -->
<div v-if="open" role="dialog">…</div>
```
