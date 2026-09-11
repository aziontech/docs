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
							:href="hrefs[agent.slug]"
						>
							<template #icon>
								<AgentMark :name="agent.mark" />
							</template>
							{{ t(agent.description, lang) }}
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

import AgentMark from '~/components/webkit/AgentMark.vue';

import { agents, label, t, type Lang } from './data';

const props = defineProps<{ lang: Lang; hrefs: Record<string, string> }>();

const FILTERS = ['All', 'Terminal', 'IDE', 'Extension'] as const;

const filter = ref<string>('All');

const groups = computed(() =>
	FILTERS.map((key) => ({
		key,
		label: label('filters', key, props.lang),
		agents: key === 'All' ? agents : agents.filter((agent) => agent.workflows.includes(key)),
	}))
);
</script>
