<template>
	<div
		data-doc-block
		data-doc-chrome
	>
		<CodeBlock :tabs="tabs" />
	</div>
</template>

<script setup lang="ts">
	import CodeBlock from '@aziontech/webkit/code-block'
	import { computed } from 'vue'

	import { agentBySlug, data, t, type Lang, type Sample } from './data'

	const props = defineProps<{
		samples?: Sample[]
		group?: 'cli' | 'context'
		agent?: string
		lang: Lang
	}>()

	const source = computed<Sample[]>(() => {
		if (props.samples) return props.samples
		if (props.group === 'cli') return data.cli as Sample[]
		if (props.group === 'context') {
			const agent = props.agent ? agentBySlug(props.agent) : undefined
			return [{ label: agent?.contextFile ?? 'AGENTS.md', language: 'markdown', fileName: agent?.contextFile ?? 'AGENTS.md', code: data.contextPrimer }]
		}
		return []
	})

	const tabs = computed(() =>
		source.value.map((sample) => ({
			label: t(sample.label, props.lang),
			value: t(sample.label, props.lang),
			code: sample.code,
			language: sample.language,
			fileName: sample.fileName
		}))
	)
</script>
