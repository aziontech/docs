<template>
	<section :class="containerClasses">
		<slot />
	</section>
</template>

<script setup>
	import { computed } from 'vue'

	const props = defineProps({
		compact: {
			type: Boolean,
			default: false
		}
	})

	const containerClasses = computed(() => {
		const baseClasses = 'text-white relative max-w-5xl 2xl:max-w-6xl mx-auto p-6 md:p-0'
		const spacingClasses = props.compact
			? 'gap-10 lg:gap-20 xl:gap-30 2xl:gap-40'
			: 'gap-20 lg:gap-40 xl:gap-60 2xl:gap-80'
		const flexClasses = 'flex flex-col justify-center'

		return `${baseClasses} ${flexClasses} ${spacingClasses}`
	})
</script>
