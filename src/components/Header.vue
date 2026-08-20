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
        <a
          v-for="(menu, index) in menuSecondary"
          :key="index"
          :target="menu.target"
          :href="menu.link"
          :title="menu.title"
          :class="[
            menu.destak ? menuClasses.destak : menuClasses.default,
            { 'wk-header-button-info': menu.severity === 'info' },
            { 'wk-header-button-outlined': menu.outlined === true },
            menu.minBreakpoint && menu.minBreakpoint === 'sm' && 'block',
            menu.minBreakpoint && menu.minBreakpoint === 'md' && 'hidden md:block',
            menu.minBreakpoint && menu.minBreakpoint === 'lg' && 'hidden lg:block',
            menu.minBreakpoint && menu.minBreakpoint === 'xl' && 'hidden xl:block',
            menu.minBreakpoint && menu.minBreakpoint === '2xl' && 'hidden 2xl:block'
          ]"
        >
          <span>
            {{ menu.text }}
          </span>
        </a>

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
  const props = defineProps({ menuSecondary: Object })
  const { menuSecondary } = props
  const menuClasses = {
    destak: 'header-button-destak wk-header-button wk-header-button-secondary whitespace-nowrap hidden',
    default: 'wk-header-button wk-header-button-text whitespace-nowrap'
  }
</script>

<style scoped>
  /*
    Visual port of azion-theme's PrimeVue `.p-button` (small size) variants used
    by the header's secondary menu, rebuilt on @aziontech/theme v4 tokens.

    `.wk-header-button-primary` / `.wk-header-button-secondary` are intentionally kept as class
    names here: they are the two state hooks that the inline scroll script in
    BaseLayout.astro toggles on `.header-button-destak` (white call-to-action at
    the top of the page, orange once scrolled past 500px). Renaming them would
    silently break that behavior.
  */
  .wk-header-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-xxs);
    padding: var(--spacing-xxs) var(--spacing-xs);
    border: var(--border-width-default) solid transparent;
    border-radius: var(--shape-button);
    color: var(--text-default);
    font-size: var(--text-sm);
    font-weight: 500;
    line-height: 1.25rem;
    text-decoration: none;
    cursor: pointer;
    user-select: none;
    transition:
      background-color var(--transition-duration-fast-02) var(--ease-productive-entrance),
      border-color var(--transition-duration-fast-02) var(--ease-productive-entrance),
      color var(--transition-duration-fast-02) var(--ease-productive-entrance);
  }

  /* text: transparent, surface only on hover (Contact / Sign in) */
  .wk-header-button-text {
    background: transparent;
    border-color: transparent;
  }

  .wk-header-button-text:hover,
  .wk-header-button-text:active {
    background: var(--bg-hover);
  }

  /* outlined */
  .wk-header-button-outlined {
    background: transparent;
    border-color: var(--border-default);
  }

  .wk-header-button-outlined:hover,
  .wk-header-button-outlined:active {
    background: var(--bg-hover);
  }

  /* primary — destak, scrolled state */
  .wk-header-button.wk-header-button-primary {
    background: var(--primary);
    border-color: var(--primary);
    color: var(--primary-contrast);
  }

  /* secondary — destak, top-of-page state */
  .wk-header-button.wk-header-button-secondary {
    background: var(--secondary);
    border-color: var(--secondary);
    color: var(--secondary-contrast);
  }

  /* info severity (last, so it wins over the text/outlined variants) */
  .wk-header-button-info,
  .wk-header-button-info:hover,
  .wk-header-button-info:active {
    background: var(--info);
    border-color: var(--info-border);
    color: var(--info-contrast);
  }
</style>
