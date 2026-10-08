import type { AstroIntegration } from 'astro';
import type * as mdast from 'mdast';
import type * as unified from 'unified';
import { visit } from 'unist-util-visit';
import { makeComponentNode } from './utils/makeComponentNode';

const CodeBlockTagname = 'AutoImportedCodeBlock';
const MermaidTagname = 'AutoImportedMermaid';
export const codeBlockAutoImport: Record<string, [string, string][]> = {
	'~/components/CodeBlock/CodeBlock.astro': [['default', CodeBlockTagname]],
	'~/components/Mermaid/Mermaid.astro': [['default', MermaidTagname]],
};

function parseTitle(meta: string | null | undefined): string | undefined {
	if (!meta) return undefined;
	const match = meta.match(/title=(["'])(.*?)\1/);
	return match?.[2] || undefined;
}

// A `diff` word in the info string (```js diff) marks the first column of every
// line as a diff marker: `+` added, `-` removed, a space unchanged.
function parseDiff(meta: string | null | undefined): boolean {
	return Boolean(meta && /(^|\s)diff(\s|$)/.test(meta));
}

function remarkCodeBlocks(): unified.Plugin<[], mdast.Root> {
	const transformer: unified.Transformer<mdast.Root> = (tree) => {
		visit(tree, 'code', (node: mdast.Code, index, parent) => {
			if (!parent || index === null || index === undefined) return;

			// A `mermaid` fence is a diagram, not source to highlight. The markdown twin
			// still serves the fence itself, so agents read the text form.
			if (node.lang === 'mermaid') {
				parent.children[index] = makeComponentNode(MermaidTagname, {
					attributes: { code: node.value || ' ', title: parseTitle(node.meta) },
				});
				return;
			}

			parent.children[index] = makeComponentNode(CodeBlockTagname, {
				attributes: {
					code: node.value || ' ',
					lang: node.lang ?? undefined,
					fileName: parseTitle(node.meta),
					diff: parseDiff(node.meta) ? 'true' : undefined,
				},
			});
		});
	};

	return function attacher() {
		return transformer;
	};
}

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
