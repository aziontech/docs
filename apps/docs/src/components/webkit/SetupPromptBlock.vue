<template>
	<!-- A compact take on the documentation home's agent block: one frame, the controls in one row. -->
	<FrameBox v-bind="$attrs" :data-testid="testId" data-doc-block data-doc-chrome>
		<div class="flex flex-col items-start gap-(--spacing-sm) p-(--spacing-lg)">
			<h3 class="m-0 text-heading-sm text-(--text-default)">{{ entry.title }}</h3>
			<p class="m-0 text-body-sm text-(--text-muted)">{{ entry.body }}</p>
			<div class="mt-(--spacing-xs) flex flex-wrap items-center gap-(--spacing-sm)">
				<CopyPromptButton
					:prompt="entry.prompt"
					:label="entry.label"
					:copied-label="entry.copiedLabel"
					:tooltip="entry.tooltip"
				/>
				<PromptPopover
					:prompt="entry.prompt"
					:label="entry.preview.label"
					:hide-label="entry.preview.hideLabel"
					:title="entry.preview.title"
					:copy-label="entry.preview.copyLabel"
					:copied-label="entry.preview.copiedLabel"
				/>
				<Button
					:label="entry.guided.label"
					kind="secondary"
					icon="pi pi-microchip-ai"
					:href="entry.guided.href"
				/>
			</div>
		</div>
	</FrameBox>
</template>

<script setup lang="ts">
import Button from '@aziontech/webkit/button';
import FrameBox from '@aziontech/webkit/frame-box';
import { computed, useAttrs } from 'vue';

import type { Lang } from '~/data/docs-home/types';
import { setupPrompts, type SetupPromptKey } from '~/data/setup-prompts';

import CopyPromptButton from './CopyPromptButton.vue';
import PromptPopover from './PromptPopover.vue';

defineOptions({ name: 'SetupPromptBlock', inheritAttrs: false });

interface Props {
	/** Which entry of the setup prompts data the block copies and previews. */
	prompt: SetupPromptKey;
	/** Language of the copy, the labels, and the prompt text. */
	lang?: Lang;
}

const props = withDefaults(defineProps<Props>(), { lang: 'en' });

const attrs = useAttrs();

const entry = computed(() => setupPrompts[props.prompt][props.lang]);
const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'setup-prompt-block');
</script>
