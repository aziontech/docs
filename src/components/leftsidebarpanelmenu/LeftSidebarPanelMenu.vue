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
				:href="item.slug"
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
	
	const props = defineProps({
		datamodel: []
	});
	const { datamodel } = props;
</script>
