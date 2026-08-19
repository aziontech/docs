<template>
	<ContentSection
		:isContentCentralized="isContentCentralized"
		:overline="overline"
		:titleTag="titleTag"
		:title="title"
		:description="description"
		:descriptionRawHtml="descriptionRawHtml"
		:id="id"
		:margin="margin"
	>
		<template #actions>
			<template
				v-for="(button, index) in buttons"
				:key="index"
			>
				<LinkButton
					v-if="button.link"
					v-bind="button"
				/>
			</template>
		</template>
	</ContentSection>
</template>

<script setup>
	import ContentSection from './ContentSection.vue'
	import LinkButton from './LinkButton.vue'

	defineProps({
		id: {
			type: String,
			default: () => ''
		},
		isContentCentralized: {
			type: Boolean,
			default: () => true
		},
		overline: {
			type: String,
			default: () => ''
		},
		titleTag: {
			type: String,
			default: () => 'h2',
			validator: (value) => ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(value)
		},
		title: {
			type: String,
			rquired: true
		},
		description: {
			type: String,
			default: () => ''
		},
		descriptionRawHtml: {
			type: String,
			default: () => ''
		},
		buttons: {
			type: Array,
			default: () => []
		},
		margin: {
			type: String,
			options: ['none', 'small', 'default', 'large'],
			default: () => 'none'
		}
	})
</script>
