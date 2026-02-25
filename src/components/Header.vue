<template>
  <header
    class="w-full h-[56px] surface-ground border-b surface-border bg-header text-white py-3 sticky top-0 z-50"
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
            { 'p-button-info': menu.severity === 'info' },
            { 'p-button-outlined border-header': menu.outlined === true },
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
    destak:
      'header-button-destak p-button p-button-secondary !text-[#000000] !bg-[#ffffff] whitespace-nowrap p-button-sm hidden',
    default:
      'p-button p-button-primary whitespace-nowrap p-button-text hover:surface-hover p-button-sm'
  }
</script>
