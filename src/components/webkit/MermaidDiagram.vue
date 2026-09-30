<template>
	<!-- Three roots, one per state: the diagram IS the design system's figure once it
	     renders, so it takes the block rung of the prose ladder like any DocFrame. -->
	<Skeleton
		v-if="loading"
		kind="shape"
		width="100%"
		height="12rem"
		:data-testid="testId"
		data-loading
	/>
	<CodeBlock v-else-if="error" :code="code" lang="mermaid" :data-testid="testId" data-error />
	<DocFrame v-else :caption="title" :data-testid="testId">
		<!-- data-doc-chrome stops the prose ladder at this boundary: mermaid's own
		     label markup (`p`, `span`) must not take the page's paragraph rhythm. -->
		<div data-doc-chrome class="relative w-full min-w-0">
			<!-- Same anchor the code block uses: the source is text an agent can read, so
			     the reader can take it the same way. -->
			<div
				class="absolute top-(--spacing-xs) right-(--spacing-xs) z-2"
				:data-testid="`${testId}__copy-anchor`"
			>
				<CopyButton
					:value="code"
					aria-label="Copy diagram source"
					copied-label="Copied"
					kind="outlined"
					size="small"
					:data-testid="`${testId}__copy`"
				/>
			</div>
			<ScrollArea
				orientation="horizontal"
				:aria-label="title || diagramLabel"
				:data-testid="`${testId}__scroll`"
			>
				<!-- eslint-disable vue/no-v-html -- mermaid output; `securityLevel: 'strict'` runs it through DOMPurify -->
				<div
					role="img"
					:aria-label="title || diagramLabel"
					:data-testid="`${testId}__diagram`"
					class="p-(--spacing-sm) [&_svg]:mx-auto [&_svg]:h-auto"
					v-html="svg"
				></div>
				<!-- eslint-enable vue/no-v-html -->
			</ScrollArea>
		</div>
	</DocFrame>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useAttrs, useId } from 'vue';

import CopyButton from '@aziontech/webkit/copy-button';
import DocFrame from '@aziontech/webkit/doc-frame';
import ScrollArea from '@aziontech/webkit/scroll-area';
import Skeleton from '@aziontech/webkit/skeleton';

import CodeBlock from '~/components/webkit/CodeBlock.vue';

defineOptions({ name: 'MermaidDiagram', inheritAttrs: false });

interface Props {
	/** Mermaid source, exactly as written in the fence. */
	code: string;
	/** Optional caption, from the fence's `title="…"` meta. */
	title?: string;
}

const props = withDefaults(defineProps<Props>(), { title: '' });

const attrs = useAttrs();
const uid = useId();

const loading = ref(true);
const error = ref(false);
const svg = ref('');
const diagramType = ref('');

const testId = computed(() => (attrs['data-testid'] as string) ?? 'documentation-mermaid-diagram');
const diagramLabel = computed(() =>
	diagramType.value ? `${diagramType.value} diagram` : 'Diagram'
);

type MermaidModule = typeof import('mermaid')['default'];
let mermaid: MermaidModule | undefined;
let observer: MutationObserver | undefined;
let renderCount = 0;

// Every token resolves through a probe element and a canvas so mermaid's color
// math receives hex, whatever color space the theme declares the token in.
function resolveColor(token: string): string {
	const probe = document.createElement('span');
	probe.style.color = `var(${token})`;
	document.body.appendChild(probe);
	const raw = getComputedStyle(probe).color;
	probe.remove();
	const ctx = document.createElement('canvas').getContext('2d');
	if (!ctx) return raw;
	ctx.fillStyle = raw;
	return ctx.fillStyle;
}

function isDark(): boolean {
	const html = document.documentElement;
	return (
		html.classList.contains('dark') ||
		html.classList.contains('azion-dark') ||
		html.dataset.theme === 'dark'
	);
}

function themeVariables() {
	const dark = isDark();
	const surface = resolveColor('--bg-surface');
	const raised = resolveColor('--bg-surface-raised');
	const canvas = resolveColor('--bg-canvas');
	const text = resolveColor('--text-default');
	const muted = resolveColor('--text-muted');
	const border = resolveColor('--border-default');
	const strong = resolveColor('--border-strong');
	const primary = resolveColor('--primary');
	const fontFamily =
		getComputedStyle(document.documentElement).getPropertyValue('--font-sans').trim() ||
		'sans-serif';

	return {
		darkMode: dark,
		fontFamily,
		fontSize: '14px',
		background: raised,
		mainBkg: canvas,
		primaryColor: canvas,
		primaryTextColor: text,
		primaryBorderColor: border,
		secondaryColor: surface,
		secondaryTextColor: text,
		secondaryBorderColor: border,
		tertiaryColor: surface,
		tertiaryTextColor: text,
		tertiaryBorderColor: border,
		lineColor: strong,
		textColor: text,
		nodeBkg: canvas,
		nodeBorder: border,
		nodeTextColor: text,
		clusterBkg: surface,
		clusterBorder: border,
		titleColor: text,
		edgeLabelBackground: raised,
		labelBackground: raised,
		labelTextColor: text,
		actorBkg: canvas,
		actorBorder: border,
		actorTextColor: text,
		actorLineColor: strong,
		signalColor: text,
		signalTextColor: text,
		noteBkgColor: surface,
		noteBorderColor: border,
		noteTextColor: text,
		activationBkgColor: raised,
		activationBorderColor: primary,
		sequenceNumberColor: raised,
		loopTextColor: muted,
		attributeBackgroundColorOdd: raised,
		attributeBackgroundColorEven: canvas,
		pie1: primary,
		git0: primary,
		errorBkgColor: raised,
		errorTextColor: text,
	};
}

async function render() {
	if (!mermaid) return;
	const seq = ++renderCount;
	try {
		mermaid.initialize({
			startOnLoad: false,
			securityLevel: 'strict',
			theme: 'base',
			look: 'classic',
			themeVariables: themeVariables(),
			flowchart: { useMaxWidth: false, htmlLabels: true },
			sequence: { useMaxWidth: false },
		});
		const id = `mermaid-${uid.replace(/[^a-zA-Z0-9_-]/g, '')}-${seq}`;
		const result = await mermaid.render(id, props.code.trim());
		if (seq !== renderCount) return;
		svg.value = result.svg;
		diagramType.value = result.diagramType;
		error.value = false;
	} catch {
		if (seq !== renderCount) return;
		error.value = true;
		// mermaid leaves its error placeholder in the body on a failed parse.
		document.querySelector(`#dmermaid-${uid.replace(/[^a-zA-Z0-9_-]/g, '')}-${seq}`)?.remove();
	} finally {
		if (seq === renderCount) loading.value = false;
	}
}

onMounted(async () => {
	try {
		mermaid = (await import('mermaid')).default;
	} catch {
		error.value = true;
		loading.value = false;
		return;
	}
	await render();

	observer = new MutationObserver(() => void render());
	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ['class', 'data-theme'],
	});
});

onBeforeUnmount(() => observer?.disconnect());
</script>
