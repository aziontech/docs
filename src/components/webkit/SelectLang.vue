<template>
	<div
		v-if="i18nPages"
		ref="rootRef"
		class="p-dropdown p-component p-inputwrapper p-inputwrapper-filled relative inline-flex cursor-pointer select-none w-full"
		:class="{ 'p-focus': isOpen }"
	>
		<button
			type="button"
			class="p-dropdown-label p-inputtext flex-auto flex items-center bg-transparent border-none cursor-pointer text-left w-full overflow-hidden whitespace-nowrap"
			:aria-label="activeLang?.lang"
			aria-haspopup="listbox"
			:aria-expanded="isOpen"
			@click="toggle"
			@keydown="onTriggerKeydown"
		>
			<span v-if="activeLang">{{ activeLang.lang }}</span>
		</button>
		<span
			class="p-dropdown-trigger flex items-center justify-center shrink-0"
			aria-hidden="true"
			@click="toggle"
		>
			<span class="pi pi-chevron-down p-dropdown-trigger-icon text-xs"></span>
		</span>

		<div
			v-if="isOpen"
			class="p-dropdown-panel p-component absolute left-0 z-50 w-full min-w-max"
			:class="openUpward ? 'bottom-full mb-1' : 'top-full mt-1'"
		>
			<div class="p-dropdown-items-wrapper max-h-52 overflow-auto">
				<ul
					class="p-dropdown-items list-none m-0"
					role="listbox"
					:aria-label="activeLang?.lang"
				>
					<li
						v-for="(option, index) in i18nPages"
						:key="index"
						class="p-dropdown-item p-0"
						:class="{ 'p-highlight': option.lang === activeLang?.lang }"
						role="option"
						:aria-selected="option.lang === activeLang?.lang"
					>
						<a
							:href="option.slug"
							target="_self"
							class="w-full px-2 py-3 flex no-underline text-inherit"
							@keydown.esc.prevent="close(true)"
						>
							{{ option.lang }}
						</a>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { onBeforeUnmount, onMounted, ref } from 'vue'

	const props = defineProps({
		i18nPages: {
			type: Array,
			required: false
		},
		lang: {
			type: String,
			required: true,
			default: 'en'
		}
	})

	const activeLang = props.i18nPages
		? props.i18nPages.find((p) => p.langPrefix === props.lang.toLowerCase())
		: null

	const rootRef = ref(null)
	const isOpen = ref(false)
	const openUpward = ref(false)

	function toggle() {
		if (isOpen.value) {
			close()
			return
		}

		const rect = rootRef.value?.getBoundingClientRect()
		openUpward.value = rect ? window.innerHeight - rect.bottom < 200 : false
		isOpen.value = true
	}

	function close(refocus = false) {
		isOpen.value = false
		if (refocus) rootRef.value?.querySelector('button')?.focus()
	}

	function onTriggerKeydown(event) {
		if (event.key === 'Escape' && isOpen.value) {
			event.preventDefault()
			close(true)
		}
		if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && !isOpen.value) {
			event.preventDefault()
			toggle()
		}
	}

	function onDocumentClick(event) {
		if (isOpen.value && rootRef.value && !rootRef.value.contains(event.target)) close()
	}

	function onDocumentKeydown(event) {
		if (event.key === 'Escape' && isOpen.value) close(true)
	}

	onMounted(() => {
		document.addEventListener('click', onDocumentClick)
		document.addEventListener('keydown', onDocumentKeydown)
	})

	onBeforeUnmount(() => {
		document.removeEventListener('click', onDocumentClick)
		document.removeEventListener('keydown', onDocumentKeydown)
	})
</script>
