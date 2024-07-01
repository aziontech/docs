<template>
	<PanelMenu
		v-model:expandedKeys="expandedKeys"
		:model="dataWithIndex"
		:unstyled="true"
		:pt="{
			headerContent: { class: ['cursor-text'] },
			content: { class: ['indent-4'] }
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
				<a v-else-if="item.slug"
					:title="item.text"
					:href="modelSlug(item.slug, item.isFallback, lang)"
					:target="(isURL(item.slug) ? '_blank' : '_self')"
					:class="isCurrent(item, lang) ? 'surface-200': ''"
					class="text-sm h-9 flex justify-between items-center hover:surface-hover py-2 px-4 border-none cursor-pointer rounded"
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
	const dataWithIndex = ( filterMobile ? dataNoMobile : data).map((item, index) => {
		// Modifying original data during buildtime
		
		// index is used to decide the margin top
		item.index = index;
		
		if(item.items && item.items.length) {
			item.items.map(subItem => {
				// subItemParent used to know the parent umbrella to be opened
				subItem.parent = item.key;
			});
		}

		return item;
	});

	function expandNode(key) {
		expandedKeys.value[key] = true;
	};

	// function collapseAll() {
	// 	expandedKeys.value = {};
	// }

	function isCurrent(item, lang) {
		const currentPageMatch = `${lang}${item.slug}` === props.currentPageMatch;
		if(currentPageMatch && item.parent) expandNode(item.parent);
		return currentPageMatch;
	}
</script>
