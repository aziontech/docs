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

	<button
		type='button'
		aria-label='Search'
		class='text-neutral-900 flex-none border-header p-2 bg-transparent xl:border-hidden inline-flex cursor-pointer items-center justify-center rounded-md xl:p-6'
		@click='activeDialog'
	>
		<i class='pi pi-search xl:text-neutral-200'></i>
	</button>
</template>

<script setup>
	import { ref, onMounted, onBeforeUnmount } from 'vue'
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
