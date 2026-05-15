<template>
  <nav class="hidden lg:flex">
    <ul class="flex gap-2">
      <li
        v-for="(menuitem, index) in menuData.items"
        :key="index"
      >
        <a
          v-if="!menuitem.items || !menuitem.items.length"
          :href="menuitem.href || ''"
          :title="menuitem.label || ''"
          class="p-button p-button-text p-button-primary p-button-sm whitespace-nowrap text-white active:bg-header-button-hover hover:surface-hover"
          :class="getBreakpointClass(menuitem)"
        >
          <span class="">
            {{ menuitem.label }}
          </span>
        </a>

        <div v-if="menuitem.items && menuitem.items.length">
          <button
            @click="
              (event) => {
                toggle(event, menuitem.ref)
              }
            "
            tabindex="0"
            class="p-button p-button-text p-button-primary p-button-sm whitespace-nowrap active:bg-header-button-hover hover:surface-hover"
            :class="activeMenu == menuitem.ref && 'surface-hover'"
          >
            <div class="flex flex-row gap-2 text-white items-center">
              <span>
                {{ menuitem.label }}
              </span>
              <i
                class="pi pi-angle-down text-sm"
                :class="activeMenu == menuitem.ref && 'rotate-180'"
              />
            </div>
          </button>
          <OverlayPanel
            unstyled
            :id="menuitem.ref"
            @hide="hideOverlayPanel(menuitem.ref)"
            ref="itemRefs"
            :pt="{
              content: {
                class:
                  'fixed p-0 hidden lg:flex flex-row border surface-border rounded-md surface-0 max-w-[calc(100%-8.5rem)] xl:max-w-6xl 2xl:max-w-screen-xl w-full'
              },
              root: { class: 'left-8 lg:left-[8.5rem] top-12 z-50' }
            }"
          >
            <div
              class="flex flex-col gap-1 border-r surface-border p-3 surface-50 rounded-l-md min-w-56"
            >
              <template
                v-for="(subitem, index) in menuitem.items"
                v-bind:key="index"
              >
                <template v-if="subitem.items">
                  <Button
                    text
                    size="small"
                    :class="{ 'surface-hover': active === index }"
                    class="flex gap-2 justify-between w-full text-nowrap text-left min-w-52"
                    @click="active = index"
                  >
                    <span class="flex gap-2 items-center">
                      {{ subitem.label }}
                      <i :class="subitem.icon"></i>
                    </span>
                    <i class="pi pi-angle-right"></i>
                  </Button>
                </template>
                <template v-else>
                  <a
                    class="p-button p-component p-button-text hover:surface-hover p-button-sm flex gap-2 hover:surface-hover justify-between w-full items-centerm min-w-52"
                    :href="subitem.href"
                    :target="subitem.external ? '_blank' : '_self'"
                  >
                    <span class="w-full flex gap-2 items-center justify-between">
                      {{ subitem.label }}
                      <i
                        :class="subitem.icon"
                        class="text-sm"
                      ></i>
                    </span>
                  </a>
                </template>
              </template>
            </div>

            <TabView
              v-model:activeIndex="active"
              :pt="{ navContainer: { class: 'hidden' }, root: { class: 'w-full' } }"
            >
              <TabPanel
                v-for="(subitem, jIndex) in menuitem.items"
                :key="jIndex"
              >
                <div
                  v-if="subitem.overline"
                  class="pt-3 pl-6 pr-3 max-w-[627px] w-full"
                >
                  <Overline :label="subitem.overline" />
                </div>
                <div class="flex flex-row justify-between min-h-56 min-w-full">
                  <ul
                    class="grid m-0 p-3 h-fit min-h-20 w-full"
                    :class="
                      menuitem.rightBlock
                        ? 'grid-cols-1 xl:grid-cols-2 max-w-[627px]'
                        : 'grid-cols-2 xl:grid-cols-3'
                    "
                  >
                    <li
                      v-for="(link, index) in subitem.items"
                      :key="index"
                      class="flex flex-col gap-2"
                    >
                      <a
                        v-bind="link.href ? { href: link.href } : {}"
                        :title="link.label"
                        class="p-button p-button-text p-button-sm w-full p-3 flex flex-col justify-start items-start"
                        :class="
                          link.href ? 'hover:surface-hover' : 'cursor-default hover:bg-inherit'
                        "
                      >
                        <div class="flex gap-3">
                          <div v-if="link.icon">
                            <span class="py-1 px-1.5 flex rounded-md surface-200">
                              <i
                                :class="link.icon"
                                class="text-xs"
                              ></i>
                            </span>
                          </div>
                          <div class="flex flex-col gap-1">
                            <div class="flex gap-2 items-center min-h-[1.625rem]">
                              <p class="text-left font-medium">
                                {{ link.label }}
                              </p>
                              <template v-if="link.tag">
                                <Tag
                                  :value="link.tag"
                                  severity="primary"
                                />
                              </template>
                            </div>
                            <p
                              v-if="link.description"
                              class="font-normal text-xs text-color-secondary text-left"
                            >
                              {{ link.description }}
                            </p>
                          </div>
                        </div>
                      </a>
                      <div
                        class="flex flex-col gap-2"
                        :class="{ 'pl-9': link.overline }"
                        v-if="link.subitems"
                      >
                        <template v-if="!link.overline">
                          <ul
                            class="pb-3"
                            :class="{ 'pl-9': link.icon }"
                          >
                            <li
                              v-for="(sublink, subIndex) in link.subitems.length >= 4
                                ? [
                                    ...link.subitems.slice(0, 3),
                                    link.subitems[link.subitems.length - 1]
                                  ]
                                : link.subitems"
                              :key="subIndex"
                              class="flex flex-col gap-2"
                            >
                              <a
                                :href="sublink.href"
                                :title="sublink.label"
                                class="w-full p-button p-button-sm text-xs"
                                :class="[
                                  sublink.isLink
                                    ? 'p-button-link hover:underline'
                                    : 'hover:surface-hover text-color p-button-text',
                                  sublink.isLink && link.subitems.length <= 4 ? 'hidden' : ''
                                ]"
                              >
                                <p class="text-left font-medium">
                                  {{ sublink.label }}
                                </p>
                              </a>
                            </li>
                          </ul>
                        </template>
                        <template v-else>
                          <template v-if="link.overline">
                            <Overline
                              :label="link.overline"
                              class="px-[10.5px]"
                            />
                          </template>
                          <ul>
                            <li
                              v-for="(sublink, subIndex) in link.subitems"
                              :key="subIndex"
                              class="flex- flex-col gap-2"
                            >
                              <a
                                :href="sublink.href"
                                :title="sublink.label"
                                class="w-full p-button p-button-text hover:surface-hover p-button-sm text-xs hover:surface-hover"
                              >
                                <div class="flex gap-3">
                                  <div v-if="sublink.icon">
                                    <span class="py-1 px-1.5 flex rounded-md surface-200">
                                      <i
                                        :class="sublink.icon"
                                        class="text-xs"
                                      ></i>
                                    </span>
                                  </div>
                                  <div>
                                    <p class="text-left font-medium">
                                      {{ sublink.label }}
                                    </p>
                                  </div>
                                </div>
                              </a>
                            </li>
                          </ul>
                        </template>
                      </div>
                    </li>
                  </ul>
                  <div
                    v-if="menuitem.rightBlock"
                    class="border-l surface-border p-6 gap-3 flex-col min-h-52 hidden lg:flex w-full max-w-[340px] surface-50 rounded-r-md"
                  >
                    <div v-if="menuitem.rightBlock.type === 'cases'">
                      <Overline
                        :label="menuitem.rightBlock.label"
                        class="mb-6 flex"
                      />
                      <div class="flex flex-col gap-4 m-0 w-full">
                        <article
                          v-for="(block, idx) in menuitem.rightBlock.items"
                          :key="idx"
                          class="flex gap-4 w-full"
                        >
                          <div class="w-full">
                            <a
                              :href="block.link.href"
                              target="_blank"
                              :title="block.link.label"
                              class="flex gap-4 group"
                            >
                              <figure
                                class="mb-4 overflow-hidden rounded border surface-border h-fit w-[280px] grayscale group-hover:grayscale-0"
                              >
                                <img
                                  :src="`${block.img.src}`"
                                  :alt="block.img.alt"
                                  class="w-full"
                                  lazy
                                />
                              </figure>
                              <div class="w-full flex flex-col">
                                <p class="text-xs leading-relaxed text-color-secondary">
                                  {{ block.description }}
                                </p>
                                <p class="p-button p-button-link p-button-sm px-0">
                                  {{ block.link.label }}
                                  <i class="pi pi-angle-right"></i>
                                </p>
                              </div>
                            </a>
                          </div>
                        </article>
                      </div>
                    </div>

                    <div v-if="menuitem.rightBlock.type === 'featured'">
                      <Overline
                        :label="menuitem.rightBlock.label"
                        class="mb-6 flex"
                      />
                      <div class="grid gap-4 m-0 w-full">
                        <a
                          :href="block.link.href"
                          :title="block.link.label"
                          v-for="(block, idx) in menuitem.rightBlock.items"
                          :key="idx"
                          class="w-full"
                        >
                          <figure
                            class="w-[160px] h-[90px] mb-4 overflow-hidden rounded border surface-border"
                          >
                            <img
                              :src="`${block.img.src}`"
                              :alt="block.img.alt"
                              class="w-full"
                              width="160"
                              height="90"
                              lazy
                            />
                          </figure>
                          <div class="w-full flex flex-col gap-1">
                            <p class="text-base font-medium text-color mb-2 leading-normal">
                              {{ block.title }}
                            </p>
                            <p class="text-xs text-color-secondary leading-relaxed">
                              {{ block.description }}
                            </p>
                            <p class="p-button p-button-link p-button-sm px-0">
                              {{ block.link.label }}
                              <i class="pi pi-angle-right"></i>
                            </p>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPanel>
            </TabView>
          </OverlayPanel>
        </div>
      </li>
    </ul>
  </nav>
</template>

<script setup>
  import { ref } from 'vue'
  import Button from 'primevue/button'
  import OverlayPanel from 'primevue/overlaypanel'
  import TabView from 'primevue/tabview'
  import TabPanel from 'primevue/tabpanel'
  import Tag from 'primevue/tag'
  import Overline from 'azion-webkit/overline'

  const props = defineProps({
    menuData: {
      type: Object
    }
  })

  const { menuData } = props
  const active = ref(0)
  const activeMenu = ref(null)
  let itemRefs = ref([])

  const hideOverlayPanel = (refAttr) => {
    if (refAttr === activeMenu.value) setMenuState(refAttr)
  }

  const setMenuState = (refAttr) => {
    activeMenu.value = activeMenu.value == refAttr ? null : refAttr
  }

  const toggle = (event, refAttr) => {
    try {
      if (refAttr) {
        active.value = 0
        const activeTab = itemRefs.value.find((i) => i.$params.attrs.id === refAttr)
        activeTab.toggle(event)

        setMenuState(refAttr)
      }
    } catch (error) {
      console.error('Error in toggle method:', error)
    }
  }

  const getBreakpointClass = (menu) => {
    const breakpoint = menu?.minBreakpoint
    if (!breakpoint) return ''

    const breakpoints = {
      sm: 'block',
      md: 'hidden md:block',
      lg: 'hidden lg:block',
      xl: 'hidden xl:block',
      '2xl': 'hidden 2xl:block'
    }

    return breakpoints[breakpoint] || ''
  }
</script>
