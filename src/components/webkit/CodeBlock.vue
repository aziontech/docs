<template>
	<div data-doc-chrome class="not-prose my-6">
		<WebkitCodeBlock :tabs="tabs" :show-line-numbers="showLineNumbers" />
	</div>
</template>

<script setup lang="ts">
import WebkitCodeBlock from '@aziontech/webkit/code-block';
import { computed } from 'vue';

interface Props {
	/** Source to render. */
	code: string;
	/** Highlighting language; also the tab label. */
	lang?: string;
	/** Shown as the block's file name. */
	fileName?: string;
	/** Numbers each line. */
	showLineNumbers?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	lang: undefined,
	fileName: undefined,
	showLineNumbers: false,
});

const tabs = computed(() => [
	{
		label: props.lang || 'code',
		value: 'code',
		code: props.code.replace(/^\n+/, '').replace(/\s+$/, '') || ' ',
		language: props.lang,
		fileName: props.fileName || undefined,
	},
]);
</script>
