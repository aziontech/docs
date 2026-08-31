<template>
	<!--
		Adapter over @aziontech/webkit's DocOnThisPage. The rail itself (the
		outline, the traveling marker, the complementary groups) is the design
		system's; what this wrapper adds is the docs site's own behavior:

		- the "Overview" entry, anchored to the masthead's `id="overview"` h1;
		- the scroll-spy that decides which heading is active (the rail is
		  presentation only — the page owns the scroll container);
		- smooth scrolling with the fixed header's offset on activation;
		- analytics tracking for the group links that declare a `tracking` type.
	-->
	<WkDocOnThisPage
		:items='items'
		:active-id='activeId'
		:title='title'
		:groups='groups'
		@select='onSelect'
		@click='onLinkClick'
	/>
</template>

<script setup lang="ts">
	import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

	import WkDocOnThisPage, {
		type DocTocItem,
		type DocTocLink
	} from '@aziontech/webkit/doc-on-this-page'

	type Heading = { depth: number; slug: string; text: string }

	/** A group link that may carry an analytics tracking type. */
	type TrackedLink = DocTocLink & { tracking?: string }
	type TrackedGroup = { label: string; links: TrackedLink[] }

	const props = withDefaults(
		defineProps<{
			headings?: Heading[]
			title?: string
			initialHeadingTitle?: string
			groups?: TrackedGroup[]
		}>(),
		{
			headings: () => [],
			title: 'On this page',
			initialHeadingTitle: 'Overview',
			groups: () => []
		}
	)

	const items = computed<DocTocItem[]>(() => {
		if (!props.headings.length) return []
		return [
			{ id: 'overview', text: props.initialHeadingTitle, depth: 2 },
			...props.headings
				.filter(({ depth }) => depth > 1 && depth < 4)
				.map(({ slug, text, depth }) => ({ id: slug, text, depth }))
		]
	})

	const activeId = ref('overview')

	const onSelect = (event: MouseEvent, item: DocTocItem) => {
		event.preventDefault()

		const target = document.getElementById(item.id)
		if (!target) return

		window.scrollTo({
			top: target.offsetTop - 96,
			behavior: 'smooth'
		})
		activeId.value = item.id
	}

	const onLinkClick = (event: MouseEvent) => {
		const anchor = (event.target as HTMLElement | null)?.closest('a')
		if (!anchor) return

		const link = props.groups
			.flatMap(({ links }) => links)
			.find(({ href, tracking }) => tracking && href === anchor.getAttribute('href'))
		if (!link) return

		const analytics = (window as any).AzAnalytics
		if (analytics?.trackClick) {
			analytics.trackClick('right_sidebar', {
				href: link.href,
				text: link.label,
				type: link.tracking
			})
		}
	}

	let observer: IntersectionObserver | null = null

	onMounted(() => {
		if (!items.value.length) return

		const setCurrent = (entries: IntersectionObserverEntry[]) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					if (activeId.value !== entry.target.id) activeId.value = entry.target.id
					break
				}
			}
		}

		observer = new IntersectionObserver(setCurrent, {
			rootMargin: '-40px 0% -80%',
			threshold: 1
		})

		for (const { id } of items.value) {
			const heading = document.getElementById(id)
			if (heading) observer.observe(heading)
		}
	})

	onBeforeUnmount(() => observer?.disconnect())
</script>
