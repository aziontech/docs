import type {
	Lang,
	Localized,
	LocalizedSegment,
	NavGroup,
	NavNode,
	NavRoot,
	NavTree,
	NavVideos,
	TopNav,
} from './schema';

export interface PageFacts {
	permalink?: string;
	title?: string;
	description?: string;
	updated?: string;
}

export type PageIndex = Map<string, Partial<Record<Lang, PageFacts>>>;

export interface MenuNode {
	id: string;
	label: string;
	icon?: string;
	href?: string;
	target?: '_self' | '_blank';
	tagValue?: string;
	opensTree?: string;
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
	videos?: NavVideos;
	pages: PageIndex;
}

export interface SidebarHeader {
	title: string;
	href?: string;
	backHref: string;
	backLabel: string;
}

export interface SidebarModel {
	groups: MenuGroupNode[];
	activeId: string;
	expandedIds: string[];
	treeId: string | null;
	header: SidebarHeader | null;
	catalog: MenuGroupNode[] | null;
}

export interface SidebarLabels {
	allProducts: string;
}

export interface NavLocation {
	treeId: string;
	nodeId: string;
	ancestors: string[];
	node: NavNode;
}

export type NavIndex = Map<string, NavLocation>;

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

function nodeHref(data: NavData, node: NavNode, lang: Lang): string | undefined {
	// A row may land on a section of its target page: `hash` carries the heading's
	// slug, which rehype-slug derives from the heading text and keeps identical in
	// both locales when the heading is a product name. Order matters: path?query#hash.
	const withQuery = (href: string | undefined) => {
		if (!href) return href;
		const q = node.query ? `?${node.query}` : '';
		const h = node.hash ? `#${node.hash}` : '';
		return `${href}${q}${h}`;
	};

	if (node.href) return node.href;
	if (node.tree) {
		const tree = data.trees.get(node.tree);
		if (!tree) return undefined;
		if (tree.root) return pageHref(data, tree.root, lang);
		return pageHref(data, COMING_SOON, lang);
	}
	if (node.page) return withQuery(pageHref(data, node.page, lang));
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

export function treeHref(data: NavData, tree: NavTree, lang: Lang): string | undefined {
	if (tree.root) return pageHref(data, tree.root, lang);
	return `/${lang}/${DOCS_BASE[lang]}/${trimSlashes(text(tree.path, lang) ?? tree.id)}/`;
}

function nodeIdentity(node: NavNode, lang: Lang, index: number): string {
	if (node.page) return node.page;
	if (node.tree) return `tree:${node.tree}`;
	if (node.href) return `href:${slugify(node.href)}`;
	const label = text(node.label, lang);
	return label ? slugify(label) : `row-${index}`;
}

export function walkTree(tree: NavTree, lang: Lang): WalkEntry[] {
	const out: WalkEntry[] = [];

	tree.groups.forEach((group, groupIndex) => {
		const visit = (
			nodes: NavNode[],
			ancestors: string[],
			parentId: string,
			segments: string[],
			depth: number
		) => {
			nodes.forEach((node, index) => {
				const nodeId = `${parentId}/${nodeIdentity(node, lang, index)}`;
				out.push({ tree, group, groupIndex, node, nodeId, ancestors, segments, depth });
				if (node.items?.length) {
					const own = segmentText(node.segment, lang);
					visit(
						node.items,
						[...ancestors, nodeId],
						nodeId,
						own ? [...segments, own] : segments,
						depth + 1
					);
				}
			});
		};
		const groupSegment = segmentText(group.segment, lang);
		visit(group.items, [], tree.id, groupSegment ? [groupSegment] : [], 1);
	});

	return out;
}

export function targetPermalink(data: NavData, entry: WalkEntry, lang: Lang): string | undefined {
	const { tree, node, segments } = entry;
	if (!node.page || node.linkOnly || node.placeholder) return undefined;

	const treePath = trimSlashes(text(tree.path, lang) ?? tree.id);
	if (tree.root && node.page === tree.root) return `/${DOCS_BASE[lang]}/${treePath}/`;

	const explicit = text(node.slug, lang);
	const current =
		data.pages.get(node.page)?.[lang]?.permalink ?? data.pages.get(node.page)?.en?.permalink;
	const slug =
		segmentText(node.segment, lang) ??
		explicit ??
		(current ? lastSegment(current) : slugify(nodeLabel(data, node, lang)));

	return `/${[DOCS_BASE[lang], treePath, ...segments, slug].filter(Boolean).join('/')}/`;
}

export function buildNavIndex(data: NavData, lang: Lang): NavIndex {
	const byPermalink: NavIndex = new Map();

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
				node,
			});
		}
	}

	return byPermalink;
}

function inlineTree(data: NavData, node: NavNode): NavTree | undefined {
	const tree = node.tree ? data.trees.get(node.tree) : undefined;
	return tree?.inline ? tree : undefined;
}

function openedTree(
	data: NavData,
	node: NavNode,
	href: string | undefined,
	ctx: MenuContext
): string | undefined {
	if (node.href || node.placeholder || !href) return undefined;
	const target = ctx.index.get(normalize(href))?.treeId;
	if (!target || target === ctx.treeId) return undefined;
	return data.trees.get(target)?.inline ? undefined : target;
}

interface MenuContext {
	activePath: string;
	activeId: string;
	expanded: string[];
	comingSoonHref?: string;
	index: NavIndex;
	treeId: string | null;
}

function toMenuNodes(
	data: NavData,
	nodes: NavNode[],
	lang: Lang,
	parentId: string,
	ctx: MenuContext,
	ancestors: string[]
): MenuNode[] {
	const out: MenuNode[] = [];

	nodes.forEach((node, index) => {
		const id = `${parentId}/${nodeIdentity(node, lang, index)}`;
		const label = nodeLabel(data, node, lang);
		if (!label) return;

		const inlined = inlineTree(data, node);
		const rows = inlined ? inlined.groups.flatMap((group) => group.items) : node.items;
		const href = inlined ? undefined : nodeHref(data, node, lang);
		const external = Boolean(node.href);
		const children = rows?.length
			? toMenuNodes(data, rows, lang, id, ctx, [...ancestors, id])
			: undefined;

		const claimsActive = Boolean(href) && href !== ctx.comingSoonHref;
		if (claimsActive && normalize(href!) === ctx.activePath) {
			ctx.activeId = children?.length ? `${id}__index` : id;
			ctx.expanded.push(...ancestors, ...(children?.length ? [id] : []));
		}

		const tagValue =
			node.tag ??
			(node.page && !hasOwnLanguage(data, node.page, lang) && lang !== 'en' ? 'EN' : undefined);

		const opensTree = openedTree(data, node, href, ctx);

		if (children?.length) {
			if (href) {
				children.unshift({
					id: `${id}__index`,
					label,
					href,
					target: external ? '_blank' : '_self',
					tagValue,
					opensTree,
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
			opensTree,
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
	ctx: MenuContext
): MenuGroupNode[] {
	return groups
		.map((group) => ({
			label: text(group.label, lang),
			items: toMenuNodes(data, group.items, lang, idPrefix, ctx, []),
		}))
		.filter((group) => group.items.length > 0);
}

function withSectionTitle(groups: MenuGroupNode[], title: string | undefined): MenuGroupNode[] {
	if (!title || groups.length === 0 || groups[0].label) return groups;
	return [{ ...groups[0], label: title }, ...groups.slice(1)];
}

export function resolveTreeMenus(
	data: NavData,
	index: NavIndex,
	lang: Lang
): Record<string, MenuGroupNode[]> {
	const comingSoonHref = pageHref(data, COMING_SOON, lang);
	const out: Record<string, MenuGroupNode[]> = {};

	for (const tree of data.trees.values()) {
		if (tree.inline) continue;
		const groups = groupsToMenu(data, tree.groups, lang, tree.id, {
			activePath: '',
			activeId: '',
			expanded: [],
			comingSoonHref,
			index,
			treeId: tree.id,
		});
		out[tree.id] = withSectionTitle(groups, text(tree.title, lang));
	}

	return out;
}

export function resolveSidebar(
	data: NavData,
	index: NavIndex,
	pathname: string,
	lang: Lang,
	labels: SidebarLabels
): SidebarModel {
	const activePath = normalize(pathname);
	const location = index.get(activePath);
	const located = location ? data.trees.get(location.treeId) : undefined;
	const tree = located?.inline ? undefined : located;

	const ctx: MenuContext = {
		activePath,
		activeId: '',
		expanded: [],
		comingSoonHref: pageHref(data, COMING_SOON, lang),
		index,
		treeId: tree?.id ?? null,
	};

	if (!tree) {
		const groups = groupsToMenu(data, data.root.groups, lang, 'root', ctx);
		return {
			groups,
			activeId: ctx.activeId,
			expandedIds: unique(ctx.expanded),
			treeId: null,
			header: null,
			catalog: null,
		};
	}

	const back = backRow(data, tree, lang, labels);
	const groups = withSectionTitle(
		groupsToMenu(data, tree.groups, lang, tree.id, ctx),
		text(tree.title, lang)
	);
	const catalog = groupsToMenu(data, data.root.groups, lang, 'root', {
		activePath,
		activeId: '',
		expanded: [],
		comingSoonHref: ctx.comingSoonHref,
		index,
		treeId: null,
	});

	return {
		groups,
		activeId: ctx.activeId,
		expandedIds: unique(ctx.expanded),
		treeId: tree.id,
		header: {
			title: text(tree.title, lang) ?? tree.id,
			href: tree.root ? pageHref(data, tree.root, lang) : undefined,
			backHref: back?.href ?? `/${lang}/${DOCS_BASE[lang]}/`,
			backLabel: back?.label ?? labels.allProducts,
		},
		catalog,
	};
}

function backRow(
	data: NavData,
	tree: NavTree,
	lang: Lang,
	labels: SidebarLabels
): MenuNode | undefined {
	const parentId = tree.parent || 'root';
	if (parentId === 'root') {
		return {
			id: `${tree.id}#back`,
			label: labels.allProducts,
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
}

export interface TopNavColumn {
	label: string;
	items: TopNavEntry[];
}

export interface TopNavModel {
	products: TopNavColumn[];
	devtools: TopNavColumn[];
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
			href: treeHref(data, tree, lang),
			description: text(tree.description, lang),
		};
	};

	const columns = (list: typeof config.products): TopNavColumn[] =>
		list.map((column) => ({
			label: text(column.label, lang) ?? '',
			items: column.items.map((item) => entry(item.tree)).filter(Boolean) as TopNavEntry[],
		}));

	return {
		products: columns(config.products),
		devtools: columns(config.devtools),
		guides: entry(config.guides),
	};
}

export interface Crumb {
	label: string;
	url?: string;
}

export function resolveBreadcrumb(
	data: NavData,
	index: NavIndex,
	pathname: string,
	lang: Lang
): Crumb[] {
	const activePath = normalize(pathname);
	const location = index.get(activePath);
	if (!location) return [];

	const tree = data.trees.get(location.treeId);
	if (!tree) return [];

	const crumbs: Crumb[] = [
		{
			label: text(tree.title, lang) ?? tree.id,
			url: tree.root ? pageHref(data, tree.root, lang) : undefined,
		},
	];

	const byId = new Map(walkTree(tree, lang).map((entry) => [entry.nodeId, entry]));
	for (const ancestorId of location.ancestors) {
		const ancestor = byId.get(ancestorId);
		if (!ancestor) continue;
		crumbs.push({
			label: nodeLabel(data, ancestor.node, lang),
			url: ancestor.node.page ? pageHref(data, ancestor.node.page, lang) : undefined,
		});
	}

	const self = byId.get(location.nodeId);
	if (self) crumbs.push({ label: nodeLabel(data, self.node, lang), url: activePath });

	return crumbs;
}

export interface Neighbour {
	text: string;
	link: string;
}

export function resolveNeighbours(
	data: NavData,
	index: NavIndex,
	pathname: string,
	lang: Lang
): { previous?: Neighbour; next?: Neighbour } {
	const activePath = normalize(pathname);
	const location = index.get(activePath);
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
		index >= 0 && index < leaves.length
			? { text: leaves[index].text, link: leaves[index].link }
			: undefined;

	return { previous: pick(at - 1), next: pick(at + 1) };
}

export function buildDirectory(
	data: NavData,
	lang: Lang,
	labels: { products: string; guides: string; devtools: string }
): MenuGroupNode[] {
	const model = buildTopNav(data, lang);
	if (!model) return [];

	const entryNode = (entry: TopNavEntry, id: string): MenuNode => ({
		id,
		label: entry.label,
		href: entry.href,
		target: '_self',
	});

	const groups: MenuGroupNode[] = [];

	if (model.products.length) {
		groups.push({
			label: labels.products,
			items: model.products.map((column, columnIndex) => ({
				id: `directory/products/${columnIndex}`,
				label: column.label,
				children: column.items.map((entry, index) =>
					entryNode(entry, `directory/products/${columnIndex}/${index}`)
				),
			})),
		});
	}

	const rest: MenuNode[] = [];
	if (model.guides?.href) {
		rest.push({
			id: 'directory/guides',
			label: labels.guides,
			href: model.guides.href,
			target: '_self',
		});
	}
	if (model.devtools.length) {
		const tools = model.devtools.flatMap((column) => column.items);
		rest.push({
			id: 'directory/devtools',
			label: labels.devtools,
			children: tools.map((tool, index) => entryNode(tool, `directory/devtools/${index}`)),
		});
	}
	if (rest.length) groups.push({ items: rest });

	return groups;
}

export type GuideKind =
	| 'learning-path'
	| 'tutorial'
	| 'how-to-guide'
	| 'reference-architecture'
	| 'video';

const GUIDE_KINDS: GuideKind[] = [
	'learning-path',
	'tutorial',
	'how-to-guide',
	'reference-architecture',
	'video',
];

export interface CatalogEntry {
	label: string;
	href: string;
	description?: string;
	kind: GuideKind;
	products: string[];
	topic: string;
	updated?: string;
	external?: boolean;
}

export interface GuidesHomeModel {
	entries: CatalogEntry[];
	kinds: GuideKind[];
	products: { id: string; label: string }[];
}

export function buildGuidesHome(data: NavData, treeId: string, lang: Lang): GuidesHomeModel {
	const tree = data.trees.get(treeId);
	const entries: CatalogEntry[] = [];
	const tagged = new Set<string>();
	const productLabel = (id: string) => text(data.trees.get(id)?.title, lang) ?? id;

	const push = (entry: CatalogEntry) => {
		for (const product of entry.products) tagged.add(product);
		entries.push(entry);
	};

	for (const group of tree?.groups ?? []) {
		for (const area of group.items) {
			const areaLabel = nodeLabel(data, area, lang);
			for (const sub of area.items ?? []) {
				for (const row of sub.items ?? []) {
					if (!row.page) continue;
					const href = pageHref(data, row.page, lang);
					if (!href) continue;
					const products = row.products ?? [];
					const facts = pageFacts(data, row.page, lang);
					push({
						label: nodeLabel(data, row, lang),
						href,
						description: facts?.description,
						kind: row.kind ?? sub.kind ?? area.kind ?? 'tutorial',
						products,
						topic: products[0] ? productLabel(products[0]) : areaLabel,
						updated: facts?.updated,
					});
				}
			}
		}
	}

	for (const video of data.videos ?? []) {
		const products = video.products ?? [];
		push({
			label: text(video.title, lang) ?? video.href,
			href: video.href,
			description: text(video.description, lang),
			kind: 'video',
			products,
			topic: products[0] ? productLabel(products[0]) : 'YouTube',
			external: true,
		});
	}

	entries.sort((a, b) => a.label.localeCompare(b.label, lang));
	const present = new Set(entries.map((entry) => entry.kind));

	return {
		entries,
		kinds: GUIDE_KINDS.filter((kind) => present.has(kind)),
		products: [...tagged]
			.map((id) => ({ id, label: productLabel(id) }))
			.sort((a, b) => a.label.localeCompare(b.label, lang)),
	};
}
