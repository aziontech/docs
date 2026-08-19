<template>
	<div
		ref="rootRef"
		class="p-dropdown p-component p-inputwrapper p-inputwrapper-filled relative inline-flex cursor-pointer select-none"
		:class="{ 'p-focus': isOpen }"
	>
		<button
			type="button"
			class="p-dropdown-label p-inputtext flex-auto flex items-center bg-transparent border-none cursor-pointer text-left overflow-hidden whitespace-nowrap"
			:aria-label="selectedTheme.label"
			aria-haspopup="listbox"
			:aria-expanded="isOpen"
			@click="toggle"
			@keydown="onTriggerKeydown"
		>
			<span class="flex gap-2 align-items-center">
				<i :class="selectedTheme.icon"></i>
				<span>{{ selectedTheme.label }}</span>
			</span>
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
					aria-label="Theme"
				>
					<li
						v-for="theme in themes"
						:key="theme.label"
						class="p-dropdown-item"
						:class="{ 'p-highlight': theme.label === selectedTheme.label }"
						role="option"
						:aria-selected="theme.label === selectedTheme.label"
						tabindex="0"
						@click="selectOption(theme)"
						@keydown.enter.prevent="selectOption(theme)"
						@keydown.space.prevent="selectOption(theme)"
						@keydown.esc.prevent="close(true)"
					>
						<div class="flex gap-2 align-items-center">
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
