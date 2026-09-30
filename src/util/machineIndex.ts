import { SITE_URL } from '~/consts';
import { getNavData, type Lang } from '~/nav/index';
import { DOCS_BASE, pageHref, text, type NavData } from '~/nav/resolve';
import type { NavNode, NavTree } from '~/nav/schema';

/** The page inventory behind llms.txt and sitemap.md: every page the navigation lists,
 * in sidebar order. Nothing reads the collection directly, so a page in no tree (an
 * orphan, the coming-soon page, the style guide) never reaches an index. */

export interface IndexedPage {
	namespace: string;
	title: string;
	description?: string;
	/** Absolute page URL. */
	url: string;
	/** Absolute URL of the page's Markdown twin. */
	markdownUrl: string;
	/** The catalog kind, when the row or its slot states one. */
	kind?: string;
	/** The products the page is about: the row's products, else the owning product tree. */
	topics: string[];
	/** Last content change, as YYYY-MM-DD, from git. */
	updated?: string;
	/** Root group, tree title, then the labels of the row's ancestors. */
	section: string[];
}

export interface IndexedGroup {
	label?: string;
	pages: IndexedPage[];
}

export interface IndexedTree {
	id: string;
	title: string;
	description?: string;
	/** Tree path under the docs base, such as `build/functions`. */
	path: string;
	/** Absolute URL of the tree's own llms.txt. */
	llmsUrl: string;
	groups: IndexedGroup[];
	pages: IndexedPage[];
}

export interface RootGroup {
	label?: string;
	/** Titles of the trees the root catalog lists directly; the label fallback for an unlabeled group. */
	listed: string[];
	trees: IndexedTree[];
}

export interface MachineIndex {
	lang: Lang;
	/** `documentation` or `documentacao`. */
	docsBase: string;
	rootGroups: RootGroup[];
	trees: IndexedTree[];
	pages: IndexedPage[];
}

/** The kind a product-section slot holds, by the slot's English label (information architecture). */
const SLOT_KIND: Record<string, string> = {
	Quickstart: 'quickstart',
	'How it works': 'concept',
	Features: 'reference',
	'Guides and tutorials': 'navigation-hub',
	Examples: 'reference',
	Reference: 'reference',
	Limits: 'reference',
	'Best practices': 'concept',
	Troubleshooting: 'troubleshooting',
	Glossary: 'glossary',
	Changelog: 'changelog',
};

const markdownUrl = (url: string) => `${url.replace(/\/$/, '')}.md`;

/** Trees reachable from the root catalog or the top nav, or descending from one that is. */
function reachableTrees(data: NavData): string[] {
	const listed: string[] = [];
	const visit = (items: NavNode[]) => {
		for (const item of items) {
			if (item.tree && !listed.includes(item.tree)) listed.push(item.tree);
			if (item.items) visit(item.items);
		}
	};
	for (const group of data.root.groups) visit(group.items);
	if (data.topnav) {
		for (const column of [...data.topnav.products, ...data.topnav.devtools]) visit(column.items);
		if (!listed.includes(data.topnav.guides)) listed.push(data.topnav.guides);
		const hub = data.topnav.devtoolsHome;
		if (hub && !listed.includes(hub)) listed.push(hub);
	}

	// A page's owner is the tree that lists it as a plain row; a linkOnly row is a cross-link.
	const owner = new Map<string, string>();
	for (const tree of data.trees.values()) {
		const visitRows = (items: NavNode[]) => {
			for (const item of items) {
				if (item.page && !item.linkOnly && !owner.has(item.page)) owner.set(item.page, tree.id);
				if (item.items) visitRows(item.items);
			}
		};
		for (const group of tree.groups) visitRows(group.items);
	}
	const crossLinked = (treeId: string): string[] => {
		const out: string[] = [];
		const visitRows = (items: NavNode[]) => {
			for (const item of items) {
				const target = item.page && item.linkOnly ? owner.get(item.page) : undefined;
				if (target) out.push(target);
				if (item.items) visitRows(item.items);
			}
		};
		for (const group of data.trees.get(treeId)?.groups ?? []) visitRows(group.items);
		return out;
	};

	// Reachable: listed, descending from a listed tree, or owning a page a reachable tree cross-links.
	const reachable = new Set(listed);
	let grew = true;
	while (grew) {
		grew = false;
		for (const tree of data.trees.values()) {
			if (!reachable.has(tree.id) && reachable.has(tree.parent)) {
				reachable.add(tree.id);
				grew = true;
			}
		}
		for (const id of [...reachable]) {
			for (const target of crossLinked(id)) {
				if (!reachable.has(target)) {
					reachable.add(target);
					grew = true;
				}
			}
		}
	}
	// Listed order first, then the descendants in file order.
	return [
		...listed,
		...[...data.trees.keys()].filter((id) => reachable.has(id) && !listed.includes(id)),
	];
}

function indexTree(data: NavData, tree: NavTree, lang: Lang, rootLabel?: string): IndexedTree {
	const title = text(tree.title, lang) ?? tree.id;
	const path = (text(tree.path, lang) ?? tree.id).replace(/^\/|\/$/g, '');
	const groups: IndexedGroup[] = [];
	const pages: IndexedPage[] = [];

	const walk = (
		items: NavNode[],
		chain: { en?: string; local?: string }[],
		inheritedKind: string | undefined,
		into: IndexedGroup
	) => {
		for (const node of items) {
			const label = { en: text(node.label, 'en'), local: text(node.label, lang) };
			const kindHere = node.kind ?? inheritedKind;
			if (node.page && !node.linkOnly && !node.placeholder && !node.href) {
				const facts = data.pages.get(node.page)?.[lang] ?? data.pages.get(node.page)?.en;
				const href = pageHref(data, node.page, lang);
				if (facts && href) {
					const parentEn = [...chain].reverse().find((c) => c.en)?.en;
					const kind =
						node.kind ??
						(node.page === tree.root
							? 'overview'
							: inheritedKind ??
							  (tree.id === 'guides'
									? 'tutorial'
									: SLOT_KIND[label.en ?? ''] ?? SLOT_KIND[parentEn ?? '']));
					const url = `${SITE_URL}${href}`;
					const page: IndexedPage = {
						namespace: node.page,
						title: label.local ?? facts.title ?? node.page,
						description: facts.description,
						url,
						markdownUrl: markdownUrl(url),
						kind,
						topics: node.products ?? [tree.id],
						updated: facts.updated?.slice(0, 10),
						section: [rootLabel, title, ...chain.map((c) => c.local)].filter(
							(part): part is string => Boolean(part)
						),
					};
					into.pages.push(page);
					pages.push(page);
				}
			}
			if (node.items?.length) {
				const next = label.local ? [...chain, label] : chain;
				walk(node.items, next, kindHere, into);
			}
		}
	};

	for (const group of tree.groups) {
		const into: IndexedGroup = { label: text(group.label, lang), pages: [] };
		walk(group.items, [], undefined, into);
		if (into.pages.length) groups.push(into);
	}

	return {
		id: tree.id,
		title,
		description: text(tree.description, lang),
		path,
		llmsUrl: `${SITE_URL}/${lang}/${DOCS_BASE[lang]}/${path}/llms.txt`,
		groups,
		pages,
	};
}

export async function getMachineIndex(lang: Lang): Promise<MachineIndex> {
	const data = await getNavData();
	const order = reachableTrees(data);
	const built = new Map<string, IndexedTree>();

	// Root groups carry the section label; descendants of a listed tree (the developer
	// tools) file under the same label as their parent.
	const rootGroups: RootGroup[] = [];
	const groupOf = new Map<string, RootGroup>();
	for (const group of data.root.groups) {
		const entry: RootGroup = { label: text(group.label, lang), listed: [], trees: [] };
		const collect = (items: NavNode[]) => {
			for (const item of items) {
				if (item.tree) {
					groupOf.set(item.tree, entry);
					const title = text(data.trees.get(item.tree)?.title, lang);
					if (title) entry.listed.push(title);
				}
				if (item.items) collect(item.items);
			}
		};
		collect(group.items);
		rootGroups.push(entry);
	}
	// A tree another tree lists as a row (Load Balancer inside Platform) files under that tree's group.
	const adopt = (treeId: string, group: RootGroup) => {
		const visitRows = (items: NavNode[]) => {
			for (const item of items) {
				if (item.tree && !groupOf.has(item.tree)) {
					groupOf.set(item.tree, group);
					adopt(item.tree, group);
				}
				if (item.items) visitRows(item.items);
			}
		};
		for (const group of data.trees.get(treeId)?.groups ?? []) visitRows(group.items);
	};
	for (const [id, group] of [...groupOf]) adopt(id, group);
	// A tree the top nav lists but the root catalog does not (the guides hub) is its own group.
	for (const id of order) {
		const tree = data.trees.get(id);
		if (!tree || groupOf.has(id) || tree.parent !== 'root') continue;
		const title = text(tree.title, lang) ?? id;
		const entry: RootGroup = { label: title, listed: [title], trees: [] };
		groupOf.set(id, entry);
		rootGroups.push(entry);
	}
	for (const id of order) {
		const tree = data.trees.get(id);
		if (!tree) continue;
		let ancestor = tree.id;
		while (
			!groupOf.has(ancestor) &&
			data.trees.get(ancestor)?.parent &&
			data.trees.get(ancestor)!.parent !== 'root'
		)
			ancestor = data.trees.get(ancestor)!.parent;
		const group = groupOf.get(ancestor) ?? rootGroups[rootGroups.length - 1];
		const indexed = indexTree(data, tree, lang, group.label ?? group.listed.join(', '));
		built.set(id, indexed);
		group.trees.push(indexed);
	}

	const trees = order.map((id) => built.get(id)).filter((t): t is IndexedTree => Boolean(t));
	return {
		lang,
		docsBase: DOCS_BASE[lang],
		rootGroups: rootGroups.filter((g) => g.trees.length),
		trees,
		pages: trees.flatMap((t) => t.pages),
	};
}

/** `[title](url): description` on one line, as the llms.txt convention states it. */
export function llmsEntry(title: string, url: string, description?: string): string {
	const note = description?.replace(/\s+/g, ' ').trim();
	return `- [${title.trim()}](${url})${note ? `: ${note}` : ''}`;
}
