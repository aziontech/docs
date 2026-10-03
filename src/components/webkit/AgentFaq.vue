<template>
	<div
		data-doc-block
		data-doc-chrome
		class="overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface)"
	>
		<Accordion type="single" size="large" default-value="0">
			<Accordion.Item v-for="(item, index) in items" :key="index" :value="String(index)">
				<Accordion.Trigger>{{ item.question }}</Accordion.Trigger>
				<!-- eslint-disable webkit/no-style-override -- design-system gap: Content
				     has no inset prop, and an inner box would add to the panel's own inset
				     rather than set it. Remove when Accordion.Content grows the seam. -->
				<Accordion.Content
					class="px-[var(--accordion-inset,var(--spacing-md))] pt-(--spacing-sm) pb-(--spacing-md)"
				>
					<!-- eslint-enable webkit/no-style-override -->
					<p class="m-0">
						<AgentInlineText :text="item.answer" :tooltips="tooltips" />
					</p>
				</Accordion.Content>
			</Accordion.Item>
		</Accordion>
	</div>
</template>

<script setup lang="ts">
import Accordion from '@aziontech/webkit/accordion';

import AgentInlineText, { type AgentTooltip } from './AgentInlineText.vue';

defineOptions({ name: 'AgentFaq' });

export interface AgentFaqItem {
	question: string;
	answer: string;
}

interface Props {
	items: AgentFaqItem[];
	tooltips?: Record<string, AgentTooltip>;
}

withDefaults(defineProps<Props>(), { tooltips: () => ({}) });
</script>
