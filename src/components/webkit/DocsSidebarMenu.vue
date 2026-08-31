<template>
	<Menu
		ref="menuRef"
		v-model:expanded="expanded"
		:groups="groups"
		:active-id="activeId"
		:role="presentation ? 'presentation' : undefined"
		:aria-label="ariaLabel"
		@navigate="onNavigate"
	/>
</template>

<script setup>
	/**
	 * The docs navigation tree on webkit's data-driven `Menu`. The tree itself
	 * is built server-side by `~/util/menuToWebkit` (from the i18n menu data)
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
	import { onMounted, ref, watch } from 'vue';

	const props = defineProps({
		groups: { type: Array, required: true },
		activeId: { type: String, default: '' },
		initialExpanded: { type: Array, default: () => [] },
		ariaLabel: { type: String, default: 'Menu' },
		presentation: { type: Boolean, default: false }
	});

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
		try {
			sessionStorage.setItem(EXPANDED_KEY, JSON.stringify(value));
		} catch {
			// ignore — see above
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
