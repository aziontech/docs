<template>
	<Sidebar
		ref="sidebarRef"
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
		/>

		<template #footer>
			<DropdownThemeSwitcher />
		</template>
	</Sidebar>
</template>

<script setup lang="ts">
import Sidebar from '@aziontech/webkit/sidebar';
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import DocsSidebarMenu from './DocsSidebarMenu.vue';
import DropdownThemeSwitcher from './DropdownThemeSwitcher.vue';

import type { MenuGroupNode, SidebarHeader as SidebarHeaderModel } from '~/nav/resolve';

withDefaults(
	defineProps<{
		groups: MenuGroupNode[];
		activeId?: string;
		initialExpanded?: string[];
		header?: SidebarHeaderModel | null;
		ariaLabel?: string;
		filterPlaceholder?: string;
		noMatchesLabel?: string;
	}>(),
	{
		activeId: '',
		initialExpanded: () => [],
		header: null,
		ariaLabel: 'Sidebar',
		filterPlaceholder: 'Filter sidebar',
		noMatchesLabel: 'No rows match.',
	}
);

const filter = ref('');

const COLLAPSED_KEY = 'docs-sidebar-collapsed';
const WIDTH_KEY = 'docs-sidebar-width';

const collapsed = ref(false);
const width = ref<number | null>(null);
/** The webkit `Sidebar` instance; only its `measure()` affordance is used. */
const sidebarRef = ref<{ measure?: () => void } | null>(null);

const railQuery = typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)') : null;
const isRail = ref(false);
const remeasure = () => {
	isRail.value = Boolean(railQuery?.matches);
	if (width.value != null) return;
	nextTick(() => sidebarRef.value?.measure?.());
};

onMounted(() => {
	try {
		collapsed.value = localStorage.getItem(COLLAPSED_KEY) === 'true';
		const stored = Number(localStorage.getItem(WIDTH_KEY));
		if (Number.isFinite(stored) && stored > 0) width.value = stored;
	} catch {
		// storage unavailable
	}
	remeasure();
	railQuery?.addEventListener('change', remeasure);
});

onBeforeUnmount(() => {
	railQuery?.removeEventListener('change', remeasure);
});

watch(collapsed, (value) => {
	try {
		localStorage.setItem(COLLAPSED_KEY, String(value));
	} catch {
		// storage unavailable
	}
});

watch(width, (value) => {
	if (value == null) return;
	try {
		localStorage.setItem(WIDTH_KEY, String(Math.round(value)));
	} catch {
		// storage unavailable
	}
});
</script>
