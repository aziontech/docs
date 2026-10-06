import type { Root } from 'hast';
import { toHtml } from 'hast-util-to-html';
import type { Transformer } from 'unified';
import { walk } from 'unist-util-walker';

// accessing untyped hast and mdx types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Node = any;

const headingRe = /h([0-6])/;

/** MDX only: collapses static hast subtrees into `set:html`. */
// Subtrees exclude MDX elements and headings, so `rehypeHeadingIds` still sees the heading
// text. Holding content as a string shrinks both the JS output and the AST Rollup keeps.
export function rehypeOptimizeStatic(): Transformer<Root, Root> {
	return (tree) => {
		const allPossibleElements = new Set<Node>();
		const elementStack: Node[] = [];

		walk(tree, {
			enter(node) {
				// @ts-expect-error test tagName naively
				const isHeading = node.tagName && headingRe.test(node.tagName);
				// A node that cannot be optimized disqualifies everything on the stack.
				if (node.type.startsWith('mdx') || isHeading) {
					for (const el of elementStack) {
						allPossibleElements.delete(el);
					}
				}
				// Skip a heading and its children: their content generates the heading text.
				if (isHeading) {
					this.skip();
					return;
				}
				if (node.type === 'element' || node.type === 'mdxJsxFlowElement') {
					elementStack.push(node);
					allPossibleElements.add(node);
				}
			},
			leave(node, parent) {
				if (node.type === 'element' || node.type === 'mdxJsxFlowElement') {
					elementStack.pop();
					// Only the outermost element is a root: a parent still in the set means
					// this node is not one. Climbing back up prunes every inner node.
					if (allPossibleElements.has(parent)) {
						allPossibleElements.delete(node);
					}
				}
			},
		});

		// Collapse each subtree root into `set:html`, dropping its children.
		for (const el of allPossibleElements) {
			if (el.type === 'mdxJsxFlowElement') {
				el.attributes.push({
					type: 'mdxJsxAttribute',
					name: 'set:html',
					value: toHtml(el.children),
				});
			} else {
				el.properties['set:html'] = toHtml(el.children);
			}
		}
	};
}
