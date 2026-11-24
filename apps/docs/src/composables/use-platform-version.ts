import { onMounted, readonly, ref, type Ref } from 'vue';

import {
	CURRENT_VERSION,
	PAGE_VERSION_ATTR,
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

function readStored(): PlatformVersion | undefined {
	try {
		const fromUrl = new URL(window.location.href).searchParams.get(VERSION_PARAM);
		if (isPlatformVersion(fromUrl)) return fromUrl;
	} catch {
		// no usable URL
	}
	try {
		const stored = window.localStorage.getItem(VERSION_STORAGE_KEY);
		if (isPlatformVersion(stored)) return stored;
	} catch {
		// storage blocked
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
	try {
		const url = new URL(window.location.href);
		url.searchParams.set(VERSION_PARAM, next);
		window.history.replaceState(window.history.state, '', url);
	} catch {
		// no usable URL
	}
	reflect(next);
}

export interface UsePlatformVersionReturn {
	version: Readonly<Ref<PlatformVersion>>;
	setVersion: (next: PlatformVersion) => void;
}

/** Client only: the version the pre-paint script found the page to cover, when it covers one. */
function readPageVersion(): PlatformVersion | undefined {
	const value = document.documentElement.getAttribute(PAGE_VERSION_ATTR);
	return isPlatformVersion(value) ? value : undefined;
}

/** A page of a single version wins over the stored choice, and the choice follows it. */
function applyPageVersion(version: PlatformVersion): void {
	pageApplied = true;
	restored = true;
	current.value = version;
	try {
		window.localStorage.setItem(VERSION_STORAGE_KEY, version);
	} catch {
		// storage blocked
	}
	reflect(version);
}

/**
 * @param pageVersion The single version the page covers, when it covers only one. Islands that
 * mount away from the page's data (the drawer) omit it and read what the pre-paint script set.
 */
export function usePlatformVersion(pageVersion?: PlatformVersion): UsePlatformVersionReturn {
	// The server never touches the singleton, which would leak between requests.
	if (typeof window === 'undefined') {
		return {
			version: readonly(ref(pageVersion ?? CURRENT_VERSION)) as Readonly<Ref<PlatformVersion>>,
			setVersion,
		};
	}
	// Synchronous, before the first render, so the island hydrates in the page's version.
	if (!pageApplied) {
		const page = pageVersion ?? readPageVersion();
		if (page) applyPageVersion(page);
	}
	onMounted(() => {
		if (!restored) {
			restored = true;
			const stored = readStored();
			if (stored) current.value = stored;
		}
		reflect(current.value);
	});
	return { version: readonly(current) as Readonly<Ref<PlatformVersion>>, setVersion };
}
