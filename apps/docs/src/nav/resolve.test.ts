import { describe, expect, test } from 'vitest';

import {
	buildNavIndex,
	resolveBreadcrumb,
	resolveHubList,
	resolveNeighbours,
	resolveSidebar,
	targetPermalink,
	walkTree,
	type NavData,
	type PageIndex,
} from './resolve';
import { navNode, navTree, type NavNode } from './schema';

const pages: PageIndex = new Map([
	['root', { en: { permalink: '/documentation/product/', title: 'Product' } }],
	['quickstart', { en: { permalink: '/documentation/product/quickstart/', title: 'Quickstart' } }],
	[
		'hub',
		{
			en: { permalink: '/documentation/product/reference/', title: 'Product reference' },
			'pt-br': { permalink: '/documentacao/produto/referencia/', title: 'Referência do produto' },
		},
	],
	[
		'settings',
		{
			en: {
				permalink: '/documentation/product/settings/',
				title: 'Settings',
				description: 'Look up every setting.',
			},
			'pt-br': {
				permalink: '/documentacao/produto/configuracoes/',
				title: 'Configurações',
				description: 'Consulte cada configuração.',
			},
		},
	],
	['legacy', { en: { permalink: '/documentation/product/legacy/', title: 'Legacy' } }],
	[
		'shared',
		{
			en: {
				permalink: '/documentation/other/shared/',
				title: 'Shared',
				description: 'Owned elsewhere.',
			},
		},
	],
	['overview', { en: { permalink: '/documentation/product/feature/', title: 'Feature' } }],
	['deep', { en: { permalink: '/documentation/product/deep/', title: 'Deep' } }],
	['limits', { en: { permalink: '/documentation/product/limits/', title: 'Limits' } }],
]);

function data(items: NavNode[]): NavData {
	const tree = navTree.parse({
		id: 'product',
		title: { en: 'Product' },
		path: { en: 'product', 'pt-br': 'produto' },
		root: 'root',
		groups: [{ items }],
	});
	return { root: { groups: [] }, trees: new Map([['product', tree]]), pages };
}

const reference: NavNode = {
	label: { en: 'Reference', 'pt-br': 'Referência' },
	page: 'hub',
	slug: { en: 'reference', 'pt-br': 'referencia' },
	landing: true,
	items: [
		{ page: 'settings', label: { en: 'Settings', 'pt-br': 'Configurações' } },
		{ page: 'legacy', hidden: true },
		{ page: 'shared', linkOnly: true },
		{ placeholder: true, label: { en: 'Soon' } },
		{ href: 'https://example.com/registry', label: { en: 'Registry' } },
	],
};

const nav = data([
	{ page: 'root', label: { en: 'Overview' } },
	{ page: 'quickstart' },
	reference,
	{ page: 'limits' },
]);

describe('navNode landing', () => {
	test('accepts a landing row that is a page with children', () => {
		expect(navNode.safeParse(reference).success).toBe(true);
	});

	test('rejects a landing row with no page or no children', () => {
		expect(navNode.safeParse({ ...reference, page: undefined }).success).toBe(false);
		expect(navNode.safeParse({ ...reference, items: [] }).success).toBe(false);
	});

	test('rejects a landing row whose sub-group has no page', () => {
		const row = { ...reference, items: [{ label: { en: 'Group' }, items: [{ page: 'deep' }] }] };
		expect(navNode.safeParse(row).success).toBe(false);
	});
});

describe('landing rows in the sidebar', () => {
	const sidebar = (pathname: string) =>
		resolveSidebar(nav, buildNavIndex(nav, 'en'), pathname, 'en', { allProducts: 'All' });

	test('a landing row gets no Overview row', () => {
		const group = sidebar('/en/documentation/product/settings/').groups[0].items[2];
		expect(group.children?.map((row) => row.label)).toEqual([
			'Settings',
			'Shared',
			'Soon',
			'Registry',
		]);
	});

	test('a page with children that is not a landing keeps its Overview row', () => {
		const withOverview = data([
			{ label: { en: 'Feature' }, page: 'overview', items: [{ page: 'deep' }] },
		]);
		const model = resolveSidebar(
			withOverview,
			buildNavIndex(withOverview, 'en'),
			'/en/documentation/product/feature/',
			'en',
			{
				allProducts: 'All',
			}
		);
		expect(model.groups[0].items[0].children?.[0].label).toBe('Overview');
		expect(model.activeId).toMatch(/__index$/);
	});

	test('on the hub page the group is open and no row is selected', () => {
		const model = sidebar('/en/documentation/product/reference/');
		expect(model.activeId).toBe('');
		expect(model.expandedIds).toContain(model.groups[0].items[2].id);
	});

	test('a child page of the hub is still selected', () => {
		expect(sidebar('/en/documentation/product/settings/').activeId).toMatch(/settings$/);
	});
});

describe('landing rows in the breadcrumb and the page sequence', () => {
	const index = buildNavIndex(nav, 'en');

	test('the group crumb links the hub', () => {
		expect(resolveBreadcrumb(nav, index, '/en/documentation/product/settings/', 'en')[1]).toEqual({
			label: 'Reference',
			url: '/en/documentation/product/reference/',
		});
	});

	test('the hub is skipped by previous and next', () => {
		expect(
			resolveNeighbours(nav, index, '/en/documentation/product/quickstart/', 'en').next?.text
		).toBe('Settings');
		expect(resolveNeighbours(nav, index, '/en/documentation/product/reference/', 'en')).toEqual({});
	});
});

describe('targetPermalink', () => {
	const permalinkOf = (items: NavNode[], page: string, lang: 'en' | 'pt-br' = 'en') => {
		const tree = data(items).trees.get('product')!;
		const entry = walkTree(tree, lang).find((row) => row.node.page === page)!;
		return targetPermalink(data(items), entry, lang);
	};

	test('a slug names the row under its parent', () => {
		expect(permalinkOf([reference], 'hub')).toBe('/documentation/product/reference/');
		expect(permalinkOf([reference], 'hub', 'pt-br')).toBe('/documentacao/produto/referencia/');
	});

	test('a segment alone lands the row at the segment root', () => {
		const row = { ...reference, slug: undefined, segment: 'versions' };
		expect(permalinkOf([row], 'hub')).toBe('/documentation/product/versions/');
	});

	test('a segment and a slug land the row under the segment, beside its children', () => {
		const row = { ...reference, segment: 'versions', slug: { en: 'previous' } };
		expect(permalinkOf([row], 'hub')).toBe('/documentation/product/versions/previous/');
		expect(permalinkOf([row], 'settings')).toBe('/documentation/product/versions/settings/');
	});
});

describe('resolveHubList', () => {
	const index = buildNavIndex(nav, 'en');

	test('lists the rows the sidebar shows, in order, with each page description', () => {
		expect(resolveHubList(nav, index, '/en/documentation/product/reference/', 'en')).toEqual([
			{
				label: 'Settings',
				href: '/en/documentation/product/settings/',
				description: 'Look up every setting.',
			},
			{ label: 'Shared', href: '/en/documentation/other/shared/', description: 'Owned elsewhere.' },
			{ label: 'Registry', href: 'https://example.com/registry', description: undefined },
		]);
	});

	test('lists a sub-group by its own page', () => {
		const nested = data([
			{
				...reference,
				items: [
					{ label: { en: 'Feature' }, page: 'overview', landing: true, items: [{ page: 'deep' }] },
				],
			},
		]);
		expect(
			resolveHubList(
				nested,
				buildNavIndex(nested, 'en'),
				'/en/documentation/product/reference/',
				'en'
			)
		).toEqual([
			{ label: 'Feature', href: '/en/documentation/product/feature/', description: undefined },
		]);
	});

	test('lists a tree row by its root page and the tree description', () => {
		const withTree = data([{ ...reference, items: [{ tree: 'other' }] }]);
		withTree.trees.set(
			'other',
			navTree.parse({
				id: 'other',
				title: { en: 'Other tool' },
				description: { en: 'Another section.' },
				path: { en: 'other' },
				root: 'shared',
				groups: [{ items: [{ page: 'shared' }] }],
			})
		);
		expect(
			resolveHubList(
				withTree,
				buildNavIndex(withTree, 'en'),
				'/en/documentation/product/reference/',
				'en'
			)
		).toEqual([
			{
				label: 'Other tool',
				href: '/en/documentation/other/shared/',
				description: 'Another section.',
			},
		]);
	});

	test('returns nothing for a page that is not a landing', () => {
		expect(resolveHubList(nav, index, '/en/documentation/product/settings/', 'en')).toBeUndefined();
		expect(resolveHubList(nav, index, '/en/documentation/missing/', 'en')).toBeUndefined();
	});

	test('takes the labels and descriptions of the reader language', () => {
		const pt = buildNavIndex(nav, 'pt-br');
		expect(
			resolveHubList(nav, pt, '/pt-br/documentacao/produto/referencia/', 'pt-br')?.[0]
		).toEqual({
			label: 'Configurações',
			href: '/pt-br/documentacao/produto/configuracoes/',
			description: 'Consulte cada configuração.',
		});
	});
});
