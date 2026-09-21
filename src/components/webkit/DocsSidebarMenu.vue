<template>
	<MenuRoot
		v-if="visibleGroups.length || pushedDrill"
		:key="drilled ? 'level' : 'flat'"
		ref="menuRef"
		v-model:expanded="expanded"
		v-model:path="path"
		:role="presentation ? 'presentation' : undefined"
		:aria-label="ariaLabel"
	>
		<MenuBack>{{ backText }}</MenuBack>

		<MenuGroup
			v-for="(group, index) in rootGroups"
			:key="group.label ?? index"
			:label="group.label ?? ''"
		>
			<DocsSidebarRows
				:nodes="group.items"
				:active-id="activeId"
				:trees="visibleTrees"
				:drillable="drillable"
				:no-matches-label="noMatchesLabel"
				@navigate="onNavigate"
			/>
		</MenuGroup>

		<MenuGroup v-if="levelGroups.length">
			<MenuSub :data-node-id="LEVEL_ID">
				<MenuSubTrigger kind="drill" :label="levelLabel" />
				<MenuSubContent>
					<MenuGroup
						v-for="(group, index) in levelGroups"
						:key="group.label ?? index"
						:label="group.label ?? ''"
					>
						<DocsSidebarRows
							:nodes="group.items"
							:active-id="activeId"
							:trees="visibleTrees"
							:drillable="drillable"
							:no-matches-label="noMatchesLabel"
							@navigate="onNavigate"
						/>
					</MenuGroup>
				</MenuSubContent>
			</MenuSub>
		</MenuGroup>
	</MenuRoot>
	<p v-else class="px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-muted)">
		{{ noMatchesLabel }}
	</p>
</template>

<script setup lang="ts">
import MenuBack from '@aziontech/webkit/menu-back';
import MenuGroup from '@aziontech/webkit/menu-group';
import MenuRoot from '@aziontech/webkit/menu-root';
import MenuSub from '@aziontech/webkit/menu-sub';
import MenuSubContent from '@aziontech/webkit/menu-sub-content';
import MenuSubTrigger from '@aziontech/webkit/menu-sub-trigger';
import { computed, nextTick, onMounted, ref, watch } from 'vue';

import DocsSidebarRows from './DocsSidebarRows.vue';

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
	/** Where to fetch the menu of every tree a row can open. */
	treesHref?: string;
	backLabel?: string;
	/** Names a destination that is not the docs root; "{name}" is the level popped back to. */
	backToPattern?: string;
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
	treesHref: '',
	backLabel: '',
	backToPattern: 'Back to {name}',
	levelLabel: '',
	levelHref: '',
});

const query = computed(() => props.filter.trim().toLowerCase());

const path = ref<string[]>([]);
const drilled = ref(false);

function prune(nodes: MenuNode[]): MenuNode[] {
	return nodes.flatMap((node) => {
		if (path.value.includes(node.id)) return [node];
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

const trees = ref<Record<string, MenuGroupNode[]>>({});
const treesStatus = ref<'idle' | 'loading' | 'ready' | 'error'>('idle');

/** A failed load drops the drill affordance, so no row offers a level it cannot open. */
const drillable = computed(() => treesStatus.value !== 'error');

watch(drillable, (able) => {
	if (!able) path.value = drilled.value ? [LEVEL_ID] : [];
});

function loadTrees() {
	if (!props.treesHref || treesStatus.value === 'loading' || treesStatus.value === 'ready') return;
	treesStatus.value = 'loading';
	fetch(props.treesHref)
		.then((response) => (response.ok ? response.json() : Promise.reject(new Error('unavailable'))))
		.then((data) => {
			trees.value = data as Record<string, MenuGroupNode[]>;
			treesStatus.value = 'ready';
		})
		.catch(() => {
			treesStatus.value = 'error';
		});
}

const visibleTrees = computed<Record<string, MenuGroupNode[]>>(() => {
	if (!query.value) return trees.value;
	const out: Record<string, MenuGroupNode[]> = {};
	for (const [id, groups] of Object.entries(trees.value)) {
		out[id] = groups
			.map((group) => ({ ...group, items: prune(group.items) }))
			.filter((group) => group.items.length > 0);
	}
	return out;
});

const hasCatalog = computed(() => Boolean(props.catalogGroups?.length));

const rootGroups = computed<MenuGroupNode[]>(() => {
	if (!hasCatalog.value) return visibleGroups.value;
	return drilled.value ? props.catalogGroups ?? [] : visibleGroups.value;
});

const levelGroups = computed<MenuGroupNode[]>(() => (drilled.value ? visibleGroups.value : []));

/** With no catalog beneath it, the menu's own tree is the level a pop lands on. */
const baseIsTree = computed(() => !hasCatalog.value && Boolean(props.levelLabel));

/** Label of every row that opens a level, so Back can name the one beneath the current. */
const drillLabels = computed(() => {
	const out = new Map<string, string>();
	const walk = (nodes: MenuNode[]) => {
		for (const node of nodes) {
			if (node.opensTree) out.set(node.id, node.label);
			if (node.children?.length) walk(node.children);
		}
	};
	for (const group of props.groups) walk(group.items);
	for (const group of props.catalogGroups ?? []) walk(group.items);
	for (const groups of Object.values(trees.value)) for (const group of groups) walk(group.items);
	return out;
});

const backText = computed(() => {
	const below = path.value[path.value.length - 2];
	const name =
		below === undefined
			? baseIsTree.value
				? props.levelLabel
				: ''
			: below === LEVEL_ID
			? props.levelLabel
			: drillLabels.value.get(below) ?? '';
	return name ? props.backToPattern.replace('{name}', name) : props.backLabel;
});

/** A level the reader pushed, above the product level the page mounts at. */
const pushedDrill = computed(() => path.value.length > (drilled.value ? 1 : 0));

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
	loadTrees();

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
	if (value.length > previous.length) loadTrees();
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
		expanded.value = [
			...visibleGroups.value.flatMap((group) => foldIds(group.items)),
			...Object.values(visibleTrees.value).flatMap((groups) =>
				groups.flatMap((group) => foldIds(group.items))
			),
		];
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
