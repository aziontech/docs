<template>
	<DocCardGroup :cols="2">
		<DocCard
			v-for="item in items"
			:key="t(item.title, lang)"
			:title="t(item.title, lang)"
			:icon="item.icon"
			:label="t(item.description, lang)"
		/>
	</DocCardGroup>
</template>

<script setup lang="ts">
	import DocCard from '@aziontech/webkit/doc-card'
	import DocCardGroup from '@aziontech/webkit/doc-card-group'
	import { computed } from 'vue'

	import { data, t, type Lang, type Localized } from './data'

	const props = defineProps<{ group: 'workflows' | 'concepts' | 'tradeoffs'; lang: Lang }>()

	const items = computed(() => data[props.group] as { title: Localized; icon: string; description: Localized }[])
</script>
