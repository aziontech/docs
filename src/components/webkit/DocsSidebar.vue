<template>
	<Sidebar
		ref="sidebarRef"
		v-model:collapsed="collapsed"
		v-model:width="width"
		resizable
		collapsible
		:aria-label="ariaLabel"
		class="h-full w-(--rail-w)"
		:style="railWidthStyle"
	>
		<template #header>
			<SidebarHeader class="pt-(--spacing-sm)">
				<DocsSidebarFilter
					v-model="filter"
					:header="header"
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
			:filter="filter"
			:no-matches-label="noMatchesLabel"
		/>
	</Sidebar>
</template>

<script setup>
	import Sidebar from '@aziontech/webkit/sidebar';
	import SidebarHeader from '@aziontech/webkit/sidebar-header';
	import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

	import DocsSidebarFilter from './DocsSidebarFilter.vue';
	import DocsSidebarMenu from './DocsSidebarMenu.vue';

	defineProps({
		groups: { type: Array, required: true },
		activeId: { type: String, default: '' },
		initialExpanded: { type: Array, default: () => [] },
		header: { type: Object, default: null },
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
				: 'var(--container-xs)'
	}));

	const railQuery =
		typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)') : null;
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
