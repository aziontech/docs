<template>
	<Tooltip :text="tooltip" placement="top">
		<span aria-live="polite">
			<ButtonHighlight :label="copied ? copiedLabel : label" @click="copy" />
		</span>
	</Tooltip>
</template>

<script setup lang="ts">
import ButtonHighlight from '@aziontech/webkit/button-highlight';
import Tooltip from '@aziontech/webkit/tooltip';
import { onBeforeUnmount, ref } from 'vue';

interface Props {
	/** Text copied to the clipboard on activation. */
	prompt: string;
	/** Visible label while idle. */
	label?: string;
	/** Visible label while the copied state is shown. */
	copiedLabel?: string;
	/** Tooltip explaining what the copied prompt is for. */
	tooltip?: string;
}

const props = withDefaults(defineProps<Props>(), {
	label: 'Copy prompt',
	copiedLabel: 'Prompt copied!',
	tooltip: 'Copies a setup prompt for your AI coding tool',
});

const copied = ref(false);
let timer: ReturnType<typeof setTimeout> | null = null;

async function copy() {
	try {
		await navigator.clipboard.writeText(props.prompt);
	} catch {
		return;
	}
	copied.value = true;
	if (timer) clearTimeout(timer);
	timer = setTimeout(() => {
		copied.value = false;
		timer = null;
	}, 2000);
}

onBeforeUnmount(() => {
	if (timer) clearTimeout(timer);
});
</script>
