<template>
	<div
		v-if="i18nPages"
		ref="rootRef"
		class="relative inline-flex w-full cursor-pointer select-none rounded-[var(--shape-elements)] border border-default bg-surface text-default transition-colors hover:bg-hover focus-within:ring-2 focus-within:ring-[var(--ring-color)]"
		:class="{ 'ring-2 ring-[var(--ring-color)]': isOpen }"
	>
		<button
			type="button"
			class="flex flex-auto w-full items-center overflow-hidden whitespace-nowrap border-none bg-transparent px-[var(--spacing-xs)] py-[var(--spacing-xxs)] text-left text-sm text-default outline-none cursor-pointer"
			:aria-label="activeLang?.lang"
			aria-haspopup="listbox"
			:aria-expanded="isOpen"
			@click="toggle"
			@keydown="onTriggerKeydown"
		>
			<span v-if="activeLang">{{ activeLang.lang }}</span>
		</button>
		<span
			class="flex w-8 shrink-0 items-center justify-center text-default"
			aria-hidden="true"
			@click="toggle"
		>
			<span class="pi pi-chevron-down text-xs"></span>
		</span>

		<div
			v-if="isOpen"
			class="absolute left-0 z-[var(--z-input-popup)] w-full min-w-max overflow-hidden rounded-[var(--shape-elements)] border border-default bg-surface-raised text-default shadow-lg"
			:class="openUpward ? 'bottom-full mb-1' : 'top-full mt-1'"
		>
			<div class="max-h-52 overflow-auto">
				<ul
					class="list-none m-0 p-[var(--spacing-xxs)]"
					role="listbox"
					:aria-label="activeLang?.lang"
				>
					<li
						v-for="(option, index) in i18nPages"
						:key="index"
						class="flex items-center rounded-[var(--shape-elements)] p-0 text-sm text-default transition-colors hover:bg-hover"
						:class="{ 'bg-selected': option.lang === activeLang?.lang }"
						role="option"
						:aria-selected="option.lang === activeLang?.lang"
					>
						<a
							:href="option.slug"
							target="_self"
							class="flex w-full items-center rounded-[inherit] px-[var(--spacing-sm)] py-[var(--spacing-xs)] no-underline text-inherit outline-offset-[-2px] focus-visible:outline-2 focus-visible:outline-[var(--ring-color)]"
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
