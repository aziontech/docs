<template>
	<span class="inline-flex h-8 items-center">
		<ThemeSwitcher v-model:value="mode" aria-label="Theme" />
	</span>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

import ThemeSwitcher from '@aziontech/webkit/theme-switcher';

const STORAGE_KEY = 'prefers-color-scheme';

const THEMES = [
	{ value: 'system', label: 'System' },
	{ value: 'dark', label: 'Dark' },
	{ value: 'light', label: 'Light' },
];

const SYSTEM_THEME = THEMES[0];

const selectedTheme = ref(SYSTEM_THEME);
const systemColorScheme = ref();
const isWatchingSystemScheme = ref(false);

const mode = computed({
	get: () => selectedTheme.value.value,
	set: (value) => handleThemeChange(THEMES.find((theme) => theme.value === value)),
});

onMounted(() => {
	systemColorScheme.value = window.matchMedia('(prefers-color-scheme: dark)');
	const colorScheme = localStorage.getItem(STORAGE_KEY);

	if (colorScheme && colorScheme !== SYSTEM_THEME.label)
		selectedTheme.value = THEMES.find((theme) => theme.label === colorScheme);
	else watchSystemColorSchemePreferences();
});

onBeforeUnmount(() => {
	if (isWatchingSystemScheme.value) removeWatchSystemColorSchemePreferences();
});

function watchSystemColorSchemePreferences() {
	isWatchingSystemScheme.value = true;
	systemColorScheme.value.addEventListener('change', handlePreferColorSchemeChange);
}

function removeWatchSystemColorSchemePreferences() {
	isWatchingSystemScheme.value = false;
	systemColorScheme.value.removeEventListener('change', handlePreferColorSchemeChange);
}

function getSystemDefaultTheme() {
	return systemColorScheme.value.matches ? 'Dark' : 'Light';
}

function toggleTheme(add, remove) {
	document.documentElement.classList.add(add);
	document.documentElement.classList.remove(remove);
}

function changeTheme(theme) {
	if (selectedTheme.value.label === theme.label && theme.label !== SYSTEM_THEME.label) return;

	selectedTheme.value = theme;
	const themeLabel = theme.label === SYSTEM_THEME.label ? getSystemDefaultTheme() : theme.label;

	if (themeLabel === 'Light') toggleTheme('azion-light', 'azion-dark');
	if (themeLabel === 'Dark') toggleTheme('azion-dark', 'azion-light');
}

function handlePreferColorSchemeChange() {
	const colorScheme = localStorage.getItem(STORAGE_KEY);
	if (colorScheme == SYSTEM_THEME.label || !colorScheme) changeTheme(SYSTEM_THEME);
}

function handleThemeChange(theme) {
	changeTheme(theme);

	if (!isWatchingSystemScheme.value && theme.label === SYSTEM_THEME.label)
		watchSystemColorSchemePreferences();
	if (isWatchingSystemScheme.value && theme.label !== SYSTEM_THEME.label)
		removeWatchSystemColorSchemePreferences();

	localStorage.setItem(STORAGE_KEY, theme.label);
}
</script>
