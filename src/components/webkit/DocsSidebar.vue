<template>
	<Sidebar
		ref="sidebarRef"
		v-model:collapsed="collapsed"
		v-model:width="width"
		resizable
		collapsible
		:aria-label="ariaLabel"
		class="docs-sidebar h-full w-(--rail-w)"
		:style="railWidthStyle"
	>
		<!-- The filter is ours, not the reference's: it stays by decision (Sep 9 2026). -->
		<template #header>
			<SidebarHeader class="pt-(--spacing-sm)">
				<DocsSidebarFilter
					v-model="filter"
					:placeholder="filterPlaceholder"
					:hotkey="isRail"
				/>
			</SidebarHeader>
		</template>

		<DocsSidebarMenu
			presentation
			:groups="groups"
			:active-id="activeId"
			:initial-expanded="initialExpanded"
			:initial-path="initialPath"
			:back-label="backLabel"
			:filter="filter"
			:no-matches-label="noMatchesLabel"
		/>

		<template #footer>
			<ThemeSwitcher />
		</template>
	</Sidebar>
</template>

<script setup>
	import Sidebar from '@aziontech/webkit/sidebar';
	import SidebarHeader from '@aziontech/webkit/sidebar-header';
	import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

	import DocsSidebarFilter from './DocsSidebarFilter.vue';
	import DocsSidebarMenu from './DocsSidebarMenu.vue';
	import ThemeSwitcher from './DropdownThemeSwitcher.vue';

	defineProps({
		groups: { type: Array, required: true },
		activeId: { type: String, default: '' },
		initialExpanded: { type: Array, default: () => [] },
		initialPath: { type: Array, default: () => [] },
		backLabel: { type: String, default: '' },
		ariaLabel: { type: String, default: 'Sidebar' },
		filterPlaceholder: { type: String, default: 'Filter sidebar' },
		noMatchesLabel: { type: String, default: 'No rows match.' }
	});

	const filter = ref('');

	const COLLAPSED_KEY = 'docs-sidebar-collapsed';
	const WIDTH_KEY = 'docs-sidebar-width';

	const collapsed = ref(false);
	const width = ref(null);
	const sidebarRef = ref(null);

	const railWidthStyle = computed(() => ({
		'--rail-w': collapsed.value
			? '0px'
			: width.value != null
				? `${width.value}px`
				: 'var(--container-2xs)'
	}));

	const railQuery =
		typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)') : null;
	/** Whether this rail is the one on screen, so only it answers the `/` hotkey. */
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

<style>
	/* The reference rail closes with one 56px band — theme switcher, then the collapse control —
	   flush with the rail's edges. webkit 4.4.0 pads the footer region and stacks a bordered band
	   inside it; these two rules flatten that to the reference geometry. Drop when webkit is bumped.
	   main.css imports Tailwind with `important`, and an important declaration in an EARLIER layer
	   outranks one in a later layer — hence `components` (before `utilities`) plus `!important`. */
	@layer components {
		.docs-sidebar [data-testid='layout-sidebar__footer'] {
			padding: 0 var(--spacing-md) !important;
		}

		.docs-sidebar [data-testid='layout-sidebar__footer'] > div {
			height: var(--size-14) !important;
			padding-top: 0 !important;
			border-color: var(--border-default) !important;
		}
	}
</style>
