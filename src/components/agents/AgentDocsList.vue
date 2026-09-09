<template>
	<FrameBox borders="all">
		<ItemList>
			<DocItem
				v-for="item in items"
				:key="item.title"
				:title="item.title"
				:icon="item.icon"
				:href="item.href"
				:target="item.target"
			>
				{{ item.description }}
			</DocItem>
		</ItemList>
	</FrameBox>
</template>

<script setup lang="ts">
	import DocItem from '@aziontech/webkit/doc-item'
	import FrameBox from '@aziontech/webkit/frame-box'
	import ItemList from '@aziontech/webkit/item-list'
	import { computed } from 'vue'

	import { data, t, type Lang } from './data'

	const props = defineProps<{ lang: Lang }>()

	const items = computed(() =>
		data.docs.map((item) => ({
			title: t(item.title, props.lang),
			icon: item.icon,
			href: t(item.href, props.lang),
			target: item.target ?? '_self',
			description: t(item.description, props.lang)
		}))
	)
</script>
