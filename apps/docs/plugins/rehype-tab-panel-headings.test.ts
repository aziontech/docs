import type { Element, Root } from 'hast';
import { VFile } from 'vfile';
import { describe, expect, test } from 'vitest';

import rehypeTabPanelHeadings from './rehype-tab-panel-headings';

const heading = (tagName: string, id: string, text: string): Element => ({
	type: 'element',
	tagName,
	properties: { id },
	children: [{ type: 'text', value: text }],
});

const jsx = (name: string, attributes: Record<string, string>, children: unknown[]) => ({
	type: 'mdxJsxFlowElement',
	name,
	attributes: Object.entries(attributes).map(([attrName, value]) => ({
		type: 'mdxJsxAttribute',
		name: attrName,
		value,
	})),
	children,
});

const newline = { type: 'text', value: '\n' };

function run(store: string) {
	const opener = heading('h3', 'api', 'API');
	const nested = heading('h3', 'troubleshooting', 'Troubleshooting');
	const tree = {
		type: 'root',
		children: [
			heading('h2', 'create-a-database', 'Create a database'),
			jsx('Tabs', { sharedStore: store }, [
				newline,
				jsx('Fragment', { slot: 'panel.api' }, [newline, opener, newline, nested]),
			]),
		],
	} as unknown as Root;
	const file = new VFile();
	rehypeTabPanelHeadings()(tree, file);
	const data = file.data as { astro?: { frontmatter?: { tabPanelHeadings?: string[] } } };
	return { opener, nested, ids: data.astro?.frontmatter?.tabPanelHeadings };
}

const href = (element: Element) => (element.children[0] as Element | undefined)?.properties?.href;

describe('rehypeTabPanelHeadings', () => {
	test('links the opening heading to its section with its interface, and drops it from the outline', () => {
		const { opener, ids } = run('interface');
		expect(href(opener)).toBe('?interface=api#create-a-database');
		expect(opener.properties?.dataTabPanelHeading).toBe('');
		expect(ids).toEqual(['api']);
	});

	test('leaves a heading further down the panel as an ordinary heading', () => {
		const { nested } = run('interface');
		expect(nested.properties?.dataTabPanelHeading).toBeUndefined();
		expect(nested.children).toEqual([{ type: 'text', value: 'Troubleshooting' }]);
	});

	test('ignores panels of any other store', () => {
		const { opener, ids } = run('pricing-tabs');
		expect(opener.properties?.dataTabPanelHeading).toBeUndefined();
		expect(ids).toBeUndefined();
	});
});
