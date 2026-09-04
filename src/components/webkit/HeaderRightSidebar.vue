<template>
	<!-- open sidebar button -->
	<IconButton
		icon="pi pi-bars"
		aria-label="Open documentation navigation"
		kind="outlined"
		size="medium"
		class="lg:hidden flex-none"
		@click="open = true"
	/>

	<!-- The DS Drawer owns what the old Teleport/mask/aside did by hand: the
	     portal, the backdrop, Escape and backdrop-click dismissal, scroll lock
	     and focus return. `side="left"`/`size="small"` as in the webkit docs
	     sample (DocsLayout.vue). -->
	<Drawer
		v-model:open="open"
		side="left"
		size="small"
	>
		<DrawerPortal>
			<DrawerOverlay />
			<DrawerContent>
				<!-- No header on a phone: closing happens by tapping the backdrop,
				     pressing Escape, or picking a page. `hidden` rather than
				     removed — DrawerContent names the dialog via `aria-labelledby`
				     pointing at this title, so the sheet keeps its accessible name
				     even while the title itself is visually hidden. -->
				<PanelHeader class="hidden w-full md:flex">
					<DrawerTitle>Documentation</DrawerTitle>
					<DrawerClose />
				</PanelHeader>

				<div class="min-h-0 w-full grow overflow-y-auto p-(--spacing-md) text-sm">
					<!-- The docs navigation tree, as a direct Vue child rather than
					     slotted Astro content: an astro-island nested inside this
					     island's slot arrives through <template>/innerHTML and never
					     hydrates, so the drawer menu is passed in as data instead. -->
					<DocsSidebarMenu
						v-if="menuGroups?.length"
						:groups="menuGroups"
						:active-id="menuActiveId"
						:initial-expanded="menuExpanded"
						:aria-label="menuAriaLabel"
					/>

					<!-- slot to receive custom menu -->
					<slot name="main-content" />

					<template v-if="menuSecondary">
						<div
							class="my-8 w-full border-t border-t-[var(--border-default)]"
							role="separator"
						></div>
						<div class="w-full p-0 bg-transparent">
							<ul
								class="list-none p-0 m-0"
								role="menu"
							>
								<template
									v-for="(entry, entryIndex) in menuSecondary"
									:key="entryIndex"
								>
									<li
										v-if="entry.items && entry.label"
										class="px-2 py-2 text-xs font-medium uppercase tracking-wider text-muted"
									>
										{{ entry.label }}
									</li>
									<li
										v-for="(item, itemIndex) in entry.items || [entry]"
										:key="itemIndex"
										role="menuitem"
									>
										<a
											v-if="item.url"
											:target="item.target"
											:href="item.url"
											class="p-2 flex gap-2 items-center no-underline rounded-[var(--shape-elements)] text-default hover:bg-[var(--bg-hover)]"
										>
											<span
												v-if="item.icon"
												:class="item.icon"
											></span>
											<span class="ml-2 font-medium text-sm">
												{{ item.label }}
											</span>
											<Tag
												v-for="tag in item.tags"
												:key="tag"
												:value="tag"
												severity="info"
											/>
										</a>
									</li>
								</template>
							</ul>
						</div>
					</template>
				</div>

				<template v-if="bottomButtons">
					<!--
						`flex-wrap` and the `small` size below keep the three CTAs
						inside the drawer: webkit's `medium` Button carries a
						`min-w-16` that the hand-styled anchors did not have, which
						pushed the row past the drawer on mobile.
					-->
					<PanelFooter class="w-full flex-wrap gap-2">
						<Button
							v-for="(button, index) in bottomButtons"
							:key="index"
							:label="button.label"
							:href="button.url"
							:title="button.urlTitle"
							:icon="button.icon"
							:kind="bottomButtonKind(button)"
							size="small"
						/>
					</PanelFooter>
				</template>
			</DrawerContent>
		</DrawerPortal>
	</Drawer>
</template>

<script setup>
	import { onBeforeUnmount, onMounted, ref } from 'vue'

	import Button from '@aziontech/webkit/button'
	import Drawer from '@aziontech/webkit/drawer'
	import DrawerClose from '@aziontech/webkit/drawer-close'
	import DrawerContent from '@aziontech/webkit/drawer-content'
	import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
	import DrawerPortal from '@aziontech/webkit/drawer-portal'
	import DrawerTitle from '@aziontech/webkit/drawer-title'
	import IconButton from '@aziontech/webkit/icon-button'
	import PanelFooter from '@aziontech/webkit/panel-footer'
	import PanelHeader from '@aziontech/webkit/panel-header'

	import DocsSidebarMenu from '~/components/webkit/DocsSidebarMenu.vue'
	import Tag from '~/components/webkit/Tag.vue'

	/*
		`severity: 'info'` has no counterpart among webkit's kinds (theme@4's
		`--info` is a tinted surface, not a button kind), so it falls back to
		`outlined` like everywhere else in this repo.
	*/
	function bottomButtonKind(button) {
		if (button.severity === 'info') return 'outlined'

		return button.destak ? 'primary' : 'outlined'
	}

	let props = defineProps({
		menuData: Object,
		menuSecondary: Array,
		bottomButtons: Array,
		menuGroups: { type: Array, default: null },
		menuActiveId: { type: String, default: '' },
		menuExpanded: { type: Array, default: () => [] },
		menuAriaLabel: { type: String, default: 'Menu' }
	})

	const { menuSecondary, bottomButtons } = props
	const open = ref(false)

	// The search palette is a separate island; when it opens, this drawer must
	// close — two stacked overlays would trap focus in the bottom one. The
	// sample expresses this as a watch inside one SPA; across islands it is a
	// window event (dispatched by webkit/HeaderSearchDialog.vue).
	function onPaletteOpen() {
		open.value = false
	}

	onMounted(() => {
		window.addEventListener('docs:palette-open', onPaletteOpen)
	})

	onBeforeUnmount(() => {
		window.removeEventListener('docs:palette-open', onPaletteOpen)
	})
</script>
