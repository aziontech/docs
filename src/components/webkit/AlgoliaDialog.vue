<template>
	<!-- Teleport only after mount: a server-rendered teleport has no matching
	     node on the client when this hydrates as an Astro island. -->
	<!-- No <Transition> here on purpose: Vue transitions depend on
	     requestAnimationFrame, which stalls in throttled/background tabs.
	     A stalled enter left the overlay stuck semi-transparent (content
	     appeared to leak over the page) and a stalled leave kept the
	     dialog in the DOM after close (Escape appeared not to work). -->
	<Teleport
		v-if='isMounted'
		to='body'
	>
		<div
			v-if='isDialogActive'
			class='fixed inset-0 z-[1101] flex items-start justify-center bg-black/40 pt-12'
			role='presentation'
			@mousedown.self='toggleDialog(false)'
		>
			<div
				class='relative flex max-h-[85vh] w-[95vw] flex-col overflow-y-auto rounded-md border surface-border surface-section shadow-lg md:w-[85vw] lg:w-[75vw] xl:w-[65vw]'
				role='dialog'
				aria-modal='true'
				aria-label='Search'
			>
				<KeyboardKey
					v-if='!hasInputValue'
					keyname='esc'
					class='absolute z-50 right-2 top-2'
					@clicked='toggleDialog(false)'
				/>

				<AlgoliaInstantSearch
					:algoliaAppId='algoliaAppId'
					:algoliaApiKey='algoliaApiKey'
					:algoliaIndex='algoliaIndex'
					:algoliaModel='algoliaModel'
					:inputPlaceholder='inputPlaceholder'
					@keyup='pressKeyboardKey'
					@keydown='pressKeyboardKey'
				/>
			</div>
		</div>
	</Teleport>
</template>

<script setup>
	import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
	import AlgoliaInstantSearch from './AlgoliaInstantSearch.vue'
	import KeyboardKey from './KeyboardKey.vue'

	const emit = defineEmits(['close', 'open'])
	const hasInputValue = ref(false)
	const props = defineProps({
		isDialogActive: Boolean,
		algoliaAppId: String,
		algoliaApiKey: String,
		algoliaIndex: Array,
		algoliaModel: Array,
		inputPlaceholder: {
			type: String,
			required: false
		}
	})

	const { algoliaAppId, algoliaApiKey, algoliaIndex, algoliaModel } = props
	const isDialogActive = ref(props.isDialogActive)
	const isMounted = ref(false)

	// The webkit v1 original synced the prop inside onUpdated, which only
	// worked because its template happened to re-render on prop changes.
	// Watch the prop directly instead.
	watch(
		() => props.isDialogActive,
		(value) => {
			isDialogActive.value = value
		}
	)

	function toggleDialog(action) {
		if (!action) {
			isDialogActive.value = false
			emit('close')

			return
		}

		isDialogActive.value = true
		emit('open')
	}

	function pressKeyboardKey() {
		let algoliaSearchInput = document.querySelectorAll('.ais-SearchBox-form input[type=search]')[0]
		algoliaSearchInput?.value?.length ? (hasInputValue.value = true) : (hasInputValue.value = false)
	}

	function onDocumentKeydown(event) {
		if (event.key === 'Escape' && isDialogActive.value) toggleDialog(false)
	}

	onMounted(() => {
		isMounted.value = true
		document.addEventListener('keydown', onDocumentKeydown)
	})

	onBeforeUnmount(() => {
		document.removeEventListener('keydown', onDocumentKeydown)
	})
</script>
