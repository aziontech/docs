<template>
	<PanelMenu
		:model="dataWithIndex"
		:unstyled="true"
		:pt="{
			headerContent: {
				class: ['cursor-text']
			},
			content: { class: ['indent-4'] }
		}"
	>
		<template #item="{ item }">
			<p
				v-if="item.hasLabel"
				class="text-sm pl-6 mb-2 cursor-text"
				:class="(item.index === 0 ? 'mt-2' : 'mt-4')"
			>
				<strong class="text-base text-bold">
					{{ item.hasLabel }}
				</strong>
			</p>

			<div v-if="!item.slug && item.text" class="flex hover:surface-hover rounded-md p-2 pl-6 border-none cursor-pointer">
				<p v-if="item.text" class="text-sm">
					{{ item.text }}
				</p>
				<!-- use this class to when opened pi-angle-down -->
				<i v-if="item.items && item.items.length" class="pi pi-angle-right text-primary ml-auto pr-4"></i>
			</div>
			<a v-else-if="item.slug"
				:title="item.text"
				:href="modelSlug(item.slug, item.isFallback, lang)"
				:target="(isURL(item.slug) ? '_blank' : '_self')"
				class="text-sm flex justify-between items-center hover:surface-hover rounded-md p-2 pl-6 border-none cursor-pointer"
			>	
				{{ item.text }}

				<i v-if="(isURL(item.slug) ? true : false)" class="text-sm pi pi-external-link text-primary mr-4"></i>
			</a>

			<Divider v-if="item.separator" class="mt-4 mb-4"/>
		</template>
	</PanelMenu>
</template>
<script setup>
	import Divider from 'primevue/divider';
	import PanelMenu from 'primevue/panelmenu';
	import { modelSlug, isURL } from '~/util';
	
	const props = defineProps({
		lang: {
			type: String
		},
		data: []
	});
	const { data, lang } = props;
	
	const dataWithIndex = data.map((item, index) => {
		item.index = index;
		return item;
	});
</script>
