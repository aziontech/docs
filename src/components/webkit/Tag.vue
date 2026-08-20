<template>
	<span
		class="inline-block whitespace-nowrap px-[var(--spacing-xs)] py-[var(--spacing-xxs)] rounded-[var(--shape-elements)] text-tag-sm tracking-[0.01rem]"
		:class="severityClasses"
	>
		<slot>{{ value }}</slot>
	</span>
</template>

<script setup>
	import { computed } from 'vue';

	const props = defineProps({
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

	// `info` keeps the neutral surface look the old PrimeVue theme gave it
	// rather than @aziontech/theme's blue `info` status color: it is the
	// severity used by the ~390 content badges ("Preview", "Compute",
	// "Static"), which read as labels, not as informational alerts.
	const severityClasses = computed(
		() =>
			({
				info: 'bg-surface text-default shadow-[0_0_0_1px_var(--border-default)]',
				success: 'bg-success text-success-contrast',
				warning: 'bg-warning text-warning-contrast',
				danger: 'bg-danger text-danger-contrast'
			})[props.severity] ?? 'bg-primary-mask text-primary'
	);
</script>
