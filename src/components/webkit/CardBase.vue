<template>
	<div
		class="wk-card w-full shadow-none flex flex-col rounded-[var(--shape-card)] border group"
		:class="[
			{ 'hover:border-[var(--border-strong)]': hover == 'default' },
			{
				'hover:bg-[var(--bg-hover)] hover:border-[var(--border-strong)]': hover == 'outlined'
			},
			{
				'hover:transform hover:-translate-y-6 transition-transform duration-300':
					hover == 'slide-up'
			},
			{
				'bg-[var(--bg-surface-raised)] border-default focus:outline-[var(--border-selected)]':
					backgroundColor == 'outlined'
			},
			{
				'bg-[var(--bg-surface-raised)] border-transparent focus:outline-[var(--border-selected)]':
					backgroundColor == 'shape'
			},
			{
				'bg-[var(--bg-surface-raised)] border-[var(--border-selected)] focus:outline-[var(--border-selected)]':
					backgroundColor == 'highlighted'
			},
			{
				'bg-transparent border-default focus:outline-[var(--border-selected)]':
					backgroundColor == 'default'
			},
			ptPrime?.root?.class
		]"
	>
		<div
			v-if="$slots.header"
			class="wk-card-header"
		>
			<div
				class="flex flex-col gap-8"
				:class="[
					{ 'p-4 md:p-6': spacing === 'compact' },
					{ 'p-5 md:p-8': spacing === 'base' },
					{ 'p-6 md:p-10': spacing === 'relaxed' }
				]"
			>
				<slot name="header" />
			</div>
		</div>

		<div
			class="wk-card-body"
			:class="ptPrime?.body?.class"
		>
			<div
				class="wk-card-content"
				:class="ptPrime?.content?.class"
			>
				<template v-if="$slots.content || $slots.actions">
					<div
						class="flex flex-col gap-8 justify-between grow h-ful"
						:class="[
							{ 'p-4 md:p-6': spacing === 'compact' },
							{ 'p-5 md:p-8': spacing === 'base' },
							{ 'p-6 md:p-10': spacing === 'relaxed' },
							defineComponentPT()
						]"
					>
						<div class="flex flex-col gap-3 grow">
							<slot name="content" />
						</div>
						<template v-if="$slots.actions">
							<div class="flex flex-col md:flex-row flex-wrap gap-2">
								<slot name="actions" />
							</div>
						</template>
					</div>
				</template>

				<template v-if="$slots['content-raw']">
					<slot name="content-raw" />
				</template>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { computed } from 'vue';

	const props = defineProps({
		spacing: {
			type: String,
			required: false,
			options: ['compact', 'relaxed', 'base'],
			default: 'base'
		},
		link: {
			type: String,
			required: false
		},
		linkText: {
			type: String,
			required: false
		},
		grid: {
			type: Boolean,
			required: false
		},
		backgroundColor: {
			type: String,
			required: false,
			default: 'default',
			options: ['outlined', 'highlighted', 'shape', 'default']
		},
		hover: {
			type: String,
			required: false,
			options: ['default', 'outlined', 'slide-up']
		},
		pt: {
			type: Object,
			required: false
		}
	});

	const ptPrime = computed(() => {
		if (props.grid) {
			return {
				root: { class: [[{ 'flex flex-col h-full': props.grid }]] },
				body: { class: [{ 'flex flex-col grow': props.grid }] },
				content: { class: [{ 'flex flex-col grow': props.grid }] }
			};
		}

		if (!props.pt) return;

		if (props.pt.prime) {
			return { ...props.pt.prime };
		}

		return {};
	});

	function defineComponentPT() {
		if (!props.pt) return;

		if (props.pt.content) {
			return props.pt.content;
		}

		return '';
	}
</script>

<style scoped>
	/*
		Replaces PrimeVue's Card wrapper. azion-theme's `.p-card` contributed
		`color: var(--text-default)` (body/content padding was `none`); background
		and radius are always set by the utility classes above.
	*/
	.wk-card {
		color: var(--text-default);
	}

	/* Parity with the `.p-card-header img` rule in webkit-v1-main.css. */
	.wk-card-header :deep(img) {
		max-width: 100%;
	}
</style>
