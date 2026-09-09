<template>
	<div class="doc-tabs">
		<div
			ref="tablistRef"
			data-doc-chrome
			class="doc-tabs__list"
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
			class="doc-tabs__panel"
			role="tabpanel"
			:aria-labelledby="panel.labelledBy"
			:hidden="curr !== panel.key"
		>
			<slot :name="panel.slot" />
		</div>
	</div>
</template>

<script setup lang="ts">
import TabView from '@aziontech/webkit/tab-view';
import { computed, nextTick, ref, useId, useSlots } from 'vue';

import { useTabState } from './useTabState';

const TabViewItem = TabView.Item;

const props = defineProps<{
	sharedStore?: string;
}>();

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

<style scoped>
.doc-tabs {
	padding-block: 1rem;
	position: relative;
}

.doc-tabs__list {
	display: flex;
	align-items: flex-end;
	gap: var(--spacing-xs, 0.25rem);
	overflow-x: auto;
	scrollbar-width: none;
}

.doc-tabs__list::-webkit-scrollbar {
	display: none;
}

.doc-tabs__panel {
	padding-block-start: 1rem;
}
</style>
