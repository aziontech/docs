<template>
	<DocSteps>
		<DocStep v-for="step in steps" :key="step.key" :title="step.title">
			<p v-if="step.body">
				<AgentInlineText :text="step.body" :tooltips="tooltips" />
			</p>
			<AgentSamples v-if="step.samples" :samples="step.samples" />
			<DocCallout v-if="step.note" kind="warning">
				<AgentInlineText :text="step.note" :tooltips="tooltips" />
			</DocCallout>
			<p v-if="step.link">
				<a
					:href="step.link.href"
					:target="isExternal(step.link.href) ? '_blank' : '_self'"
					:rel="isExternal(step.link.href) ? 'noreferrer' : undefined"
					class="group/link inline-flex items-center gap-(--spacing-xxs)"
				>
					{{ step.link.label }}
					<i
						:class="isExternal(step.link.href) ? 'pi-arrow-up-right' : 'pi-chevron-right'"
						class="pi text-body-xs"
						aria-hidden="true"
					/>
				</a>
			</p>
			<DocPrompt v-if="step.prompt" :title="tryIt" icon="pi pi-sparkles">
				{{ step.prompt }}
			</DocPrompt>
		</DocStep>
	</DocSteps>
</template>

<script setup lang="ts">
import DocCallout from '@aziontech/webkit/doc-callout';
import DocPrompt from '@aziontech/webkit/doc-prompt';
import DocStep from '@aziontech/webkit/doc-step';
import DocSteps from '@aziontech/webkit/doc-steps';

import AgentInlineText, { type AgentTooltip } from './AgentInlineText.vue';
import AgentSamples, { type AgentSample } from './AgentSamples.vue';

defineOptions({ name: 'AgentQuickStart' });

export interface AgentQuickStartStep {
	key: string;
	title: string;
	body?: string;
	samples?: AgentSample[];
	note?: string;
	link?: { label: string; href: string };
	prompt?: string;
}

interface Props {
	steps: AgentQuickStartStep[];
	tryIt?: string;
	tooltips?: Record<string, AgentTooltip>;
}

withDefaults(defineProps<Props>(), { tryIt: '', tooltips: () => ({}) });

const isExternal = (href: string) => /^(https?:)?\/\//.test(href);
</script>
