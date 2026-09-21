<template>
	<template v-for="node in nodes" :key="node.id">
		<MenuSub v-if="drillable && node.opensTree" :data-node-id="node.id">
			<MenuSubTrigger
				kind="drill"
				:label="node.label"
				:icon="node.icon ?? ''"
				:href="node.href ?? ''"
				@click="emit('navigate', $event, node)"
			>
				<span class="flex min-w-0 items-center gap-(--spacing-xxs)">
					<span class="min-w-0 truncate">{{ node.label }}</span>
					<Tag v-if="node.tagValue" :label="node.tagValue" severity="info" rounded />
				</span>
			</MenuSubTrigger>
			<MenuSubContent>
				<div
					v-if="rowsFor(node) === undefined"
					class="flex flex-col gap-(--spacing-sm) px-(--spacing-sm) py-(--spacing-xs)"
				>
					<Skeleton v-for="row in 5" :key="row" height="0.75rem" />
				</div>
				<p
					v-else-if="rowsFor(node)?.length === 0"
					class="px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-muted)"
				>
					{{ noMatchesLabel }}
				</p>
				<MenuGroup
					v-for="(group, index) in rowsFor(node) ?? []"
					:key="group.label ?? index"
					:label="group.label ?? ''"
				>
					<DocsSidebarRows
						:nodes="group.items"
						:active-id="activeId"
						:trees="trees"
						:drillable="drillable"
						:no-matches-label="noMatchesLabel"
						@navigate="forward"
					/>
				</MenuGroup>
			</MenuSubContent>
		</MenuSub>

		<MenuSub v-else-if="node.children?.length" :data-node-id="node.id">
			<MenuSubTrigger
				kind="inline"
				:label="node.label"
				:icon="node.icon ?? ''"
				:href="node.href ?? ''"
				@click="emit('navigate', $event, node)"
			/>
			<MenuSubContent>
				<DocsSidebarRows
					:nodes="node.children"
					:active-id="activeId"
					:trees="trees"
					:drillable="drillable"
					:no-matches-label="noMatchesLabel"
					@navigate="forward"
				/>
			</MenuSubContent>
		</MenuSub>

		<MenuItem
			v-else
			:label="node.label"
			:icon="node.icon ?? ''"
			:href="node.href ?? ''"
			:target="node.target ?? '_self'"
			:selected="activeId !== '' && node.id === activeId"
			@click="emit('navigate', $event, node)"
		>
			<template v-if="node.tagValue" #tag>
				<Tag :label="node.tagValue" severity="info" rounded />
			</template>
		</MenuItem>
	</template>
</template>

<script setup lang="ts">
import MenuGroup from '@aziontech/webkit/menu-group';
import MenuItem from '@aziontech/webkit/menu-item';
import MenuSub from '@aziontech/webkit/menu-sub';
import MenuSubContent from '@aziontech/webkit/menu-sub-content';
import MenuSubTrigger from '@aziontech/webkit/menu-sub-trigger';
import Skeleton from '@aziontech/webkit/skeleton';
import Tag from '@aziontech/webkit/tag';

import type { MenuGroupNode, MenuNode } from '~/nav/resolve';

defineOptions({ name: 'DocsSidebarRows', inheritAttrs: false });

interface Props {
	nodes: MenuNode[];
	activeId?: string;
	/** Menu of every tree a row can open, keyed by tree id; a missing key is still loading. */
	trees?: Record<string, MenuGroupNode[]>;
	/** False once the menus cannot be loaded, so a row stays a plain link. */
	drillable?: boolean;
	/** Shown in a drilled level the filter emptied. */
	noMatchesLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
	activeId: '',
	trees: () => ({}),
	drillable: true,
	noMatchesLabel: 'No rows match.',
});

const emit = defineEmits<{
	navigate: [event: MouseEvent, node: MenuNode];
}>();

function rowsFor(node: MenuNode): MenuGroupNode[] | undefined {
	return node.opensTree ? props.trees[node.opensTree] : undefined;
}

function forward(event: MouseEvent, node: MenuNode) {
	emit('navigate', event, node);
}
</script>
