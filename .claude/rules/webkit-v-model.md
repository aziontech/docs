# Rule: two-way state goes through `defineModel`

Every two-way value a component exposes is declared with `defineModel()` (Vue 3.4+) —
never a hand-written `modelValue` prop paired with an `update:modelValue` emit, and never
a local `ref` mirrored into a `watch`. One macro solves both problems every stateful
component has: the **controlled/uncontrolled split** (when the parent binds `v-model` the
parent owns the value; when it doesn't, the returned ref holds local state) and the
**boilerplate**. The `webkit/authoring-standards` ESLint rule blocks the manual
`modelValue` + `update:modelValue` pair as an **error** — this rule is why, and what to
write instead.

## Do

- Declare the primary two-way value as `const model = defineModel<Type>({ default: ... })`
  — consumers bind it with `v-model`.
- Declare each secondary two-way value as a **named** model —
  `const open = defineModel<boolean>('open', { default: false })` — consumers bind
  `v-model:open`.
- Put the default in the `defineModel` options object, not in a separate `withDefaults`.
- Normalize on the boundary with the `get` / `set` options (trim, clamp, coerce) so the
  parent's value and the internal value never disagree.
- Type every model explicitly (`defineModel<string>()`) — never let it infer `any`.
- Name models by the shared vocabulary: the primary value is the default model; overlay
  open state is `open` (seeded by `defaultOpen`), never `visible` / `show` / `isToggled`.
  Naming is convention + review in this project.
- Treat renaming a model, adding a required second model, or changing a model's type as a
  **breaking change** — every `v-model` binding on it changes. Migrating a manual
  `modelValue` pair onto `defineModel` is **not** breaking: the public contract
  (`v-model`, the `update:modelValue` event) stays identical.

## Do not

- Never declare a `modelValue` prop plus an `update:modelValue` emit by hand when
  `defineModel` expresses it — blocked by lint.
- Never mirror a prop into a local `ref` via `watch` to fake two-way binding — that is
  exactly the bug factory `defineModel` removes (forget the watch, forget to emit, emit
  the stale value).
- Never put a model's default in `withDefaults`; it goes in the `defineModel` options.
- Never leave a model untyped (`defineModel()` with no generic).
- Never name a model off-vocabulary (`visible`, `show`, `value`, `isToggled`).

## Correct

<!-- prettier-ignore -->
```vue
<script setup lang="ts">
  // Primary value — consumer binds v-model="query".
  // Boundary transform: what leaves the component is always trimmed.
  const model = defineModel<string>({ default: '', set: (v) => v.trim() })

  // Secondary value — consumer binds v-model:open="isOpen"
  const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <input :value="model" @input="model = ($event.target as HTMLInputElement).value" />
</template>
```

<!-- prettier-ignore -->
```html
<!-- Consumer side: works controlled (bound) or uncontrolled (unbound) -->
<SearchField v-model="query" v-model:open="menuOpen" />
```

## Wrong

<!-- prettier-ignore -->
```vue
<script setup lang="ts">
  // Hand-rolled pair — blocked by the webkit/authoring-standards ESLint rule
  const props = defineProps<{ modelValue: string }>()
  const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

  // Local mirror kept in sync by hand — the pattern defineModel removes
  const local = ref(props.modelValue)
  watch(
    () => props.modelValue,
    (v) => (local.value = v)
  )
</script>
```
