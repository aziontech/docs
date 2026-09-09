<template>
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

const currentTab = useSharedTab(props.sharedStore, 'dolar');

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

	// The content column scrolls, not the window; the heading's scroll-margin sets the offset.
	target.scrollIntoView({ behavior: 'smooth', block: 'start' });
	activeId.value = item.id;
};

let observer: IntersectionObserver | null = null;

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
