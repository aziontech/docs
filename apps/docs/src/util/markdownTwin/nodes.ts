/** mdast builders and readers shared by the twin's handlers. */
import { toString } from 'mdast-util-to-string';

import { evaluateLiteral } from './estree';

/** A loose mdast node: the handlers build plain mdast and read MDX nodes off the same tree. */
export interface MdNode {
	type: string;
	children?: MdNode[];
	value?: string;
	[key: string]: unknown;
}

interface JsxAttribute {
	type: string;
	name: string;
	value?: string | null | { value: string; data?: { estree?: { type: string } } };
}

export const text = (value: string): MdNode => ({ type: 'text', value });
export const inlineCode = (value: string): MdNode => ({ type: 'inlineCode', value });
export const strong = (children: MdNode[]): MdNode => ({ type: 'strong', children });
export const paragraph = (children: MdNode[]): MdNode => ({ type: 'paragraph', children });
export const blockquote = (children: MdNode[]): MdNode => ({ type: 'blockquote', children });
export const heading = (depth: number, children: MdNode[]): MdNode => ({
	type: 'heading',
	depth,
	children,
});
export const link = (url: string, children: MdNode[]): MdNode => ({
	type: 'link',
	url,
	title: null,
	children,
});
export const image = (url: string, alt: string): MdNode => ({
	type: 'image',
	url,
	alt,
	title: null,
});
export const code = (lang: string | undefined, value: string): MdNode => ({
	type: 'code',
	lang: lang || null,
	meta: null,
	value,
});
export const listItem = (children: MdNode[]): MdNode => ({
	type: 'listItem',
	spread: children.length > 1,
	checked: null,
	children,
});
export const list = (ordered: boolean, items: MdNode[]): MdNode => ({
	type: 'list',
	ordered,
	start: ordered ? 1 : null,
	spread: items.some((item) => item.spread),
	children: items,
});
export const table = (header: MdNode[][], rows: MdNode[][][]): MdNode => ({
	type: 'table',
	align: header.map(() => null),
	children: [header, ...rows].map((cells) => ({
		type: 'tableRow',
		children: cells.map((cell) => ({ type: 'tableCell', children: cell })),
	})),
});

/** A bold label on its own line: the step titles, tab labels, and aside titles. */
export const label = (value: string): MdNode => paragraph([strong([text(value)])]);

export const plainText = (nodes: MdNode[] | MdNode): string =>
	toString(nodes as Parameters<typeof toString>[0]).trim();

const PHRASING = new Set([
	'text',
	'inlineCode',
	'emphasis',
	'strong',
	'delete',
	'link',
	'image',
	'break',
	'html',
	'footnoteReference',
]);

export const isPhrasing = (node: MdNode): boolean => PHRASING.has(node.type);

/**
 * Makes converted children valid block content: each run of inline nodes becomes a
 * paragraph (whitespace-only runs are dropped), and blocks stand on their own. A component
 * written on one line with its content parses as inline, but its handler returns blocks.
 */
export function asBlocks(nodes: MdNode[]): MdNode[] {
	const out: MdNode[] = [];
	let run: MdNode[] = [];
	const flush = () => {
		if (run.some((node) => node.type !== 'text' || String(node.value).trim()))
			out.push(paragraph(run));
		run = [];
	};
	for (const node of nodes) {
		if (PHRASING.has(node.type)) run.push(node);
		else {
			flush();
			out.push(node);
		}
	}
	flush();
	return out;
}

/** Flattens converted children into one line of phrasing content: paragraphs are joined
 * with a space, and any other block is reduced to its text. */
export function toPhrasing(nodes: MdNode[]): MdNode[] {
	const out: MdNode[] = [];
	for (const node of nodes) {
		const part =
			node.type === 'paragraph'
				? node.children ?? []
				: PHRASING.has(node.type)
				? [node]
				: [text(plainText(node))];
		if (part.length === 0) continue;
		if (out.length > 0 && node.type === 'paragraph') out.push(text(' '));
		out.push(...part);
	}
	return out;
}

/** The value of a JSX attribute: a string, the literal an expression evaluates to, `true`
 * for a bare boolean attribute, or `undefined` when absent. */
export function attr(node: MdNode, name: string): unknown {
	const attribute = (node.attributes as JsxAttribute[]).find(
		(item) => item.type === 'mdxJsxAttribute' && item.name === name
	);
	if (!attribute) return undefined;
	const { value } = attribute;
	if (value === null || value === undefined) return true;
	if (typeof value === 'string') return value;
	if (!value.data?.estree) throw new Error(`attribute ${name} has no parsed expression`);
	return evaluateLiteral(value.data.estree);
}

export function str(node: MdNode, name: string): string | undefined {
	const value = attr(node, name);
	return typeof value === 'string' ? value : undefined;
}

export const isElement = (node: MdNode): boolean =>
	node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement';

/** The child elements of a component, looking through the paragraph MDX wraps around
 * elements written on consecutive lines (`<Fragment slot="tab.x">X</Fragment>`). */
export function childElements(node: MdNode): MdNode[] {
	return (node.children ?? []).flatMap((child) =>
		child.type === 'paragraph' ? childElements(child) : isElement(child) ? [child] : []
	);
}

/** Wraps phrasing in a paragraph when the element stood on its own line. */
export const block = (node: MdNode, phrasing: MdNode[]): MdNode[] =>
	node.type === 'mdxJsxFlowElement' ? [paragraph(phrasing)] : phrasing;

/** Points a navigation link at its page's twin: `/en/documentation/x/?tab=api#y` becomes
 * `/en/documentation/x.md?tab=api#y`. Only the pathname changes, and only when `hasTwin`
 * (when given) says the route serves that page; other links stay as they are. */
export function twinHref(href: string, hasTwin?: (path: string) => boolean): string {
	if (!href.startsWith('/') || href.startsWith('//')) return href;
	const end = href.search(/[?#]/);
	const path = (end === -1 ? href : href.slice(0, end)).replace(/\/+$/, '');
	const rest = end === -1 ? '' : href.slice(end);
	if (path === '' || /\.[a-z0-9]+$/i.test(path)) return href;
	if (hasTwin && !hasTwin(path)) return href;
	return `${path}.md${rest}`;
}
