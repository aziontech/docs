# Rule: one prop name, one type, one default per concept

The same concept ships under the **same prop name, type, and default** on every component —
in webkit and in the components you author in this project. When one component calls it
`variant` and another `kind`, or one spells it `closeable` and another `closable`, everyone
relearns the API per component and AI-generated code guesses wrong. This vocabulary is
**convention + review** in this project (no lint rule checks prop names). The adjacent
authoring shape _is_ enforced: the `webkit/authoring-standards` ESLint rule blocks a manual
`modelValue` prop + `update:modelValue` emit — use `defineModel` / `v-model` instead.

## The dictionary

| Concept                              | Canonical prop                                | Type                                                            | Default                                  | Banned aliases                                                                                                                                             |
| ------------------------------------ | --------------------------------------------- | --------------------------------------------------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Visual/structural variant            | `kind`                                        | component-specific string union                                 | component-specific                       | `variant`, `appearance`, `intent`                                                                                                                          |
| Severity / status color              | `severity`                                    | shared string union                                             | per family                               | `status`                                                                                                                                                   |
| Size                                 | `size`                                        | `'small' \| 'medium' \| 'large'` (this order; a subset is fine) | `large` for actions/links, else `medium` | `xs`/`sm`/`md`/`lg`/`xl`, reordered unions                                                                                                                 |
| Light-dismiss (outside-click / Esc)  | `dismissible`                                 | `boolean`                                                       | overlay-specific                         | `dismissable`, `closeable`                                                                                                                                 |
| Explicit close affordance (X button) | `closable`                                    | `boolean`                                                       | `false`                                  | — (distinct concept, not an alias of `dismissible`)                                                                                                        |
| Primary heading text                 | `title`                                       | `string`                                                        | `''`                                     | `heading`, `header` (as a prop)                                                                                                                            |
| Primary two-way value                | `modelValue` (default `v-model`)              | component-specific                                              | per component                            | ad-hoc names like `isToggled`                                                                                                                              |
| Overlay open state                   | `open` (+ `v-model:open`), seed `defaultOpen` | `boolean`                                                       | `undefined` (controlled)                 | `visible`, `show`, `opened`                                                                                                                                |
| Disabled                             | `disabled`                                    | `boolean`                                                       | `false`                                  | `isDisabled`, `enabled`                                                                                                                                    |
| Loading                              | `loading`                                     | `boolean`                                                       | `false`                                  | `isLoading`                                                                                                                                                |
| Leading/trailing glyph               | `icon`                                        | `string` (icon name)                                            | `''`                                     | `iconName`, `leadingIcon`, `trailingIcon`                                                                                                                  |
| Accessible name                      | `ariaLabel` (+ prefixed `xAriaLabel`)         | `string`                                                        | per component                            | `aria-label` as a prop                                                                                                                                     |
| Boolean (any)                        | no `is`/`has` prefix; **positive polarity**   | `boolean`                                                       | `false`                                  | `isX`, `hasX`; negatives: `hidden`→`visible`, `closed`→`open`, `inactive`→`active`, `collapsed`→`expanded` (`disabled`/`readonly` are accepted exceptions) |
| Value change signal                  | `v-model` / `update:<x>` only                 | —                                                               | —                                        | a `<x>-change` event that echoes `update:<x>`; a genuinely distinct commit (e.g. commit-on-blur) is a bare `change`                                        |

**Not banned — legitimate competing uses:** `type` for native pass-throughs (`<input type>`)
is fine — only a _variant_ named `type` is wrong (rename to `kind`). `value` is fine for
identity, the `v-model` payload, or display text.

## Do

- Reuse the canonical name whenever a concept already has one — `kind`, `size`, `severity`,
  `disabled`, `loading`, `icon`, `title`, `open`.
- Declare `size` with the shared tokens in canonical order; a subset (`'small' | 'medium'`)
  is fine, a reorder is not. Default `size` to `large` on actions/links, `medium` elsewhere.
- Name booleans positively and unprefixed: `visible`, `active`, `expanded` — not `hidden`,
  `isActive`, `collapsed` (`disabled`/`readonly` are the accepted exceptions).
- Use `defineModel` for two-way values; the ESLint rule `webkit/authoring-standards` blocks
  the manual `modelValue` + `update:modelValue` pair.
- When migrating code from another design system, rewrite its names to this vocabulary
  (`variant` → `kind`, `sm/md/lg` → `small/medium/large`) — never carry them over.

## Do not

- Never introduce a prop whose concept already has a canonical name under a different name.
- Never use `xs`/`sm`/`md`/`lg`/`xl` tokens for `size`, and never reorder the union.
- Never prefix a boolean with `is`/`has`, and never name one negatively.
- Never emit a `<x>-change` event alongside `update:<x>` — it is a redundant echo.
- Never name overlay visibility `visible`/`show`/`opened` — it is `open` (`v-model:open`).
- Never confuse `dismissible` (light-dismiss behavior) with `closable` (renders an X button);
  they are two concepts, not two spellings.

## Correct

<!-- prettier-ignore -->
```ts
// banner.vue — canonical vocabulary throughout
interface Props {
  kind?: 'inline' | 'floating'            // visual variant
  severity?: 'info' | 'warning' | 'error' // status color
  size?: 'small' | 'medium'               // subset, canonical order
  dismissible?: boolean                   // closes on outside-click / Esc
  closable?: boolean                      // shows an explicit X button
  title?: string
  loading?: boolean                       // positive, unprefixed
}
const open = defineModel<boolean>('open') // overlay state: open, never visible
```

## Wrong

<!-- prettier-ignore -->
```ts
interface Props {
  variant?: 'inline' | 'floating'  // ❌ the variant prop is `kind`
  status?: 'info' | 'warning'      // ❌ severity color is `severity`
  size?: 'sm' | 'md' | 'lg'        // ❌ tokens are small / medium / large
  isLoading?: boolean              // ❌ no is/has prefix — `loading`
  hidden?: boolean                 // ❌ negative polarity — `visible`
  closeable?: boolean              // ❌ `dismissible` or `closable`, by concept
  show?: boolean                   // ❌ overlay state is `open` + v-model:open
}
const emit = defineEmits<{ 'update:value': [string]; 'value-change': [string] }>()
emit('value-change', next)         // ❌ redundant echo of update:value
```
