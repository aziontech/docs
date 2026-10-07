# Rule: one folder layout, one `<script setup>` order for every component

Two components should differ only in what they _do_, never in how their files are arranged
or in what order their `<script setup>` reads. Parts of this rule are machine-enforced by
the `webkit/authoring-standards` ESLint rule: runtime `defineProps({})` / `defineEmits([])`
(use the type-based forms), a manual `modelValue` prop + `update:modelValue` emit (use
`defineModel`), a `<slot>` without a `defineSlots` declaration, a composable returning
`reactive()` or authored as `.js`, and a bare `@deprecated` tag are all blocked. The folder
layout and the section order themselves are convention + review.

## Do

- Keep **one component per `.vue` file**, named in kebab-case; the folder carries the same name:

<!-- prettier-ignore -->
```
src/components/<name>/
  <name>.vue              # the root component
  index.ts                # compound root (composition components only)
  injection-key.ts        # provide/inject key (composition only)
  composables/            # composables used only by this component
    use-<name>-context.ts
  <name>-<part>/          # each public sub-component in its own folder
    <name>-<part>.vue
```

- **Co-locate** what only this component uses (its composables, its `injection-key.ts`, its
  sub-components). Promote to a shared `src/composables/` only when a second component needs it.
- Start every `<script setup lang="ts">` with `defineOptions({ name, inheritAttrs: false })` —
  `name` in PascalCase — then keep the fixed section order shown below. Omit a section that
  does not apply; never reorder.
- Declare props, emits, models, and slots with the **type-based macros**: `defineProps<Props>()`,
  `defineEmits<{ ... }>()`, `defineModel<T>()`, `defineSlots<{ ... }>()`.
- Author composables as `.ts` files returning refs/computed values.

## Do not

- Never put more than one component in a `.vue` file.
- Never reorder the `<script setup>` sections or omit `defineOptions({ name, inheritAttrs: false })`.
- Never use runtime `defineProps({...})` / `defineEmits([...])` — blocked by lint.
- Never hand-wire a `modelValue` prop + `update:modelValue` emit; use `defineModel` — blocked by lint.
- Never render a `<slot>` without a matching `defineSlots` declaration — blocked by lint.
- Never hoist a component-specific composable or `injection-key.ts` out of the component
  folder before a second consumer exists.
- Never add a per-component `package.json`.

## Correct

<!-- prettier-ignore -->
```vue
<script setup lang="ts">
  // 1. imports
  import { computed, useAttrs } from 'vue'

  // 2. defineOptions — name (PascalCase) + inheritAttrs
  defineOptions({ name: 'TagChip', inheritAttrs: false })

  // 3. types (props interfaces, exported variant unions)
  export type TagChipKind = 'primary' | 'secondary'
  interface Props { kind?: TagChipKind; disabled?: boolean }

  // 4. props
  const props = withDefaults(defineProps<Props>(), { kind: 'primary', disabled: false })

  // 5. emits
  const emit = defineEmits<{ click: [event: MouseEvent, label: string] }>()

  // 6. models · 7. slots
  const model = defineModel<string>({ default: '' })
  defineSlots<{ default(): unknown }>()

  // 8. inject / composables
  const attrs = useAttrs()

  // 9. local state · 10. computed
  const testId = computed(() => (attrs['data-testid'] as string) ?? 'tag-chip')

  // 11. watchers / lifecycle · 12. functions · 13. defineExpose (minimal, intentional)
</script>
```

## Wrong

<!-- prettier-ignore -->
```vue
<script setup>
  // runtime macros, manual v-model wiring, no defineOptions, imports out of order
  const props = defineProps({ modelValue: String, kind: { type: String, default: 'primary' } })
  const emit = defineEmits(['update:modelValue', 'click'])
  import { computed } from 'vue'
</script>

<!-- a slot rendered without a defineSlots declaration -->
<template><div><slot /></div></template>
```
