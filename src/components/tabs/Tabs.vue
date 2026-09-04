<template>
	<div class="doc-tabs">
		<!--
			`data-doc-chrome` stops DocProse's typography contract at the tab
			strip: without it the design system's chips would be repainted as
			prose (link ink, prose spacing) for living inside the article body.
			The panels below deliberately stay outside the marker — their
			content is the author's markdown and has to keep the treatment.
		-->
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

/**
 * The documentation site's tab view, built on the design system's TabView.
 *
 * Only `TabView.Item` is used, not the full `Root`/`List`/`Panel`
 * composition, and the reason is the panels: `TabView.Panel` mounts its
 * slot behind a `v-if` on the active tab, so every inactive panel would
 * disappear from the served markup. Across 178 content files that would
 * take half of each page's prose out of the crawled HTML, out of the
 * browser's find-in-page, and out of reach of the one-shot heading-anchor
 * wiring ReadableContent installs on mount. Panels are therefore rendered
 * here and merely `hidden`, exactly as the component this replaces did.
 * With no `Root` above them the items carry no TabView context, so this
 * component owns the active value, the ids and the arrow keys, and
 * `TabView.Item` falls back to its standalone `selected` styling — which
 * paints the same chip the composed version does.
 *
 * The authoring API is unchanged, because 178 `.mdx` files depend on it:
 * one `tab.<key>` slot per tab, one `panel.<key>` slot per panel, and an
 * optional `sharedStore` tying several tab views on a page together.
 */
const TabViewItem = TabView.Item;

const props = defineProps<{
	/** Ties this view's choice to every other view using the same key. */
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

/**
 * The tabs, not the panels, are the authored order.
 *
 * Astro fills the slot object as each slot finishes rendering, so the key
 * order is resolution order: the `tab.*` slots are plain text and settle in
 * order, while a `panel.*` slot holding a `<Code>` island can overtake the
 * one written above it. Pairing every tab with its panel and only then
 * appending whatever panels are left over (a handful of content files have
 * a `panel.*` whose `tab.*` is missing or misspelled) keeps the reading
 * order stable and, more importantly, keeps the leftmost tab the one that
 * opens.
 */
const panels = computed(() => {
	const remaining = new Map(slotsNamed(PANEL_PREFIX).map((panel) => [panel.key, panel]));

	const paired = tabs.value.flatMap(({ key }) => {
		const panel = remaining.get(key);
		if (!panel) return [];
		remaining.delete(key);
		return [{ ...panel, labelledBy: tabTestId(key) + '__tab' }];
	});

	// An orphan panel can never be selected, but it is still rendered so its
	// prose stays in the page; it has no tab to be labelled by.
	return [
		...paired,
		...[...remaining.values()].map((panel) => ({ ...panel, labelledBy: undefined })),
	];
});

const { curr, setCurr } = useTabState(tabs.value[0]?.key ?? '', props.sharedStore);

/**
 * `TabView.Item` sets `inheritAttrs: false` and derives its button id from
 * `data-testid`, the one attribute it does read. Feeding it a unique id per
 * tab is therefore how the panels get something stable to point their
 * `aria-labelledby` at.
 */
const uid = useId();
function tabTestId(key: string) {
	return `${uid}-${key}`;
}

const tablistRef = ref<HTMLElement | null>(null);

const onTabClick = (event: MouseEvent, key: string) => {
	const button = event.currentTarget as HTMLElement | null;

	setCurr(key);

	// Changing a shared choice re-lays out every other tab view on the page,
	// which yanks the article out from under the tab that was just clicked.
	// Bringing it back into view once the panels have settled keeps the
	// reader where they were.
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

	// The chips use a roving tabindex, so focus has to follow the selection
	// or the next arrow press would come from a button that no longer takes
	// keyboard focus.
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
	/* Long strips (six package managers, five operating systems) have to scroll
	sideways on narrow viewports rather than wrap, and the scrollbar itself
	would sit on top of the article. */
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
