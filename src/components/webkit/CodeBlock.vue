<template>
	<div data-doc-chrome class="not-prose my-6">
		<WebkitCodeBlock :tabs="tabs" :show-line-numbers="showLineNumbers" />
	</div>
</template>

<script setup>
	import WebkitCodeBlock from '@aziontech/webkit/code-block';
	import { computed } from 'vue';

	const props = defineProps({
		code: { type: String, required: true },
		lang: { type: String, default: undefined },
		fileName: { type: String, default: undefined },
		showLineNumbers: { type: Boolean, default: false }
	});

	const tabs = computed(() => [
		{
			label: props.lang || 'code',
			value: 'code',
			code: props.code.replace(/^\n+/, '').replace(/\s+$/, '') || ' ',
			language: props.lang,
			fileName: props.fileName || undefined
		}
	]);
</script>
