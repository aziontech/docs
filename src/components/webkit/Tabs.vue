<template>
	<!-- Clips the entering panel's offset, which would otherwise widen the document. The
	     spacing is chrome for the strip, so a block without one sits flush in the prose. -->
	<div :class="['relative overflow-hidden', tabs.length ? 'py-(--spacing-md)' : '']">
		<!-- Composed, not standalone: the List slides one indicator and owns the keyboard model. -->
		<TabViewRoot v-if="tabs.length" :value="curr" :data-testid="uid" @update:value="onValueChange">
			<TabViewList data-doc-chrome>
				<TabViewItem
					v-for="tab in tabs"
					:key="tab.key"
					:value="tab.key"
					:data-testid="tabTestId(tab.key)"
				>
					<slot :name="tab.slot" />
				</TabViewItem>
			</TabViewList>
		</TabViewRoot>

		<!-- `v-show`, not `v-if`: every interface's panel stays in the served HTML for search. -->
		<Transition
			v-for="panel in panels"
			:key="panel.key"
			:enter-from-class="enterFrom"
			enter-active-class="transition duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
		>
			<div
				v-show="curr === panel.key"
				:class="tabs.length ? 'pt-(--spacing-md)' : ''"
				:role="tabs.length ? 'tabpanel' : undefined"
				:aria-labelledby="panel.labelledBy"
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

/** `#interface=cli`; heading ids from rehype-slug never contain `=`, so they parse to null. */
const readHash = (storeKey: string): string | undefined => {
	const value = new URLSearchParams(window.location.hash.slice(1)).get(storeKey);
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

/** A fragment-only URL keeps path and query; replaceState neither scrolls nor adds history. */
const writeHash = (storeKey: string, value: string) => {
	try {
		history.replaceState(history.state, '', `#${storeKey}=${value}`);
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
const setKey = (key: string, value: TabStore[string]) => {
	if (state[key]?.curr === value.curr) return;
	state = { ...state, [key]: value };
	if (PERSISTED_STORES.has(key) && typeof window !== 'undefined') {
		writeStorage(key, value.curr);
		writeHash(key, value.curr);
	}
	for (const listener of [...listeners]) listener();
};

/** Fragment beats storage, both beat the first tab. Never writes the URL: a heading hash survives. */
const seed = (storeKey: string) => {
	if (!PERSISTED_STORES.has(storeKey) || state[storeKey]) return;
	const fromHash = readHash(storeKey);
	const curr = fromHash ?? readStorage(storeKey);
	if (!curr) return;
	state = { ...state, [storeKey]: { curr } };
	if (fromHash) writeStorage(storeKey, fromHash);
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
import { computed, useId, useSlots, watch } from 'vue';

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

const panels = computed(() => {
	const remaining = new Map(slotsNamed(PANEL_PREFIX).map((panel) => [panel.key, panel]));

	const paired = tabs.value.flatMap(({ key }) => {
		const panel = remaining.get(key);
		if (!panel) return [];
		remaining.delete(key);
		return [{ ...panel, labelledBy: tabTestId(key) + '__tab' }];
	});

	return [
		...paired,
		...[...remaining.values()].map((panel) => ({ ...panel, labelledBy: undefined })),
	];
});

/** A block with no `tab.*` slots renders panels alone, so one strip at the top drives the page. */
const ownKeys = computed(() =>
	(tabs.value.length ? tabs.value : panels.value).map(({ key }) => key)
);

const { curr, setCurr } = useTabState(
	ownKeys.value[0] ?? '',
	props.sharedStore,
	() => ownKeys.value
);

const uid = useId();
function tabTestId(key: string) {
	return `${uid}-${key}`;
}

/** The Root is controlled by the store; clicks and arrow keys both arrive here. */
const onValueChange = (next: string | number | null) => {
	if (next !== null) setCurr(String(next));
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
