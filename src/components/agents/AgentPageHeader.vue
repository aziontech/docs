<template>
	<DocPageHeader
		v-if="agent"
		data-doc-chrome
		class="mb-8 mt-2"
		:title="title"
		:description="description"
		:breadcrumb="breadcrumb"
		:markdown-href="markdownHref"
		:locale="locale"
		:labels="labels"
	>
		<template #title>
			<div class="flex min-w-0 flex-col items-start gap-(--spacing-sm) sm:flex-1 sm:flex-row sm:items-center sm:gap-(--spacing-md)">
				<span class="flex size-14 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised) sm:size-16 [&>svg]:size-7 sm:[&>svg]:size-8">
					<AgentMark :name="agent.mark" />
				</span>
				<div class="min-w-0 flex-1">
					<span class="block text-overline-sm uppercase text-(--primary)">{{ agent.vendor }}</span>
					<h1
						id="overview"
						class="m-0 text-heading-xl text-(--text-default) max-sm:[font-size:var(--text-2xl)]"
					>
						{{ title }}
					</h1>
				</div>
			</div>
		</template>
		<template #details>
			<div class="flex flex-col gap-(--spacing-md)">
				<div class="flex flex-wrap items-center gap-(--spacing-xs)">
					<Tag
						v-for="tag in tags"
						:key="tag"
						:label="tag"
						severity="secondary"
						size="medium"
						rounded
					/>
				</div>
				<div class="flex flex-wrap items-center gap-x-(--spacing-xs) gap-y-(--spacing-xxs)">
					<template
						v-for="(link, index) in links"
						:key="link.href"
					>
						<span
							v-if="index > 0"
							class="text-label-md text-(--text-muted)"
							aria-hidden="true"
						>·</span>
						<a
							:href="link.href"
							target="_blank"
							rel="noreferrer"
							class="group/link inline-flex items-center gap-(--spacing-xxs) rounded-(--shape-flat) text-label-md text-(--text-muted) no-underline hover:text-(--text-default)"
						>
							{{ link.label }}
							<i
								class="pi pi-arrow-up-right text-body-xs"
								aria-hidden="true"
							/>
						</a>
					</template>
				</div>
			</div>
		</template>
	</DocPageHeader>
</template>

<script setup lang="ts">
	import Tag from '@aziontech/webkit/tag'
	import { computed } from 'vue'

	import AgentMark from '~/components/webkit/AgentMark.vue'
	import DocPageHeader, { type DocPageHeaderLabels } from '~/components/webkit/DocPageHeader.vue'

	import { agentBySlug, agentTags, data, fill, t, type AgentLink, type Lang } from './data'

	const props = defineProps<{
		agent: string
		lang: Lang
		breadcrumb: { label: string; href?: string }[]
		markdownHref: string
		locale: string
		labels: DocPageHeaderLabels
		links: AgentLink[]
	}>()

	const agent = computed(() => agentBySlug(props.agent))
	const title = computed(() => (agent.value ? fill(t(data.labels.plusAzion, props.lang), { name: agent.value.name }) : ''))
	const description = computed(() =>
		agent.value ? `${t(agent.value.description, props.lang)} ${fill(t(data.labels.madeBy, props.lang), { vendor: agent.value.vendor })}` : ''
	)
	const tags = computed(() => (agent.value ? agentTags(agent.value, props.lang) : []))
</script>
