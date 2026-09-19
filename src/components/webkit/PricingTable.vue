<template>
	<Table border>
		<Table.Header>
			<Table.Row>
				<Table.HeadCell principal>
					<span class="whitespace-normal">{{ metric }}</span>
				</Table.HeadCell>
				<Table.HeadCell v-for="column in columns" :key="column">
					<span class="whitespace-nowrap">{{ column }}</span>
				</Table.HeadCell>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			<Table.Row v-for="row in rows" :key="row.tier">
				<Table.Cell principal>
					<span class="whitespace-normal">{{ row.tier }}</span>
				</Table.Cell>
				<Table.Cell v-for="(price, index) in row.prices" :key="index">
					<span class="whitespace-nowrap text-(--text-muted)">{{ price }}</span>
				</Table.Cell>
			</Table.Row>
		</Table.Body>
	</Table>
</template>

<script setup lang="ts">
import Table from '@aziontech/webkit/table';

interface Props {
	/** First column's header: the metric this table prices. */
	metric: string;
	/** Remaining column headers, already localized. */
	columns: string[];
	/** One row per pricing tier; prices align with columns (empty cells already dropped). */
	rows: { tier: string; prices: string[] }[];
}

defineProps<Props>();
</script>
