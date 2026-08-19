<template>
	<kbd>
		<button
			type='button'
			class='cursor-pointer rounded border surface-border bg-transparent px-2 py-1 text-color transition-colors hover:surface-hover'
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
