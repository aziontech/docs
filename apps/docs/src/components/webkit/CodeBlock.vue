<template>
	<div data-doc-block data-doc-chrome>
		<WebkitCodeBlock :tabs="webkitTabs" :show-line-numbers="lineNumbers" />
	</div>
</template>

<script setup lang="ts">
import WebkitCodeBlock from '@aziontech/webkit/code-block';
import { computed, useId } from 'vue';

// The bar on top of a code block names its language when the block carries no
// file name. Tags are the fence's info string; unknown tags show as written.
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
	/** Tab label, such as `npm`. */
	label: string;
	/** Source to render in this tab. */
	code: string;
	/** Highlighting language of this tab. */
	lang?: string;
}

interface Props {
	/** Source to render. Ignored when `tabs` is set. */
	code?: string;
	/** Highlighting language; also names the bar on top of a multi-line block. */
	lang?: string;
	/** Shown in the bar on top, in place of the language name. */
	fileName?: string;
	/** Numbers each line. Defaults to on for a multi-line block, off for one line. */
	showLineNumbers?: boolean;
	/** Page locale, for the bar's language name. */
	locale?: string;
	/** Reads the first column of each line as a diff marker: `+` added, `-` removed, a space unchanged. */
	diff?: boolean;
	/** One tab per version of the same code, such as an install command per package manager. Replaces `code` and `lang`. */
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

// A diff block keeps its markers out of the code: each line loses its first column,
// and `+` or `-` there becomes a line change webkit draws in its diff layout.
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

// A one-liner follows webkit's single-line story: no bar, no gutter. A multi-line
// block gets both, the bar naming the language when no file name is given.
const lineNumbers = computed(() => props.showLineNumbers ?? multiline.value);
// webkit's diff layout has no bar on top.
const barLabel = computed(() =>
	props.diff
		? undefined
		: props.fileName || (multiline.value ? codeLanguageLabel(props.lang, props.locale) : undefined)
);

// webkit builds each tab's id from its value, so two tabbed blocks on one page need distinct values.
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
