<template>
	<Menu
		v-if="visibleGroups.length && !levelEmpty"
		ref="menuRef"
		v-model:expanded="expanded"
		v-model:path="path"
		:groups="visibleGroups"
		:active-id="activeId"
		:role="presentation ? 'presentation' : undefined"
		:aria-label="ariaLabel"
		class="docs-sidebar-menu"
		@navigate="onNavigate"
	>
		<!-- The one row a data-driven menu still places by hand: it heads the drilled level and
		     pops it back to the catalog the level was pushed from. -->
		<Menu.Back v-if="backLabel">{{ backLabel }}</Menu.Back>
	</Menu>
	<p
		v-else
		class="px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-muted)"
	>
		{{ noMatchesLabel }}
	</p>
</template>

<script setup>
	import Menu from '@aziontech/webkit/menu';
	import { computed, nextTick, onMounted, ref, watch } from 'vue';

	const props = defineProps({
		groups: { type: Array, required: true },
		activeId: { type: String, default: '' },
		initialExpanded: { type: Array, default: () => [] },
		/** Drill stack to open on — the ids of the rows whose levels hold the page. */
		initialPath: { type: Array, default: () => [] },
		/** Text of the Back row heading the drilled level; none renders no row. */
		backLabel: { type: String, default: '' },
		ariaLabel: { type: String, default: 'Menu' },
		presentation: { type: Boolean, default: false },
		filter: { type: String, default: '' },
		noMatchesLabel: { type: String, default: 'No rows match.' }
	});

	const query = computed(() => props.filter.trim().toLowerCase());
	const path = ref([...props.initialPath]);

	function prune(nodes) {
		return nodes.flatMap((node) => {
			const own = node.label.toLowerCase().includes(query.value);
			const kids = node.children ? prune(node.children) : [];
			const levels = node.groups
				? node.groups.map((group) => ({ ...group, items: prune(group.items) })).filter((group) => group.items.length)
				: [];
			if (own) return [node];
			if (kids.length) return [{ ...node, children: kids }];
			if (levels.length) return [{ ...node, groups: levels }];
			return [];
		});
	}

	function pruneGroups(groups) {
		return groups
			.map((group) => ({ ...group, items: prune(group.items) }))
			.filter((group) => group.items.length > 0);
	}

	/** The row whose level is open, if any — the filter searches inside it, not the catalog behind it. */
	const levelId = computed(() => path.value[path.value.length - 1]);

	const levelGroups = computed(() => {
		if (!query.value || !levelId.value) return null;
		const node = props.groups.flatMap((group) => group.items).find((item) => item.id === levelId.value);
		return node?.groups ? pruneGroups(node.groups) : null;
	});

	/** Inside a level with nothing left to show: the menu gives way to the "no rows" note. */
	const levelEmpty = computed(() => levelGroups.value !== null && levelGroups.value.length === 0);

	const visibleGroups = computed(() => {
		if (!query.value) return props.groups;
		// A drilled level filters its own rows and keeps its place in the catalog, which stays off
		// canvas behind it either way; pruning the catalog would drop the row the level hangs off.
		if (levelGroups.value) {
			return props.groups.map((group) => ({
				...group,
				items: group.items.map((item) =>
					item.id === levelId.value ? { ...item, groups: levelGroups.value } : item
				)
			}));
		}
		return pruneGroups(props.groups);
	});

	function foldIds(nodes, out = []) {
		for (const node of nodes) {
			if (node.children?.length) {
				out.push(node.id);
				foldIds(node.children, out);
			}
			for (const group of node.groups ?? []) foldIds(group.items, out);
		}
		return out;
	}

	const EXPANDED_KEY = 'docs-sidebar-expanded';

	const menuRef = ref(null);
	const expanded = ref([...props.initialExpanded]);

	onMounted(() => {
		try {
			const stored = JSON.parse(sessionStorage.getItem(EXPANDED_KEY) || '[]');
			if (Array.isArray(stored) && stored.length) {
				expanded.value = [...new Set([...expanded.value, ...stored])];
			}
		} catch {
			// storage unavailable
		}

		if (props.presentation) {
			// A drilled level mounts one patch after the menu does (webkit withholds it so its
			// entrance transition exists first), so the active row is looked up after that patch.
			nextTick(() =>
				nextTick(() =>
					menuRef.value?.$el
						?.querySelector('[aria-current="page"]')
						?.scrollIntoView({ block: 'nearest' })
				)
			);
		}
	});

	watch(expanded, (value) => {
		if (query.value) return;
		try {
			sessionStorage.setItem(EXPANDED_KEY, JSON.stringify(value));
		} catch {
			// storage unavailable
		}
	});

	let restore = null;
	watch(query, (value, previous) => {
		if (value && !previous) restore = [...expanded.value];
		if (value) {
			expanded.value = visibleGroups.value.flatMap((group) => foldIds(group.items));
			return;
		}
		if (restore) {
			expanded.value = restore;
			restore = null;
		}
	});

	function onNavigate(event, node) {
		if (typeof window === 'undefined' || !window.AzAnalytics?.trackClick) return;
		window.AzAnalytics.trackClick('sidebar', {
			text: node.label,
			href: node.href,
			isExternal: node.target === '_blank'
		});
	}
</script>

<style>
	/* webkit 4.4.0 centres the Back row's label against a balancing spacer; the reference rail
	   (a newer webkit) reads it left-aligned beside the chevron. Drop when webkit is bumped.
	   main.css imports Tailwind with `important`, and an important declaration in an EARLIER layer
	   outranks one in a later layer — hence `components` (before `utilities`) plus `!important`. */
	@layer components {
		.docs-sidebar-menu [data-testid='navigation-menu-back'] > span:nth-child(2) {
			text-align: left !important;
		}

		.docs-sidebar-menu [data-testid='navigation-menu-back'] > span:last-child {
			display: none !important;
		}

		/* The drilled tree hangs off a placeholder row appended to the catalog (see resolveSidebar);
		   the level itself is teleported out of it, so only the row's trigger needs to disappear. */
		.docs-sidebar-menu li[data-node-id*='/level:'] {
			display: none !important;
		}
	}
</style>
