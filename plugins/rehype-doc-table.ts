import type { Element, Root } from 'hast';
import { SKIP, visit } from 'unist-util-visit';

/*
 * A markdown table IS a webkit Table: the tokens are carried over rather than
 * the markup, since webkit's Table is a flex tree and this is real `<table>`.
 * Classes stay identical to `doc-markdown.vue` in webkit-docs.
 */
const TABLE_CLASS =
	'w-full border-separate border-spacing-0 overflow-hidden rounded-(--shape-elements) border-(length:--border-width-default) border-solid border-(--border-default) bg-(--bg-surface) text-(--text-default)';
const THEAD_ROW_CLASS = 'h-11';
const TBODY_CLASS = '[&>tr:last-child>td]:border-b-0';
const TH_CLASS =
	'border-b-(length:--border-width-default) border-solid border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) py-(--spacing-xs) text-start align-middle text-label-sm text-(--text-muted)';
const TD_CLASS =
	'border-b-(length:--border-width-default) border-solid border-(--border-default) px-(--spacing-sm) py-(--spacing-xs) text-start align-middle text-label-md text-(--text-default)';

const addClass = (node: Element, className: string) => {
	node.properties = { ...node.properties, className };
};

/*
 * GFM column alignment arrives as the cell's `align` property (serialized as an
 * inline `text-align`) and would fight the important `text-start` in the cell
 * classes — so it moves into the class and the `align`/style carriers go.
 */
const addCellClass = (cell: Element, baseClass: string) => {
	const inline = String(cell.properties?.style ?? '');
	const align = cell.properties?.align ?? /text-align:\s*([a-z]+)\b/.exec(inline)?.[1];
	const className =
		align === 'center' || align === 'right'
			? baseClass.replace('text-start', align === 'center' ? 'text-center' : 'text-end')
			: baseClass;
	const rest = inline.replace(/text-align:\s*[a-z]+;?\s*/, '').trim();
	cell.properties = { ...cell.properties, className };
	delete cell.properties.align;
	if (rest) cell.properties.style = rest;
	else delete cell.properties.style;
};

const children = (node: Element, tagName: string) =>
	node.children.filter(
		(child): child is Element => child.type === 'element' && child.tagName === tagName
	);

const style = (table: Element) => {
	addClass(table, TABLE_CLASS);

	for (const head of children(table, 'thead')) {
		for (const row of children(head, 'tr')) {
			addClass(row, THEAD_ROW_CLASS);
			for (const cell of children(row, 'th')) {
				addCellClass(cell, TH_CLASS);
				cell.properties.scope = 'col';
			}
		}
	}

	for (const body of children(table, 'tbody')) {
		addClass(body, TBODY_CLASS);
		for (const row of children(body, 'tr')) {
			for (const cell of children(row, 'td')) addCellClass(cell, TD_CLASS);
		}
	}
};

/** `data-doc-block` is the hook DocProse spaces a block with. */
export default function rehypeDocTable() {
	return (tree: Root) => {
		visit(tree, 'element', (node, index, parent) => {
			if (node.tagName !== 'table' || !parent || index === undefined) return;

			style(node);
			parent.children[index] = {
				type: 'element',
				tagName: 'div',
				properties: { 'data-doc-block': '', className: 'w-full overflow-x-auto' },
				children: [node],
				position: node.position,
			};

			return SKIP;
		});
	};
}
