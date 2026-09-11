<template>
	<!-- eslint-disable webkit/no-style-override -- keeps a two-word tag on one line;
	     Tag is a leaf with no slot to carry this, and wrapping it in an inline box
	     would not constrain the label inside the component. -->
	<WebkitTag :label="label" :severity="webkitSeverity" size="medium" class="whitespace-nowrap">
		<!-- eslint-enable webkit/no-style-override -->
		<template v-if="$slots['default']" #default>
			<slot />
		</template>
	</WebkitTag>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import WebkitTag from '@aziontech/webkit/tag';

/** Status colour the tag maps onto webkit's own severities. */
export type TagSeverity = 'success' | 'info' | 'warning' | 'danger';

interface Props {
	/** Text to show; numbers are stringified. */
	value?: string | number;
	/** Status colour. */
	severity?: TagSeverity;
}

const props = withDefaults(defineProps<Props>(), {
	value: undefined,
	severity: undefined,
});

defineSlots<{
	/** Replaces the label when the consumer supplies content. */
	default(): unknown;
}>();

const label = computed(() =>
	props.value === undefined || props.value === null ? '' : String(props.value)
);

const webkitSeverity = computed(
	() =>
		({
			info: 'secondary',
			success: 'success',
			warning: 'warning',
			danger: 'danger',
		}[props.severity as TagSeverity] ?? 'primary')
);
</script>
