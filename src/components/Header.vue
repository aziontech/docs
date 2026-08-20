<template>
  <header
    class="w-full h-[56px] bg-canvas border-b border-default text-default py-3 sticky top-0 z-50"
  >
    <div class="px-shell h-8 flex justify-between items-center">
      <div class="flex gap-4 items-center">
        <slot name="visualid" />
        <slot name="navigation" />
      </div>

      <div class="flex gap-2">
        <!--
          Header CTAs come from @aziontech/webkit's Button instead of the
          `.wk-header-button` CSS this file used to carry (a hand-made port of
          azion-theme's PrimeVue `.p-button`).

          Visibility lives on the wrapper, NOT on the Button. Tailwind emits
          `.hidden{display:none}` *before* `.inline-flex{display:inline-flex}`
          at equal specificity, so a `hidden` class sitting next to webkit's own
          `inline-flex` loses the cascade and the element stays visible. It used
          to work because the old anchor took its `inline-flex` from unlayered
          scoped CSS, which any utility outranks. A wrapper with no display
          utility of its own sidesteps the fight entirely.

          `title` does not survive the move: webkit's Button declares
          `inheritAttrs: false` and forwards only `class` and `data-testid`, so
          the tooltip attribute these anchors carried cannot reach the DOM. The
          visible label is the accessible name either way.
        -->
        <span
          v-for="(menu, index) in menuSecondary"
          :key="index"
          :class="visibilityClass(menu)"
        >
          <Button
            :label="menu.text"
            :href="menu.link"
            :target="menu.target"
            :kind="menuKind(menu)"
            size="medium"
            class="whitespace-nowrap"
          />
        </span>

        <div
          v-if="$slots.dialog"
          class="min-w-8"
        >
          <slot name="dialog" />
        </div>

        <slot name="mobile-right-sidebar" />
      </div>
    </div>
  </header>
</template>

<script setup>
  import Button from '@aziontech/webkit/button'

  const props = defineProps({ menuSecondary: Object })
  const { menuSecondary } = props

  /*
    `severity: 'info'` has no counterpart among webkit's kinds (theme@4's
    `--info` is a tinted surface, not a button kind) and falls back to
    `outlined`, the same fallback used by LinkButton and HeaderRightSidebar.
    Non-destak entries were the transparent `text` variant.
  */
  function menuKind(menu) {
    if (menu.severity === 'info' || menu.outlined === true) return 'outlined'
    if (menu.destak) return 'secondary'

    return 'text'
  }

  /*
    `destak` keeps the `hidden` it has always had: this entry ships hidden and
    the docs' header data sets no `minBreakpoint` that would reveal it, so the
    CTA has never been displayed here. The inline script in BaseLayout.astro
    that used to swap its variant on scroll was therefore mutating an invisible
    element; it was removed along with the CSS hooks it toggled. Showing the
    CTA is a content decision (give the entry a `minBreakpoint`), and reviving
    the scrolled state needs a variant source other than a class swap on
    webkit's internals, since this component is not hydrated.
  */
  function visibilityClass(menu) {
    const breakpoint = {
      sm: 'block',
      md: 'hidden md:block',
      lg: 'hidden lg:block',
      xl: 'hidden xl:block',
      '2xl': 'hidden 2xl:block'
    }[menu.minBreakpoint]

    if (breakpoint) return breakpoint

    return menu.destak ? 'hidden' : ''
  }
</script>

