<template>
  <!--
    The docs top bar, aligned with the design system's docs sample (webkit repo,
    feat/doc-masthead-action-belt: apps/webkit-sample/src/site/docs/components/
    DocsLayout.vue) — the DS GlobalHeader with the sample's regions and order:
    the way into the mobile navigation, the brand cluster and section links on
    the Left, the Nav spacer, then search leading the trailing actions.

    Adaptations to this site's rendering model:

    · This component is server-rendered with no client directive, so the two
      interactive controls — the navigation drawer trigger and the search
      trigger — stay in their hydrated islands and reach the bar through the
      `mobile-nav` and `dialog` slots (BaseLayout.astro supplies them).
    · The sample's shell owns the scroll region; this page scrolls the
      document, so the bar keeps the docs' sticky positioning.
    · The sample's `kind="content"` (page-boundary inset) is not in the
      published webkit yet — add it when the next webkit release ships it.

    `@container` makes the bar the container the search trigger's
    `@min-[47rem]` shape switch measures (see webkit/HeaderSearch.vue).
  -->
  <GlobalHeader
    aria-label="Azion documentation"
    class="@container sticky top-0 z-50"
  >
    <GlobalHeader.Left class="justify-start!">
      <!-- Below `lg` the navigation tree has no rail to live in, so the bar
           carries the way into it (the drawer island renders the trigger). -->
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
          <!-- The wordmark already says Azion; on a 390px bar the badge is the
               one piece of the identity that can go. -->
          <span
            class="hidden rounded-(--shape-elements) border border-(--border-muted) px-(--spacing-xxs) py-px text-overline-sm uppercase tracking-widest text-(--text-muted) sm:inline-block"
          >
            Docs
          </span>
        </a>
      </GlobalHeader.Brand>

      <!-- The section links need the room the rail breakpoint frees up; below
           `lg` the bar is already carrying the menu button and the search
           trigger. Plain `href` triggers, so the sample's Portal/Popup block
           (which serves panel content) has nothing to render and is omitted.
           NavigationMenu still needs hydration for its hover highlight (a
           `pointerenter` + provide/inject feature), so it lives in its own
           island behind this slot rather than inline in this SSR-only
           component — the `mobile-nav`/`dialog` slots below already follow
           the same pattern. -->
      <slot name="nav" />
    </GlobalHeader.Left>

    <!-- Empty spacer region; pushes the trailing cluster to the end. -->
    <GlobalHeader.Nav />

    <GlobalHeader.Right>
      <!-- The search island (trigger + palette) leads the trailing actions. -->
      <slot name="dialog" />

      <!-- GitHub, the docs bar's one external identity link. `outlined`, as in
           the sample: it sits with the bar's other icon controls and has to
           read as one of them.

           The breakpoint wrappers below carry `hidden`, not the controls: a
           webkit button sets its own display class on the same element and
           wins the cascade, so `hidden` on the control never applies. Above
           the breakpoint the wrapper is `contents`, so the control stays a
           direct flex item of the bar. Below `sm` the bar (menu, wordmark,
           search, Console) fits a 320px screen; the identity link and the
           second call to action come back as the room does. -->
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
    /** Where the brand cluster links to (the language's docs home). */
    homeHref: {
      type: String,
      default: '/'
    },
    /** Translated label for the console sign-in action. */
    signInLabel: {
      type: String,
      default: 'Sign in'
    }
  })
</script>
