<template>
	<!-- Clips the entering panel's offset, which would otherwise widen the document. The
	     spacing is chrome for the strip, so a block without one sits flush in the prose. -->
	<div ref="root" :class="['relative overflow-hidden', strip.length ? 'py-(--spacing-md)' : '']">
		<!-- Composed, not standalone: the List slides one indicator and owns the keyboard model. -->
		<TabViewRoot v-if="strip.length" :value="curr" :data-testid="uid" @update:value="onValueChange">
			<TabViewList data-doc-chrome>
				<TabViewItem
					v-for="tab in strip"
					:key="tab.key"
					:value="tab.key"
					:data-testid="tabTestId(tab.key)"
				>
					<slot v-if="tab.slot" :name="tab.slot" />
					<template v-else>{{ tab.label }}</template>
				</TabViewItem>
			</TabViewList>
		</TabViewRoot>

		<!-- `v-show`, not `v-if`: every interface's panel stays in the served HTML for search. -->
		<Transition
			v-for="panel in panels"
			:key="panel.key"
			:enter-from-class="enterFrom"
			enter-active-class="transition duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
			leave-active-class="hidden"
		>
			<div
				v-show="curr === panel.key"
				:data-panel-key="panel.key"
				:class="
					strip.length
						? 'pt-(--spacing-md) [&>astro-slot>:is(h2,h3,h4,h5)[data-tab-panel-heading]]:pt-0'
						: '[&>astro-slot>:is(h2,h3,h4,h5)[data-tab-panel-heading]]:pt-(--spacing-md)'
				"
				:role="strip.length ? 'tabpanel' : undefined"
			>
				<slot :name="panel.slot" />
			</div>
		</Transition>
	</div>
</template>

<script lang="ts">
import { onMounted, onUnmounted, ref, toValue, type MaybeRefOrGetter, type Ref } from 'vue';

type TabStore = {
	[key: string]: {
		curr: string;
	};
};

/** Module scope, so every island importing this file shares one store. */
const listeners = new Set<() => void>();
let state: TabStore = {};

/** Stores that outlive the page. `pricing-tabs` stays in memory: the nav deep-links it by hash. */
const PERSISTED_STORES = new Set(['interface']);
const STORAGE_PREFIX = 'docs-tabs-';
const KEY_PATTERN = /^[a-z0-9]+$/;

/** `?interface=cli`, which leaves the fragment to a section; links to `#interface=cli` still read. */
const readUrl = (storeKey: string): string | undefined => {
	const value =
		new URLSearchParams(window.location.search).get(storeKey) ??
		new URLSearchParams(window.location.hash.slice(1)).get(storeKey);
	return value && KEY_PATTERN.test(value) ? value : undefined;
};

const readStorage = (storeKey: string): string | undefined => {
	try {
		return localStorage.getItem(STORAGE_PREFIX + storeKey) ?? undefined;
	} catch {
		return undefined; // storage unavailable
	}
};

const writeStorage = (storeKey: string, value: string) => {
	try {
		localStorage.setItem(STORAGE_PREFIX + storeKey, value);
	} catch {
		// storage unavailable
	}
};

/** Keeps a section fragment; replaceState neither scrolls nor adds history. */
const writeUrl = (storeKey: string, value: string) => {
	try {
		const url = new URL(window.location.href);
		url.searchParams.set(storeKey, value);
		if (new URLSearchParams(url.hash.slice(1)).has(storeKey)) url.hash = '';
		history.replaceState(history.state, '', url);
	} catch {
		// sandboxed document
	}
};

/** Notifies on subscribe, as nanostores does; listeners read `state` themselves. */
const subscribe = (listener: () => void) => {
	listeners.add(listener);
	listener();
	return () => {
		listeners.delete(listener);
	};
};

/** A selection: updates memory, mirrors a persisted store to its carriers, notifies. */
const setKey = (key: string, value: TabStore[string], { url = true } = {}) => {
	if (state[key]?.curr === value.curr) return;
	state = { ...state, [key]: value };
	if (PERSISTED_STORES.has(key) && typeof window !== 'undefined') {
		writeStorage(key, value.curr);
		if (url) writeUrl(key, value.curr);
	}
	for (const listener of [...listeners]) listener();
};

/** The URL beats storage, both beat the first tab. Never writes the URL: a heading hash survives. */
const seed = (storeKey: string) => {
	if (!PERSISTED_STORES.has(storeKey) || state[storeKey]) return;
	const fromUrl = readUrl(storeKey);
	const curr = fromUrl ?? readStorage(storeKey);
	if (!curr) return;
	state = { ...state, [storeKey]: { curr } };
	if (fromUrl) writeStorage(storeKey, fromUrl);
};

/** Panel heading links, and any link an author writes as `?interface=<key>#<section>`. */
const PANEL_ANCHOR = 'a[data-tab-panel-anchor], a[href^="?interface="]';

/** Its destination: this URL with the link's interface and section, other parameters kept. */
const panelUrl = (anchor: HTMLAnchorElement): URL | undefined => {
	const target = new URL(anchor.href);
	const key = target.searchParams.get('interface');
	if (target.pathname !== window.location.pathname || !key || !KEY_PATTERN.test(key)) return;
	const url = new URL(window.location.href);
	url.searchParams.set('interface', key);
	url.hash = target.hash;
	return url;
};

/** Copied and modified-click links carry the merged destination too. */
const resolvePanelAnchors = () => {
	for (const anchor of document.querySelectorAll<HTMLAnchorElement>(PANEL_ANCHOR)) {
		const url = panelUrl(anchor);
		if (!url) continue;
		// The rewritten href no longer starts with `?interface=`, so mark it to stay matched.
		anchor.setAttribute('data-tab-panel-anchor', '');
		anchor.setAttribute('href', url.search + url.hash);
	}
};

/** Each history entry remembers its selection, so Back restores one whose URL names none. */
const HISTORY_KEY = 'docsTabsInterface';

let panelAnchorsWired = false;
const wirePanelAnchors = (fallback: string) => {
	resolvePanelAnchors();
	if (panelAnchorsWired) return;
	panelAnchorsWired = true;
	history.replaceState({ ...history.state, [HISTORY_KEY]: state.interface?.curr ?? fallback }, '');
	document.addEventListener('click', (event) => {
		const anchor = (event.target as Element | null)?.closest?.(PANEL_ANCHOR);
		if (!(anchor instanceof HTMLAnchorElement) || event.defaultPrevented) return;
		if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
			return;
		const url = panelUrl(anchor);
		const key = url?.searchParams.get('interface');
		if (!url || !key) return;
		event.preventDefault();
		setKey('interface', { curr: key }, { url: false });
		if (url.href !== window.location.href)
			history.pushState({ ...history.state, [HISTORY_KEY]: key }, '', url);
		document.getElementById(decodeURIComponent(url.hash.slice(1)))?.scrollIntoView();
	});
	window.addEventListener('popstate', (event) => {
		const key = readUrl('interface') ?? event.state?.[HISTORY_KEY];
		if (typeof key === 'string' && KEY_PATTERN.test(key))
			setKey('interface', { curr: key }, { url: false });
		resolvePanelAnchors();
	});
};

/** A shared value this block does not offer falls back locally, leaving the store alone. */
export function useSharedTab(
	storeKey: string | undefined,
	fallback: string,
	keys?: MaybeRefOrGetter<readonly string[]>
): Ref<string> {
	const curr = ref(fallback);

	let unsubscribe: (() => void) | undefined;

	onMounted(() => {
		if (!storeKey) return;
		seed(storeKey);
		if (storeKey === 'interface') wirePanelAnchors(fallback);
		unsubscribe = subscribe(() => {
			const next = state[storeKey]?.curr;
			if (!next) return;
			const valid = toValue(keys);
			curr.value = valid && !valid.includes(next) ? fallback : next;
		});
	});

	onUnmounted(() => unsubscribe?.());

	return curr;
}

export function useTabState(
	initial: string,
	storeKey?: string,
	keys?: MaybeRefOrGetter<readonly string[]>
) {
	const curr = useSharedTab(storeKey, initial, keys);

	const setCurr = (next: string) => {
		if (storeKey) {
			setKey(storeKey, { curr: next });
			return;
		}
		curr.value = next;
	};

	return { curr, setCurr };
}
</script>

<script setup lang="ts">
import TabView from '@aziontech/webkit/tab-view';
import { computed, nextTick, useId, useSlots, watch } from 'vue';

const TabViewRoot = TabView.Root;
const TabViewList = TabView.List;
const TabViewItem = TabView.Item;

const props = defineProps<{
	sharedStore?: string;
}>();

/** Consumer-named: `tab.<key>` pairs with `panel.<key>`, so the declaration is an index signature. */
defineSlots<Record<string, () => unknown>>();

const TAB_PREFIX = 'tab.';
const PANEL_PREFIX = 'panel.';

const slots = useSlots();

const slotsNamed = (prefix: string) =>
	Object.keys(slots)
		.filter((name) => name.startsWith(prefix))
		.map((name) => ({ slot: name, key: name.slice(prefix.length) }));

const tabs = computed(() => slotsNamed(TAB_PREFIX));

/**
 * The strip this block renders: its own `tab.*` slots, or, for a panel-only block of the
 * interface store, one built from its panel keys — so the reader switches at any section,
 * not only where the page declares the tabs.
 */
const INTERFACE_LABELS: Record<string, string> = {
	console: 'Console',
	api: 'API',
	cli: 'CLI',
	github: 'GitHub',
	playground: 'GraphiQL',
};

/** One order on every page: the interfaces a reader picks first, whatever order the MDX declares. */
const INTERFACE_ORDER = ['console', 'playground', 'cli', 'github', 'api'];
const byInterface = <T extends { key: string }>(tabs: T[]) =>
	[...tabs].sort(
		(a, b) =>
			(INTERFACE_ORDER.indexOf(a.key) + 1 || Infinity) -
			(INTERFACE_ORDER.indexOf(b.key) + 1 || Infinity)
	);

const strip = computed(() => {
	const own = tabs.value.map((tab) => ({ ...tab, label: '' }));
	if (props.sharedStore !== 'interface') return own;
	if (own.length) return byInterface(own);
	const panelSlots = slotsNamed(PANEL_PREFIX);
	if (panelSlots.length < 2) return [];
	return byInterface(
		panelSlots.map(({ key }) => ({ key, slot: '', label: INTERFACE_LABELS[key] ?? key }))
	);
});

const panels = computed(() => {
	const remaining = new Map(slotsNamed(PANEL_PREFIX).map((panel) => [panel.key, panel]));

	const paired = strip.value.flatMap(({ key }) => {
		const panel = remaining.get(key);
		if (!panel) return [];
		remaining.delete(key);
		return [panel];
	});

	return [...paired, ...remaining.values()];
});

/** A block whose keys the strip cannot name still follows the store through its panels. */
const ownKeys = computed(() =>
	(strip.value.length ? strip.value : panels.value).map(({ key }) => key)
);

const { curr, setCurr } = useTabState(
	ownKeys.value[0] ?? '',
	props.sharedStore,
	() => ownKeys.value
);

const root = ref<HTMLElement | null>(null);

/**
 * TabView builds its tab and panel ids from an id it generates internally, so the pairing
 * can only be read off the rendered strip. Each panel then takes the id its tab points at
 * and names that tab back.
 */
const pairIds = () => {
	for (const panel of root.value?.querySelectorAll<HTMLElement>('[data-panel-key]') ?? []) {
		const tab = root.value?.querySelector(
			`[data-testid="${tabTestId(panel.dataset.panelKey ?? '')}"]`
		);
		if (!tab) continue;
		const controls = tab.getAttribute('aria-controls');
		if (controls) panel.id = controls;
		if (tab.id) panel.setAttribute('aria-labelledby', tab.id);
	}
};

watch(strip, () => void nextTick(pairIds), { immediate: true });

const uid = useId();
function tabTestId(key: string) {
	return `${uid}-${key}`;
}

/**
 * The Root is controlled by the store; clicks and arrow keys both arrive here.
 * Every block switches at once, so a panel above this one changing height would slide
 * the strip out from under the pointer: the scroll follows it instead.
 */
const onValueChange = (next: string | number | null) => {
	if (next === null) return;
	const before = root.value?.getBoundingClientRect().top;
	setCurr(String(next));
	if (before === undefined) return;
	// Each pass measures against the same mark, so whichever runs first makes the next a no-op.
	const hold = () => {
		const after = root.value?.getBoundingClientRect().top;
		if (after === undefined || after === before) return;
		window.scrollBy({ top: after - before, behavior: 'instant' });
	};
	void nextTick(hold);
	if (typeof requestAnimationFrame === 'function') requestAnimationFrame(hold);
};

/** The side a panel enters from, by direction of travel. Pre-flush, so it is set before the enter. */
const enterFrom = ref('opacity-0');
let previous = curr.value;

watch(curr, (next) => {
	const from = ownKeys.value.indexOf(previous);
	const to = ownKeys.value.indexOf(next);
	previous = next;

	if (from === -1 || to === -1 || from === to) {
		enterFrom.value = 'opacity-0';
		return;
	}

	enterFrom.value =
		to > from ? 'opacity-0 translate-x-(--spacing-md)' : 'opacity-0 -translate-x-(--spacing-md)';
});
</script>
