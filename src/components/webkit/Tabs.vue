<template>
	<div class="relative py-(--spacing-md)">
		<div
			ref="tablistRef"
			data-doc-chrome
			class="flex items-end gap-(--spacing-xs) overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
			role="tablist"
			@keydown="onKeydown"
		>
			<TabViewItem
				v-for="tab in tabs"
				:key="tab.key"
				:value="tab.key"
				:selected="curr === tab.key"
				:data-testid="tabTestId(tab.key)"
				@click="onTabClick($event, tab.key)"
			>
				<slot :name="tab.slot" />
			</TabViewItem>
		</div>

		<div
			v-for="panel in panels"
			:key="panel.key"
			class="pt-(--spacing-md)"
			role="tabpanel"
			:aria-labelledby="panel.labelledBy"
			:hidden="curr !== panel.key"
		>
			<slot :name="panel.slot" />
		</div>
	</div>
</template>

<script lang="ts">
import { onMounted, onUnmounted, ref, type Ref } from 'vue';

type TabStore = {
	[key: string]: {
		curr: string;
	};
};

/**
 * Module scope: one store per module, so every island importing this file shares it —
 * that is what lets a tab click drive the pricing sidebar in a separate island. A plain
 * stand-in for the nanostores `map` it replaced; a wrapper imports only vue and webkit.
 */
const listeners = new Set<() => void>();
let state: TabStore = {};

/** Notifies on subscribe, as nanostores does; listeners read `state` themselves. */
const subscribe = (listener: () => void) => {
	listeners.add(listener);
	listener();
	return () => {
		listeners.delete(listener);
	};
};

const setKey = (key: string, value: TabStore[string]) => {
	if (state[key] === value) return;
	state = { ...state, [key]: value };
	for (const listener of [...listeners]) listener();
};

export function useSharedTab(storeKey: string | undefined, fallback: string): Ref<string> {
	const curr = ref(fallback);

	let unsubscribe: (() => void) | undefined;

	onMounted(() => {
		if (!storeKey) return;
		unsubscribe = subscribe(() => {
			const next = state[storeKey]?.curr;
			if (next) curr.value = next;
		});
	});

	onUnmounted(() => unsubscribe?.());

	return curr;
}

export function useTabState(initial: string, storeKey?: string) {
	const curr = useSharedTab(storeKey, initial);

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
import { computed, nextTick, useId, useSlots } from 'vue';

const TabViewItem = TabView.Item;

const props = defineProps<{
	sharedStore?: string;
}>();

/**
 * Slots are named by the consumer — `tab.<key>` pairs with `panel.<key>` — so the
 * declaration is an index signature rather than a fixed list.
 */
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

const { curr, setCurr } = useTabState(tabs.value[0]?.key ?? '', props.sharedStore);

const uid = useId();
function tabTestId(key: string) {
	return `${uid}-${key}`;
}

const tablistRef = ref<HTMLElement | null>(null);

const onTabClick = (event: MouseEvent, key: string) => {
	const button = event.currentTarget as HTMLElement | null;

	setCurr(key);

	if (props.sharedStore && button) {
		nextTick(() => button.scrollIntoView({ behavior: 'smooth' }));
	}
};

const onKeydown = (event: KeyboardEvent) => {
	const step = event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0;
	if (!step) return;

	const index = tabs.value.findIndex(({ key }) => key === curr.value);
	const next = tabs.value[index + step];
	if (!next) return;

	event.preventDefault();
	setCurr(next.key);

	nextTick(() => {
		tablistRef.value?.querySelector<HTMLElement>(`[data-testid="${tabTestId(next.key)}"]`)?.focus();
	});
};
</script>
