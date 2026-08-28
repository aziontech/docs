<template>
	<div
		ref="rootRef"
		class="relative inline-flex cursor-pointer select-none rounded-[var(--shape-elements)] border border-default bg-surface text-default transition-colors hover:bg-hover focus-within:ring-2 focus-within:ring-[var(--ring-color)]"
		:class="{ 'ring-2 ring-[var(--ring-color)]': isOpen }"
	>
		<button
			type="button"
			class="flex flex-auto items-center overflow-hidden whitespace-nowrap border-none bg-transparent px-[var(--spacing-xs)] py-[var(--spacing-xxs)] text-left text-sm text-default outline-none cursor-pointer"
			:aria-label="selectedTheme.label"
			aria-haspopup="listbox"
			:aria-expanded="isOpen"
			@click="toggle"
			@keydown="onTriggerKeydown"
		>
			<span class="flex items-center gap-2">
				<i :class="selectedTheme.icon"></i>
				<span>{{ selectedTheme.label }}</span>
			</span>
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
					aria-label="Theme"
				>
					<li
						v-for="theme in themes"
						:key="theme.label"
						class="flex items-center rounded-[var(--shape-elements)] px-[var(--spacing-sm)] py-[var(--spacing-xs)] text-sm text-default transition-colors outline-offset-[-2px] hover:bg-hover focus-visible:outline-2 focus-visible:outline-[var(--ring-color)]"
						:class="{ 'bg-selected': theme.label === selectedTheme.label }"
						role="option"
						:aria-selected="theme.label === selectedTheme.label"
						tabindex="0"
						@click="selectOption(theme)"
						@keydown.enter.prevent="selectOption(theme)"
						@keydown.space.prevent="selectOption(theme)"
						@keydown.esc.prevent="close(true)"
					>
						<div class="flex items-center gap-2">
							<i :class="theme.icon"></i>
							<div>{{ theme.label }}</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { onBeforeUnmount, onMounted, ref } from 'vue'

	const selectedTheme = ref({
		label: 'System',
		icon: 'pi pi-desktop'
	})

	const themes = [
		{
			label: 'System',
			icon: 'pi pi-desktop'
		},
		{
			label: 'Dark',
			icon: 'pi pi-moon'
		},
		{
			label: 'Light',
			icon: 'pi pi-sun'
		}
	]

	let systemColorScheme = ref()
	let isWatchingSystemScheme = ref(false)

	const rootRef = ref(null)
	const isOpen = ref(false)
	const openUpward = ref(false)

	onMounted(() => {
		systemColorScheme.value = window.matchMedia('(prefers-color-scheme: dark)') // Get system prefered color scheme
		const colorScheme = localStorage.getItem('prefers-color-scheme') // Check if there is pre-defined site prefered color scheme

		if (colorScheme && colorScheme !== 'System')
			selectedTheme.value = themes.find((theme) => theme.label === colorScheme)
		// update dropdown placeholder value
		else watchSystemColorSchemePreferences()

		document.addEventListener('click', onDocumentClick)
		document.addEventListener('keydown', onDocumentKeydown)
	})

	onBeforeUnmount(() => {
		document.removeEventListener('click', onDocumentClick)
		document.removeEventListener('keydown', onDocumentKeydown)
	})

	// Watch for changes on system color scheme changes
	function watchSystemColorSchemePreferences() {
		isWatchingSystemScheme.value = true
		systemColorScheme.value.addEventListener('change', handlePreferColorSchemeChange)
	}

	function removeWatchSystemColorSchemePreferences() {
		isWatchingSystemScheme.value = false
		systemColorScheme.value.removeEventListener('change', handlePreferColorSchemeChange)
	}

	function getStystemDefaultTheme() {
		return systemColorScheme.value.matches ? 'Dark' : 'Light'
	}

	function toggleTheme(add, remove) {
		document.documentElement.classList.add(add)
		document.documentElement.classList.remove(remove)
	}

	function changeTheme(theme) {
		if (selectedTheme.value.label === theme.label && theme.label !== 'System') return

		selectedTheme.value = theme
		const themeLabel = theme.label === 'System' ? getStystemDefaultTheme() : theme.label

		if (themeLabel === 'Light') toggleTheme('azion-light', 'azion-dark')
		if (themeLabel === 'Dark') toggleTheme('azion-dark', 'azion-light')
	}

	function handlePreferColorSchemeChange() {
		const colorScheme = localStorage.getItem('prefers-color-scheme')
		if (colorScheme == 'System' || !colorScheme) changeTheme(themes[0]) // Select the 'System' in the themes array
	}

	function handleThemeChange(theme) {
		changeTheme(theme)

		if (!isWatchingSystemScheme.value && theme.label === 'System')
			watchSystemColorSchemePreferences()
		if (isWatchingSystemScheme.value && theme.label !== 'System')
			removeWatchSystemColorSchemePreferences()
		localStorage.setItem('prefers-color-scheme', theme.label)
	}

	function selectOption(theme) {
		handleThemeChange(theme)
		close(true)
	}

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
</script>
