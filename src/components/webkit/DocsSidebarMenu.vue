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
