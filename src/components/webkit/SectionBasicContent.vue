<template>
	<ContentSection
		:id="id"
		:is-content-centralized="isContentCentralized"
		:overline="overline"
		:title-tag="titleTag"
		:title="title"
		:description="description"
		:description-raw-html="descriptionRawHtml"
		:margin="margin"
	>
		<template #actions>
			<template
				v-for="(button, index) in buttons"
				:key="index"
			>
				<Button
					v-if="button.link"
					v-bind="toButtonProps(button)"
					class="not-prose w-fit no-underline"
				/>
			</template>
		</template>
	</ContentSection>
</template>

<script setup>
	import ContentSection from './ContentSection.vue'
	import Button from '@aziontech/webkit/button'

	// Maps the author-shaped button objects from src/content (LinkButton's old
	// prop surface: link/severity/outlined/text) onto webkit Button's props.
	const toButtonProps = (button) => ({
		label: button.label,
		href: button.link,
		target: button.target,
		icon: button.icon,
		iconPos: button.iconPos ?? button['icon-pos'],
		size: 'medium',
		kind:
			button.textLink || button.text
				? 'text'
				: button.outlined
					? 'outlined'
					: button.severity === 'secondary'
						? 'secondary'
						: 'primary'
	})


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
