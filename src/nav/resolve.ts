import type { Lang, Localized, LocalizedSegment, NavGroup, NavNode, NavRoot, NavTree, TopNav } from './schema';

export interface PageFacts {
	permalink?: string;
	title?: string;
	description?: string;
}

/** Page facts read from the content collection, keyed by namespace then language. */
export type PageIndex = Map<string, Partial<Record<Lang, PageFacts>>>;

export interface MenuNode {
	id: string;
	label: string;
	icon?: string;
	href?: string;
	target?: '_self' | '_blank';
	tagValue?: string;
	children?: MenuNode[];
}

export interface MenuGroupNode {
	label?: string;
	items: MenuNode[];
}

export interface NavData {
	root: NavRoot;
	trees: Map<string, NavTree>;
	topnav?: TopNav;
	pages: PageIndex;
}

export interface SidebarModel {
	groups: MenuGroupNode[];
	activeId: string;
	expandedIds: string[];
	treeId: string | null;
}

/** Where a row lives: which tree, which group, and the rows above it. */
export interface NavLocation {
	treeId: string;
	nodeId: string;
	ancestors: string[];
	groupIndex: number;
	/** URL segments contributed by the groups and folds above this row. */
	segments: string[];
	/** Permalink this row's page will own once the tree's URLs are applied. */
	target: string;
	node: NavNode;
}

/** One row reached while walking a tree, with the URL segments above it. */
export interface WalkEntry {
	tree: NavTree;
	group: NavGroup;
	groupIndex: number;
	node: NavNode;
	nodeId: string;
	ancestors: string[];
	segments: string[];
	depth: number;
}

export const DOCS_BASE: Record<Lang, string> = { en: 'documentation', 'pt-br': 'documentacao' };

/** Namespace of the page every not-yet-written section points at. */
export const COMING_SOON = 'documentation_coming_soon';

export function text(value: Localized | undefined, lang: Lang): string | undefined {
	if (!value) return undefined;
	return (lang === 'en' ? value.en : value['pt-br'] ?? value.en) || undefined;
}

export function segmentText(value: LocalizedSegment | undefined, lang: Lang): string | undefined {
	if (!value) return undefined;
	if (typeof value === 'string') return value;
	return (lang === 'en' ? value.en : value['pt-br'] ?? value.en) || undefined;
}

export function trimSlashes(value: string): string {
	return value.replace(/^\/+/, '').replace(/\/+$/, '');
}

export function withSlashes(value: string): string {
	const inner = trimSlashes(value);
	return inner ? `/${inner}/` : '/';
}

function slugify(value: string): string {
	return value
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

function pageFacts(data: NavData, namespace: string, lang: Lang): PageFacts | undefined {
	const entry = data.pages.get(namespace);
	if (!entry) return undefined;
	return entry[lang] ?? entry.en;
}

/** True when the page exists in this language rather than falling back to English. */
function hasOwnLanguage(data: NavData, namespace: string, lang: Lang): boolean {
	return Boolean(data.pages.get(namespace)?.[lang]?.permalink);
}

function lastSegment(permalink: string): string {
	const parts = trimSlashes(permalink).split('/');
	return parts[parts.length - 1] ?? '';
}

function nodeLabel(data: NavData, node: NavNode, lang: Lang): string {
	const explicit = text(node.label, lang);
	if (explicit) return explicit;
	if (node.tree) {
		const tree = data.trees.get(node.tree);
		if (tree) return text(tree.title, lang) ?? node.tree;
	}
	if (node.page) {
		const facts = pageFacts(data, node.page, lang);
		if (facts?.title) return facts.title;
		return node.page;
	}
	return node.tree ?? node.page ?? '';
}

/** The row's live URL, taken from the page's current permalink so the tree renders correctly before and after a URL migration. */
function nodeHref(data: NavData, node: NavNode, lang: Lang): string | undefined {
	if (node.href) return node.href;
	if (node.tree) {
		const tree = data.trees.get(node.tree);
		if (!tree) return undefined;
		if (tree.root) return pageHref(data, tree.root, lang);
		// A tree with no landing page of its own sends the reader to the shared coming-soon page.
		return pageHref(data, COMING_SOON, lang);
	}
	if (node.page) return pageHref(data, node.page, lang);
	if (node.placeholder) return pageHref(data, COMING_SOON, lang);
	return undefined;
}

export function pageHref(data: NavData, namespace: string, lang: Lang): string | undefined {
	const own = data.pages.get(namespace)?.[lang]?.permalink;
	if (own) return `/${lang}${withSlashes(own)}`;
	const fallback = data.pages.get(namespace)?.en?.permalink;
	if (fallback) return `/en${withSlashes(fallback)}`;
	return undefined;
}

function nodeIdentity(node: NavNode, lang: Lang, index: number): string {
	if (node.page) return node.page;
	if (node.tree) return `tree:${node.tree}`;
	if (node.href) return `href:${slugify(node.href)}`;
	const label = text(node.label, lang);
	return label ? slugify(label) : `row-${index}`;
}

/** Every row of a tree, depth-first, carrying the URL segments above it. */
export function walkTree(tree: NavTree, lang: Lang): WalkEntry[] {
	const out: WalkEntry[] = [];

	tree.groups.forEach((group, groupIndex) => {
		const visit = (nodes: NavNode[], ancestors: string[], parentId: string, segments: string[], depth: number) => {
			nodes.forEach((node, index) => {
				const nodeId = `${parentId}/${nodeIdentity(node, lang, index)}`;
				out.push({ tree, group, groupIndex, node, nodeId, ancestors, segments, depth });
				if (node.items?.length) {
					const own = segmentText(node.segment, lang);
					visit(node.items, [...ancestors, nodeId], nodeId, own ? [...segments, own] : segments, depth + 1);
				}
			});
		};
		const groupSegment = segmentText(group.segment, lang);
		visit(group.items, [], tree.id, groupSegment ? [groupSegment] : [], 1);
	});

	return out;
}

/** The permalink a row's page takes once the tree's URL scheme is applied. */
export function targetPermalink(data: NavData, entry: WalkEntry, lang: Lang): string | undefined {
	const { tree, node, segments } = entry;
	if (!node.page || node.linkOnly || node.placeholder) return undefined;

	const treePath = trimSlashes(text(tree.path, lang) ?? tree.id);
	if (tree.root && node.page === tree.root) return `/${DOCS_BASE[lang]}/${treePath}/`;

	const explicit = text(node.slug, lang);
	const current = data.pages.get(node.page)?.[lang]?.permalink ?? data.pages.get(node.page)?.en?.permalink;
	// A row that contributes a segment and owns a page is that segment's index.
	const slug = segmentText(node.segment, lang) ?? explicit ?? (current ? lastSegment(current) : slugify(nodeLabel(data, node, lang)));

	return `/${[DOCS_BASE[lang], treePath, ...segments, slug].filter(Boolean).join('/')}/`;
}

export function buildNavIndex(data: NavData, lang: Lang): Map<string, NavLocation> {
	const byPermalink = new Map<string, NavLocation>();

	for (const tree of data.trees.values()) {
		for (const entry of walkTree(tree, lang)) {
			const { node } = entry;
			if (!node.page || node.placeholder || node.linkOnly) continue;
			const href = pageHref(data, node.page, lang);
			if (!href || byPermalink.has(href)) continue;
			byPermalink.set(href, {
				treeId: tree.id,
				nodeId: entry.nodeId,
				ancestors: entry.ancestors,
				groupIndex: entry.groupIndex,
				segments: entry.segments,
				target: targetPermalink(data, entry, lang) ?? href,
				node,
			});
		}
	}

	return byPermalink;
}

function toMenuNodes(
	data: NavData,
	nodes: NavNode[],
	lang: Lang,
	parentId: string,
	ctx: { activePath: string; activeId: string; expanded: string[]; comingSoonHref?: string },
	ancestors: string[],
): MenuNode[] {
	const out: MenuNode[] = [];

	nodes.forEach((node, index) => {
		const id = `${parentId}/${nodeIdentity(node, lang, index)}`;
		const label = nodeLabel(data, node, lang);
		if (!label) return;

		const href = nodeHref(data, node, lang);
		const external = Boolean(node.href);
		const children = node.items?.length
			? toMenuNodes(data, node.items, lang, id, ctx, [...ancestors, id])
			: undefined;

		// Several rows share the coming-soon page, so none of them may claim the active state.
		const claimsActive = Boolean(href) && href !== ctx.comingSoonHref;
		if (claimsActive && normalize(href!) === ctx.activePath) {
			ctx.activeId = children?.length ? `${id}__index` : id;
			ctx.expanded.push(...ancestors, ...(children?.length ? [id] : []));
		}

		const tagValue =
			node.tag ?? (node.page && !hasOwnLanguage(data, node.page, lang) && lang !== 'en' ? 'EN' : undefined);

		if (children?.length) {
			if (href) {
				children.unshift({
					id: `${id}__index`,
					label,
					href,
					target: external ? '_blank' : '_self',
					tagValue,
				});
			}
			out.push({ id, label, icon: node.icon, children });
			return;
		}

		out.push({
			id,
			label,
			icon: node.icon,
			href,
			target: external ? '_blank' : '_self',
			tagValue,
		});
	});

	return out;
}

function normalize(pathname: string): string {
	return withSlashes(pathname.split('?')[0].split('#')[0]);
}

function groupsToMenu(
	data: NavData,
	groups: NavGroup[],
	lang: Lang,
	idPrefix: string,
	ctx: { activePath: string; activeId: string; expanded: string[]; comingSoonHref?: string },
	firstGroupLabel?: string,
): MenuGroupNode[] {
	return groups
		.map((group, index) => ({
			label: text(group.label, lang) ?? (index === 0 ? firstGroupLabel : undefined),
			items: toMenuNodes(data, group.items, lang, idPrefix, ctx, []),
		}))
		.filter((group) => group.items.length > 0);
}

export function resolveSidebar(data: NavData, pathname: string, lang: Lang): SidebarModel {
	const activePath = normalize(pathname);
	const index = buildNavIndex(data, lang);
	const location = index.get(activePath);
	const ctx = {
		activePath,
		activeId: '',
		expanded: [] as string[],
		comingSoonHref: pageHref(data, COMING_SOON, lang),
	};

	if (!location) {
		const groups = groupsToMenu(data, data.root.groups, lang, 'root', ctx);
		return { groups, activeId: ctx.activeId, expandedIds: unique(ctx.expanded), treeId: null };
	}

	const tree = data.trees.get(location.treeId);
	if (!tree) {
		const groups = groupsToMenu(data, data.root.groups, lang, 'root', ctx);
		return { groups, activeId: ctx.activeId, expandedIds: unique(ctx.expanded), treeId: null };
	}

	const back = backRow(data, tree, lang);
	const groups = groupsToMenu(data, tree.groups, lang, tree.id, ctx, text(tree.title, lang));

	return {
		groups: back ? [{ items: [back] }, ...groups] : groups,
		activeId: ctx.activeId,
		expandedIds: unique(ctx.expanded),
		treeId: tree.id,
	};
}

function backRow(data: NavData, tree: NavTree, lang: Lang): MenuNode | undefined {
	const parentId = tree.parent || 'root';
	if (parentId === 'root') {
		return {
			id: `${tree.id}#back`,
			label: text({ en: 'All products', 'pt-br': 'Todos os produtos' }, lang) ?? 'All products',
			icon: 'pi pi-arrow-left',
			href: `/${lang}/${DOCS_BASE[lang]}/`,
			target: '_self',
		};
	}
	const parent = data.trees.get(parentId);
	if (!parent) return undefined;
	const href = parent.root ? pageHref(data, parent.root, lang) : pageHref(data, COMING_SOON, lang);
	return {
		id: `${tree.id}#back`,
		label: text(parent.title, lang) ?? parentId,
		icon: 'pi pi-arrow-left',
		href,
		target: '_self',
	};
}

function unique(values: string[]): string[] {
	return [...new Set(values)];
}

export interface TopNavEntry {
	label: string;
	href?: string;
	description?: string;
	icon?: string;
	modules?: TopNavEntry[];
}

export interface TopNavModel {
	products: { label: string; items: TopNavEntry[] }[];
	devtools: TopNavEntry[];
	guides?: TopNavEntry;
}

export function buildTopNav(data: NavData, lang: Lang): TopNavModel | null {
	const config = data.topnav;
	if (!config) return null;

	const entry = (treeId: string): TopNavEntry | undefined => {
		const tree = data.trees.get(treeId);
		if (!tree) return undefined;
		return {
			label: text(tree.title, lang) ?? treeId,
			href: tree.root
				? pageHref(data, tree.root, lang)
				: `/${lang}/${DOCS_BASE[lang]}/${trimSlashes(text(tree.path, lang) ?? tree.id)}/`,
			description: text(tree.description, lang),
		};
	};

	return {
		products: config.products.map((column) => ({
			label: text(column.label, lang) ?? '',
			items: column.items.flatMap((item) => {
				const base = entry(item.tree);
				if (!base) return [];
				const modules = (item.modules ?? []).map(entry).filter(Boolean) as TopNavEntry[];
				return [{ ...base, modules: modules.length ? modules : undefined }];
			}),
		})),
		devtools: config.devtools.map(entry).filter(Boolean) as TopNavEntry[],
		guides: entry(config.guides),
	};
}

export interface Crumb {
	label: string;
	url?: string;
}

/** Tree title, the folds above the page, then the page itself. */
export function resolveBreadcrumb(data: NavData, pathname: string, lang: Lang): Crumb[] {
	const activePath = normalize(pathname);
	const location = buildNavIndex(data, lang).get(activePath);
	if (!location) return [];

	const tree = data.trees.get(location.treeId);
	if (!tree) return [];

	const crumbs: Crumb[] = [
		{
			label: text(tree.title, lang) ?? tree.id,
			url: tree.root ? pageHref(data, tree.root, lang) : undefined,
		},
	];

	const entries = walkTree(tree, lang);
	for (const ancestorId of location.ancestors) {
		const ancestor = entries.find((entry) => entry.nodeId === ancestorId);
		if (!ancestor) continue;
		crumbs.push({
			label: nodeLabel(data, ancestor.node, lang),
			url: ancestor.node.page ? pageHref(data, ancestor.node.page, lang) : undefined,
		});
	}

	const self = entries.find((entry) => entry.nodeId === location.nodeId);
	if (self) crumbs.push({ label: nodeLabel(data, self.node, lang), url: activePath });

	return crumbs;
}

export interface Neighbour {
	text: string;
	link: string;
}

/** Previous and next page in the reading order of the tree that owns this page. */
export function resolveNeighbours(
	data: NavData,
	pathname: string,
	lang: Lang,
): { previous?: Neighbour; next?: Neighbour } {
	const activePath = normalize(pathname);
	const location = buildNavIndex(data, lang).get(activePath);
	if (!location) return {};

	const tree = data.trees.get(location.treeId);
	if (!tree) return {};

	const leaves = walkTree(tree, lang)
		.filter((entry) => entry.node.page && !entry.node.placeholder && !entry.node.linkOnly)
		.map((entry) => ({
			nodeId: entry.nodeId,
			text: nodeLabel(data, entry.node, lang),
			link: pageHref(data, entry.node.page!, lang),
		}))
		.filter((leaf): leaf is Neighbour & { nodeId: string } => Boolean(leaf.link));

	const at = leaves.findIndex((leaf) => leaf.nodeId === location.nodeId);
	if (at === -1) return {};

	const pick = (index: number) =>
		index >= 0 && index < leaves.length ? { text: leaves[index].text, link: leaves[index].link } : undefined;

	return { previous: pick(at - 1), next: pick(at + 1) };
}
