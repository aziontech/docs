<template>
	<FlowNode unstyled :terminal="node.terminal ?? false" :data-testid="testId">
		<!-- The Console's topology card: a quarter of the container less the flow's padding and
		     gaps, plus what the margins take from the flow's gap to leave 32px (2rem) between
		     cards at every width; the lines attach to the header anchor, so the ports stay on the
		     card edge. Clamped to 150px, the narrowest header that shows "Custom Pages" whole, and
		     224px, the Console's card, so four columns fit the article with no scroll. -->
		<div
			:data-state="open ? 'open' : 'closed'"
			class="mx-[calc((2rem_-_var(--spacing-xl))/2)] flex w-[clamp(9.375rem,calc((100cqw_-_2*var(--spacing-md)_-_3*var(--spacing-xl))/4_+_var(--spacing-xl)_-_2rem),14rem)] flex-col rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) shadow-(--shadow-sm) transition-colors duration-moderate-01 ease-productive-entrance hover:border-(--border-strong) has-[:focus-visible]:border-(--border-strong) motion-reduce:transition-none data-[state=open]:border-(--primary)"
		>
			<!-- The anchor pins the connector ports to the header, so an expanding body never
			     moves a card's lines. Header, identity row and body share one side padding, so
			     the icon lines up with the text under it; 12px leaves the links' hover surface,
			     which bleeds 8px past the text, clear of the card border. -->
			<FlowAnchor>
				<button
					:id="triggerId"
					type="button"
					:aria-expanded="open"
					:aria-controls="bodyId"
					:data-state="open ? 'open' : 'closed'"
					class="group flex w-full items-center gap-(--spacing-xxs) rounded-t-(--shape-card) px-(--spacing-sm) pt-(--spacing-xs) pb-(--spacing-xxs) text-left outline-none transition-colors duration-moderate-01 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset motion-reduce:transition-none"
					@click="toggle"
				>
					<i
						:class="node.icon"
						class="text-label-sm leading-none text-(--text-muted)"
						aria-hidden="true"
					/>
					<span class="min-w-0 flex-1 truncate text-label-sm text-(--text-muted)">{{
						node.kind
					}}</span>
					<i
						class="pi pi-chevron-down text-label-sm leading-none text-(--text-muted) transition-transform duration-moderate-01 ease-productive-entrance group-data-[state=open]:rotate-180 motion-reduce:transition-none"
						aria-hidden="true"
					/>
				</button>
			</FlowAnchor>
			<p
				class="m-0 truncate px-(--spacing-sm) pb-(--spacing-xs) text-label-sm text-(--text-default)"
			>
				{{ node.role }}
			</p>
			<div
				:id="bodyId"
				role="region"
				:aria-labelledby="triggerId"
				:inert="!open"
				:data-state="open ? 'open' : 'closed'"
				class="grid grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none data-[state=open]:grid-rows-[1fr]"
			>
				<div class="overflow-hidden">
					<div
						class="flex flex-col items-start gap-(--spacing-xs) border-t border-(--border-muted) px-(--spacing-sm) py-(--spacing-xs)"
					>
						<!-- The tags are pulled left by their own padding and border, so their text starts
						     on the same line as the links under them. -->
						<div
							v-if="node.tag || node.examples?.length"
							class="-ml-[calc(var(--spacing-xxs)_+_var(--border-width-default,1px))] flex flex-wrap gap-(--spacing-xxs)"
						>
							<Tag
								v-if="node.tag"
								size="small"
								:severity="node.tag.severity"
								:label="node.tag.label"
							/>
							<Tag
								v-for="example in node.examples"
								:key="example"
								size="small"
								severity="secondary"
								:label="example"
							/>
						</div>
						<ul v-if="node.items?.length" class="m-0 flex list-none flex-col p-0">
							<li v-for="item in node.items" :key="item.id">
								<Link :href="item.href" :label="item.label" size="small" :show-icon="false" />
							</li>
						</ul>
						<Link
							v-if="node.href"
							:href="node.href"
							:label="referenceLabel"
							size="small"
							:show-icon="false"
						/>
					</div>
				</div>
			</div>
		</div>
	</FlowNode>
</template>

<script setup lang="ts">
import FlowAnchor from '@aziontech/webkit/flow-anchor';
import FlowNode from '@aziontech/webkit/flow-node';
import Link from '@aziontech/webkit/link';
import Tag from '@aziontech/webkit/tag';
import { computed, useAttrs } from 'vue';

import type { TopologyNode } from '~/data/platform-topology';

defineOptions({ name: 'PlatformTopologyNode', inheritAttrs: false });

interface Props {
	/** The resource this card stands for, with what it holds. */
	node: TopologyNode;
	/** Label of the link that closes the body. */
	referenceLabel: string;
	/** Id prefix of the header and the body, so the pair stays unique per diagram. */
	idPrefix: string;
}

const props = defineProps<Props>();

/** Whether the body is open; the diagram seeds it and every card toggles on its own. */
const open = defineModel<boolean>('open', { default: false });

const emit = defineEmits<{
	/** The header was activated; the subject is the card's node. */
	'node-toggle': [event: MouseEvent, node: TopologyNode];
}>();

const attrs = useAttrs();

const testId = computed(
	() => (attrs['data-testid'] as string | undefined) ?? `platform-topology__node-${props.node.id}`
);
const triggerId = computed(() => `${props.idPrefix}-${props.node.id}-trigger`);
const bodyId = computed(() => `${props.idPrefix}-${props.node.id}-body`);

function toggle(event: MouseEvent) {
	open.value = !open.value;
	emit('node-toggle', event, props.node);
}
</script>
