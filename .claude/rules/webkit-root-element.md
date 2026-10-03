# Rule: own the root element — forward attrs, switch by data, expose the minimum

A component renders **its own root element**: which element it is switches on a data prop,
consumer attributes reach it via `inheritAttrs: false` + `v-bind="$attrs"`, and the
imperative surface (`defineExpose`) stays minimal. No wrapper `<div>` that swallows attrs,
no `as`/`asChild` polymorphism helper, no leaked internal state. This pattern is
**convention + code review** in this project — no lint rule checks it mechanically. (Token
discipline inside class strings is enforced separately by the stylelint config and the
`webkit/no-hardcoded-color` ESLint rule.)

## Do

- Switch the root element by **intent expressed as data**: an `href` prop drives
  `<component :is="isLink ? 'a' : 'button'">` — anchor when there is a URL, button otherwise.
- Set `inheritAttrs: false` in `defineOptions` and put `v-bind="$attrs"` on the **real**
  root, so attributes (including `class`) land on the element the consumer means.
- Merge the consumer's `class` with `cn` from `@aziontech/webkit/utils/cn` (the only
  class-composition helper). Keep the base classes a flat literal.
- Expose **functions only** via `defineExpose` (`focus()`, `open()`) — and only when a prop,
  event, or `v-model` cannot express the interaction. Default to exposing nothing.

## Do not

- Never switch the root with an `as`/`is` **string prop** — use a data prop like `href`.
- Never import or invent an `asChild`/`Slot` polymorphism helper — webkit does not ship one.
- Never wrap the root in a `<div>` that eats `$attrs`.
- Never declare `class` in `defineProps` — it flows through `useAttrs()` + `cn`.
- Never `defineExpose` internal reactive state (`internalValue`, raw element refs) — the
  imperative surface is a small set of named functions.

## Correct

<!-- prettier-ignore -->
```vue
<script setup lang="ts">
  import { computed, useAttrs } from 'vue'
  import { cn } from '@aziontech/webkit/utils/cn'

  defineOptions({ name: 'ActionCard', inheritAttrs: false })

  interface Props {
    /** When set, the root renders as an anchor link to this URL. */
    href?: string
  }
  const props = withDefaults(defineProps<Props>(), { href: '' })

  const attrs = useAttrs()
  const isLink = computed(() => props.href.length > 0)
</script>

<template>
  <component
    :is="isLink ? 'a' : 'button'"
    v-bind="$attrs"
    :href="isLink ? href : undefined"
    :class="cn('rounded-(--shape-card) bg-(--bg-surface) p-(--spacing-md)', attrs.class as string)"
  >
    <slot />
  </component>
</template>
```

<!-- prettier-ignore -->
```vue
<script setup lang="ts">
  import { ref } from 'vue'
  const inputRef = ref<HTMLInputElement | null>(null)
  defineExpose({
    /** Move focus to the field. */
    focus: () => inputRef.value?.focus()
  })
</script>
```

## Wrong

<!-- prettier-ignore -->
```vue
<script setup lang="ts">
  import { ref } from 'vue'
  // ❌ `as` string prop; `class` declared as a prop; internal state exposed
  const props = defineProps<{ as?: string; class?: string }>()
  const internalValue = ref('')
  defineExpose({ internalValue })
</script>

<template>
  <!-- ❌ wrapper div swallows $attrs; the real root never receives the consumer's attributes -->
  <div class="wrapper">
    <component :is="props.as ?? 'button'" :class="props.class">
      <slot />
    </component>
  </div>
</template>
```
