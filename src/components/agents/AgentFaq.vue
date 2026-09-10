<template>
	<div
		data-doc-block
		data-doc-chrome
		class="overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface)"
	>
		<Accordion
			type="single"
			size="large"
		>
			<Accordion.Item
				v-for="(item, index) in items"
				:key="index"
				:value="String(index)"
			>
				<Accordion.Trigger>{{ item.question }}</Accordion.Trigger>
				<Accordion.Content class="px-[var(--accordion-inset,var(--spacing-md))] pt-(--spacing-sm) pb-(--spacing-md)">
					<p class="m-0">
						<InlineText
							:text="item.answer"
							:lang="lang"
						/>
					</p>
				</Accordion.Content>
			</Accordion.Item>
		</Accordion>
	</div>
</template>

<script setup lang="ts">
	import Accordion from '@aziontech/webkit/accordion'
	import { computed } from 'vue'

	import { agentBySlug, data, fill, t, type Lang } from './data'
	import InlineText from './InlineText.vue'

	const props = defineProps<{ agent: string; group: 'faq' | 'troubleshooting'; lang: Lang }>()

	const items = computed(() => {
		const agent = agentBySlug(props.agent)
		if (!agent) return []
		const lang = props.lang
		const surfaceKey = agent.workflows.includes('Terminal') ? 'terminal' : 'editor'
		const surface = t(data.surface[surfaceKey], lang)
		const vars: Record<string, string> = { name: agent.name, surface, surfaceDe: surface }
		return data[props.group].map((entry) => ({
			question: fill(t(entry.question, lang), vars),
			answer: fill(t(entry.answer, lang), {
				...vars,
				note: agent.connect.note ? t(agent.connect.note, lang) : t(entry.fallbackNote, lang)
			})
		}))
	})
</script>
