import type { AstroIntegration } from 'astro';
import type * as mdast from 'mdast';
import type * as unified from 'unified';
import { visit } from 'unist-util-visit';
import { makeComponentNode } from './utils/makeComponentNode';

const CodeBlockTagname = 'AutoImportedCodeBlock';
export const codeBlockAutoImport: Record<string, [string, string][]> = {
	'~/components/CodeBlock/CodeBlock.astro': [['default', CodeBlockTagname]],
};

function parseTitle(meta: string | null | undefined): string | undefined {
	if (!meta) return undefined;
	const match = meta.match(/title=(["'])(.*?)\1/);
	return match?.[2] || undefined;
}

function remarkCodeBlocks(): unified.Plugin<[], mdast.Root> {
	const transformer: unified.Transformer<mdast.Root> = (tree) => {
		visit(tree, 'code', (node: mdast.Code, index, parent) => {
			if (!parent || index === null || index === undefined) return;

			parent.children[index] = makeComponentNode(CodeBlockTagname, {
				attributes: {
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
