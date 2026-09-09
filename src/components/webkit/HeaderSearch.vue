<script setup>
  import IconButton from '@aziontech/webkit/icon-button'
  import Kbd from '@aziontech/webkit/kbd'

  defineOptions({ inheritAttrs: false })

  defineProps({
    label: { type: String, default: 'Search' }
  })

  defineEmits(['click'])
</script>

<template>
  <IconButton
    icon="pi pi-search"
    kind="outlined"
    size="medium"
    :aria-label="label"
    aria-keyshortcuts="Meta+K"
    class="@min-[47rem]:hidden"
    @click="$emit('click', $event)"
  />

  <button
    type="button"
    :aria-label="label"
    aria-keyshortcuts="Meta+K"
    class="hidden h-8 w-56 shrink-0 cursor-pointer items-center gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) text-left text-(--text-default) transition-colors duration-moderate-01 ease-productive-entrance [--input-ring-offset:var(--bg-surface)] [&:not(:focus-visible)]:hover:border-(--border-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--input-ring-offset,var(--bg-canvas))] motion-reduce:transition-none @min-[47rem]:flex"
    @click="$emit('click', $event)"
  >
    <span
      class="inline-flex shrink-0 items-center justify-center text-(--text-muted)"
      aria-hidden="true"
    >
      <i class="pi pi-search" />
    </span>
    <span class="min-w-0 flex-1 truncate text-label-sm text-(--text-muted)">{{ label }}</span>
    <Kbd
      meta
      size="small"
      class="shrink-0"
      >K</Kbd
    >
  </button>
</template>
