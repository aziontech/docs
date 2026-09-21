<template>
	<template v-for="node in nodes" :key="node.id">
		<MenuSub v-if="node.children?.length" :data-node-id="node.id">
			<MenuSubTrigger
				kind="inline"
				:label="node.label"
				:icon="node.icon ?? ''"
				:href="node.href ?? ''"
				@click="emit('navigate', $event, node)"
			/>
			<MenuSubContent>
				<DocsSidebarRows :nodes="node.children" :active-id="activeId" @navigate="forward" />
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
			<template v-if="node.opensTree || node.tagValue" #tag>
				<span class="flex items-center gap-(--spacing-xxs)">
					<Tag v-if="node.tagValue" :label="node.tagValue" severity="info" rounded />
					<i
						v-if="node.opensTree"
						class="pi pi-chevron-right mr-(--spacing-xxs) size-3 shrink-0 leading-none text-(length:--text-button-md-font-size) text-(--text-muted) group-hover:text-(--text-default)"
						aria-hidden="true"
					/>
				</span>
			</template>
		</MenuItem>
	</template>
</template>

<script setup lang="ts">
import MenuItem from '@aziontech/webkit/menu-item';
import MenuSub from '@aziontech/webkit/menu-sub';
import MenuSubContent from '@aziontech/webkit/menu-sub-content';
import MenuSubTrigger from '@aziontech/webkit/menu-sub-trigger';
import Tag from '@aziontech/webkit/tag';

import type { MenuNode } from '~/nav/resolve';

defineOptions({ name: 'DocsSidebarRows', inheritAttrs: false });

interface Props {
	nodes: MenuNode[];
	activeId?: string;
}

withDefaults(defineProps<Props>(), { activeId: '' });

const emit = defineEmits<{
	navigate: [event: MouseEvent, node: MenuNode];
}>();

function forward(event: MouseEvent, node: MenuNode) {
	emit('navigate', event, node);
}
</script>
