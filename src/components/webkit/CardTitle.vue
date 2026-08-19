<template>
	<h1
		v-if="titleTag === 'h1'"
		class="text-heading-1 text-pretty max-w-lg"
	>
		<slot />
	</h1>
	<h2
		v-else-if="titleTag === 'h2'"
		class="text-heading-1 text-pretty max-w-lg"
	>
		<slot />
	</h2>
	<h3
		v-else-if="titleTag === 'h3'"
		class="text-heading-1 text-pretty max-w-lg"
	>
		<slot />
	</h3>
	<h4
		v-else-if="titleTag === 'h4'"
		class="text-heading-1 text-pretty max-w-lg"
	>
		<slot />
	</h4>
	<h5
		v-else-if="titleTag === 'h5'"
		class="text-heading-1 text-pretty max-w-lg"
	>
		<slot />
	</h5>
	<h6
		v-else-if="titleTag === 'h6'"
		class="text-heading-1 text-pretty max-w-lg"
	>
		<slot />
	</h6>
	<p
		v-else
		class="text-heading-1 text-pretty max-w-lg"
	>
		<slot />
	</p>
</template>

<script setup>
	defineProps({
		titleTag: {
			type: String,
			required: false,
			default: ''
		}
	});
</script>
