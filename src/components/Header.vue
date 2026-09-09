<template>
  <!-- The shell (BaseLayout) keeps the header in place — nothing sticks. `px` is forced past
       the component's own `--spacing-md`: the reference header insets by `--spacing-lg`. -->
  <GlobalHeader
    aria-label="Azion documentation"
    class="@container px-(--spacing-lg)!"
  >
    <GlobalHeader.Left class="justify-start!">
      <!-- Boxed and dropped at `lg`: the drawer leaves an empty root element in the row, and as a
           bare flex item it would take a gap of its own and push the brand off the header's inset. -->
      <div class="flex items-center lg:hidden">
        <slot name="mobile-nav" />
      </div>

      <GlobalHeader.Brand>
        <a
          :href="homeHref"
          aria-label="Azion Docs — home"
          class="inline-flex shrink-0 items-center gap-(--spacing-xs) rounded-(--shape-elements) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface)"
        >
          <Brand
            kind="default"
            size="small"
            aria-hidden="true"
          />
          <span
            class="hidden rounded-(--shape-elements) border border-(--border-muted) px-(--spacing-xxs) py-px text-overline-sm uppercase tracking-widest text-(--text-muted) sm:inline-block"
          >
            Docs
          </span>
        </a>
      </GlobalHeader.Brand>

      <slot name="nav" />
    </GlobalHeader.Left>

    <GlobalHeader.Nav />

    <GlobalHeader.Right>
      <!-- Boxed for the same reason as the drawer: the command menu leaves an empty root element
           beside the search trigger, which as a bare flex item would take a gap of its own. -->
      <div class="flex items-center">
        <slot name="dialog" />
      </div>

      <div class="hidden sm:contents">
        <IconButton
          icon="pi pi-github"
          kind="outlined"
          size="medium"
          aria-label="Azion on GitHub"
          href="https://github.com/aziontech"
          target="_blank"
          class="shrink-0"
        />
      </div>

      <Button
        label="Console"
        kind="secondary"
        size="medium"
        href="https://console.azion.com"
        target="_blank"
        class="shrink-0"
      />
    </GlobalHeader.Right>
  </GlobalHeader>
</template>

<script setup>
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'

  defineProps({
    homeHref: {
      type: String,
      default: '/'
    }
  })
</script>
