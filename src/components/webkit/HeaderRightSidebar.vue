<template>
	<!-- eslint-disable webkit/no-style-override -- placement in the header's flex
	     row (hidden from `lg` up), not a restyle of the button. -->
	<IconButton
		icon="pi pi-bars"
		aria-label="Open documentation navigation"
		kind="outlined"
		size="medium"
		class="lg:hidden flex-none"
		@click="open = true"
	/>
	<!-- eslint-enable webkit/no-style-override -->

	<Drawer
		v-model:open="open"
		side="left"
		size="small"
	>
		<DrawerPortal>
			<DrawerOverlay />
			<DrawerContent>
				<!-- eslint-disable webkit/no-style-override -- the drawer owns whether its
				     header shows at this width; that is layout, not styling. -->
				<PanelHeader class="hidden w-full md:flex">
				<!-- eslint-enable webkit/no-style-override -->
					<DrawerTitle>Documentation</DrawerTitle>
					<DrawerClose />
				</PanelHeader>

				<div class="min-h-0 w-full grow overflow-y-auto p-(--spacing-md) text-body-sm">
					<DocsSidebarFilter
						v-model="filter"
						class="mb-(--spacing-sm)"
						:header="menuHeader"
						:placeholder="menuFilterPlaceholder"
						:hotkey="open"
					/>

					<DocsSidebarMenu
						v-if="menuGroups?.length"
						:groups="menuGroups"
						:active-id="menuActiveId"
						:initial-expanded="menuExpanded"
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
										class="px-2 py-2 text-label-sm font-medium uppercase tracking-wider text-muted"
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
											<span class="ml-2 font-medium text-label-md">
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
					<!-- eslint-disable webkit/no-style-override -- lets the footer's own
					     buttons wrap onto a second row on a narrow drawer. -->
					<PanelFooter class="w-full flex-wrap gap-2">
					<!-- eslint-enable webkit/no-style-override -->
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

<script setup lang="ts">
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

	import type { MenuGroupNode, SidebarHeader as SidebarHeaderModel } from '~/nav/resolve'

	/** A link row in the secondary menu, or a group heading that owns rows. */
	interface MenuEntry {
		label?: string
		url?: string
		urlTitle?: string
		target?: string
		icon?: string
		tags?: string[]
		items?: MenuEntry[]
	}

	/** A call to action in the drawer footer. `destak` is the legacy emphasis flag. */
	interface BottomButton {
		label?: string
		url?: string
		urlTitle?: string
		icon?: string
		severity?: string
		destak?: boolean
	}

	function bottomButtonKind(button: BottomButton) {
		if (button.severity === 'info') return 'outlined'

		return button.destak ? 'primary' : 'outlined'
	}

	defineSlots<{
		/** The drawer's scrolling body, above the secondary menu. */
		'main-content'(): unknown
	}>()

	const props = withDefaults(
		defineProps<{
			menuSecondary?: MenuEntry[]
			bottomButtons?: BottomButton[]
			menuGroups?: MenuGroupNode[] | null
			menuActiveId?: string
			menuExpanded?: string[]
			menuAriaLabel?: string
			menuHeader?: SidebarHeaderModel | null
			menuFilterPlaceholder?: string
			menuNoMatchesLabel?: string
			directoryGroups?: MenuGroupNode[] | null
			directoryAriaLabel?: string
		}>(),
		{
			menuSecondary: undefined,
			bottomButtons: undefined,
			menuGroups: null,
			menuActiveId: '',
			menuExpanded: () => [],
			menuAriaLabel: 'Menu',
			menuHeader: null,
			menuFilterPlaceholder: 'Filter sidebar',
			menuNoMatchesLabel: 'No rows match.',
			directoryGroups: null,
			directoryAriaLabel: 'Directory',
		},
	)

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
