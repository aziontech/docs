<template>
	<span class="text-overline text-muted text-balance">
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
