<template>
	<div data-doc-block data-doc-chrome>
		<CodeBlock :tabs="tabs" />
	</div>
</template>

<script setup lang="ts">
import CodeBlock from '@aziontech/webkit/code-block';
import { computed } from 'vue';

defineOptions({ name: 'AgentSamples' });

export interface AgentSample {
	label: string;
	language: string;
	code: string;
	fileName?: string;
}

interface Props {
	samples: AgentSample[];
}

const props = defineProps<Props>();

const tabs = computed(() =>
	props.samples.map((sample) => ({
		label: sample.label,
		value: sample.label,
		code: sample.code,
		language: sample.language,
		fileName: sample.fileName,
	}))
);
</script>
