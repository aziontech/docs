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
					<Tag
						v-for="own in node.ownVersions ?? []"
						:key="own"
						:label="versionLabels[own]"
						severity="secondary"
					/>
					<Tag
						v-if="menuStage(node)"
						:label="stageLabels[menuStage(node)!]"
						:severity="STAGE_SEVERITY[menuStage(node)!]"
					/>
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
						:stage-labels="stageLabels"
						:version-labels="versionLabels"
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
					:stage-labels="stageLabels"
					:version-labels="versionLabels"
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
			<template
				v-if="node.tagValue || node.ownVersions || menuStage(node) || isExternal(node.href)"
				#tag
			>
				<span
					v-if="node.tagValue || node.ownVersions || menuStage(node)"
					class="flex items-center gap-(--spacing-xxs)"
				>
					<Tag v-if="node.tagValue" :label="node.tagValue" severity="info" rounded />
					<Tag
						v-for="own in node.ownVersions ?? []"
						:key="own"
						:label="versionLabels[own]"
						severity="secondary"
					/>
					<Tag
						v-if="menuStage(node)"
						:label="stageLabels[menuStage(node)!]"
						:severity="STAGE_SEVERITY[menuStage(node)!]"
					/>
				</span>
				<!-- A row that leaves the site carries the arrow the docs use for external links. -->
				<i
					v-else
					class="pi pi-arrow-up-right text-label-sm leading-none text-(--text-muted)"
					aria-hidden="true"
				/>
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
import type { PlatformVersion, Stage } from '~/nav/versions';

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
	/** Words for the stage tags. */
	stageLabels?: Record<Stage, string>;
	/** Short names for the version tags (`v3`, `v4`). */
	versionLabels?: Record<PlatformVersion, string>;
}

const props = withDefaults(defineProps<Props>(), {
	activeId: '',
	trees: () => ({}),
	drillable: true,
	noMatchesLabel: 'No rows match.',
	stageLabels: () => ({
		experimental: 'Experimental',
		preview: 'Preview',
		deprecated: 'Deprecated',
	}),
	versionLabels: () => ({ v3: 'v3.x', v4: 'v4.x' }),
});

const emit = defineEmits<{
	navigate: [event: MouseEvent, node: MenuNode];
}>();

// Deprecated never tags a row: such rows are listed only under their own version, where the
// select, the page header and the banner already say it.
const menuStage = (node: MenuNode): Stage | undefined =>
	node.stage === 'deprecated' ? undefined : node.stage;

// Same colours as the stage tag beside the page title: a stage in progress is info, a stage on its way out a warning.
const STAGE_SEVERITY = {
	experimental: 'info',
	preview: 'info',
	deprecated: 'warning',
} as const;

function rowsFor(node: MenuNode): MenuGroupNode[] | undefined {
	return node.opensTree ? props.trees[node.opensTree] : undefined;
}

function forward(event: MouseEvent, node: MenuNode) {
	emit('navigate', event, node);
}

/** An absolute http(s) destination leaves the site; a relative one, such as an llms.txt, does not. */
const isExternal = (href?: string) => /^https?:\/\//.test(href ?? '');
</script>
