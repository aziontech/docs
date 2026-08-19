<template>
	<ul class="flex flex-col gap-1">
		<li
			v-for="{ slug, text, children } in data"
			class="flex flex-col gap-1 -ml-2 overflow-hidden"
		>
			<a
				@click="onScroll"
				:class="[
					'rounded hover:underline text-color-secondary text-sm max-w-full px-2 py-1',
					currentHeading === slug && 'surface-200'
				]"
				:href="`#${slug}`"
			>
				{{ text }}
			</a>
			<template v-if="children.length > 0">
				<TableOfContentsItem
					class="ml-4"
					:data="children"
					:currentHeading="currentHeading"
				/>
			</template>
		</li>
	</ul>
</template>

<script setup>
	defineProps({
		data: {
			type: Array,
			required: true
		},
		currentHeading: {
			type: String,
			required: false
		}
	})

	const onScroll = (e) => {
		e.preventDefault()

		const targetHref = e.currentTarget.getAttribute('href')
		const selectorTitle = document.querySelector(`${targetHref}`)
		const getOffsetTop = selectorTitle.offsetTop - 96

		window.scrollTo({
			top: getOffsetTop,
			behavior: 'smooth'
		})
	}
</script>
