import type { AstroIntegration } from 'astro';
import type * as mdast from 'mdast';
import remarkDirective from 'remark-directive';
import type * as unified from 'unified';
import { remove } from 'unist-util-remove';
import { visit } from 'unist-util-visit';
import { makeComponentNode } from './utils/makeComponentNode';

const AsideTagname = 'AutoImportedAside';
export const asideAutoImport: Record<string, [string, string][]> = {
	'~/components/Aside.astro': [['default', AsideTagname]],
};

/** remark plugin turning `:::tip[Did you know?]` blocks into `<Aside type title>`. */
// The `:::` parsing itself comes from `remark-directive`; this only rewrites its nodes.
function remarkAsides(): unified.Plugin<[], mdast.Root> {
	const variants = new Set(['note', 'tip', 'caution', 'danger']);

	const transformer: unified.Transformer<mdast.Root> = (tree) => {
		// @ts-expect-error Possibly infinite type instantiation we can’t do anything about.
		visit(tree, (node, index, parent) => {
			if (!parent || index === null || node.type !== 'containerDirective') return;
			const type = node.name;
			if (!variants.has(type)) return;

			// remark-directive turns a container’s “label” into a child paragraph; lift it
			// to the `title` prop and drop the paragraph.
			let title: string | undefined;
			remove(node, (child) => {
				if (child.data?.directiveLabel) {
					// `in` alone leaves `children` as `unknown`, so narrow to the text node.
					const children = 'children' in child ? child.children : undefined;
					const first = Array.isArray(children) ? children[0] : undefined;
					if (
						first &&
						typeof first === 'object' &&
						'value' in first &&
						typeof first.value === 'string'
					) {
						title = first.value;
					}
					return true;
				}
			});

			parent.children[index] = makeComponentNode(
				AsideTagname,
				{ attributes: { type, title } },
				...node.children
			);
		});
	};

	return function attacher() {
		return transformer;
	};
}

/** Registers the remark plugin and auto-imports `<Aside>` everywhere. */
export function astroAsides(): AstroIntegration {
	return {
		name: '@astrojs/asides',
		hooks: {
			'astro:config:setup': ({ updateConfig }) => {
				updateConfig({
					markdown: {
						remarkPlugins: [remarkDirective, remarkAsides()],
					},
				});
			},
		},
	};
}
