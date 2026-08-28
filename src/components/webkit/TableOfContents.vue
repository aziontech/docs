<template>
	<div class="flex flex-col gap-2">
		<p class="font-medium text-base">{{ title }}</p>
		<TableOfContentsItem
			:data="toc"
			:currentHeading="currentHeading"
		/>
	</div>
</template>

<script setup>
	import TableOfContentsItem from './TableOfContentsItem.vue'
	import { ref, onBeforeMount } from 'vue'

	const props = defineProps({
		headings: {
			required: true
		},
		title: {
			type: String,
			required: false,
			default: 'Jump to Section'
		},
		initialHeadingTitle: {
			type: String,
			required: false,
			default: 'Overview'
		}
	})

	function diveChildren(item, depth) {
		if (depth === 1) {
			return item.children
		} else {
			return diveChildren(item.children[item.children.length - 1], depth - 1)
		}
	}

	function generateToc(headings, title = 'Overview') {
		const overview = { depth: 2, slug: 'overview', text: title }
		headings = [overview, ...headings.filter(({ depth }) => depth > 1 && depth < 4)]
		const toc = []

		for (const heading of headings) {
			if (toc.length === 0) {
				toc.push({ ...heading, children: [] })
				continue
			}

			const lastItemInToc = toc[toc.length - 1]
			if (heading.depth < lastItemInToc.depth)
				throw new Error(`Orphan heading found: ${heading.text}.`)

			if (heading.depth === lastItemInToc.depth) {
				toc.push({ ...heading, children: [] })
				continue
			}

			const gap = heading.depth - lastItemInToc.depth
			const target = diveChildren(lastItemInToc, gap)
			target.push({ ...heading, children: [] })
		}
		return toc
	}

	const toc = generateToc(props.headings, props.initialHeadingTitle)
	const currentHeading = ref(toc[0].slug)

	const observerOptions = { rootMargin: '-40px 0% -80%', threshold: 1 }

	onBeforeMount(() => {
		if (currentHeading.value) {
			const setCurrent = (entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						if (currentHeading.value == entry.target.id) {
							break
						}
						currentHeading.value = entry.target.id
						break
					}
				}
			}

			const headingsObserver = new IntersectionObserver(setCurrent, observerOptions)

			const h1 = document.getElementById('overview')
			if (h1) headingsObserver.observe(h1)
			document.querySelectorAll('article :is(h1,h2,h3)').forEach((h) => headingsObserver.observe(h))
		}
	})
</script>
