<template>
	<MenuRoot
		v-if="visibleGroups.length"
		:key="drilled ? 'level' : 'flat'"
		ref="menuRef"
		v-model:expanded="expanded"
		v-model:path="path"
		:groups="menuGroups"
		:active-id="activeId"
		:role="presentation ? 'presentation' : undefined"
		:aria-label="ariaLabel"
		@navigate="onNavigate"
	>
		<MenuBack v-if="backLabel">{{ backLabel }}</MenuBack>
	</MenuRoot>
	<p v-else class="px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-muted)">
		{{ noMatchesLabel }}
	</p>
</template>

<script setup lang="ts">
import MenuBack from '@aziontech/webkit/menu-back';
import MenuRoot from '@aziontech/webkit/menu-root';
import { computed, nextTick, onMounted, ref, watch } from 'vue';

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
	catalogGroups?: MenuGroupNode[] | null;
	backLabel?: string;
	levelLabel?: string;
	levelHref?: string;
}

const props = withDefaults(defineProps<Props>(), {
	activeId: '',
	initialExpanded: () => [],
	ariaLabel: 'Menu',
	presentation: false,
	filter: '',
	noMatchesLabel: 'No rows match.',
	catalogGroups: null,
	backLabel: '',
	levelLabel: '',
	levelHref: '',
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

const LEVEL_ID = 'docs-sidebar-level';

const path = ref<string[]>([]);
const drilled = ref(false);

const menuGroups = computed<MenuGroupNode[]>(() => {
	if (!drilled.value || !props.catalogGroups?.length) return visibleGroups.value;
	return [
		...props.catalogGroups,
		{
			items: [
				{ id: LEVEL_ID, label: props.levelLabel, kind: 'drill', groups: visibleGroups.value },
			],
		},
	];
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

	if (props.catalogGroups?.length && props.groups.length) {
		path.value = [LEVEL_ID];
		drilled.value = true;
	}

	if (props.presentation) {
		nextTick(() =>
			nextTick(() =>
				menuRef.value?.$el
					?.querySelector('[aria-current="page"]')
					?.scrollIntoView({ block: 'nearest' })
			)
		);
	}
});

watch(path, (value, previous) => {
	if (!drilled.value || value.length > 0 || previous.length === 0) return;
	nextTick(() => {
		const root = menuRef.value?.$el;
		if (!root) return;
		const rows = Array.from(root.children)
			.filter((child) => child.tagName === 'SECTION')
			.flatMap((section) => Array.from(section.querySelectorAll<HTMLAnchorElement>('a[href]')));
		const landing = rows.find((row) => row.getAttribute('href') === props.levelHref) ?? rows[0];
		landing?.focus();
	});
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
		isExternal: node.target === '_blank',
	});
}
</script>
