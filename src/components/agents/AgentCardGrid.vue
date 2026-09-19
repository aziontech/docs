<template>
	<DocCardGroup :cols="3">
		<DocCard
			v-for="entry in others"
			:key="entry.slug"
			:title="entry.name"
			:overline="entry.vendor"
			:href="hrefs[entry.slug]"
		>
			<template #icon>
				<AgentMark :name="entry.mark" />
			</template>
			{{ t(entry.description, lang) }}
		</DocCard>
	</DocCardGroup>
</template>

<script setup lang="ts">
import DocCard from '@aziontech/webkit/doc-card';
import DocCardGroup from '@aziontech/webkit/doc-card-group';
import { computed } from 'vue';

import AgentMark from '~/components/webkit/AgentMark.vue';

import { agents, t, type Lang } from './data';

const props = defineProps<{ agent: string; lang: Lang; hrefs: Record<string, string> }>();

const others = computed(() => agents.filter((agent) => agent.slug !== props.agent));
</script>
