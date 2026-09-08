import fs from 'node:fs';
import path from 'node:path';

import { LANGS, type Lang } from '../../src/nav/schema';
import { REPO_ROOT } from './lib/load';
import { fieldRange } from './lib/frontmatter';

const MAP_DIR = path.join(REPO_ROOT, 'redirects');
const SITE = 'https://www.azion.com';
const apply = process.argv.includes('--apply');

/** Directories whose files may link to a documentation URL. */
const SCAN = ['src/content/docs', 'src/includes', 'src/i18n', 'src/components', 'src/layouts', 'src/pages', 'src/data'];
const EXTENSIONS = new Set(['.mdx', '.md', '.ts', '.js', '.astro', '.vue', '.json']);
/** The legacy menu modules the new model replaces; retargeting them would only churn a file that is about to go. */
const LEGACY_MENUS = new Set([
	'nav.ts',
	'headerMenu.ts',
	'buildMenu.ts',
	'storeMenu.ts',
	'secureMenu.ts',
	'observeMenu.ts',
	'deployMenu.ts',
	'cliMenu.ts',
	'cliMenuAlpha.ts',
	'devtoolsMenu.ts',
	'graphqlMenu.ts',
	'libMenu.ts',
	'mcpMenu.ts',
	'runtimeMenu.ts',
]);

interface Row {
	from: string;
	moved: string;
}

const replacements = new Map<string, string>();

for (const lang of LANGS) {
	const file = path.join(MAP_DIR, `url-map.${lang}.json`);
	if (!fs.existsSync(file)) {
		console.error(`missing ${file}; run migrate-permalinks first`);
		process.exit(1);
	}
	for (const row of JSON.parse(fs.readFileSync(file, 'utf8')) as Row[]) {
		const from = row.from.replace(SITE, '');
		const moved = row.moved.replace(SITE, '');
		// With the language prefix, as links in content are written.
		replacements.set(from, moved);
		// And without it, for the few links that omit it.
		replacements.set(from.replace(`/${lang as Lang}`, ''), moved.replace(`/${lang as Lang}`, ''));
	}
}

/*
	One pass, longest path first, so a parent path never rewrites the head of a
	child that has its own row. The trailing guard rejects a match that another
	segment continues, which is what makes a sequential replace corrupt URLs.
*/
const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const keys = [...replacements.keys()].sort((a, b) => b.length - a.length);
const pattern = new RegExp(`(${keys.map((key) => escape(key.replace(/\/$/, ''))).join('|')})(\\/?)(?![A-Za-z0-9_\\-/])`, 'g');

const lookup = new Map<string, string>();
for (const [from, moved] of replacements) lookup.set(from.replace(/\/$/, ''), moved);

function walk(dir: string, out: string[] = []): string[] {
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) walk(full, out);
		else if (EXTENSIONS.has(path.extname(entry.name)) && !LEGACY_MENUS.has(entry.name)) out.push(full);
	}
	return out;
}

let filesChanged = 0;
let linksChanged = 0;
const perFile: { file: string; count: number }[] = [];

for (const dir of SCAN) {
	const root = path.join(REPO_ROOT, dir);
	if (!fs.existsSync(root)) continue;
	for (const file of walk(root)) {
		const before = fs.readFileSync(file, 'utf8');
		let count = 0;
		const rewrite = (text: string) =>
			text.replace(pattern, (match, urlPath) => {
				const target = lookup.get(urlPath);
				if (!target) return match;
				count += 1;
				return target;
			});

		/*
			A page's own address is migrate-permalinks' business: rewriting it here
			would point a retired page at its replacement and claim that URL twice.
			Only that field is protected, and by line span rather than by name,
			because a folded scalar puts the value on its own line. Everything else,
			including a description or a card link that carries a URL, is retargeted.
		*/
		const isContent = ['.md', '.mdx'].includes(path.extname(file));
		const protectedRange = isContent ? fieldRange(before, 'permalink') : null;
		let after: string;

		if (protectedRange) {
			const [start, end] = protectedRange;
			const lines = before.split('\n');
			after = lines
				.map((line, index) => (index >= start && index <= end ? line : rewrite(line)))
				.join('\n');
		} else {
			after = rewrite(before);
		}

		if (!count || after === before) continue;
		filesChanged += 1;
		linksChanged += count;
		perFile.push({ file: path.relative(REPO_ROOT, file), count });
		if (apply) fs.writeFileSync(file, after);
	}
}

perFile.sort((a, b) => b.count - a.count);
console.log(`${apply ? 'rewrote' : 'would rewrite'} ${linksChanged} links across ${filesChanged} files`);
for (const entry of perFile.slice(0, 12)) console.log(`  ${String(entry.count).padStart(4)}  ${entry.file}`);
if (perFile.length > 12) console.log(`  ... and ${perFile.length - 12} more files`);
if (!apply) console.log('\ndry run: pass --apply to write');
