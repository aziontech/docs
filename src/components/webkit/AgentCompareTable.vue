<template>
	<div data-doc-block data-doc-chrome>
		<Table border>
			<Table.Header>
				<Table.Row>
					<Table.HeadCell principal frozen="start">
						{{ columns.agent }}
					</Table.HeadCell>
					<Table.HeadCell v-for="key in BOOLEAN_COLUMNS" :key="key" align="center">
						{{ columns[key] }}
					</Table.HeadCell>
					<Table.HeadCell v-for="key in TAG_COLUMNS" :key="key">
						{{ columns[key] }}
					</Table.HeadCell>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				<Table.Row v-for="agent in rows" :key="agent.id">
					<Table.Cell principal frozen="start">
						<a
							:href="agent.href"
							class="flex min-w-0 items-center gap-(--spacing-sm) text-label-md text-(--text-default) no-underline hover:underline"
						>
							<AgentMark :name="agent.mark" class="size-4 shrink-0" />
							<span class="truncate">{{ agent.name }}</span>
						</a>
					</Table.Cell>
					<Table.Cell v-for="key in BOOLEAN_COLUMNS" :key="key" align="center">
						<i
							:class="[
								agent[key] ? 'pi-check text-(--primary)' : 'pi-minus text-(--text-muted)',
								'pi text-label-md leading-none',
							]"
							aria-hidden="true"
						/>
						<span class="sr-only">{{ agent[key] ? yes : no }}</span>
					</Table.Cell>
					<Table.Cell v-for="key in TAG_COLUMNS" :key="key">
						<Tag :label="agent[key]" severity="secondary" size="small" />
					</Table.Cell>
				</Table.Row>
			</Table.Body>
		</Table>
	</div>
</template>

<script setup lang="ts">
import Table from '@aziontech/webkit/table';
import Tag from '@aziontech/webkit/tag';

import AgentMark, { type AgentName } from './AgentMark.vue';

defineOptions({ name: 'AgentCompareTable' });

const BOOLEAN_COLUMNS = ['terminal', 'ide', 'extension', 'openSource'] as const;
const TAG_COLUMNS = ['pricing', 'model', 'context'] as const;

export interface AgentCompareRow {
	id: string;
	name: string;
	mark: AgentName;
	href: string;
	terminal: boolean;
	ide: boolean;
	extension: boolean;
	openSource: boolean;
	pricing: string;
	model: string;
	context: string;
}

interface Props {
	rows: AgentCompareRow[];
	columns: Record<
		'agent' | 'terminal' | 'ide' | 'extension' | 'openSource' | 'pricing' | 'model' | 'context',
		string
	>;
	yes: string;
	no: string;
}

defineProps<Props>();
</script>
