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
		<DocsSidebarMenu
			presentation
			:groups="groups"
			:active-id="activeId"
			:initial-expanded="initialExpanded"
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
	import Sidebar from '@aziontech/webkit/sidebar';
	import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

	import DocsSidebarMenu from './DocsSidebarMenu.vue';

	defineProps({
		groups: { type: Array, required: true },
		activeId: { type: String, default: '' },
		initialExpanded: { type: Array, default: () => [] },
		ariaLabel: { type: String, default: 'Sidebar' }
	});

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
	});

	onBeforeUnmount(() => railQuery?.removeEventListener('change', remeasure));

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
