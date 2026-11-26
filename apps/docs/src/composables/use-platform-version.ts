import { computed, onMounted, readonly, ref, type Ref } from 'vue';

import {
	CURRENT_VERSION,
	VERSION_PARAM,
	VERSION_STORAGE_KEY,
	isPlatformVersion,
	type PlatformVersion,
} from '~/nav/versions';

/**
 * Module singleton: one ref shared by every island on the page. A single-version page passes its
 * version, used on the server and in the first client render so hydration matches; otherwise both
 * start at CURRENT_VERSION and the stored choice enters in onMounted.
 */
const current = ref<PlatformVersion>(CURRENT_VERSION);
let restored = false;
let pageApplied = false;

/** Drops `?api=` from the address, so a later visit to this history entry never brings it back. */
function clearParam(): void {
	try {
		const url = new URL(window.location.href);
		if (!url.searchParams.has(VERSION_PARAM)) return;
		url.searchParams.delete(VERSION_PARAM);
		window.history.replaceState(window.history.state, '', url);
	} catch {
		// no usable URL
	}
}

// The pre-paint script has already stored a valid `?api=`, so storage holds the choice.
function readStored(): PlatformVersion | undefined {
	try {
		const stored = window.localStorage.getItem(VERSION_STORAGE_KEY);
		if (isPlatformVersion(stored)) return stored;
	} catch {
		// storage blocked
	}
	try {
		const fromUrl = new URL(window.location.href).searchParams.get(VERSION_PARAM);
		if (isPlatformVersion(fromUrl)) return fromUrl;
	} catch {
		// no usable URL
	}
	return undefined;
}

function reflect(version: PlatformVersion): void {
	document.documentElement.setAttribute('data-platform-version', version);
}

function setVersion(next: PlatformVersion): void {
	current.value = next;
	if (typeof window === 'undefined') return;
	try {
		window.localStorage.setItem(VERSION_STORAGE_KEY, next);
	} catch {
		// storage blocked
	}
	clearParam();
	reflect(next);
}

export interface UsePlatformVersionReturn {
	version: Readonly<Ref<PlatformVersion>>;
	setVersion: (next: PlatformVersion) => void;
}

/** A page of a single version shows that version while it is open; the stored choice stays as it was. */
function applyPageVersion(version: PlatformVersion): void {
	pageApplied = true;
	restored = true;
	current.value = version;
	reflect(version);
}

/** @param pageVersion The single version the page covers, when it covers only one. */
export function usePlatformVersion(pageVersion?: PlatformVersion): UsePlatformVersionReturn {
	// The server never touches the singleton, which would leak between requests.
	if (typeof window === 'undefined') {
		return {
			version: readonly(ref(pageVersion ?? CURRENT_VERSION)) as Readonly<Ref<PlatformVersion>>,
			setVersion,
		};
	}
	// Synchronous, before the first render, so the island hydrates in the page's version.
	if (!pageApplied && pageVersion) applyPageVersion(pageVersion);
	// Each island renders what the server rendered until it mounts itself: another island may
	// already have restored the stored choice, and reading it here would mismatch on hydration.
	const initial = pageVersion ?? CURRENT_VERSION;
	const hydrated = ref(false);
	onMounted(() => {
		if (!restored) {
			restored = true;
			const stored = readStored();
			if (stored) current.value = stored;
		}
		clearParam();
		reflect(current.value);
		hydrated.value = true;
	});
	const version = computed(() => (hydrated.value ? current.value : initial));
	return { version: version as Readonly<Ref<PlatformVersion>>, setVersion };
}
