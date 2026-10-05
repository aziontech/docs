/** Converts a page's MDX body into the plain Markdown served at `/{lang}/{permalink}.md`.
 * Parsed with the MDX grammar, so indented step bodies stay prose and a `>` inside an
 * attribute stays in the attribute; each component becomes the mdast that carries the same
 * information. Imports and JSX comments are dropped; MDX includes are converted in place. */
import path from 'node:path';

import { remark } from 'remark';
import remarkDirective from 'remark-directive';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';

import type { Lang } from '../../data/docs-home/types';

import { callout, calloutTitle, handlers, type Context, type TwinData } from './handlers';
import {
	asBlocks,
	childElements,
	isElement,
	isPhrasing,
	paragraph,
	plainText,
	str,
	text,
	twinHref,
	type MdNode,
} from './nodes';

export type { PricingProps, TwinData, TwinGroup } from './handlers';

export interface TwinOptions {
	lang: Lang;
	/** Raw source of an include by its `includeKey` (`/src/includes/….mdx`), or `undefined` when no
	 * such file exists; an include it cannot find fails the conversion. */
	readInclude?: (key: string) => string | undefined;
	/** Whether the route serves a twin for an internal path (`/en/documentation/x`); links to
	 * pages without one keep their HTML address. */
	hasTwin?: (path: string) => boolean;
	/** Build-time data for the components that render it. */
	data?: TwinData;
	/** Called once per element or expression the converter has no rule for. */
	onUnknown?: (name: string) => void;
}

const mdxParser = remark().use(remarkMdx).use(remarkGfm).use(remarkDirective);
const markdownParser = remark().use(remarkGfm);
const includeParser = remark().use(remarkGfm).use(remarkDirective);
const serializer = remark()
	.use(remarkGfm)
	.use({
		settings: {
			bullet: '-',
			// Two lists in a row (cards, then related items) stay apart without an HTML comment.
			bulletOther: '*',
			bulletOrdered: '.',
			bulletOrderedOther: ')',
			emphasis: '*',
			strong: '*',
			fence: '`',
			fences: true,
			rule: '-',
			listItemIndent: 'one',
			incrementListMarker: true,
		},
	});

const FRONTMATTER = /^---[\s\S]*?---\n?/;
const INCLUDE = /\.mdx?$/;

/** Where an include import points, as the key both callers look it up by: `~/includes/a/./b.mdx`
 * and `/src/includes/a/b.mdx` are both `/src/includes/a/b.mdx`. `undefined` outside `src/includes`. */
export function includeKey(specifier: string): string | undefined {
	const rooted = specifier.startsWith('~/') ? `/src/${specifier.slice(2)}` : specifier;
	if (!rooted.startsWith('/')) return undefined;
	const key = path.posix.normalize(rooted);
	return key.startsWith('/src/includes/') && INCLUDE.test(key) ? key : undefined;
}

interface EsmNode {
	type: string;
	source?: { value: string };
	specifiers?: { type: string; local: { name: string }; imported?: { name?: string; value?: string } }[];
}

/** Local name to import specifier, for every default import (`import X from`, and
 * `import { default as X } from`) the ESTree of the page's import blocks declares. */
function readImports(tree: MdNode): Map<string, string> {
	const imports = new Map<string, string>();
	for (const node of tree.children ?? []) {
		if (node.type !== 'mdxjsEsm') continue;
		const program = (node.data as { estree?: { body: EsmNode[] } } | undefined)?.estree;
		for (const declaration of program?.body ?? []) {
			if (declaration.type !== 'ImportDeclaration') continue;
			for (const specifier of declaration.specifiers ?? []) {
				const imported = specifier.imported?.name ?? specifier.imported?.value;
				if (specifier.type === 'ImportDefaultSpecifier' || imported === 'default')
					imports.set(specifier.local.name, declaration.source!.value);
			}
		}
	}
	return imports;
}

/** The component an import names, whatever the page calls it locally:
 * `@aziontech/webkit/doc-card` is DocCard, `~/components/webkit/CodeBlock.vue` is CodeBlock. */
const componentOf = (specifier: string) =>
	(specifier.split('/').pop() ?? '')
		.replace(/\.[a-z]+$/, '')
		.replace(/(^|-)([a-z])/g, (_, __, letter: string) => letter.toUpperCase());

/** Every `tab.KEY` label a shared tab strip declares, keyed `store:KEY`, first one wins. */
function collectTabLabels(
	node: MdNode,
	labels: Map<string, string>,
	componentName: (node: MdNode) => string
) {
	const store =
		isElement(node) && componentName(node) === 'Tabs' ? str(node, 'sharedStore') : undefined;
	if (store)
		for (const fragment of childElements(node)) {
			const slot = str(fragment, 'slot') ?? '';
			const key = `${store}:${slot.slice(4)}`;
			if (slot.startsWith('tab.') && !labels.has(key)) labels.set(key, plainText(fragment));
		}
	for (const child of node.children ?? []) collectTabLabels(child, labels, componentName);
}

function sourceOf(node: MdNode, source: string): string {
	const position = node.position as { start: { offset: number }; end: { offset: number } };
	return source.slice(position.start.offset, position.end.offset);
}

async function convert(
	source: string,
	options: TwinOptions,
	tabLabels: Map<string, string>,
	parser: typeof mdxParser = mdxParser
): Promise<MdNode[]> {
	const tree = parser.parse(source) as unknown as MdNode;
	const imports = readImports(tree);
	/** The component an element renders: what its import names, not what the page calls it. */
	const componentName = (node: MdNode) => {
		const name = String(node.name ?? '');
		const specifier = imports.get(name);
		return specifier && !INCLUDE.test(specifier) ? componentOf(specifier) : name;
	};
	collectTabLabels(tree, tabLabels, componentName);

	const ctx: Context = {
		lang: options.lang,
		tabLabels,
		data: options.data ?? {},
		twinHref: (href) => twinHref(href, options.hasTwin),
		transform: async (nodes) => (await Promise.all(nodes.map(transformNode))).flat(),
		markdown: (markdown) =>
			((markdownParser.parse(markdown) as unknown as MdNode).children ?? []) as MdNode[],
	};

	async function transformNode(node: MdNode): Promise<MdNode[]> {
		switch (node.type) {
			case 'mdxjsEsm':
				return [];
			case 'mdxFlowExpression':
			case 'mdxTextExpression':
				// `{/* … */}` comments, including the ones wrapping dead content.
				if (!/^\s*\/\*[\s\S]*\*\/\s*$/.test(String(node.value)))
					options.onUnknown?.('{expression}');
				return [];
			case 'containerDirective': {
				const [first, ...rest] = node.children ?? [];
				const labelled = (first?.data as { directiveLabel?: boolean })?.directiveLabel;
				const title = labelled ? plainText(first) : calloutTitle(options.lang, String(node.name));
				return callout(title, await ctx.transform(labelled ? rest : node.children ?? []));
			}
			case 'leafDirective':
				return [paragraph([text(sourceOf(node, source))])];
			case 'textDirective':
				// remark-directive reads `word:name` in prose as a directive; give the text back.
				return [text(sourceOf(node, source))];
			case 'mdxJsxFlowElement':
			case 'mdxJsxTextElement':
				return element(node);
		}
		if (node.children) node.children = await ctx.transform(node.children);
		// A paragraph whose components returned blocks is split around them.
		if (node.type === 'paragraph' && !(node.children ?? []).every(isPhrasing))
			return asBlocks(node.children ?? []);
		return [node];
	}

	async function element(node: MdNode): Promise<MdNode[]> {
		const name = String(node.name ?? '');
		const specifier = imports.get(name);
		if (specifier && INCLUDE.test(specifier)) {
			const key = includeKey(specifier);
			const include = key === undefined ? undefined : options.readInclude?.(key);
			if (include === undefined) throw new Error(`include ${specifier} not found`);
			const body = include.replace(FRONTMATTER, '');
			return convert(body, options, tabLabels, key!.endsWith('.md') ? includeParser : mdxParser);
		}

		const handler = handlers[componentName(node)];
		if (handler) return handler(node, ctx);

		if (name === 'br') return [{ type: 'html', value: '<br>' }];
		if (name && name[0] === name[0].toUpperCase()) options.onUnknown?.(name);
		return ctx.transform(node.children ?? []);
	}

	return ctx.transform(tree.children ?? []);
}

/** The page body as plain Markdown, without the title line (the route writes it). */
export async function mdxToMarkdown(body: string, options: TwinOptions): Promise<string> {
	const children = await convert(body.replace(FRONTMATTER, ''), options, new Map());
	const root = { type: 'root', children } as Parameters<typeof serializer.stringify>[0];
	return serializer.stringify(root);
}
