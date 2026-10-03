# Rule: slots are typed with defineSlots, kebab-named, with fallback inside the slot

Slots are a component's anatomy surface — where the consumer puts content — the
counterpart to props (data + scalar config). Every slot must be declared and typed with
`defineSlots`, so the editor knows the slot exists and what a scoped slot yields. An
untyped slot is invisible to tooling. The `webkit/authoring-standards` ESLint rule blocks
a `<slot>` in the template with no `defineSlots` declaration; the naming and payload
conventions below are enforced by review.

## Do

- Declare every slot with a typed `defineSlots<{ ... }>()` in `<script setup>`, one entry
  per slot, each with a short JSDoc line.
- Name multi-word slots in **kebab-case** (`prefix`, `header-actions`) — matching how the
  consumer writes `<template #header-actions>`.
- Give a **scoped slot** a payload typed as an **object with named keys**
  (`{ item, index }`) — the smallest thing that identifies the subject.
- Put fallback content **inside the `<slot>` element** in the template; the fallback
  renders whenever the consumer passes nothing.

## Do not

- Never render a `<slot>` with no `defineSlots` declaration at all — blocked by lint. Keeping every rendered slot listed in the declaration is convention + review.
- Never name a slot in camelCase (`headerActions`) — kebab-case (`header-actions`).
- Never pass scoped-slot payload positionally — always a named-key object.
- Never add a `label`/`text` prop as a **substitute** for a slot's content; the slot with
  fallback content covers both cases. A display-text prop may exist as the fallback's
  source, but the slot stays the primary path.

## Correct

<!-- prettier-ignore -->
```vue
<script setup lang="ts">
  interface Item {
    id: string
    label: string
  }

  defineProps<{ items: Item[] }>()

  defineSlots<{
    /** Leading adornment. */
    prefix(): unknown
    /** Rendered per item; receives the record and its index. */
    item(props: { item: Item; index: number }): unknown
  }>()
</script>

<template>
  <ul class="flex flex-col gap-(--spacing-xs)">
    <li v-for="(entry, i) in items" :key="entry.id">
      <slot name="prefix" />
      <slot name="item" :item="entry" :index="i">
        <!-- fallback: shown when the consumer passes no item slot -->
        {{ entry.label }}
      </slot>
    </li>
  </ul>
</template>
```

## Wrong

<!-- prettier-ignore -->
```vue
<script setup lang="ts">
  // No defineSlots: the slots below are invisible to the editor — blocked by lint.
  // A "label" prop standing in for slot content instead of slot fallback.
  defineProps<{ items: { id: string; label: string }[]; emptyLabel: string }>()
</script>

<template>
  <ul>
    <!-- camelCase slot name -->
    <slot name="headerActions" />
    <li v-for="(entry, i) in items" :key="entry.id">
      <!-- positional-style payload crammed into one unnamed value -->
      <slot name="item" :value="[entry, i]" />
    </li>
    <!-- prop substituting for a slot's fallback content -->
    <li v-if="!items.length">{{ emptyLabel }}</li>
  </ul>
</template>
```
