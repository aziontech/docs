<template>
  <footer class="py-12 dark:bg-neutral-950 surface-ground border-t border-solid surface-border bg-header text-white">
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
            <p class="text-color-secondary text-sm">
              {{ cta.text }}
              <span class="text-color whitespace-nowrap">{{ cta.phone }}</span>
            </p>
          </div>
          <div
            class="flex gap-3"
            v-if="socialButtons"
          >
            <LinkButton
              v-for="({ icon, link, title, target }, index) in socialButtons"
              outlined
              iconPos="center"
              :aria-label="title"
              :key="index"
              :icon="icon"
              :link="link"
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
  import Divider from 'primevue/divider'
  import AzionLogo from 'azion-webkit/azionlogo'
  import Overline from 'azion-webkit/overline'
  import LinkButton from 'azion-webkit/linkbutton'

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
