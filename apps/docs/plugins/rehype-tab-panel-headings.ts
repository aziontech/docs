import type { Element, Root, RootContent } from 'hast';
import { h } from 'hastscript';
import type { VFile } from 'vfile';

import { autoLinks } from './rehype-autolink-config';

interface JsxNode {
	type: string;
	name?: string | null;
	attributes?: { type: string; name?: string; value?: unknown }[];
	children?: RootContent[];
}

const attr = (node: JsxNode, name: string): unknown =>
	node.attributes?.find((a) => a.type === 'mdxJsxAttribute' && a.name === name)?.value;

const isJsx = (node: JsxNode, name: string) =>
	(node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') && node.name === name;

const isHeading = (node: JsxNode): node is JsxNode & Element =>
	node.type === 'element' && /^h[1-6]$/.test((node as unknown as Element).tagName);

/** An interface panel's opening heading: dropped from the outline, linked to `?interface=<key>#<section>`. */
export default function rehypeTabPanelHeadings() {
	return (tree: Root, file: VFile) => {
		const ids: string[] = [];
		let section = '';

		const label = (heading: Element, key: string) => {
			heading.properties ??= {};
			heading.properties.dataTabPanelHeading = '';
			if (typeof heading.properties.id === 'string') ids.push(heading.properties.id);
			const href = `?interface=${key}${section ? `#${section}` : ''}`;
			Object.assign(heading.properties, autoLinks.headingProperties(heading));
			heading.children = [
				h('a', { ...autoLinks.properties, href, dataTabPanelAnchor: '' }, autoLinks.content(heading)),
			];
		};

		const walk = (node: JsxNode, inInterfaceTabs: boolean, inPanel: boolean) => {
			let tabs = inInterfaceTabs;
			let panel = inPanel;
			if (isJsx(node, 'Tabs')) {
				tabs = attr(node, 'sharedStore') === 'interface';
				panel = false;
			} else if (isJsx(node, 'Fragment')) {
				const slot = attr(node, 'slot');
				if (tabs && typeof slot === 'string' && slot.startsWith('panel.')) {
					panel = true;
					const opener = node.children?.find(
						(child) => child.type !== 'text' || child.value.trim() !== ''
					) as JsxNode | undefined;
					if (opener && isHeading(opener)) label(opener, slot.slice(6));
				}
			}
			if (!panel && isHeading(node) && typeof node.properties?.id === 'string') section = node.properties.id;
			for (const child of node.children ?? []) walk(child as JsxNode, tabs, panel);
		};
		walk(tree as unknown as JsxNode, false, false);

		if (ids.length === 0) return;
		const data = file.data as { astro?: { frontmatter?: Record<string, unknown> } };
		data.astro ??= {};
		data.astro.frontmatter ??= {};
		data.astro.frontmatter.tabPanelHeadings = ids;
	};
}
