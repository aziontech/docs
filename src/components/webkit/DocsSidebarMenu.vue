<template>
	<MenuRoot
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

<script setup lang="ts">
	import MenuRoot from '@aziontech/webkit/menu-root';
	import { computed, onMounted, ref, watch } from 'vue';

	import type { MenuGroupNode, MenuNode } from '~/nav/resolve';

	interface Props {
		/** The menu's groups, already resolved for this language. */
		groups: MenuGroupNode[];
		/** Id of the row for the page being read. */
		activeId?: string;
		/** Rows expanded on first render. */
		initialExpanded?: string[];
		/** Accessible name for the menu. */
		ariaLabel?: string;
		/** Renders as presentation, for a host that owns the landmark. */
		presentation?: boolean;
		/** Free-text filter applied to row labels. */
		filter?: string;
		/** Shown when the filter matches nothing. */
		noMatchesLabel?: string;
	}

	const props = withDefaults(defineProps<Props>(), {
		activeId: '',
		initialExpanded: () => [],
		ariaLabel: 'Menu',
		presentation: false,
		filter: '',
		noMatchesLabel: 'No rows match.',
	});

	const query = computed(() => props.filter.trim().toLowerCase());

	function prune(nodes: MenuNode[]): MenuNode[] {
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

	function foldIds(nodes: MenuNode[], out: string[] = []): string[] {
		for (const node of nodes) {
			if (node.children?.length) {
				out.push(node.id);
				foldIds(node.children, out);
			}
		}
		return out;
	}

	const EXPANDED_KEY = 'docs-sidebar-expanded';

	const menuRef = ref<{ $el?: HTMLElement } | null>(null);
	const expanded = ref<string[]>([...props.initialExpanded]);

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
			// storage unavailable
		}
	});

	let restore: string[] | null = null;
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

	function onNavigate(event: Event, node: MenuNode) {
		if (typeof window === 'undefined' || !window.AzAnalytics?.trackClick) return;
		window.AzAnalytics.trackClick('sidebar', {
			text: node.label,
			href: node.href,
			isExternal: node.target === '_blank'
		});
	}
</script>
