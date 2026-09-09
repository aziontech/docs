<template>
	<div
		data-doc-block
		data-doc-chrome
	>
		<Table border>
			<Table.Header>
				<Table.Row>
					<Table.HeadCell
						principal
						frozen="start"
					>{{ label('columns', 'agent', lang) }}</Table.HeadCell>
					<Table.HeadCell
						v-for="key in BOOLEAN_COLUMNS"
						:key="key"
						align="center"
					>{{ label('columns', key, lang) }}</Table.HeadCell>
					<Table.HeadCell
						v-for="key in TAG_COLUMNS"
						:key="key"
					>{{ label('columns', key, lang) }}</Table.HeadCell>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				<Table.Row
					v-for="agent in rows"
					:key="agent.id"
				>
					<Table.Cell
						principal
						frozen="start"
					>
						<a
							:href="agent.href"
							class="flex min-w-0 items-center gap-(--spacing-sm) text-label-md text-(--text-default) no-underline hover:underline"
						>
							<AgentMark
								:name="agent.mark"
								class="size-4 shrink-0"
							/>
							<span class="truncate">{{ agent.name }}</span>
						</a>
					</Table.Cell>
					<Table.Cell
						v-for="key in BOOLEAN_COLUMNS"
						:key="key"
						align="center"
					>
						<i
							:class="[agent[key] ? 'pi-check text-(--primary)' : 'pi-minus text-(--text-muted)', 'pi text-label-md leading-none']"
							aria-hidden="true"
						/>
						<span class="sr-only">{{ agent[key] ? t(data.labels.yes, lang) : t(data.labels.no, lang) }}</span>
					</Table.Cell>
					<Table.Cell
						v-for="key in TAG_COLUMNS"
						:key="key"
					>
						<Tag
							:label="agent[key]"
							severity="secondary"
							size="small"
						/>
					</Table.Cell>
				</Table.Row>
			</Table.Body>
		</Table>
	</div>
</template>

<script setup lang="ts">
	import Table from '@aziontech/webkit/table'
	import Tag from '@aziontech/webkit/tag'
	import { computed } from 'vue'

	import AgentMark from '~/components/webkit/AgentMark.vue'

	import { agents, data, label, t, type Lang } from './data'

	const props = defineProps<{ lang: Lang; hrefs: Record<string, string> }>()

	const BOOLEAN_COLUMNS = ['terminal', 'ide', 'extension', 'openSource'] as const
	const TAG_COLUMNS = ['pricing', 'model', 'context'] as const

	const rows = computed(() =>
		agents.map((agent) => ({
			id: agent.slug,
			name: agent.name,
			mark: agent.mark,
			href: props.hrefs[agent.slug],
			terminal: agent.workflows.includes('Terminal'),
			ide: agent.workflows.includes('IDE'),
			extension: agent.workflows.includes('Extension'),
			openSource: agent.openSource,
			pricing: label('values', agent.pricing, props.lang),
			model: label('values', agent.model, props.lang),
			context: label('values', agent.context, props.lang)
		}))
	)
</script>
