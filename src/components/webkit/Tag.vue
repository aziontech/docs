<template>
	<WebkitTag
		:label="label"
		:severity="webkitSeverity"
		size="medium"
		class="whitespace-nowrap"
	>
		<template
			v-if="$slots['default']"
			#default
		>
			<slot />
		</template>
	</WebkitTag>
</template>

<script setup>
	import { computed } from 'vue';

	import WebkitTag from '@aziontech/webkit/tag';

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

	const label = computed(() =>
		props.value === undefined || props.value === null ? '' : String(props.value)
	);

	const webkitSeverity = computed(
		() =>
			({
				info: 'secondary',
				success: 'success',
				warning: 'warning',
				danger: 'danger'
			})[props.severity] ?? 'primary'
	);
</script>
