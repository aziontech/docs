# Rule: type props with a named `interface Props`, `withDefaults`, and JSDoc

Props are the **data + scalar configuration** surface of a component — anatomy (where
things go) is slots and sub-components, never props. Declare props with a named
`interface Props` consumed by `defineProps<Props>()`, wrapped in `withDefaults`, with a
one-line JSDoc on every public prop and named, exported variant unions. The
`webkit/authoring-standards` ESLint rule blocks the runtime object form
(`defineProps({ ... })`) as an **error**; prop naming and defaults are convention,
checked in review.

## Do

- Declare a **named `interface Props`** and consume it with `defineProps<Props>()`.
- Put every default in **`withDefaults`** — one place, not scattered `??` fallbacks in
  the template.
- Give every public prop a **one-line JSDoc** (`/** ... */`) — it feeds the editor hover
  and generated prop tables. Keep it a plain sentence with **no angle brackets** in
  script comments (they break downstream SFC parsing).
- **Export every variant union** as a named type (`ButtonKind`, `ButtonSize`) so a
  consumer can type a variable that holds it.
- Default optional **text props to `''`** (never `undefined`) so the template never
  renders the string "undefined".
- Default **booleans to `false`** with positive polarity and no `is`/`has` prefix
  (`disabled`, `loading`, `open`).
- Model a two-way value with **`defineModel`**, not a plain prop plus a manual
  `update:*` event.

## Do not

- Never use the runtime object form `defineProps({ kind: { type: String } })` — blocked
  by `webkit/authoring-standards`. Same for runtime `defineEmits([...])`.
- Never use `any` or `@ts-ignore` in a prop type — use precise unions or generics.
- Never declare `class` or `style` in `defineProps` — consumer classes flow through
  attribute fallthrough (`useAttrs()`), not a prop.
- Never inline an unnamed variant union — name it and export it.
- Never repeat the literal set of a union in JSDoc and in the type — derive it from one
  place.
- Never turn a slot-shaped concern into a prop (config arrays of UI). Props are data and
  scalar config; UI structure is composed in slots.

## Correct

<!-- prettier-ignore -->
```vue
<script setup lang="ts">
  /** Visual variant. */
  export type ButtonKind = 'primary' | 'secondary' | 'outlined' | 'text'
  /** Size token. */
  export type ButtonSize = 'small' | 'medium' | 'large'

  interface Props {
    /** Visual variant. */
    kind?: ButtonKind
    /** Size token. */
    size?: ButtonSize
    /** Disables interaction. */
    disabled?: boolean
    /** Leading icon name. */
    icon?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'primary',
    size: 'large',
    disabled: false,
    icon: ''
  })
</script>
```

## Wrong

<!-- prettier-ignore -->
```vue
<script setup lang="ts">
  // Runtime object form — blocked by webkit/authoring-standards.
  const props = defineProps({
    kind: { type: String, default: 'primary' }, // inline, untyped, no exported union
    isDisabled: Boolean, // "is" prefix — should be `disabled`
    icon: { type: String, default: undefined }, // text default must be ''
    label: { type: null as any }, // `any` in a prop type
    class: String // never declare class/style as a prop
  })
</script>
```
