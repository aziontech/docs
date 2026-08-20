<template>
	<kbd>
		<button
			type='button'
			class='cursor-pointer rounded border border-default bg-transparent px-2 py-1 text-default transition-colors hover:bg-hover'
			@click='emitClicked'
		>
			<small>
				{{ keyname }}
			</small>
		</button>
	</kbd>
</template>

<script setup>
	const props = defineProps({
		keyname: String
	})

	const emit = defineEmits(['clicked'])
	const { keyname } = props

	function emitClicked(event) {
		emit('clicked', event)
	}
</script>
