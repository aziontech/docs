<template>
	<PanelMenu
		:unstyled="true"
		:model="dataWithIndex"
		:pt="{
			headerContent: { class: ['cursor-text'] },
			content: { class: ['indent-4'] }
		}"
	>
		<template #item="{ item }">
			<div :class="(item.onlyMobile ? 'lg:hidden' : 'block')">
				<p
					v-if="item.hasLabel"
					class="text-sm pl-4 mb-2 cursor-text"
					:class="(item.index === 0 ? 'mt-2' : 'mt-5')"
				>
					<strong class="text-base text-medium">
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
					:class="isCurrent(`${lang}${item.slug}`) ? 'surface-200': ''"
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
	import PanelMenu from 'primevue/panelmenu';
	import { modelSlug, isURL } from '~/util';
	
	const props = defineProps({
		currentPageMatch: { type: String },
		lang: { type: String },
		data: { type: Array },
		filterMobile: {
			type: Boolean,
			default: false
		}
	});
	const { data, filterMobile, lang } = props;
	
	// console.log(`props.currentPageMatch: `, props.currentPageMatch);
	
	const dataNoMobile = data.filter((item) => !item.onlyMobile);
	const dataWithIndex = ( filterMobile ? dataNoMobile : data).map((item, index) => {
		// console.log(`item: ${lang}${item.slug}`);

		item.index = index;
		return item;
	});

	function isCurrent(urlpath) {
		return urlpath === props.currentPageMatch;
	}
</script>
