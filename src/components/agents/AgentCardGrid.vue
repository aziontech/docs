<template>
	<DocCardGroup :cols="3">
		<DocCard
			v-for="agent in others"
			:key="agent.slug"
			:title="agent.name"
			:overline="agent.vendor"
			:href="agentUrl(agent.slug, lang)"
		>
			<template #icon>
				<AgentMark :name="agent.mark" />
			</template>
			{{ t(agent.description, lang) }}
		</DocCard>
	</DocCardGroup>
</template>

<script setup lang="ts">
	import DocCard from '@aziontech/webkit/doc-card'
	import DocCardGroup from '@aziontech/webkit/doc-card-group'
	import { computed } from 'vue'

	import AgentMark from '~/components/webkit/AgentMark.vue'

	import { agents, agentUrl, t, type Lang } from './data'

	const props = defineProps<{ agent: string; lang: Lang }>()

	const others = computed(() => agents.filter((agent) => agent.slug !== props.agent))
</script>
