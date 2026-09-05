<template>
	<template
		v-for="(token, index) in tokens"
		:key="index"
	>
		<code v-if="token.type === 'code'">{{ token.value }}</code>
		<strong v-else-if="token.type === 'strong'">{{ token.value }}</strong>
		<a
			v-else-if="token.type === 'link'"
			:href="token.href"
		>{{ token.value }}</a>
		<DocTooltip
			v-else-if="token.type === 'tooltip' && tooltip(token.key, lang)"
			:headline="tooltip(token.key, lang)?.headline"
			:tip="tooltip(token.key, lang)?.tip"
			:cta="tooltip(token.key, lang)?.cta"
			:href="tooltip(token.key, lang)?.href"
		>{{ token.value }}</DocTooltip>
		<template v-else>{{ token.value }}</template>
	</template>
</template>

<script setup lang="ts">
	import DocTooltip from '@aziontech/webkit/doc-tooltip'
	import { computed } from 'vue'

	import { tooltip, type Lang } from './data'
	import { tokenize } from './inline'

	const props = defineProps<{ text: string; lang: Lang }>()

	const tokens = computed(() => tokenize(props.text))
</script>
