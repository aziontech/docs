<template>
	<!--
		The "On this page" rail for the pricing pages, on the same webkit
		DocOnThisPage the rest of the documentation uses (see
		~/components/webkit/OnThisPage.vue). What it adds is the one thing
		pricing needs and no other page does: the outline follows the currency
		tab.

		Both currencies repeat the same headings, so rehype-slug hands the
		second copy a `-1` suffix. The rail therefore lists each heading once
		and rewrites the anchor to whichever copy is currently on screen.
	-->
	<WkDocOnThisPage :items="items" :active-id="activeId" :title="labels.title" @select="onSelect" />
</template>

<script setup lang="ts">
import WkDocOnThisPage, { type DocTocItem } from '@aziontech/webkit/doc-on-this-page';
import type { MarkdownHeading } from 'astro';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import { useSharedTab } from '~/components/tabs/useTabState';
import { deduplicateHeadings } from '~/util/deduplicateHeadings';
import { unescape } from '~/util/html-entities';

const props = withDefaults(
	defineProps<{
		headings: MarkdownHeading[];
		labels: { initialHeadingTitle: string; title: string };
		sharedStore?: string;
	}>(),
	{ sharedStore: 'pricing-tabs' }
);

/**
 * The currency tab currently chosen on the page. `dolar` is the tab the
 * pricing content declares first, so it is what the page shows until the
 * reader picks the other one.
 */
const currentTab = useSharedTab(props.sharedStore, 'dolar');

/**
 * The heading a rail entry should point at for the tab in view.
 *
 * The BRL panel is the second copy of the same headings, so its anchors
 * carry rehype-slug's `-1` suffix; the USD panel keeps the bare slug.
 */
const anchorFor = (slug: string) => {
	if (currentTab.value !== 'real') return slug;
	return props.headings.some((heading) => heading.slug === `${slug}-1`) ? `${slug}-1` : slug;
};

const items = computed<DocTocItem[]>(() => [
	{ id: 'overview', text: props.labels.initialHeadingTitle, depth: 2 },
	...deduplicateHeadings(props.headings)
		.filter(({ depth }) => depth > 1 && depth < 4)
		.map(({ slug, text, depth }) => ({ id: anchorFor(slug), text: unescape(text), depth })),
]);

const activeId = ref('overview');

const onSelect = (event: MouseEvent, item: DocTocItem) => {
	event.preventDefault();

	const target = document.getElementById(item.id);
	if (!target) return;

	window.scrollTo({ top: target.offsetTop - 96, behavior: 'smooth' });
	activeId.value = item.id;
};

let observer: IntersectionObserver | null = null;

/**
 * Watch the headings that are actually on screen.
 *
 * Both currency panels stay in the document — the tab view only hides the
 * inactive one — so the observer has to skip anything sitting under a
 * `hidden` panel, or the rail would light up on headings the reader cannot
 * see. Switching tabs swaps which copy is visible, hence the re-scan.
 */
const observeVisibleHeadings = () => {
	observer?.disconnect();

	observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				activeId.value = entry.target.id;
				break;
			}
		},
		{ rootMargin: '-40px 0% -86%', threshold: 1 }
	);

	for (const heading of document.querySelectorAll('article :is(h1,h2,h3)')) {
		if (!heading.closest('[hidden]')) observer.observe(heading);
	}
};

onMounted(observeVisibleHeadings);
watch(currentTab, () => requestAnimationFrame(observeVisibleHeadings));

onBeforeUnmount(() => observer?.disconnect());
</script>
