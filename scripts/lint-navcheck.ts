import { LANGS, type Lang } from '../src/nav/schema';
import { buildNavIndex, targetPermalink, walkTree } from '../src/nav/resolve';
import { loadNav } from './nav/lib/load';

const MAX_DEPTH = 3;
const MAX_CHILDREN = 7;
const PERMALINK_FORMAT = /^[a-z0-9\-|/]+$/;

const errors: string[] = [];
const warnings: string[] = [];

const fail = (message: string) => errors.push(message);
const warn = (message: string) => warnings.push(message);

const { data, redirects, exempt, corpus, issues } = loadNav();
for (const issue of issues) fail(issue);

const enPages = new Map(corpus.filter((p) => p.lang === 'en').map((p) => [p.namespace, p]));
const ptPages = new Map(corpus.filter((p) => p.lang === 'pt-br').map((p) => [p.namespace, p]));

for (const tree of data.trees.values()) {
	const parent = tree.parent ?? 'root';
	if (parent !== 'root' && !data.trees.has(parent)) {
		fail(`tree "${tree.id}": parent "${parent}" is not a tree`);
	}
	if (tree.root && !enPages.has(tree.root)) {
		fail(`tree "${tree.id}": root namespace "${tree.root}" has no English page`);
	}

	const entries = walkTree(tree, 'en');
	const ids = new Set<string>();
	let rootIsListed = !tree.root;

	for (const entry of entries) {
		const { node, nodeId, depth } = entry;
		if (ids.has(nodeId)) fail(`tree "${tree.id}": duplicate row id "${nodeId}"`);
		ids.add(nodeId);

		if (depth > MAX_DEPTH)
			fail(`tree "${tree.id}": row "${nodeId}" is ${depth} levels deep (max ${MAX_DEPTH})`);
		if ((node.items?.length ?? 0) > MAX_CHILDREN) {
			warn(
				`tree "${tree.id}": row "${nodeId}" has ${node.items?.length} children (soft max ${MAX_CHILDREN})`
			);
		}
		if (node.page && node.page === tree.root) rootIsListed = true;
		if (node.page && !enPages.has(node.page)) {
			fail(`tree "${tree.id}": row "${nodeId}" points at unknown namespace "${node.page}"`);
		}
		if (node.page && enPages.has(node.page) && !ptPages.has(node.page) && !node.placeholder) {
			warn(
				`tree "${tree.id}": "${node.page}" has no Portuguese page; the row falls back to English`
			);
		}
		if (node.tree && !data.trees.has(node.tree)) {
			fail(`tree "${tree.id}": row "${nodeId}" points at unknown tree "${node.tree}"`);
		}
	}

	if (!rootIsListed) {
		fail(
			`tree "${tree.id}": root page "${tree.root}" is not listed as a row, so it would never be reachable or migrated`
		);
	}

	for (const [groupIndex, group] of tree.groups.entries()) {
		if (group.items.length > MAX_CHILDREN && !group.label) {
			warn(
				`tree "${tree.id}": group ${groupIndex} has ${group.items.length} rows (soft max ${MAX_CHILDREN})`
			);
		}
	}
}

const rootRefs = (() => {
	const refs: string[] = [];
	const visit = (nodes: (typeof data.root.groups)[number]['items']) => {
		for (const node of nodes) {
			if (node.tree) refs.push(node.tree);
			if (node.page && !enPages.has(node.page)) fail(`root.json: unknown namespace "${node.page}"`);
			if (node.items?.length) visit(node.items);
		}
	};
	for (const group of data.root.groups) visit(group.items);
	return refs;
})();

for (const ref of rootRefs) {
	if (!data.trees.has(ref)) fail(`root.json: unknown tree "${ref}"`);
}

if (data.topnav) {
	for (const [panel, columns] of [
		['products', data.topnav.products],
		['devtools', data.topnav.devtools],
	] as const) {
		for (const column of columns) {
			for (const item of column.items) {
				if (!data.trees.has(item.tree)) fail(`topnav.json: unknown ${panel} tree "${item.tree}"`);
			}
		}
	}
	if (!data.trees.has(data.topnav.guides))
		fail(`topnav.json: unknown guides tree "${data.topnav.guides}"`);
}

for (const [index, video] of (data.videos ?? []).entries()) {
	for (const product of video.products ?? []) {
		if (!data.trees.has(product))
			fail(`videos.json: entry ${index} is tagged with unknown tree "${product}"`);
	}
}

for (const [namespace, target] of Object.entries(redirects)) {
	if (!enPages.has(namespace))
		fail(`redirects.json: "${namespace}" is not a page in the collection`);
	const named = [target.page, target.tree, target.path].filter(Boolean).length;
	if (named !== 1)
		fail(`redirects.json: "${namespace}" must name exactly one of page, tree or path`);
	if (target.page && !enPages.has(target.page))
		fail(`redirects.json: "${namespace}" replaced by unknown page "${target.page}"`);
	if (target.tree && !data.trees.has(target.tree))
		fail(`redirects.json: "${namespace}" replaced by unknown tree "${target.tree}"`);
}

const homes = new Map<string, string[]>();
for (const tree of data.trees.values()) {
	for (const entry of walkTree(tree, 'en')) {
		const { node } = entry;
		if (!node.page || node.linkOnly || node.placeholder) continue;
		const list = homes.get(node.page) ?? [];
		list.push(`${tree.id}:${entry.nodeId}`);
		homes.set(node.page, list);
	}
}

for (const [namespace, owners] of homes) {
	if (owners.length > 1)
		fail(
			`"${namespace}" is listed in ${owners.length} rows (${owners.join(
				', '
			)}); a page lives in one node`
		);
	if (redirects[namespace])
		fail(`"${namespace}" is both listed in the navigation and marked as discarded`);
}

for (const namespace of Object.keys(exempt)) {
	if (!enPages.has(namespace)) fail(`exempt.json: "${namespace}" is not a page in the collection`);
	if (homes.has(namespace))
		fail(`exempt.json: "${namespace}" is listed in the navigation, so it is not exempt`);
}

const orphans = [...enPages.keys()].filter((ns) => !homes.has(ns) && !redirects[ns] && !exempt[ns]);
if (orphans.length) {
	fail(
		`${orphans.length} English pages are in no row and in no redirect row, starting with: ${orphans
			.slice(0, 10)
			.join(', ')}`
	);
}

for (const lang of LANGS) {
	const seen = new Map<string, string>();
	for (const tree of data.trees.values()) {
		for (const entry of walkTree(tree, lang as Lang)) {
			const target = targetPermalink(data, entry, lang as Lang);
			if (!target) continue;
			if (!PERMALINK_FORMAT.test(target.replace(/^\/|\/$/g, ''))) {
				fail(`${lang}: computed permalink "${target}" has characters test:frontmatter rejects`);
			}
			const owner = `${tree.id}:${entry.nodeId}`;
			const clash = seen.get(target);
			if (clash) fail(`${lang}: "${target}" would be claimed by both ${clash} and ${owner}`);
			else seen.set(target, owner);
		}
	}
}

for (const lang of LANGS) {
	const index = buildNavIndex(data, lang as Lang);
	if (index.size === 0 && data.trees.size > 0) fail(`${lang}: the navigation index is empty`);
}

const treeCount = data.trees.size;
const rowCount = [...data.trees.values()].reduce(
	(sum, tree) => sum + walkTree(tree, 'en').length,
	0
);

console.log(
	`navcheck: ${treeCount} trees, ${rowCount} rows, ${enPages.size} English pages, ` +
		`${Object.keys(redirects).length} discarded, ${Object.keys(exempt).length} exempt`
);
for (const warning of warnings) console.log(`  warn  ${warning}`);
for (const error of errors) console.log(`  ERROR ${error}`);

if (errors.length) {
	console.log(
		`\nnavcheck failed with ${errors.length} error(s) and ${warnings.length} warning(s).`
	);
	process.exit(1);
}
console.log(`\nnavcheck passed with ${warnings.length} warning(s).`);
