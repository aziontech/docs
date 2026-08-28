<template>
	<AlgoliaDialog
		:algoliaAppId='algoliaAppId'
		:algoliaApiKey='algoliaApiKey'
		:algoliaIndex='algoliaIndex'
		:algoliaModel='algoliaModel'
		:isDialogActive='isDialogActive'
		@close='closeDialog'
		:inputPlaceholder='inputPlaceholder'
	/>

	<!--
		The search trigger is webkit's IconButton (icon-only control) instead of
		a hand-styled <button>. `transparent` is the kind that matches how it
		has to sit inside the header bar.
	-->
	<IconButton
		icon='pi pi-search'
		aria-label='Search'
		kind='transparent'
		size='medium'
		class='flex-none'
		@click='activeDialog'
	/>
</template>

<script setup>
	import { ref, onMounted, onBeforeUnmount } from 'vue'

	import IconButton from '@aziontech/webkit/icon-button'

	import AlgoliaDialog from './AlgoliaDialog.vue'

	const props = defineProps({
		algoliaAppId: {
			type: String
		},
		algoliaApiKey: {
			type: String
		},
		algoliaIndex: {
			type: Array
		},
		algoliaModel: {
			type: Array
		},
		inputPlaceholder: {
			type: String,
			required: false,
			default: 'Search Azion'
		}
	})

	const { algoliaAppId, algoliaApiKey, algoliaIndex, algoliaModel } = props

	let isDialogActive = ref(false)

	function setHtmlOverflow(overflow) {
		if (typeof document === 'undefined') return
		document.documentElement.style.overflow = overflow
	}

	function focusSearchInput() {
		setTimeout(function () {
			document.querySelectorAll('.ais-SearchBox-form input[type=search]')[0]?.focus()
		}, 800)
	}

	function activeDialog() {
		isDialogActive.value = true

		focusSearchInput()
		setHtmlOverflow('hidden')
	}

	function closeDialog() {
		isDialogActive.value = false
		setHtmlOverflow('auto')
	}

	/////////////////////////////////
	// CAPTURE cmd + k or ctrl + k //
	/////////////////////////////////

	function onWindowKeydown(event) {
		if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
			event.preventDefault()
			activeDialog()
		}
	}

	onMounted(() => {
		window.addEventListener('keydown', onWindowKeydown)
	})

	onBeforeUnmount(() => {
		window.removeEventListener('keydown', onWindowKeydown)
	})
</script>
