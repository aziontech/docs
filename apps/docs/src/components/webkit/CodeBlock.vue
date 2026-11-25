<template>
	<div data-doc-block data-doc-chrome>
		<WebkitCodeBlock :tabs="webkitTabs" :show-line-numbers="lineNumbers" />
	</div>
</template>

<script setup lang="ts">
import WebkitCodeBlock from '@aziontech/webkit/code-block';
import { computed, useId } from 'vue';

const LABELS: Record<string, string> = {
	bash: 'Shell',
	sh: 'Shell',
	shell: 'Shell',
	zsh: 'Shell',
	console: 'Shell',
	js: 'JavaScript',
	javascript: 'JavaScript',
	ts: 'TypeScript',
	typescript: 'TypeScript',
	json: 'JSON',
	jsonl: 'JSON Lines',
	hcl: 'HCL',
	graphql: 'GraphQL',
	yaml: 'YAML',
	yml: 'YAML',
	mdx: 'MDX',
	md: 'Markdown',
	markdown: 'Markdown',
	html: 'HTML',
	css: 'CSS',
	python: 'Python',
	py: 'Python',
	go: 'Go',
	sql: 'SQL',
	http: 'HTTP',
	xml: 'XML',
};

const TEXT_TAGS = new Set(['text', 'plaintext', 'txt']);

function codeLanguageLabel(lang: string | undefined, locale = 'en'): string | undefined {
	const tag = lang?.trim().toLowerCase();
	if (!tag) return undefined;
	if (TEXT_TAGS.has(tag)) return locale === 'pt-br' ? 'Texto' : 'Text';
	return LABELS[tag] ?? lang;
}

interface CodeTab {
	label: string;
	code: string;
	lang?: string;
}

interface Props {
	code?: string;
	lang?: string;
	fileName?: string;
	showLineNumbers?: boolean;
	locale?: string;
	diff?: boolean;
	tabs?: CodeTab[];
}

const props = withDefaults(defineProps<Props>(), {
	code: '',
	lang: undefined,
	fileName: undefined,
	showLineNumbers: undefined,
	locale: 'en',
	diff: false,
	tabs: () => [],
});

const trim = (value: string) => value.replace(/^\n+/, '').replace(/\s+$/, '') || ' ';

const raw = computed(() => trim(props.code));

const parsed = computed(() => {
	if (!props.diff) return { code: raw.value, lineChanges: undefined };
	const lineChanges: { line: number; change: 'added' | 'removed' }[] = [];
	const lines = raw.value.split('\n').map((line, index) => {
		const marker = line.charAt(0);
		if (marker === '+') lineChanges.push({ line: index + 1, change: 'added' });
		if (marker === '-') lineChanges.push({ line: index + 1, change: 'removed' });
		return line.slice(1);
	});
	return { code: lines.join('\n'), lineChanges };
});

const source = computed(() => parsed.value.code);
const multiline = computed(() =>
	props.tabs.length
		? props.tabs.some((tab) => trim(tab.code).includes('\n'))
		: source.value.includes('\n')
);

const lineNumbers = computed(() => props.showLineNumbers ?? multiline.value);
const barLabel = computed(() =>
	props.diff
		? undefined
		: props.fileName || (multiline.value ? codeLanguageLabel(props.lang, props.locale) : undefined)
);

const uid = useId();

const webkitTabs = computed(() =>
	props.tabs.length
		? props.tabs.map((tab, index) => ({
				label: tab.label,
				value: `${uid}-${index}`,
				code: trim(tab.code),
				language: tab.lang,
			}))
		: [
				{
					label: props.lang || 'code',
					value: 'code',
					code: source.value,
					language: props.lang,
					fileName: barLabel.value,
					lineChanges: parsed.value.lineChanges,
				},
			]
);
</script>
