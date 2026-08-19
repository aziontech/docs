<template>
	<span class="wk-tag" :class="severity ? `wk-tag-${severity}` : ''">
		<slot>{{ value }}</slot>
	</span>
</template>

<script setup>
	defineProps({
		value: {
			type: [String, Number],
			required: false
		},
		severity: {
			type: String,
			required: false,
			validator: (value) => ['success', 'info', 'warning', 'danger'].includes(value)
		}
	});
</script>

<style scoped>
	/*
		Visual port of azion-theme's PrimeVue `.p-tag` styles, self-contained so
		this component no longer depends on PrimeVue classes. Values from
		azion-theme/src/azion/{_variables.scss,extended-components/_tag.scss}.
	*/
	.wk-tag {
		display: inline-block;
		background: var(--p-tag-background);
		color: var(--p-tag-color);
		padding: var(--tag-padding);
		font-size: 0.75rem;
		font-weight: 500;
		letter-spacing: 0.01rem;
		border-radius: 6px;
		white-space: nowrap;
	}
	.wk-tag-info {
		background: var(--surface-section);
		color: var(--text-color);
		box-shadow: 0 0 0 1px var(--surface-border);
	}
	.wk-tag-success {
		background: var(--p-tag-success-background);
		color: var(--p-tag-success-color);
	}
	.wk-tag-warning {
		background: var(--p-tag-warning-background);
		color: var(--p-tag-warning-color);
	}
	.wk-tag-danger {
		background: var(--p-tag-danger-background);
		color: var(--p-tag-danger-color);
	}
</style>
