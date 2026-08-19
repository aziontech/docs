<template>
	<a
		:href="link"
		:title="title"
		:target="target"
		:aria-label="ariaLabel"
		class="no-underline flex border-radius cursor-pointer h-full"
	>
		<CardBase v-bind="props">
			<template
				v-if="$slots.header"
				#header
			>
				<slot name="header" />
			</template>

			<template
				v-if="$slots.content"
				#content
			>
				<slot name="content" />
			</template>

			<template
				v-if="!disableAction"
				#actions
			>
				<div class="font-medium flex gap-2 items-center">
					<p v-if="action?.label">
						{{ action.label }}
					</p>
					<i
						v-if="action?.isExternal"
						class="pi pi-arrow-up-right text-sm"
					></i>
					<i
						v-else
						class="pi pi-arrow-right text-sm"
					></i>
				</div>
			</template>

			<template
				v-if="$slots['content-raw']"
				#content-raw
			>
				<slot name="content-raw" />
			</template>
		</CardBase>
	</a>
</template>

<script setup>
	import CardBase from './CardBase.vue';

	const props = defineProps({
		spacing: {
			type: String,
			required: false,
			options: ['compact', 'relaxed', 'base'],
			default: 'base'
		},
		grid: {
			type: Boolean,
			required: false
		},
		backgroundColor: {
			type: String,
			required: false,
			default: 'default',
			options: ['outlined', 'shape', 'default']
		},
		hover: {
			type: String,
			required: false,
			default: 'default',
			options: ['default', 'outlined']
		},
		link: {
			type: String,
			required: true
		},
		title: {
			type: String,
			required: false
		},
		ariaLabel: {
			type: String,
			required: false
		},
		target: {
			type: String,
			required: false,
			default: '_self',
			options: ['_blank', '_self']
		},
		disableAction: {
			required: false,
			default: false,
			type: Boolean
		},
		action: {
			type: Object,
			required: false
		},
		pt: {
			type: Object,
			required: false
		}
	});
</script>
