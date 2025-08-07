<template>
	<PanelMenu
		v-model:expandedKeys="expandedKeys"
		:model="dataWithIndex"
		:unstyled="true"
		:pt="{
			headerContent: { class: ['cursor-text'] },
		}"
	>
		<template #item="{ item }">
			<div :class="(item.onlyMobile ? 'lg:hidden' : 'block')">
				<p
					v-if="item.hasLabel"
					class="text-base pl-4 mb-2 cursor-text"
					:class="(item.index === 0 ? 'mt-2' : 'mt-5')"
				>
					<strong class="font-medium">
						{{ item.hasLabel }}
					</strong>
				</p>

				<div
					v-if="!item.slug && item.text"
					class="flex hover:surface-hover py-2 px-4 border-none cursor-pointer rounded h-9"
					:style="{ paddingLeft: `${(item.level * 16) + 16}px !important` }"
				>
					<p v-if="item.text" class="text-sm">
						{{ item.text }}
					</p>
					<!-- use this class to when opened pi-angle-down -->
					<i
						v-if="item.items && item.items.length"
						class="pi pi-angle-right text-primary ml-auto pr-1">
					</i>
				</div>
				<a  v-else-if="item.slug && item.text && item.items"
					:title="item.text"
					:href="isCurrent(item, lang) ? '#' : modelSlug(item.slug, item.isFallback, lang)"
					:target="(isURL(item.slug) ? '_blank' : '_self')"
					:class="isCurrent(item, lang) ? 'surface-200': ''"
					class="text-sm h-9 flex justify-between items-center hover:surface-hover py-2 px-4 border-none cursor-pointer rounded"
					:style="{ paddingLeft: `${(item.level * 16) + 16}px !important` }"
					@click="handleItemClick(item, $event)"
				>	
					{{ item.text }}
					<i
						v-if="(isURL(item.slug) ? true : false)"
						class="text-base pi pi-external-link text-primary mr-1">
					</i>

					<span @click="handleItemClick(item, $event)">
						<i
						class="pi pi-angle-right text-primary ml-auto pr-1">
					</i>
					</span>
				</a>
				<a v-else-if="item.slug"
					:title="item.text"
					:href="modelSlug(item.slug, item.isFallback, lang)"
					:target="(isURL(item.slug) ? '_blank' : '_self')"
					:class="isCurrent(item, lang) ? 'surface-200': ''"
					class="text-sm h-9 flex justify-between items-center hover:surface-hover py-2 px-4 border-none cursor-pointer rounded"
					:style="{ paddingLeft: `${(item.level * 16) + 16}px !important` }"
				>	
					{{ item.text }}
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
	
	const dataNoMobile = data.filter((item) => !item.onlyMobile);
	
	// Recursive function to process menu items and their nested children
	function processMenuItems(items, parentKey = null, level = 0) {
		return items.map((item, index) => {
			// Modifying original data during buildtime
			
			// index is used to decide the margin top
			item.index = index;
			item.level = level; // Track nesting level
			
			// Set parent key for all nested items
			if (parentKey) {
				item.parent = parentKey;
			}
			
			// Recursively process nested items
			if (item.items && item.items.length) {
				item.items = processMenuItems(item.items, item.key, level + 1);
			}

			return item;
		});
	}
	
	const dataWithIndex = processMenuItems(filterMobile ? dataNoMobile : data);
	
	// Handle item click - prevent navigation if current page and expand dropdown instead
	function handleItemClick(item, event) {
		const isArrowClick = event.target.closest('span') || event.target.tagName === 'I';
		const isCurrentPage = isCurrent(item, lang);
		
		if (isArrowClick || isCurrentPage) {
			event.preventDefault();
			// Toggle the expanded state for this item
			if (expandedKeys.value[item.key]) {
				expandedKeys.value[item.key] = false;
			} else {
				expandedKeys.value[item.key] = true;
			}
		}
	}
	
	// Recursive function to expand all parent nodes
	function expandParentNodes(item) {
		if (item.parent) {
			expandedKeys.value[item.parent] = true;
			// Find the parent item and recursively expand its parents
			const parentItem = findItemByKey(data, item.parent);
			if (parentItem) {
				expandParentNodes(parentItem);
			}
		}
	}
	
	// Helper function to find an item by key in the nested structure
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

	// function collapseAll() {
	// 	expandedKeys.value = {};
	// }

	function isCurrent(item, lang) {
		const currentPageMatch = `${lang}${item.slug}` === props.currentPageMatch;
		if(currentPageMatch) {
			// If this is the current page and has a parent, expand all parent nodes
			if(item.parent) {
				expandParentNodes(item);
			}
			// If this is the current page and has subitems, expand this item too
			if(item.items && item.items.length) {
				expandedKeys.value[item.key] = true;
			}
		}
		return currentPageMatch;
	}
</script>
