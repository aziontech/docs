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
					<!-- The flow draws lines only between consecutive columns. A link between two
					     cards stacked in the same column is measured here and drawn in the flow's
					     own connector style, over the same container the flow paints in. -->
					<svg
						v-if="content.links.length"
						ref="linksRef"
						:viewBox="linksViewBox"
						preserveAspectRatio="none"
						fill="none"
						aria-hidden="true"
						class="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
						:data-testid="`${testId}__links`"
					>
						<path
							v-for="(d, index) in linkPaths"
							:key="index"
							:d="d"
							stroke-width="1"
							stroke-dasharray="4 4"
							class="animate-flow-dash stroke-(--accent) motion-reduce:animate-none"
						/>
					</svg>
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

/* Links between two cards of one column: a straight vertical line from the top edge of the
   lower card to the bottom edge of the upper one, measured in the flow container's space. The
   svg stays mounted while the diagram declares a link, so a measurement can never unmount it. */
const linksRef = ref<SVGSVGElement | null>(null);
const linkPaths = ref<string[]>([]);
const linksViewBox = ref('0 0 0 0');
let observer: ResizeObserver | null = null;

function measureLinks() {
	const svg = linksRef.value;
	const container = svg?.parentElement;
	if (!svg || !container) return;
	const base = container.getBoundingClientRect();
	const paths: string[] = [];
	for (const link of content.value.links) {
		const from = container.querySelector<HTMLElement>(
			`[data-testid="${testId.value}__node-${link.from}"]`
		);
		const to = container.querySelector<HTMLElement>(
			`[data-testid="${testId.value}__node-${link.to}"]`
		);
		if (!from || !to) continue;
		const a = from.getBoundingClientRect();
		const b = to.getBoundingClientRect();
		const x = a.left - base.left + a.width / 2;
		paths.push(`M${x},${a.top - base.top} L${x},${b.bottom - base.top}`);
	}
	linksViewBox.value = `0 0 ${container.clientWidth} ${container.clientHeight}`;
	linkPaths.value = paths;
}

/* The flow measures its own lines on container resizes. A card animating shut stops resizing
   the container as soon as a taller column takes over, while the cards below it keep moving,
   so the container alone is not enough: the cards at both ends of a link are observed too, and
   the end of every transition triggers one more measurement. Flipping `data-flow-disabled` on
   the overlay, which the flow watches, makes the flow re-measure its lines at that point. */
let nudge = 0;
function settle() {
	measureLinks();
	const svg = linksRef.value;
	if (!svg) return;
	nudge = (nudge + 1) % 2;
	if (nudge) svg.setAttribute('data-flow-disabled', 'false');
	else svg.removeAttribute('data-flow-disabled');
}

onMounted(() => {
	globalThis.requestAnimationFrame(() => {
		measureLinks();
		const container = linksRef.value?.parentElement;
		if (!container) return;
		container.addEventListener('transitionend', settle);
		if ('ResizeObserver' in globalThis) {
			observer = new ResizeObserver(() => measureLinks());
			observer.observe(container);
			for (const link of content.value.links) {
				for (const id of [link.from, link.to]) {
					const el = container.querySelector<HTMLElement>(
						`[data-testid="${testId.value}__node-${id}"]`
					);
					if (el) observer.observe(el);
				}
			}
		}
	});
});

onBeforeUnmount(() => {
	linksRef.value?.parentElement?.removeEventListener('transitionend', settle);
	observer?.disconnect();
	observer = null;
});
</script>
