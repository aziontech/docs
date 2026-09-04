import type { AstroIntegration } from 'astro';
import type * as mdast from 'mdast';
import type * as unified from 'unified';
import { visit } from 'unist-util-visit';
import { makeComponentNode } from './utils/makeComponentNode';

const CodeBlockTagname = 'AutoImportedCodeBlock';
export const codeBlockAutoImport: Record<string, [string, string][]> = {
	'~/components/CodeBlock/CodeBlock.astro': [['default', CodeBlockTagname]],
};

/**
 * Extracts a `title="..."` (or `title='...'`) entry from a fence meta string,
 * e.g. ```js title="azion.config.js"
 */
function parseTitle(meta: string | null | undefined): string | undefined {
	if (!meta) return undefined;
	const match = meta.match(/title=(["'])(.*?)\1/);
	return match?.[2] || undefined;
}

/**
 * remark plugin that converts fenced code blocks into instances of the
 * Webkit-backed `<CodeBlock>` component. Because it runs at the remark level,
 * it also covers fences inside imported MDX partials (snippets/tabs), which
 * `<Content components={...}>` overrides would miss.
 *
 * For example, this Markdown
 *
 * ````md
 * ```js title="azion.config.js"
 * console.log('hello');
 * ```
 * ````
 *
 * will produce this output
 *
 * ```astro
 * <CodeBlock lang="js" fileName="azion.config.js" code="console.log('hello');" />
 * ```
 */
function remarkCodeBlocks(): unified.Plugin<[], mdast.Root> {
	const transformer: unified.Transformer<mdast.Root> = (tree) => {
		visit(tree, 'code', (node: mdast.Code, index, parent) => {
			if (!parent || index === null || index === undefined) return;

			parent.children[index] = makeComponentNode(CodeBlockTagname, {
				attributes: {
					// makeComponentNode drops falsy attribute values, so keep an
					// empty fence renderable by passing a single blank line.
					code: node.value || ' ',
					lang: node.lang ?? undefined,
					fileName: parseTitle(node.meta),
				},
			});
		});
	};

	return function attacher() {
		return transformer;
	};
}

/**
 * Astro integration that sets up the remark plugin and auto-imports the
 * `<CodeBlock>` component everywhere.
 */
export function astroCodeBlocks(): AstroIntegration {
	return {
		name: '@azion/code-blocks',
		hooks: {
			'astro:config:setup': ({ updateConfig }) => {
				updateConfig({
					markdown: {
						remarkPlugins: [remarkCodeBlocks()],
					},
				});
			},
		},
	};
}
