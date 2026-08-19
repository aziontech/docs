<template>
	<HeroBase
		isDisplay
		:isCentralized="true"
		:description="description"
		:descriptionRawHtml="descriptionRawHtml"
		:bannerNews="bannerNews"
		:id="id"
		:margin="margin"
		:bottomSpacing="bottomSpacing"
	>
		<template #title>
			<h1
				class="font-medium text-heading-5 text-balance"
				v-html="title"
			/>
		</template>
		<template #actions>
			<div class="flex gap-4 flex-col md:flex-row justify-center items-center">
				<HeroButton
					v-for="button in buttons"
					:key="button.label || button.link"
					:label="button.label"
					:href="button.link"
					:icon="button.icon"
					:size="button.size === 'medium' ? 'large' : 'small'"
					:type="button.type"
					:theme="button.theme"
				/>
			</div>
		</template>
		<template #content>
			<div class="flex flex-col gap-4 md:gap-8 items-center text-center">
				<ContentLogo
					size="small"
					:isCentralized="true"
					:title="logosTitle"
					:logos="logos"
				/>
			</div>
		</template>
	</HeroBase>
</template>

<script setup>
	import HeroBase from './HeroBase.vue';
	import HeroButton from './HeroButton.vue';
	import ContentLogo from './ContentLogo.vue';

	defineProps({
		id: {
			type: String,
			default: () => ''
		},
		bannerNews: {
			type: Object,
			default: () => {}
		},
		overline: {
			type: String,
			default: () => ''
		},
		titleTag: {
			type: String,
			default: () => 'h1',
			validator: (value) => ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(value)
		},
		title: {
			type: String,
			default: () => ''
		},
		description: {
			type: String,
			default: () => ''
		},
		descriptionRawHtml: {
			type: String,
			default: () => ''
		},
		logosTitle: {
			type: String,
			default: () => ''
		},
		logos: {
			type: Array,
			required: true,
			default: () => []
		},
		buttons: {
			type: Array,
			default: () => []
		},
		margin: {
			type: String,
			options: ['none', 'small', 'default', 'large'],
			default: () => 'none'
		},
		bottomSpacing: {
			type: String,
			default: () => 'mb-24'
		}
	});
</script>
