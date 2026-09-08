import fs from 'node:fs';
import path from 'node:path';

import { LANGS, type Lang } from '../../src/nav/schema';
import { targetPermalink, walkTree, withSlashes } from '../../src/nav/resolve';
import { loadNav, REPO_ROOT, type CorpusPage } from './lib/load';
import { removeField, setField } from './lib/frontmatter';

const apply = process.argv.includes('--apply');

const { data, corpus, issues } = loadNav();
if (issues.length) {
	console.error('nav data does not load cleanly; run lint:navcheck first');
	for (const issue of issues) console.error(`  ${issue}`);
	process.exit(1);
}

const byNamespace = new Map<string, Partial<Record<Lang, CorpusPage>>>();
for (const page of corpus) {
	const entry = byNamespace.get(page.namespace) ?? {};
	entry[page.lang] = page;
	byNamespace.set(page.namespace, entry);
}

interface Move {
	lang: Lang;
	file: string;
	from: string;
	to: string;
}

const moves: Move[] = [];

for (const lang of LANGS) {
	for (const tree of data.trees.values()) {
		for (const entry of walkTree(tree, lang)) {
			const { node } = entry;
			if (!node.page || node.linkOnly || node.placeholder) continue;
			const page = byNamespace.get(node.page)?.[lang];
			if (!page) continue;
			const to = targetPermalink(data, entry, lang);
			if (!to || withSlashes(page.permalink) === withSlashes(to)) continue;
			moves.push({ lang, file: page.file, from: page.permalink, to });
		}
	}
}

const orphanedNamespaces = corpus.filter((page) => page.hasMenuNamespace).length;

if (apply) {
	let touched = 0;
	for (const move of moves) {
		const file = path.join(REPO_ROOT, 'src/content/docs', move.file);
		const before = fs.readFileSync(file, 'utf8');
		const after = removeField(setField(before, 'permalink', move.to), 'menu_namespace');
		if (after === before) continue;
		fs.writeFileSync(file, after);
		touched += 1;
	}
	for (const page of corpus) {
		if (!page.hasMenuNamespace) continue;
		const file = path.join(REPO_ROOT, 'src/content/docs', page.file);
		const before = fs.readFileSync(file, 'utf8');
		const after = removeField(before, 'menu_namespace');
		if (after === before) continue;
		fs.writeFileSync(file, after);
		touched += 1;
	}
	console.log(`rewrote ${touched} files`);
} else {
	console.log('dry run: nothing written (pass --apply)');
}

console.log(`${moves.length} page/language permalinks to move`);
console.log(`${orphanedNamespaces} files still carry menu_namespace`);
if (!apply) {
	for (const move of moves.slice(0, 8)) console.log(`  ${move.from}  ->  ${move.to}`);
}
