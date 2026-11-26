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
								:version="version"
								:stage-labels="menuStageLabels"
								:version-labels="menuVersionLabels"
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
					<div class="flex w-full flex-col gap-(--spacing-sm)">
						<!-- The version row is the theme row's twin: label left, control right, same height. -->
						<div
							v-if="menuGroups?.length && $slots['version-select']"
							class="flex w-full items-center justify-between"
						>
							<span class="pl-(--spacing-sm) text-label-md text-(--text-default)">
								{{ versionLabel }}
							</span>
							<slot name="version-select" />
						</div>
						<div class="flex w-full items-center justify-between">
							<span class="pl-(--spacing-sm) text-label-md text-(--text-default)">
								{{ themeLabel }}
							</span>
							<DropdownThemeSwitcher />
						</div>
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
import type { PlatformVersion, Stage } from '~/nav/versions';

defineSlots<{
	/** The drawer's scrolling body, below the menus. */
	'main-content'(): unknown;
	/** The version select, in the footer above the theme switcher. */
	'version-select'(): unknown;
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
		/** Words for the menu's stage tags, in the language of the page. */
		menuStageLabels?: Record<Stage, string>;
		/** Short names for the menu's version tags (`v3.x`). */
		menuVersionLabels?: Record<PlatformVersion, string>;
		directoryGroups?: MenuGroupNode[] | null;
		directoryAriaLabel?: string;
		/** Label beside the theme switcher in the footer. */
		themeLabel?: string;
		/** Label beside the version select in the footer. */
		versionLabel?: string;
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
		menuStageLabels: () => ({
			experimental: 'Experimental',
			preview: 'Preview',
			deprecated: 'Deprecated',
		}),
		menuVersionLabels: () => ({ v3: 'v3.x', v4: 'v4.x' }),
		directoryGroups: null,
		directoryAriaLabel: 'Directory',
		themeLabel: 'Theme',
		versionLabel: 'Version',
	}
);

const open = ref(false);

// The drawer mounts away from the rail, so it follows the choice through what the composable
// reflects on <html> (set before paint and on every change).
const version = ref<PlatformVersion>('v4');
let watcher: MutationObserver | null = null;

function readVersion() {
	const value = document.documentElement.getAttribute('data-platform-version');
	version.value = value === 'v3' || value === 'v4' ? value : 'v4';
}

function onPaletteOpen() {
	open.value = false;
}

onMounted(() => {
	window.addEventListener('docs:palette-open', onPaletteOpen);
	readVersion();
	watcher = new MutationObserver(readVersion);
	watcher.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ['data-platform-version'],
	});
});

onBeforeUnmount(() => {
	window.removeEventListener('docs:palette-open', onPaletteOpen);
	watcher?.disconnect();
});
</script>
