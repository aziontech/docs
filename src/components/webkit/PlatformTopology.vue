<template>
	<div
		v-bind="$attrs"
		data-doc-block
		data-doc-chrome
		:data-testid="testId"
		class="rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised)"
	>
		<!-- The wrapper centers the diagram; the flow root keeps its own horizontal scroll when
		     the column is narrower than the diagram, as the Console's topology does. -->
		<div class="@container flex w-full justify-center">
			<div class="min-w-0 max-w-full">
				<FlowRoot align="start" :aria-label="content.ariaLabel" :data-testid="`${testId}__flow`">
					<!-- A column with one card is a bare node, so the list only holds a group where
					     cards really stack; a group between the list and its items is an ARIA gap
					     the flow component owns. -->
					<template v-for="(column, columnIndex) in content.columns" :key="columnIndex">
						<FlowParallel
							v-if="column.length > 1"
							align="start"
							:data-testid="`${testId}__column-${columnIndex}`"
						>
							<PlatformTopologyNode
								v-for="node in column"
								:key="node.id"
								v-model:open="openIds[node.id]"
								:node="node"
								:reference-label="content.referenceLabel"
								:id-prefix="uid"
								:data-testid="`${testId}__node-${node.id}`"
								@node-toggle="onToggle"
							/>
						</FlowParallel>
						<PlatformTopologyNode
							v-else
							v-model:open="openIds[column[0].id]"
							:node="column[0]"
							:reference-label="content.referenceLabel"
							:id-prefix="uid"
							:data-testid="`${testId}__node-${column[0].id}`"
							@node-toggle="onToggle"
						/>
					</template>
					<!-- The flow measures its lines when its container resizes, and a card closing
					     under a taller column moves the cards below it without resizing the
					     container. Flipping `data-flow-disabled` on this element, which the flow
					     watches, makes it measure again once every transition ends. -->
					<span ref="nudgeRef" hidden aria-hidden="true" />
				</FlowRoot>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import FlowParallel from '@aziontech/webkit/flow-parallel';
import FlowRoot from '@aziontech/webkit/flow-root';
import { computed, onBeforeUnmount, onMounted, reactive, ref, useAttrs, useId } from 'vue';

import PlatformTopologyNode from './PlatformTopologyNode.vue';
import { platformTopology } from '~/data/platform-topology';
import type { TopologyNode, TopologyNodeId } from '~/data/platform-topology';
import type { Lang } from '~/data/docs-home/types';

defineOptions({ name: 'PlatformTopology', inheritAttrs: false });

interface Props {
	/** Language of the copy; it also selects the permalinks the cards link to. */
	lang?: Lang;
	/** Ids of the cards whose body starts open; every card opens and closes on its own. */
	defaultOpen?: TopologyNodeId[];
}

const props = withDefaults(defineProps<Props>(), {
	lang: 'en',
	defaultOpen: () => [],
});

const emit = defineEmits<{
	/** A card header was activated; the subject is the card's node. */
	'node-toggle': [event: MouseEvent, node: TopologyNode];
}>();

const attrs = useAttrs();
const uid = useId();

const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'platform-topology');
const content = computed(() => platformTopology[props.lang]);

const openIds = reactive<Record<string, boolean>>(
	Object.fromEntries(props.defaultOpen.map((id) => [id, true]))
);

function onToggle(event: MouseEvent, node: TopologyNode) {
	emit('node-toggle', event, node);
}

const nudgeRef = ref<HTMLElement | null>(null);
let nudge = 0;
function settle() {
	const el = nudgeRef.value;
	if (!el) return;
	nudge = (nudge + 1) % 2;
	if (nudge) el.setAttribute('data-flow-disabled', 'false');
	else el.removeAttribute('data-flow-disabled');
}

onMounted(() => {
	nudgeRef.value?.parentElement?.addEventListener('transitionend', settle);
});

onBeforeUnmount(() => {
	nudgeRef.value?.parentElement?.removeEventListener('transitionend', settle);
});
</script>
