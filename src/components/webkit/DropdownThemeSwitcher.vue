<template>
	<span class="inline-flex h-8 items-center">
		<!--
			Docs-side adapter around @aziontech/webkit's ThemeSwitcher.

			The design system owns the control itself — the three modes, their
			icons, the segmented layout, the sliding indicator and the keyboard
			radiogroup semantics. Everything below the control is this site's own
			business and stays here: reading and writing the preference, and
			painting the document.
		-->
		<ThemeSwitcher v-model:value="mode" aria-label="Theme" />
	</span>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

import ThemeSwitcher from '@aziontech/webkit/theme-switcher';

/*
	The storage key and the capitalized labels written into it are a contract,
	not an implementation detail: BaseLayout.astro reads the same key in a
	blocking inline script (and monkey-patches `localStorage.setItem` to re-run
	itself on every write) so the very first paint is already themed, and every
	visitor who has used the site already has one of these exact strings saved.
	The webkit control speaks lowercase mode names, so the two vocabularies are
	paired here rather than migrating the stored value — a format change would
	silently reset the theme for everyone.
*/

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

	// Only an explicit Light/Dark choice pins the control; anything else (no
	// stored value, or the literal 'System') leaves it following the OS, which
	// means subscribing to the media query.
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
	// Re-picking the mode already in effect is a no-op, except for 'System':
	// that path is also how a media-query change re-applies the OS preference.
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

	// The write is what actually repaints the page: BaseLayout's patched
	// `setItem` picks it up and applies the theme to <html> for real.
	localStorage.setItem(STORAGE_KEY, theme.label);
}
</script>
