<template>
	<!--
		Still a <kbd> wrapping a real <button> -- only the button's paint moved
		to webkit's Button (`small` + `outlined`, the closest kind to the
		transparent bordered chip this drew by hand).
	-->
	<kbd>
		<Button
			:label="keyname"
			kind="outlined"
			size="small"
			@click="emitClicked"
		/>
	</kbd>
</template>

<script setup>
	import Button from '@aziontech/webkit/button'

	const props = defineProps({
		keyname: String
	})

	const emit = defineEmits(['clicked'])
	const { keyname } = props

	function emitClicked(event) {
		emit('clicked', event)
	}
</script>
