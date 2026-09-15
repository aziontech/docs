<template>
	<Table border>
		<Table.Header>
			<Table.Row>
				<Table.HeadCell principal>{{ labels.name }}</Table.HeadCell>
				<Table.HeadCell>{{ labels.type }}</Table.HeadCell>
				<Table.HeadCell>{{ labels.updated }}</Table.HeadCell>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			<Table.Row v-for="row in rows" :key="row.href">
				<!-- eslint-disable webkit/no-style-override -- design-system gap: Table has
				     no row density/wrap seam, and `py-`/`whitespace-normal` are the cell's
				     own box, unreachable from a wrapper. Remove when Table grows it. -->
				<Table.Cell principal class="whitespace-normal py-(--spacing-sm)">
					<!-- eslint-enable webkit/no-style-override -->
					<a
						:href="row.href"
						:target="row.external ? '_blank' : undefined"
						:rel="row.external ? 'noreferrer' : undefined"
						class="text-(--text-link) no-underline hover:underline"
					>
						{{ row.label }}
					</a>
				</Table.Cell>
				<Table.Cell>
					<span class="text-(--text-muted)">{{ row.kind }}</span>
				</Table.Cell>
				<Table.Cell>
					<span class="text-(--text-muted)">{{ row.updated }}</span>
				</Table.Cell>
			</Table.Row>
		</Table.Body>
	</Table>
</template>

<script setup lang="ts">
import Table from '@aziontech/webkit/table';

defineProps<{
	rows: { label: string; href: string; external?: boolean; kind: string; updated: string }[];
	labels: { name: string; type: string; updated: string };
}>();
</script>
