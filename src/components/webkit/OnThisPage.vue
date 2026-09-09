<template>
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

	type TrackedLink = DocTocLink & { tracking?: string }
	type TrackedGroup = { label: string; links: TrackedLink[] }

	const props = withDefaults(
		defineProps<{
			headings?: Heading[]
			title?: string
			groups?: TrackedGroup[]
		}>(),
		{
			headings: () => [],
			title: 'On this page',
			groups: () => []
		}
	)

	// The page's own headings only — the reference rail opens on the first section, with no
	// synthetic "Overview" entry for the masthead.
	const items = computed<DocTocItem[]>(() =>
		props.headings
			.filter(({ depth }) => depth > 1 && depth < 4)
			.map(({ slug, text, depth }) => ({ id: slug, text, depth }))
	)

	const activeId = ref(items.value[0]?.id ?? '')

	const onSelect = (event: MouseEvent, item: DocTocItem) => {
		event.preventDefault()

		const target = document.getElementById(item.id)
		if (!target) return

		// The content column scrolls, not the window; the heading's scroll-margin sets the offset.
		target.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
