<template>
	<PanelMenu
		v-model:expandedKeys="expandedKeys"
		:model="dataWithIndex"
		:unstyled="true"
		:pt="{
			headerContent: { class: ['cursor-text'] },
			// PrimeVue's default 'p-toggleable-content' name carries a runtime-injected
			// 1s max-height animation, which replays when hydration re-expands the active
			// chain. A name with no CSS makes expand/collapse instant.
			transition: { name: 'sidebar-toggle-instant' },
		}"
	>
		<template #item="{ item }">
			<div :class="(item.onlyMobile ? 'lg:hidden' : 'block')">
				<p
					v-if="item.hasLabel"
					class="text-base pl-4 mb-1 cursor-text flex items-center"
					:class="(item.index === 0 ? 'mt-2' : 'mt-4')"
					@click.stop.prevent
				>
					<i v-if="item.labelIcon" :class="item.labelIcon" class="mr-2 text-sm"></i>
					<strong class="font-medium">
						{{ item.hasLabel }}
					</strong>
				</p>

				<div
					v-if="!item.slug && item.text"
					class="flex hover:surface-hover py-1 px-4 border-none cursor-pointer rounded min-h-8"
					:style="{ paddingLeft: `${(item.level * 16) + 16}px !important` }"
				>
					<p v-if="item.text" class="text-sm flex items-center">
						<i v-if="item.icon" :class="item.icon" class="mr-2 text-sm"></i>
						{{ item.text }}
					</p>
					<i
						v-if="item.items && item.items.length"
						:class="expandedKeys[item.key] ? 'pi-angle-down' : 'pi-angle-right'"
						class="pi text-primary ml-auto pr-1">
					</i>
				</div>
				<a  v-else-if="item.slug && item.text && item.items"
					:title="item.text"
					:href="isCurrent(item) ? '#' : modelSlug(item.slug, item.isFallback, lang)"
					:target="(isURL(item.slug) ? '_blank' : '_self')"
					:class="isCurrent(item) ? 'surface-200': ''"
					class="text-sm min-h-8 flex justify-between items-center hover:surface-hover py-1 px-4 border-none cursor-pointer rounded"
					:style="{ paddingLeft: `${(item.level * 16) + 16}px !important` }"
					@click="handleItemClick(item, $event)"
				>
					<span class="flex items-center">
						<i v-if="item.icon" :class="item.icon" class="mr-2 text-sm"></i>
						{{ item.text }}
					</span>
					<i
						v-if="(isURL(item.slug) ? true : false)"
						class="text-base pi pi-external-link text-primary mr-1">
					</i>

					<span @click="handleItemClick(item, $event)">
						<i
						:class="expandedKeys[item.key] ? 'pi-angle-down' : 'pi-angle-right'"
						class="pi text-primary ml-auto pr-1">
					</i>
					</span>
				</a>
				<a v-else-if="item.slug"
					:title="item.text"
					:href="modelSlug(item.slug, item.isFallback, lang)"
					:target="(isURL(item.slug) ? '_blank' : '_self')"
					:class="isCurrent(item) ? 'surface-200': ''"
					class="text-sm min-h-8 flex justify-between items-center hover:surface-hover py-1 px-4 border-none cursor-pointer rounded"
					:style="{ paddingLeft: `${(item.level * 16) + 16}px !important` }"
					@click="trackSidebarClick(item, modelSlug(item.slug, item.isFallback, lang))"
				>
					<span class="flex items-center">
						<i v-if="item.icon" :class="item.icon" class="mr-2 text-sm"></i>
						{{ item.text }}
					</span>
					<i
						v-if="(isURL(item.slug) ? true : false)"
						class="text-base pi pi-external-link text-primary mr-1">
					</i>
				</a>
			</div>
		</template>
	</PanelMenu>
</template>
<script setup>
	/**
	 *
	 * https://v3.primevue.org/panelmenu/#controlled
	 *
	 */
	import { ref } from 'vue';
	import PanelMenu from 'primevue/panelmenu';
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

	// Flat key -> item map for ancestor lookups.
	function indexByKey(items, map = {}) {
		for (const item of items) {
			map[item.key] = item;
			if (item.items && item.items.length) indexByKey(item.items, map);
		}
		return map;
	}
	const itemsByKey = indexByKey(dataWithIndex);

	// PanelMenu already toggles a section on header click (it emits update:expandedKeys).
	// This handler is only for slug+items rows: navigate on the label, toggle on the arrow
	// or when the row is already the current page.
	function handleItemClick(item, event) {
		const isArrowClick = event.target.closest('span') || event.target.tagName === 'I';
		if (isArrowClick || isCurrent(item)) {
			event.preventDefault();
			if (expandedKeys.value[item.key]) {
				expandedKeys.value[item.key] = false;
			} else {
				expandedKeys.value[item.key] = true;
			}
		}
	}

	// Pure — safe to call during render (used only for the active-item highlight and href).
	function isCurrent(item) {
		return `${lang}${item.slug}` === props.currentPageMatch;
	}

	// Expand the current page's ancestor chain once, on load, so the active section opens —
	// but stays collapsible. (Expanding during render would immediately undo a manual collapse.)
	(function expandCurrentOnLoad() {
		for (const key in itemsByKey) {
			const item = itemsByKey[key];
			if (item.slug && `${lang}${item.slug}` === props.currentPageMatch) {
				let cur = item;
				while (cur) {
					if (cur.items && cur.items.length) expandedKeys.value[cur.key] = true;
					cur = cur.parent ? itemsByKey[cur.parent] : null;
				}
			}
		}
	})();
</script>
