<template>
	<Sidebar
		v-model:collapsed="collapsed"
		v-model:width="width"
		resizable
		collapsible
		:aria-label="ariaLabel"
	>
		<DocsSidebarMenu
			presentation
			:groups="groups"
			:active-id="activeId"
			:initial-expanded="initialExpanded"
			:filter="filter"
			:no-matches-label="noMatchesLabel"
			:catalog-groups="catalogGroups"
			:trees-href="treesHref"
			:back-label="backLabel"
			:back-to-pattern="backToPattern"
			:level-label="header?.title ?? ''"
			:level-href="header?.href ?? ''"
			:back-href="header?.backHref ?? ''"
			:parent-level="parentLevel"
		/>

		<template #footer>
			<DropdownThemeSwitcher />
		</template>
	</Sidebar>
</template>

<script setup lang="ts">
import Sidebar from '@aziontech/webkit/sidebar';
import { nextTick, onMounted, ref, watch } from 'vue';

import DocsSidebarMenu from './DocsSidebarMenu.vue';
import DropdownThemeSwitcher from './DropdownThemeSwitcher.vue';

import type {
	MenuGroupNode,
	SidebarHeader as SidebarHeaderModel,
	SidebarParent,
} from '~/nav/resolve';

withDefaults(
	defineProps<{
		groups: MenuGroupNode[];
		activeId?: string;
		initialExpanded?: string[];
		header?: SidebarHeaderModel | null;
		ariaLabel?: string;
		filterPlaceholder?: string;
		noMatchesLabel?: string;
		catalogGroups?: MenuGroupNode[] | null;
		treesHref?: string;
		backLabel?: string;
		backToPattern?: string;
		parentLevel?: SidebarParent | null;
	}>(),
	{
		activeId: '',
		initialExpanded: () => [],
		header: null,
		ariaLabel: 'Sidebar',
		filterPlaceholder: 'Filter sidebar',
		noMatchesLabel: 'No rows match.',
		catalogGroups: null,
		treesHref: '',
		backLabel: '',
		backToPattern: 'Back to {name}',
		parentLevel: null,
	}
);

const filter = ref('');

// Also read before the rail paints, by the inline script in LeftSidebar.astro.
const COLLAPSED_KEY = 'docs-sidebar-collapsed';
const WIDTH_KEY = 'docs-sidebar-width';

/** The rail's width until the reader drags it; the unhydrated wrapper in BaseLayout seeds the same token. */
const DEFAULT_WIDTH_TOKEN = '--container-2xs';
const DEFAULT_WIDTH_FALLBACK = 300;

const readDefaultWidth = () => {
	const value = Number.parseFloat(
		getComputedStyle(document.documentElement).getPropertyValue(DEFAULT_WIDTH_TOKEN)
	);
	return Number.isFinite(value) && value > 0 ? value : DEFAULT_WIDTH_FALLBACK;
};

// Both start at what the server rendered, so hydration matches; the reader's own state lands in
// the mount tick, which the rail applies without motion.
const collapsed = ref(false);
const width = ref<number | null>(null);

/** Off while the mount restores state, so only the reader's own drags and collapses are stored. */
let persisting = false;

onMounted(() => {
	let stored = 0;
	try {
		collapsed.value = localStorage.getItem(COLLAPSED_KEY) === 'true';
		stored = Number(localStorage.getItem(WIDTH_KEY));
	} catch {
		// storage unavailable
	}
	// Always a set width: left null, the rail would size to its rows once the wrapper stops seeding it.
	width.value = Number.isFinite(stored) && stored > 0 ? stored : readDefaultWidth();
	nextTick(() => {
		persisting = true;
	});
});

watch(collapsed, (value) => {
	if (!persisting) return;
	try {
		localStorage.setItem(COLLAPSED_KEY, String(value));
	} catch {
		// storage unavailable
	}
});

watch(width, (value) => {
	if (!persisting || value == null) return;
	try {
		localStorage.setItem(WIDTH_KEY, String(Math.round(value)));
	} catch {
		// storage unavailable
	}
});
</script>
