<template>
	<h1
		v-if="tag === 'h1'"
		:class="[{ 'text-center': isContentCentralized }]"
		class="text-heading-2 font-medium text-balance"
		style="line-height: 125% !important"
	>
		{{ title }}
	</h1>
	<h2
		v-if="tag === 'h2'"
		:class="[{ 'text-center': isContentCentralized }]"
		class="text-heading-2 font-medium text-balance"
		style="line-height: 125% !important"
	>
		{{ title }}
	</h2>
	<h3
		v-if="tag === 'h3'"
		:class="[{ 'text-center': isContentCentralized }]"
		class="text-heading-2 font-medium text-balance"
		style="line-height: 125% !important"
	>
		{{ title }}
	</h3>
	<h4
		v-if="tag === 'h4'"
		:class="[{ 'text-center': isContentCentralized }]"
		class="text-heading-2 font-medium text-balance"
		style="line-height: 125% !important"
	>
		{{ title }}
	</h4>
	<h5
		v-if="tag === 'h5'"
		:class="[{ 'text-center': isContentCentralized }]"
		class="text-heading-2 font-medium text-balance"
		style="line-height: 125% !important"
	>
		{{ title }}
	</h5>
	<h6
		v-if="tag === 'h6'"
		:class="[{ 'text-center': isContentCentralized }]"
		class="text-heading-2 font-medium text-balance"
		style="line-height: 125% !important"
	>
		{{ title }}
	</h6>
</template>

<script setup>
	defineProps({
		isContentCentralized: {
			type: Boolean,
			default: () => false
		},
		tag: {
			type: String,
			default: () => 'h2',
			validator: (value) => ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(value)
		},
		title: {
			type: [String, undefined, null]
		}
	});
</script>
