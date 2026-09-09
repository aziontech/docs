<template>
	<IconButton
		icon="pi pi-bars"
		aria-label="Open documentation navigation"
		kind="outlined"
		size="medium"
		class="lg:hidden flex-none"
		@click="open = true"
	/>

	<Drawer
		v-model:open="open"
		side="left"
		size="small"
	>
		<DrawerPortal>
			<DrawerOverlay />
			<DrawerContent>
				<PanelHeader class="hidden w-full md:flex">
					<DrawerTitle>Documentation</DrawerTitle>
					<DrawerClose />
				</PanelHeader>

				<div class="min-h-0 w-full grow overflow-y-auto p-(--spacing-md) text-sm">
					<DocsSidebarFilter
						v-model="filter"
						class="mb-(--spacing-sm)"
						:placeholder="menuFilterPlaceholder"
						:hotkey="open"
					/>

					<DocsSidebarMenu
						v-if="menuGroups?.length"
						:groups="menuGroups"
						:active-id="menuActiveId"
						:initial-expanded="menuExpanded"
						:initial-path="menuPath"
						:back-label="menuBackLabel"
						:aria-label="menuAriaLabel"
						:filter="filter"
						:no-matches-label="menuNoMatchesLabel"
					/>

					<DocsSidebarMenu
						v-if="directoryGroups?.length"
						:groups="directoryGroups"
						:aria-label="directoryAriaLabel"
						class="mt-(--spacing-md)"
					/>

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

	import DocsSidebarFilter from '~/components/webkit/DocsSidebarFilter.vue'
	import DocsSidebarMenu from '~/components/webkit/DocsSidebarMenu.vue'
	import Tag from '~/components/webkit/Tag.vue'

	function bottomButtonKind(button) {
		if (button.severity === 'info') return 'outlined'

		return button.destak ? 'primary' : 'outlined'
	}

	let props = defineProps({
		menuSecondary: Array,
		bottomButtons: Array,
		menuGroups: { type: Array, default: null },
		menuActiveId: { type: String, default: '' },
		menuExpanded: { type: Array, default: () => [] },
		menuAriaLabel: { type: String, default: 'Menu' },
		menuPath: { type: Array, default: () => [] },
		menuBackLabel: { type: String, default: '' },
		menuFilterPlaceholder: { type: String, default: 'Filter sidebar' },
		menuNoMatchesLabel: { type: String, default: 'No rows match.' },
		directoryGroups: { type: Array, default: null },
		directoryAriaLabel: { type: String, default: 'Directory' }
	})

	const { menuSecondary, bottomButtons } = props
	const open = ref(false)
	const filter = ref('')

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
