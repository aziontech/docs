<template>
	<!--
		Width goes through the `--rail-w` custom property instead of Sidebar's
		own inline width. This entry compiles Tailwind with the `important`
		flag (see main.css), so any `w-*` utility on the aside — including the
		component's built-in `w-full` — beats the inline `width` the rail's
		drag/collapse gestures set. Routing every state (seed, sized, 0 when
		collapsed) through the variable keeps the utility winning while the
		gesture still decides the value. The only casualty is the collapsed
		rail's hover "peek" (an internal inline width), which degrades to the
		expand button alone.
	-->
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
			<SidebarHeader class="flex flex-col gap-(--spacing-sm) pt-(--spacing-sm)">
				<div
					v-if="header"
					class="flex items-center gap-(--spacing-xs)"
				>
					<IconButton
						icon="pi pi-arrow-left"
						kind="outlined"
						size="small"
						:aria-label="header.backLabel"
						:href="header.backHref"
					/>
					<a
						:href="header.href"
						class="truncate text-label-md text-(--text-default) no-underline"
					>
						{{ header.title }}
					</a>
				</div>
				<div ref="filterWrap">
					<InputText
					v-model="filter"
					:placeholder="filterPlaceholder"
					:aria-label="filterPlaceholder"
					size="medium"
				>
					<template #iconRight>
						<Kbd size="small">/</Kbd>
					</template>
					</InputText>
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

<script setup>
	/**
	 * The desktop docs rail: webkit `Sidebar` (resizable + collapsible, per the
	 * DS reference shell) hosting the navigation tree. `Sidebar` owns the drag /
	 * collapse gestures; this wrapper only persists their outcome, because the
	 * site is an Astro MPA and the component remounts on every navigation.
	 *
	 * `collapsed` and `width` are localStorage (a sizing preference, like the
	 * reference implementation); the fold state lives in DocsSidebarMenu.
	 * Both are read after mount rather than at setup so SSR markup and
	 * hydration agree — the cost is that a collapsed rail renders expanded
	 * until the island hydrates.
	 *
	 * `w-(--container-xs)` (20rem, the previous fixed column) is only the
	 * natural width the rail is seeded with before the reader ever drags it;
	 * once sized, the persisted width takes over.
	 */
	import IconButton from '@aziontech/webkit/icon-button';
	import InputText from '@aziontech/webkit/input-text';
	import Kbd from '@aziontech/webkit/kbd';
	import Sidebar from '@aziontech/webkit/sidebar';
	import SidebarHeader from '@aziontech/webkit/sidebar-header';
	import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

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
	const filterWrap = ref(null);

	// `/` jumps to the filter from anywhere on the page that is not already a field.
	function onSlash(event) {
		if (!railQuery?.matches) return;
		if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;
		const target = event.target;
		if (target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
		const input = filterWrap.value?.querySelector('input');
		if (!input) return;
		event.preventDefault();
		input.focus();
	}

	const COLLAPSED_KEY = 'docs-sidebar-collapsed';
	const WIDTH_KEY = 'docs-sidebar-width';

	const collapsed = ref(false);
	const width = ref(null);
	const sidebarRef = ref(null);

	// See the template comment: the rail's width, in every state, expressed as
	// the variable `w-(--rail-w)` reads. `--container-xs` (20rem, the previous
	// fixed column) is the natural width before the reader ever drags it.
	const railWidthStyle = computed(() => ({
		'--rail-w': collapsed.value
			? '0px'
			: width.value != null
				? `${width.value}px`
				: 'var(--container-xs)'
	}));

	// `Sidebar` seeds `width` from its natural width on mount — but the aside
	// is `display: none` below `lg`, and Astro may hydrate this island while
	// the rail is hidden (narrow window, background tab), leaving the model
	// null and the drag/collapse gestures without a width to work from. The
	// spec's answer is the exposed `measure()`: re-run it when the rail
	// becomes visible.
	const railQuery =
		typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)') : null;
	const remeasure = () => {
		if (width.value != null) return;
		nextTick(() => sidebarRef.value?.measure?.());
	};

	onMounted(() => {
		try {
			collapsed.value = localStorage.getItem(COLLAPSED_KEY) === 'true';
			const stored = Number(localStorage.getItem(WIDTH_KEY));
			if (Number.isFinite(stored) && stored > 0) width.value = stored;
		} catch {
			// localStorage unavailable — the rail just starts at its natural width.
		}
		remeasure();
		railQuery?.addEventListener('change', remeasure);
		window.addEventListener('keydown', onSlash);
	});

	onBeforeUnmount(() => {
		railQuery?.removeEventListener('change', remeasure);
		window.removeEventListener('keydown', onSlash);
	});

	watch(collapsed, (value) => {
		try {
			localStorage.setItem(COLLAPSED_KEY, String(value));
		} catch {
			// ignore
		}
	});

	watch(width, (value) => {
		if (value == null) return;
		try {
			localStorage.setItem(WIDTH_KEY, String(Math.round(value)));
		} catch {
			// ignore
		}
	});
</script>
