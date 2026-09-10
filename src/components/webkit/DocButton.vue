<template>
	<span data-doc-chrome data-doc-block class="inline-block">
		<Button v-bind="$attrs" @click="$emit('click', $event)" />
	</span>
</template>

<script setup lang="ts">
import Button from '@aziontech/webkit/button';

defineOptions({ inheritAttrs: false });
defineEmits<{
	/** Forwarded from the underlying button. */
	click: [event: MouseEvent];
}>();
</script>
