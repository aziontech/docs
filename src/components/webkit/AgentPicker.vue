<template>
	<div data-doc-block data-doc-chrome>
		<TabView v-model:value="filter">
			<TabView.List>
				<TabView.Item v-for="group in groups" :key="group.key" :value="group.key">
					{{ group.label }}
				</TabView.Item>
			</TabView.List>
			<TabView.Content>
				<TabView.Panel v-for="group in groups" :key="group.key" :value="group.key">
					<DocCardGroup :cols="3">
						<DocCard
							v-for="agent in group.agents"
							:key="agent.slug"
							:title="agent.name"
							:overline="agent.vendor"
							:href="agent.href"
						>
							<template #icon>
								<AgentMark :name="agent.mark" />
							</template>
							{{ agent.description }}
						</DocCard>
					</DocCardGroup>
				</TabView.Panel>
			</TabView.Content>
		</TabView>
	</div>
</template>

<script setup lang="ts">
import DocCard from '@aziontech/webkit/doc-card';
import DocCardGroup from '@aziontech/webkit/doc-card-group';
import TabView from '@aziontech/webkit/tab-view';
import { computed, ref } from 'vue';

import AgentMark, { type AgentName } from './AgentMark.vue';

defineOptions({ name: 'AgentPicker' });

export interface AgentPickerAgent {
	slug: string;
	name: string;
	vendor: string;
	mark: AgentName;
	href: string;
	description: string;
	workflows: string[];
}

export interface AgentPickerFilter {
	key: string;
	label: string;
	workflow?: string;
}

interface Props {
	agents: AgentPickerAgent[];
	filters: AgentPickerFilter[];
}

const props = defineProps<Props>();

const filter = ref<string>(props.filters[0]?.key ?? '');

const groups = computed(() =>
	props.filters.map((entry) => ({
		key: entry.key,
		label: entry.label,
		agents: entry.workflow
			? props.agents.filter((agent) => agent.workflows.includes(entry.workflow as string))
			: props.agents,
	}))
);
</script>
