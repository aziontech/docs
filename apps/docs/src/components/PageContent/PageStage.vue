<template>
	<!-- The release stage beside the page title: the tag, and the help icon that explains it. GA has
	     no stage, so the host renders this only when the page carries one. -->
	<span class="inline-flex shrink-0 items-center gap-(--spacing-xs)">
		<Tag :label="stageLabel" :severity="stageSeverity" />
		<!-- DocTooltip teleports its panel to body, which Astro does not re-emit; it renders after
		     mount, in a box of the same size, so nothing shifts. -->
		<DocTooltip
			v-if="mounted"
			:headline="stageLabel"
			:tip="stageTip"
			:cta="labels.stageCta"
			:href="labels.stageHref"
			placement="bottom"
		>
			<span
				class="float-left flex size-(--spacing-md) items-center justify-center text-(--text-muted)"
			>
				<i class="pi pi-question-circle" aria-hidden="true" />
				<span class="sr-only">{{ labels.stageHelp }}</span>
			</span>
		</DocTooltip>
		<span v-else class="block size-(--spacing-md)" aria-hidden="true" />
	</span>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import DocTooltip from '@aziontech/webkit/doc-tooltip';
import Tag from '@aziontech/webkit/tag';

import type { PageStageLabels } from '~/components/PageContent/page-stage-labels';
import type { Stage } from '~/nav/versions';

// Astro hands an island's `slot` to the component as an attribute; it must not reach the root.
defineOptions({ name: 'PageStage', inheritAttrs: false });

const props = defineProps<{
	/** The page's release stage. */
	stage: Stage;
	/** The stage words and the help panel's copy. */
	labels: PageStageLabels;
}>();

const mounted = ref(false);
onMounted(() => {
	mounted.value = true;
});

const stageLabel = computed(
	() =>
		({
			experimental: props.labels.stageExperimental,
			preview: props.labels.stagePreview,
			deprecated: props.labels.stageDeprecated,
		})[props.stage]
);

const stageTip = computed(
	() =>
		({
			experimental: props.labels.stageTipExperimental,
			preview: props.labels.stageTipPreview,
			deprecated: props.labels.stageTipDeprecated,
		})[props.stage]
);

// The menu's stage tags use the same colours: a stage in progress is info, one on its way out a warning.
const STAGE_SEVERITY = {
	experimental: 'info',
	preview: 'info',
	deprecated: 'warning',
} as const;
const stageSeverity = computed(() => STAGE_SEVERITY[props.stage]);
</script>
