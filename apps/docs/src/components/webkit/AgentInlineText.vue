<template>
	<template v-for="(token, index) in tokens" :key="index">
		<code v-if="token.type === 'code'">{{ token.value }}</code>
		<strong v-else-if="token.type === 'strong'">{{ token.value }}</strong>
		<a v-else-if="token.type === 'link'" :href="token.href">{{ token.value }}</a>
		<DocTooltip
			v-else-if="token.type === 'tooltip' && tooltips[token.key]"
			:headline="tooltips[token.key].headline"
			:tip="tooltips[token.key].tip"
			:cta="tooltips[token.key].cta"
			:href="tooltips[token.key].href"
		>
			{{ token.value }}
		</DocTooltip>
		<template v-else>{{ token.value }}</template>
	</template>
</template>

<script setup lang="ts">
import DocTooltip from '@aziontech/webkit/doc-tooltip';
import { computed } from 'vue';

defineOptions({ name: 'AgentInlineText', inheritAttrs: false });

export interface AgentTooltip {
	headline: string;
	tip: string;
	cta: string;
	href: string;
}

interface Props {
	text: string;
	tooltips?: Record<string, AgentTooltip>;
}

const props = withDefaults(defineProps<Props>(), { tooltips: () => ({}) });

type InlineToken =
	| { type: 'text'; value: string }
	| { type: 'code'; value: string }
	| { type: 'strong'; value: string }
	| { type: 'link'; value: string; href: string }
	| { type: 'tooltip'; value: string; key: string };

/** An href the docs will render as a link: same-site path, in-page anchor or http(s). */
const SAFE_HREF = /^(https?:\/\/|\/(?!\/)|#)/;

const PATTERN = /\[\[(\w+):([^\]]+)\]\]|`([^`]+)`|\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

function tokenize(text: string): InlineToken[] {
	const tokens: InlineToken[] = [];
	let last = 0;
	for (const match of text.matchAll(PATTERN)) {
		const index = match.index ?? 0;
		if (index > last) tokens.push({ type: 'text', value: text.slice(last, index) });
		const [, tipKey, tipText, code, strong, linkText, href] = match;
		if (tipKey) tokens.push({ type: 'tooltip', key: tipKey, value: tipText });
		else if (code !== undefined) tokens.push({ type: 'code', value: code });
		else if (strong !== undefined) tokens.push({ type: 'strong', value: strong });
		else if (linkText !== undefined) {
			tokens.push(
				SAFE_HREF.test(href)
					? { type: 'link', value: linkText, href }
					: { type: 'text', value: linkText }
			);
		}
		last = index + match[0].length;
	}
	if (last < text.length) tokens.push({ type: 'text', value: text.slice(last) });
	return tokens;
}

const tokens = computed(() => tokenize(props.text));
</script>
