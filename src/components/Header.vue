<template>
  <GlobalHeader
    aria-label="Azion documentation"
    class="@container sticky top-0 z-50"
  >
    <GlobalHeader.Left class="justify-start!">
      <slot name="mobile-nav" />

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
      <slot name="dialog" />

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

      <div class="hidden md:contents">
        <Button
          :label="signInLabel"
          kind="primary"
          size="medium"
          href="https://console.azion.com/login"
          target="_blank"
          class="shrink-0"
        />
      </div>
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
    },
    signInLabel: {
      type: String,
      default: 'Sign in'
    }
  })
</script>
