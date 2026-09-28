<template>
	<PopoverRoot v-bind="$attrs" :data-testid="testId" width="small" placement="bottom-start">
		<PopoverTrigger v-slot="{ isOpen }">
			<Button
				kind="text"
				:label="isOpen ? hideLabel : label"
				:icon="isOpen ? 'pi pi-eye-slash' : 'pi pi-eye'"
			/>
		</PopoverTrigger>
		<!-- The panel teleports to `body`, which server rendering cannot emit: mount it client-side. -->
		<PopoverContent v-if="isMounted">
			<PopoverHeader>
				<PopoverTitle>{{ title }}</PopoverTitle>
			</PopoverHeader>
			<div class="flex flex-col gap-(--spacing-sm) p-(--spacing-md)">
				<p class="m-0 text-pretty wrap-anywhere text-body-sm text-(--text-muted)">{{ prompt }}</p>
				<div class="flex justify-end">
					<CopyButton
						:value="prompt"
						:aria-label="copyLabel"
						:copied-label="copiedLabel"
						kind="outlined"
					/>
				</div>
			</div>
		</PopoverContent>
	</PopoverRoot>
</template>

<script setup lang="ts">
import Button from '@aziontech/webkit/button';
import CopyButton from '@aziontech/webkit/copy-button';
import PopoverContent from '@aziontech/webkit/popover-content';
import PopoverHeader from '@aziontech/webkit/popover-header';
import PopoverRoot from '@aziontech/webkit/popover-root';
import PopoverTitle from '@aziontech/webkit/popover-title';
import PopoverTrigger from '@aziontech/webkit/popover-trigger';
import { computed, onMounted, ref, useAttrs } from 'vue';

defineOptions({ name: 'PromptPopover', inheritAttrs: false });

interface Props {
	/** The prompt shown in the panel and copied by its copy control. */
	prompt: string;
	/** Trigger label while the panel is closed. */
	label?: string;
	/** Trigger label while the panel is open, so the state is in the words a screen reader announces. */
	hideLabel?: string;
	/** Panel title; it names the dialog. */
	title?: string;
	/** Accessible name of the copy control. */
	copyLabel?: string;
	/** Accessible name of the copy control once the prompt is copied. */
	copiedLabel?: string;
}

withDefaults(defineProps<Props>(), {
	label: 'Show prompt',
	hideLabel: 'Hide prompt',
	title: 'Setup prompt',
	copyLabel: 'Copy prompt',
	copiedLabel: 'Prompt copied',
});

const attrs = useAttrs();

const isMounted = ref(false);

const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'prompt-popover');

onMounted(() => {
	isMounted.value = true;
});
</script>
