<template>
	<div data-doc-block data-doc-chrome>
		<Table border>
			<Table.Header>
				<Table.Row>
					<Table.HeadCell principal>{{ columns.tool }}</Table.HeadCell>
					<Table.HeadCell :grow="2">{{ columns.what }}</Table.HeadCell>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				<Table.Row v-for="tool in tools" :key="tool.id">
					<Table.Cell principal>
						<code
							class="rounded-(--shape-elements) border border-(--border-default) bg-(--bg-hover) px-(--spacing-xs) py-0.5 text-label-code-sm text-(--text-default)"
							>{{ tool.id }}</code
						>
					</Table.Cell>
					<Table.Cell :grow="2">
						<span class="whitespace-normal text-(--text-muted)">{{ tool.description }}</span>
					</Table.Cell>
				</Table.Row>
			</Table.Body>
		</Table>
	</div>
</template>

<script setup lang="ts">
import Table from '@aziontech/webkit/table';

defineOptions({ name: 'AgentToolsTable' });

interface Props {
	tools: { id: string; description: string }[];
	columns: { tool: string; what: string };
}

defineProps<Props>();
</script>
