<script setup>
  // The bar's search affordance, ported from the design system's docs sample
  // (webkit repo, feat/doc-masthead-action-belt:
  // apps/webkit-sample/src/shared/ui/HeaderSearch.vue). Two controls, one job,
  // never both on screen:
  //
  // · The wide shape is a BUTTON, not a field — the palette owns the typing. A
  //   readonly input that opens something else lies about what typing into it
  //   does. It wears `InputText size="medium"`'s chrome value for value
  //   (surface fill, default border, `--shape-elements` radius, `h-8`, the
  //   muted 12px label — `text-label-sm`, the input's own placeholder size,
  //   not `md`), with the field's hover/focus behaviours translated to a
  //   button: border strengthens on hover only while NOT focused, and the
  //   focus ring offsets against `--bg-surface` because the control sits on
  //   the bar, not the canvas. `cursor-pointer` stays — parity with the field
  //   ends where it would lie about the interaction.
  //
  // · Given less room, the DS's own IconButton (outlined/medium), so it IS one
  //   of the bar's icon controls rather than this bar squeezed into a square.
  //
  // The switch is a CONTAINER QUERY on the bar (the consumer marks its
  // GlobalHeader `@container`), not a viewport breakpoint — bars in different
  // shells run out of room at different viewports. `@min-[47rem]` is measured
  // against the bar's CONTENT box (48px narrower than its visible width, the
  // page boundary padding), and spelled literally because the theme declares
  // its `--container-*` ladder in `:root` rather than `@theme`, so Tailwind's
  // named rungs (`@xs`…) would resolve to Tailwind's own defaults.
  //
  // Rendering both and hiding one with `display: none` is the only way a CSS
  // query can choose between two different components; the hidden one leaves
  // the accessibility tree too.
  import IconButton from '@aziontech/webkit/icon-button'
  import Kbd from '@aziontech/webkit/kbd'

  // Two roots, so there is no single element for a consumer's attributes to
  // land on. Both call sites pass none; anything either shape needs lives here.
  defineOptions({ inheritAttrs: false })

  defineProps({
    // The visible text in the wide shape, and the accessible name of BOTH.
    label: { type: String, default: 'Search' }
  })

  defineEmits(['click'])
</script>

<template>
  <!-- Narrow: the DS control, hidden the moment the bar fits. `@min-[47rem]:hidden`
       beats IconButton's own `inline-flex` because a variant is emitted after the
       plain utility it fights. -->
  <IconButton
    icon="pi pi-search"
    kind="outlined"
    size="medium"
    :aria-label="label"
    aria-keyshortcuts="Meta+K"
    class="@min-[47rem]:hidden"
    @click="$emit('click', $event)"
  />

  <!-- Wide: the search bar — a button in the DS field's chrome, 224px (`w-56`,
       a control that sits with the other controls, not a band across the bar). -->
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
