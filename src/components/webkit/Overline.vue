<template>
	<span class="text-overline text-color-secondary text-balance">
		{{ label }}
	</span>
</template>

<script setup>
	defineProps({
		label: {
			type: String,
			required: true
		}
	});
</script>
