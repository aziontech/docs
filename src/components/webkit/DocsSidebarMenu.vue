<template>
	<Menu
		v-if="visibleGroups.length"
		ref="menuRef"
		v-model:expanded="expanded"
		:groups="visibleGroups"
		:active-id="activeId"
		:role="presentation ? 'presentation' : undefined"
		:aria-label="ariaLabel"
		@navigate="onNavigate"
	/>
	<p
		v-else
		class="px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-muted)"
	>
		{{ noMatchesLabel }}
	</p>
</template>

<script setup>
	/**
	 * The docs navigation tree on webkit's data-driven `Menu`. The tree itself
	 * is built server-side by `~/nav` (from the tree that owns the current page)
	 * and arrives here as plain `groups` + `activeId` + the fold ids above the
	 * active row.
	 *
	 * The site is an Astro MPA, so this component remounts on every navigation.
	 * `expanded` (which folds are open) is therefore seeded from the derived
	 * ancestors of the active row — SSR and hydration agree on that — and then
	 * merged with sessionStorage after mount, so a fold the reader opened by
	 * hand survives the page load without becoming a persistent preference
	 * (merge, never replace: a row the reader opened is theirs to close).
	 *
	 * Two instances mount per page — the desktop rail (inside webkit `Sidebar`,
	 * with `presentation` so the sidebar's own <nav> stays the single landmark)
	 * and the mobile drawer (which keeps its own `aria-label`). They share the
	 * sessionStorage key, so a fold opened in one is open in the other on the
	 * next page.
	 */
	import Menu from '@aziontech/webkit/menu';
	import { computed, onMounted, ref, watch } from 'vue';

	const props = defineProps({
		groups: { type: Array, required: true },
		activeId: { type: String, default: '' },
		initialExpanded: { type: Array, default: () => [] },
		ariaLabel: { type: String, default: 'Menu' },
		presentation: { type: Boolean, default: false },
		filter: { type: String, default: '' },
		noMatchesLabel: { type: String, default: 'No rows match.' }
	});

	/*
		A row survives the filter when its label matches or a descendant does. A
		matching fold keeps all its children, so a reader who typed the group's
		name sees what it holds; a fold kept only for a descendant is pruned to
		the rows that matched.
	*/
	const query = computed(() => props.filter.trim().toLowerCase());

	function prune(nodes) {
		return nodes.flatMap((node) => {
			const own = node.label.toLowerCase().includes(query.value);
			const kids = node.children ? prune(node.children) : [];
			if (own) return [node];
			if (kids.length) return [{ ...node, children: kids }];
			return [];
		});
	}

	const visibleGroups = computed(() => {
		if (!query.value) return props.groups;
		return props.groups
			.map((group) => ({ ...group, items: prune(group.items) }))
			.filter((group) => group.items.length > 0);
	});

	function foldIds(nodes, out = []) {
		for (const node of nodes) {
			if (node.children?.length) {
				out.push(node.id);
				foldIds(node.children, out);
			}
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
			// sessionStorage unavailable (private mode, etc.) — folds still derive
			// from the active row.
		}

		// Bring the active row into view on arrival — replaces the old
		// scroll-offset persistence, and also works for a pasted URL, which a
		// stored offset never matched. Desktop only: the drawer instance is
		// closed at mount, so there is nothing to scroll yet.
		if (props.presentation) {
			menuRef.value?.$el
				?.querySelector('[aria-current="page"]')
				?.scrollIntoView({ block: 'nearest' });
		}
	});

	watch(expanded, (value) => {
		if (query.value) return;
		try {
			sessionStorage.setItem(EXPANDED_KEY, JSON.stringify(value));
		} catch {
			// ignore — see above
		}
	});

	// While a filter is typed every surviving fold is open; clearing it restores
	// the folds the reader had open before.
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

	/**
	 * `navigate` fires for leaf rows (real navigations); fold triggers emit
	 * nothing. Same event the previous sidebar tracked.
	 */
	function onNavigate(event, node) {
		if (typeof window === 'undefined' || !window.AzAnalytics?.trackClick) return;
		window.AzAnalytics.trackClick('sidebar', {
			text: node.label,
			href: node.href,
			isExternal: node.target === '_blank'
		});
	}
</script>
