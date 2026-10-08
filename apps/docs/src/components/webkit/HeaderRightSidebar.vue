<template>
	<!-- Placement in the header's flex row (hidden from `lg` up) lives on this box;
	     the button itself is untouched. -->
	<div class="flex-none lg:hidden">
		<IconButton
			icon="pi pi-bars"
			aria-label="Open documentation navigation"
			kind="outlined"
			size="medium"
			@click="open = true"
		/>
	</div>

	<Drawer v-model:open="open" side="left" size="small">
		<DrawerPortal>
			<DrawerOverlay />
			<DrawerContent>
				<!-- The drawer owns whether its header shows at this width; the box carries
				     the visibility, the PanelHeader keeps its own layout. -->
				<div class="hidden w-full md:block">
					<PanelHeader>
						<DrawerTitle>Documentation</DrawerTitle>
						<DrawerClose />
					</PanelHeader>
				</div>

				<div class="flex min-h-0 w-full grow flex-col">
					<ScrollArea tabindex="-1">
						<div class="p-(--spacing-md) text-body-sm">
							<DocsSidebarMenu
								v-if="menuGroups?.length"
								:groups="menuGroups"
								:active-id="menuActiveId"
								:initial-expanded="menuExpanded"
								:aria-label="menuAriaLabel"
								:no-matches-label="menuNoMatchesLabel"
								:catalog-groups="menuCatalog"
								:trees-href="menuTreesHref"
								:back-label="menuBackLabel"
								:back-to-pattern="menuBackToPattern"
								:level-label="menuHeader?.title ?? ''"
								:level-href="menuHeader?.href ?? ''"
								:back-href="menuHeader?.backHref ?? ''"
								:parent-level="menuParent"
							/>

							<DocsSidebarMenu
								v-if="directoryGroups?.length"
								:groups="directoryGroups"
								:aria-label="directoryAriaLabel"
								class="mt-(--spacing-md)"
							/>

							<slot name="main-content" />
						</div>
					</ScrollArea>
				</div>

				<PanelFooter>
					<div class="flex w-full items-center justify-between">
						<span class="pl-(--spacing-sm) text-label-md text-(--text-default)">
							{{ themeLabel }}
						</span>
						<DropdownThemeSwitcher />
					</div>
				</PanelFooter>
			</DrawerContent>
		</DrawerPortal>
	</Drawer>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

import Drawer from '@aziontech/webkit/drawer';
import DrawerClose from '@aziontech/webkit/drawer-close';
import DrawerContent from '@aziontech/webkit/drawer-content';
import DrawerOverlay from '@aziontech/webkit/drawer-overlay';
import DrawerPortal from '@aziontech/webkit/drawer-portal';
import DrawerTitle from '@aziontech/webkit/drawer-title';
import IconButton from '@aziontech/webkit/icon-button';
import PanelFooter from '@aziontech/webkit/panel-footer';
import PanelHeader from '@aziontech/webkit/panel-header';
import ScrollArea from '@aziontech/webkit/scroll-area';

import DocsSidebarMenu from '~/components/webkit/DocsSidebarMenu.vue';
import DropdownThemeSwitcher from '~/components/webkit/DropdownThemeSwitcher.vue';

import type {
	MenuGroupNode,
	SidebarHeader as SidebarHeaderModel,
	SidebarParent,
} from '~/nav/resolve';

defineSlots<{
	/** The drawer's scrolling body, below the menus. */
	'main-content'(): unknown;
}>();

withDefaults(
	defineProps<{
		menuGroups?: MenuGroupNode[] | null;
		menuActiveId?: string;
		menuExpanded?: string[];
		menuAriaLabel?: string;
		menuHeader?: SidebarHeaderModel | null;
		/** The root catalog the page's tree sits on, reached through the Back row. */
		menuCatalog?: MenuGroupNode[] | null;
		/** A nested tree's parent level, beneath the page's own tree. */
		menuParent?: SidebarParent | null;
		menuNoMatchesLabel?: string;
		menuTreesHref?: string;
		menuBackLabel?: string;
		menuBackToPattern?: string;
		directoryGroups?: MenuGroupNode[] | null;
		directoryAriaLabel?: string;
		/** Label beside the theme switcher in the footer. */
		themeLabel?: string;
	}>(),
	{
		menuGroups: null,
		menuActiveId: '',
		menuExpanded: () => [],
		menuAriaLabel: 'Menu',
		menuHeader: null,
		menuCatalog: null,
		menuParent: null,
		menuNoMatchesLabel: 'No rows match.',
		menuTreesHref: '',
		menuBackLabel: '',
		menuBackToPattern: 'Back to {name}',
		directoryGroups: null,
		directoryAriaLabel: 'Directory',
		themeLabel: 'Theme',
	}
);

const open = ref(false);

function onPaletteOpen() {
	open.value = false;
}

onMounted(() => {
	window.addEventListener('docs:palette-open', onPaletteOpen);
});

onBeforeUnmount(() => {
	window.removeEventListener('docs:palette-open', onPaletteOpen);
});
</script>
