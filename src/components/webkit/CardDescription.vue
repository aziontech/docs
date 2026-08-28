<template>
	<p
		class="max-w-lg text-pretty"
		:class="[
			{ 'text-muted': color == 'secondary' },
			{ 'text-body-1': size == 'small' },
			{ 'text-body-2': size == 'medium' },
			{ 'text-body-3': size == 'large' }
		]"
	>
		<slot />
	</p>
</template>

<script setup>
	defineProps({
		color: {
			type: String,
			options: ['primary', 'secondary'],
			required: false,
			default: 'secondary'
		},
		size: {
			type: String,
			options: ['small', 'medium', 'large'],
			required: false,
			default: 'medium'
		}
	});
</script>
