import fs from 'node:fs';
import path from 'node:path';

import { LANGS, type Lang } from '../src/nav/schema';
import { text, walkTree } from '../src/nav/resolve';
import { loadNav, REPO_ROOT, type CorpusPage } from './nav/lib/load';

/** Build-free check of the closing-links rules in the style guide (Choose a content type):
 * every page closes with links, no dead ends, and the product spine is reciprocal.
 * Warn-only by default; `--strict` exits 1 when any rule has offenders. */

const strict = process.argv.includes('--strict');
const LIST = 40;

const CANONICAL: Record<Lang, string[]> = {
	en: ['Next steps', 'Related resources'],
	'pt-br': ['Próximos passos', 'Recursos relacionados'],
};
const VARIANTS = [
	'Related',
	'Related docs',
	'Related documentation',
	'Related Resources',
	'Related items',
	'Related products',
	'Documentação relacionada',
	'Docs relacionados',
];
/** Slot labels (English) whose pages are lists of links already. */
const EXEMPT_LABELS = new Set(['Glossary', 'Changelog', 'Guides and tutorials']);
/** Trees that are not a product section: their pages are hubs, records, or agreements. */
const NON_PRODUCT_TREES = new Set([
	'guides',
	'devtools',
	'fundamentals',
	'platform',
	'changelog',
	'agreements',
	'style-guide',
	'support',
	'services',
	'marketplace',
	'agent-setup',
]);

const { data, corpus, issues } = loadNav();
if (issues.length) {
	console.error('nav data does not load cleanly; run lint:navcheck first');
	process.exit(1);
}

interface Placement {
	treeId: string;
	labelEn?: string;
	parentLabelEn?: string;
	products?: string[];
	isRoot: boolean;
}

const placement = new Map<string, Placement>();
for (const tree of data.trees.values()) {
	const labels = new Map<string, string | undefined>();
	for (const entry of walkTree(tree, 'en')) {
		labels.set(entry.nodeId, text(entry.node.label, 'en'));
		const { node } = entry;
		if (!node.page || node.linkOnly || node.placeholder || placement.has(node.page)) continue;
		placement.set(node.page, {
			treeId: tree.id,
			labelEn: text(node.label, 'en'),
			parentLabelEn: labels.get(entry.ancestors[entry.ancestors.length - 1] ?? ''),
			products: node.products,
			isRoot: node.page === tree.root,
		});
	}
}

const normalize = (href: string) => {
	let out = href.split('#')[0].split('?')[0];
	out = out.replace(/^\/(en|pt-br)\//, '/');
	if (!out.endsWith('/')) out += '/';
	return out;
};

const byPermalink = new Map<string, CorpusPage>();
for (const page of corpus) byPermalink.set(`${page.lang}:${normalize(page.permalink)}`, page);

const readBody = (page: CorpusPage) => {
	const raw = fs.readFileSync(path.join(REPO_ROOT, 'src/content/docs', page.file), 'utf8');
	const end = raw.indexOf('\n---', 4);
	return end === -1 ? raw : raw.slice(end + 4);
};

const LINK = /(?:href="|\]\()(\/[^"\s)]+)/g;
const links = (chunk: string, lang: Lang): CorpusPage[] => {
	const out: CorpusPage[] = [];
	for (const match of chunk.matchAll(LINK)) {
		const target = byPermalink.get(`${lang}:${normalize(match[1])}`);
		if (target) out.push(target);
	}
	return out;
};

const closing = (body: string) => {
	const headings = [...body.matchAll(/^## +(.+?)\s*$/gm)];
	if (!headings.length) return undefined;
	const last = headings[headings.length - 1];
	return { title: last[1].trim(), chunk: body.slice(last.index ?? 0) };
};

const noClosing: string[] = [];
const nonCanonical: string[] = [];
const deadEnds: string[] = [];
const spine: string[] = [];

const homeTree = (page: CorpusPage, at: Placement) =>
	at.treeId === 'guides' && at.products?.[0] && data.trees.has(at.products[0])
		? at.products[0]
		: at.treeId;

for (const page of corpus) {
	const at = placement.get(page.namespace);
	if (!at) continue;
	const exempt =
		EXEMPT_LABELS.has(at.labelEn ?? '') ||
		EXEMPT_LABELS.has(at.parentLabelEn ?? '') ||
		(at.isRoot && NON_PRODUCT_TREES.has(at.treeId)) ||
		['changelog', 'agreements', 'style-guide'].includes(at.treeId);
	if (exempt) continue;

	const body = readBody(page);
	const end = closing(body);
	const label = `${page.lang} ${page.file}`;
	if (!end || !(CANONICAL[page.lang].includes(end.title) || VARIANTS.includes(end.title))) {
		noClosing.push(`${label}: last heading is "${end?.title ?? 'none'}"`);
		continue;
	}
	if (!CANONICAL[page.lang].includes(end.title)) nonCanonical.push(`${label}: "## ${end.title}"`);

	const targets = links(end.chunk, page.lang).filter((t) => t.namespace !== page.namespace);
	if (!targets.length) {
		noClosing.push(`${label}: "## ${end.title}" holds no link to a documentation page`);
		continue;
	}
	const home = homeTree(page, at);
	const deeper = targets.some((t) => {
		const p = placement.get(t.namespace);
		return p && p.treeId === home && !p.isRoot;
	});
	if (!deeper) deadEnds.push(`${label}: no closing link into "${home}" beyond its overview`);
}

// Product spine: the overview links every page of its section, and every page links the overview.
for (const tree of data.trees.values()) {
	if (!tree.root || NON_PRODUCT_TREES.has(tree.id)) continue;
	for (const lang of LANGS) {
		const root = corpus.find((p) => p.lang === lang && p.namespace === tree.root);
		if (!root) continue;
		const rootLinks = new Set(links(readBody(root), lang).map((t) => t.namespace));
		for (const entry of walkTree(tree, lang)) {
			const { node } = entry;
			if (!node.page || node.linkOnly || node.placeholder || node.page === tree.root) continue;
			if (text(node.label, 'en') === 'Guides and tutorials') continue;
			const page = corpus.find((p) => p.lang === lang && p.namespace === node.page);
			if (!page) continue;
			if (!rootLinks.has(node.page))
				spine.push(`${lang} ${root.file}: overview does not link "${node.page}"`);
			const back = links(readBody(page), lang).some((t) => t.namespace === tree.root);
			if (!back) spine.push(`${lang} ${page.file}: does not link the "${tree.id}" overview`);
		}
	}
}

const report = (title: string, rows: string[]) => {
	console.log(`\n${title}: ${rows.length}`);
	for (const row of rows.slice(0, LIST)) console.log(`  ${row}`);
	if (rows.length > LIST) console.log(`  ... and ${rows.length - LIST} more`);
};

console.log(`checked ${corpus.filter((p) => placement.has(p.namespace)).length} listed pages`);
report('pages with no closing links (every page closes with links)', noClosing);
report('closings under a non-canonical heading', nonCanonical);
report('dead ends (no closing link deeper into the product)', deadEnds);
report('product spine gaps (overview <-> section pages)', spine);

const total = noClosing.length + nonCanonical.length + deadEnds.length + spine.length;
console.log(`\n${total} finding(s)`);
if (strict && total) process.exit(1);
