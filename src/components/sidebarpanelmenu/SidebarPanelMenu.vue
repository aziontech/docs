<template>
	<PanelMenuTree
		:items="dataWithIndex"
		:expanded-keys="expandedKeys"
		:lang="lang"
		:is-current="isCurrent"
		@toggle="handleToggle"
		@item-click="handleItemClick"
		@track-click="trackSidebarClick"
	/>
</template>
<script setup>
	/**
	 * Recursive tree menu for the docs left sidebar. Used to be a thin wrapper
	 * around PrimeVue's `unstyled` PanelMenu -- all the item markup and click
	 * handling below was already fully custom (via PanelMenu's `#item` slot),
	 * PrimeVue only supplied the recursive rendering and the
	 * `v-model:expandedKeys` bookkeeping, both reproduced here directly.
	 */
	import { ref } from 'vue';
	import PanelMenuTree from './PanelMenuTree.vue';
	import { modelSlug, isURL } from '~/util';

	const expandedKeys = ref({});
	const props = defineProps({
		currentPageMatch: { type: String },
		lang: {  type: String },
		data: { type: Array },
		filterMobile: {
			type: Boolean,
			default: false
		}
	});
	const {
		lang,
		data,
		filterMobile
	} = props;

	/**
	 * Track sidebar navigation clicks
	 */
	function trackSidebarClick(item, href) {
		if (typeof window !== 'undefined' && window.AzAnalytics?.trackClick) {
			const isExternal = isURL(item.slug);
			window.AzAnalytics.trackClick('sidebar', {
				text: item.text,
				href: href,
				isExternal: isExternal,
				level: item.level
			});
		}
	}

	const dataNoMobile = data.filter((item) => !item.onlyMobile);

	function processMenuItems(items, parentKey = null, level = 0) {
		return items.map((item, index) => {
			item.index = index;
			item.level = level;

			if (parentKey) {
				item.parent = parentKey;
			}

			if (item.items && item.items.length) {
				item.items = processMenuItems(item.items, item.key, level + 1);
			}

			return item;
		});
	}

	const dataWithIndex = processMenuItems(filterMobile ? dataNoMobile : data);

	function handleToggle(item) {
		expandedKeys.value[item.key] = !expandedKeys.value[item.key];
	}

	function handleItemClick(item, event) {
		const isArrowClick = event.target.closest('span') || event.target.tagName === 'I';
		const isCurrentPage = isCurrent(item);

		if (isArrowClick || isCurrentPage) {
			event.preventDefault();
			if (expandedKeys.value[item.key]) {
				expandedKeys.value[item.key] = false;
			} else {
				expandedKeys.value[item.key] = true;
			}
		}
	}

	function expandParentNodes(item) {
		if (item.parent) {
			expandedKeys.value[item.parent] = true;
			const parentItem = findItemByKey(data, item.parent);
			if (parentItem) {
				expandParentNodes(parentItem);
			}
		}
	}

	function findItemByKey(items, key) {
		for (const item of items) {
			if (item.key === key) {
				return item;
			}
			if (item.items && item.items.length) {
				const found = findItemByKey(item.items, key);
				if (found) return found;
			}
		}
		return null;
	}

	// `isCurrent` is passed down by reference through PanelMenuTree's recursion
	// (as a single-arg callback), so `lang` comes from this file's closure
	// rather than a second call argument like the old template-bound version.
	function isCurrent(item) {
		const currentPageMatch = `${lang}${item.slug}` === props.currentPageMatch;
		if(currentPageMatch) {
			if(item.parent) {
				expandParentNodes(item);
			}
			if(item.items && item.items.length) {
				expandedKeys.value[item.key] = true;
			}
		}
		return currentPageMatch;
	}
</script>
