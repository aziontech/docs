<template>
	<div
		data-doc-block
		data-doc-chrome
		class="agent-tools"
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
						class="whitespace-normal"
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

<style>
	/* The reference measures the tool column to its widest chip (244px on the current tool set) and
	   hands the rest to the description; webkit 4.4.0 splits the row by grow weight, and each row
	   is its own flex line, so the column has to be a fixed basis to stay aligned. Same layer
	   trick as the other 4.4.0 bridges. */
	@layer components {
		.agent-tools [data-testid='data-table__head-cell']:first-child,
		.agent-tools [data-testid='data-table__cell']:first-child {
			flex: 0 0 15.25rem !important;
		}
	}
</style>
