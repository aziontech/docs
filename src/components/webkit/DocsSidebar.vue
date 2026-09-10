<template>
	<!-- eslint-disable webkit/no-style-override -- `--rail-w` IS the collapse
	     mechanism: the computed style drives the width the rail animates to, and
	     the class is what consumes it. Composing this inside a slot is not
	     possible, so the override stays, deliberately and in one place. -->
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
	<!-- eslint-enable webkit/no-style-override -->
		<template #header>
			<SidebarHeader>
				<div class="pt-(--spacing-sm)">
					<DocsSidebarFilter
						v-model="filter"
						:header="header"
						:placeholder="filterPlaceholder"
						:hotkey="isRail"
					/>
				</div>
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

<script setup lang="ts">
	import Sidebar from '@aziontech/webkit/sidebar';
	import SidebarHeader from '@aziontech/webkit/sidebar-header';
	import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

	import DocsSidebarFilter from './DocsSidebarFilter.vue';
	import DocsSidebarMenu from './DocsSidebarMenu.vue';

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
		},
	);

	const filter = ref('');

	const COLLAPSED_KEY = 'docs-sidebar-collapsed';
	const WIDTH_KEY = 'docs-sidebar-width';

	const collapsed = ref(false);
	const width = ref<number | null>(null);
	/** The webkit `Sidebar` instance; only its `measure()` affordance is used. */
	const sidebarRef = ref<{ measure?: () => void } | null>(null);

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
