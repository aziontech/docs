<template>
  <footer class="py-12 bg-canvas border-t border-solid border-default text-default">
    <div class="flex flex-col gap-9 lg:gap-8 px-shell">
      <div class="flex flex-col lg:flex-row justify-between w-full gap-9 lg:gap-12">
        <div class="w-full flex flex-col justify-between gap-4">
          <div class="flex flex-col gap-4">
            <AzionLogo
              :href="`/${lang}/`"
              hrefTitle="Azion Technologies"
              class="mb-4 block"
              version="default"
              aria-label="Azion logo"
            />

            <slot name="system-status" />
            <p class="text-muted text-sm">
              {{ cta.text }}
              <span class="text-default whitespace-nowrap">{{ cta.phone }}</span>
            </p>
          </div>
          <div
            class="flex gap-3"
            v-if="socialButtons"
          >
            <!--
              Ghost icon buttons, straight from the design system. webkit calls
              that kind `transparent`: no fill and no border at rest, with the
              hover/active layers coming from the component's own ghost
              overlays.

              Consuming IconButton directly rather than routing through
              LinkButton (as this used to, via `outlined iconPos="center"`):
              LinkButton is the compatibility adapter for the ~1.5k content
              call sites, and it puts `w-fit` on its root for the label case --
              which overrode IconButton's `size-10` and rendered these six
              icons as 18x40 slivers instead of 40px squares. First-party
              components in this repo already go direct (Header.vue for Button,
              Divider above), and it also puts `ariaLabel` on the prop the
              design system actually reads instead of relying on attribute
              fallthrough to fill it in.
            -->
            <IconButton
              v-for="({ icon, link, title, target }, index) in socialButtons"
              :key="index"
              :icon="icon"
              :ariaLabel="title"
              kind="transparent"
              size="large"
              :href="link"
              :target="target || '_blank'"
            />
          </div>
        </div>
        <div
          class="w-full flex flex-wrap md:flex-nowrap gap-4 lg:gap-8 lg:justify-end -ml-[16px] lg:ml-0"
        >
          <div
            :key="index"
            v-for="({ title, list }, index) in listData"
            class="max-w-44 w-full"
          >
            <Overline
              class="px-4"
              :label="title"
            />
            <ul class="list-none p-0 m-0 mt-4 gap-3">
              <li
                v-for="({ link, title }, i) in list"
                :key="i"
              >
                <LinkButton
                  :link="`${link}`"
                  text
                  class="px-4 whitespace-nowrap"
                  :label="title"
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="hidden md:block">
        <Divider />
      </div>
      <div class="flex justify-between md:items-center flex-col md:flex-row gap-8">
        <div class="flex gap-3">
          <slot name="action" />
          <slot name="theme-switch" />
        </div>
        <div class="md:hidden">
          <Divider />
        </div>
        <p class="text-body-1">
          {{ copyright }}
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
  /*
    Divider comes straight from the design system. The local
    webkit/Divider.vue wrapper existed only to carry the hand-written
    `border-t-[var(--border-default)]` rule that webkit's Divider now owns;
    with no props to translate and no docs-specific default, a pass-through
    file would just be a redirect that makes this import ambiguous.

    Both call sites below already sit inside `hidden md:block` / `md:hidden`
    wrappers, so webkit's `flex w-full` classes never compete with the
    visibility utilities -- which matters because Tailwind runs in important
    mode here and `.hidden` is emitted before `.flex`.
  */
  import Divider from '@aziontech/webkit/divider'
  import AzionLogo from '~/components/webkit/AzionLogo.vue'
  import Overline from '~/components/webkit/Overline.vue'
  import IconButton from '@aziontech/webkit/icon-button'
  import LinkButton from '~/components/webkit/LinkButton.vue'

  defineProps({
    lang: {
      type: String,
      required: true
    },
    listData: {
      type: Array,
      required: true
    },
    copyright: {
      type: String,
      required: true
    },
    cta: {
      type: Object,
      required: true
    },
    socialButtons: {
      type: Array,
      required: false
    }
  })
</script>
