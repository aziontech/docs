<template>
	<DocSteps>
		<DocStep
			v-for="step in steps"
			:key="step.key"
			:title="step.title"
		>
			<p v-if="step.body">
				<InlineText
					:text="step.body"
					:lang="lang"
				/>
			</p>
			<Samples
				v-if="step.samples"
				:samples="step.samples"
				:lang="lang"
			/>
			<DocCallout
				v-if="step.note"
				kind="warning"
			>
				<InlineText
					:text="step.note"
					:lang="lang"
				/>
			</DocCallout>
			<p v-if="step.link">
				<a
					:href="step.link.href"
					:target="isExternal(step.link.href) ? '_blank' : '_self'"
					:rel="isExternal(step.link.href) ? 'noreferrer' : undefined"
					class="group/link inline-flex items-center gap-(--spacing-xxs)"
				>
					{{ step.link.label }}
					<i
						:class="isExternal(step.link.href) ? 'pi-arrow-up-right' : 'pi-chevron-right'"
						class="pi text-body-xs"
						aria-hidden="true"
					/>
				</a>
			</p>
			<DocPrompt
				v-if="step.prompt"
				:title="tryIt"
				icon="pi pi-sparkles"
			>
				{{ step.prompt }}
			</DocPrompt>
		</DocStep>
	</DocSteps>
</template>

<script setup lang="ts">
	import DocCallout from '@aziontech/webkit/doc-callout'
	import DocPrompt from '@aziontech/webkit/doc-prompt'
	import DocStep from '@aziontech/webkit/doc-step'
	import DocSteps from '@aziontech/webkit/doc-steps'
	import { computed } from 'vue'

	import { agentBySlug, data, fill, t, type Lang, type Sample } from './data'
	import InlineText from './InlineText.vue'
	import Samples from './Samples.vue'

	const props = defineProps<{ agent: string; lang: Lang }>()

	interface Step {
		key: string
		title: string
		body?: string
		samples?: Sample[]
		note?: string
		link?: { label: string; href: string }
		prompt?: string
	}

	const isExternal = (href: string) => /^(https?:)?\/\//.test(href)

	const tryIt = computed(() => t(data.steps.tryIt, props.lang))

	const steps = computed<Step[]>(() => {
		const agent = agentBySlug(props.agent)
		if (!agent) return []
		const vars = { name: agent.name }
		const lang = props.lang
		return [
			{
				key: 'install',
				title: fill(t(data.steps.install, lang), vars),
				body: t(agent.install.body, lang),
				samples: agent.install.samples,
				link: agent.install.link ? { label: t(agent.install.link.label, lang), href: agent.install.link.href } : undefined
			},
			{
				key: 'token',
				title: t(data.steps.token.title, lang),
				body: fill(t(data.steps.token.body, lang), vars),
				link: { label: t(data.steps.token.link, lang), href: data.tokensUrl }
			},
			{
				key: 'connect',
				title: t(data.steps.connect, lang),
				body: t(agent.connect.body, lang),
				samples: agent.connect.samples,
				note: agent.connect.note ? t(agent.connect.note, lang) : undefined
			},
			{
				key: 'verify',
				title: t(data.steps.verify, lang),
				body: t(agent.verify.body, lang),
				samples: agent.verify.samples,
				prompt: (data.prompts as Record<Lang, string[]>)[lang][1]
			}
		]
	})
</script>
