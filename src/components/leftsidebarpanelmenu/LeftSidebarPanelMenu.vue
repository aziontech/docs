<template>
	<PanelMenu
		:model="datamodel"
		:pt="{
			headerContent: {
				class: ['hover:surface-hover rounded-md p-2 pl-8 border-none']
			},
			menuContent: {
				class: ['border-none p-0']
			},
			content: {
				class: ['m-0 p-2 pl-14']
			}
		}">

		<template #item="{ item }">
			<div v-if="!item.slug" class="flex">
				<p class="text-sm">
					{{ item.text }}
				</p>
				<span
					v-if="item.items && item.items.length"
					class="pi pi-angle-down text-primary ml-auto pr-4"></span>
			</div>
			<a 
				v-else
				:href="modelSlug(item.slug, item.isFallback, lang)"
				:title="item.text"
				:target="item.target"
				class="text-sm block">
				
				{{ item.text }}
			</a>
		</template>
	</PanelMenu>
</template>
<script setup>
	import PanelMenu from 'primevue/panelmenu';
	import { modelSlug, isURL } from '~/util';
	
	const props = defineProps({
		lang: {
			type: String
		},
		datamodel: []
	});
	const { datamodel, lang } = props;
</script>
