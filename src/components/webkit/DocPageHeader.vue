<template>
	<WkDocPageHeader
		:breadcrumb="breadcrumb"
		:description="description"
		:last-updated="lastUpdated"
		:last-updated-label="labels.lastUpdated"
		:locale="locale"
		:meta-actions="metaActions"
		@meta-action="onMetaAction"
	>
		<template #title>
			<slot name="title">
				<!-- eslint-disable vue/no-v-html -- title comes from the page frontmatter at build time, never user input -->
				<h1
					id="overview"
					class="m-0 w-full min-w-0 text-heading-2xl text-(--text-default) sm:w-auto sm:flex-1 sm:text-heading-xl"
					v-html="title"
				/>
				<!-- eslint-enable vue/no-v-html -->
			</slot>
		</template>
		<template v-if="$slots.details" #details>
			<slot name="details" />
		</template>
	</WkDocPageHeader>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import WkDocPageHeader, {
	type DocCrumb,
	type DocPageAction,
} from '@aziontech/webkit/doc-page-header';

defineSlots<{
	/** Replaces the rendered title. */
	title(): unknown;
	/** Extra detail rows under the header. */
	details(): unknown;
}>();

export interface DocPageHeaderLabels {
	lastUpdated: string;
	copy: string;
	copied: string;
	copyTip: string;
	view: string;
	viewTip: string;
	agents: string;
	agentsTip: string;
}

const props = defineProps<{
	title: string;
	description?: string;
	breadcrumb?: DocCrumb[];
	markdownHref: string;
	/** BCP 47 tag the last-updated date is formatted in. */
	locale: string;
	labels: DocPageHeaderLabels;
	lastUpdated?: string;
	agentSetupHref?: string;
}>();

const isCopied = ref(false);

const metaActions = computed<DocPageAction[]>(() => [
	{
		value: 'copy',
		label: isCopied.value ? props.labels.copied : props.labels.copy,
		icon: 'pi pi-copy',
		tip: props.labels.copyTip,
	},
	{
		value: 'markdown',
		label: props.labels.view,
		icon: 'pi pi-eye',
		href: props.markdownHref,
		target: '_blank',
		tip: props.labels.viewTip,
	},
	...(props.agentSetupHref
		? [
				{
					value: 'agents',
					label: props.labels.agents,
					icon: 'pi pi-microchip-ai',
					href: props.agentSetupHref,
					tip: props.labels.agentsTip,
				},
		  ]
		: []),
]);

const pageMarkdown = ref<string | null>(null);

const onMetaAction = async (_event: MouseEvent, item: DocPageAction) => {
	if (item.value !== 'copy') return;

	try {
		if (!pageMarkdown.value) {
			const response = await fetch(props.markdownHref);
			pageMarkdown.value = await response.text();
		}
		if (typeof navigator !== 'undefined' && navigator.clipboard) {
			await navigator.clipboard.writeText(pageMarkdown.value);
		}
		isCopied.value = true;
		setTimeout(() => {
			isCopied.value = false;
		}, 2000);
	} catch (error) {
		console.error(error);
	}
};
</script>
