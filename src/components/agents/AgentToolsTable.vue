<template>
	<div
		data-doc-block
		data-doc-chrome
	>
		<Table border>
			<Table.Header>
				<Table.Row>
					<Table.HeadCell principal>{{ label('columns', 'tool', lang) }}</Table.HeadCell>
					<Table.HeadCell :grow="2">{{ label('columns', 'what', lang) }}</Table.HeadCell>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				<Table.Row
					v-for="tool in rows"
					:key="tool.id"
				>
					<Table.Cell principal>
						<code class="rounded-(--shape-elements) border border-(--border-default) bg-(--bg-hover) px-(--spacing-xs) py-0.5 text-label-code-sm text-(--text-default)">{{ tool.id }}</code>
					</Table.Cell>
					<Table.Cell
						:grow="2"
						class="whitespace-normal text-(--text-muted)"
					>
						{{ tool.description }}
					</Table.Cell>
				</Table.Row>
			</Table.Body>
		</Table>
	</div>
</template>

<script setup lang="ts">
	import Table from '@aziontech/webkit/table'
	import { computed } from 'vue'

	import { data, label, t, type Lang } from './data'

	const props = defineProps<{ lang: Lang }>()

	const rows = computed(() =>
		data.tools.map((tool) => ({
			id: tool.id,
			description: t(tool.description, props.lang)
		}))
	)
</script>
