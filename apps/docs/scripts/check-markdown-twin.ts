/** Converts every MDX page as `/{lang}/{permalink}.md` does and fails on MDX left outside a
 * code fence, a page that fails to convert, or a component with no rule. Also lists pages whose
 * Markdown has fewer words than the MDX prose. No build needed (pricing and the guides catalog
 * render empty): `pnpm exec tsx scripts/check-markdown-twin.ts [file …]`. */
import fs from 'node:fs';
import path from 'node:path';

import { toString } from 'mdast-util-to-string';
import { remark } from 'remark';
import remarkMdx from 'remark-mdx';

import { mdxToMarkdown } from '../src/util/markdownTwin/index';

const ROOT = 'src/content/docs';
const LEAKS: [string, RegExp][] = [
	['import line', /^\s*import\s+\w+\s+from\s/],
	['component tag', /<[A-Z][A-Za-z]*[\s/>]/],
	['directive', /^\s*:::/],
	['JSX comment', /\{\/\*/],
	['HTML comment', /<!--/],
];

function walk(dir: string, pattern = /\.mdx$/): string[] {
	return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		// Like Vite's glob, skip dot-files and dot-directories.
		if (entry.name.startsWith('.')) return [];
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) return walk(full, pattern);
		return pattern.test(entry.name) ? [full] : [];
	});
}

/** Lines outside fenced code (a fence may sit in a quote), with inline code removed, numbered from 1. */
function proseLines(markdown: string): [number, string][] {
	const out: [number, string][] = [];
	let fence: string | null = null;
	markdown.split('\n').forEach((line, index) => {
		const marker = line.match(/^[\s>]*(`{3,}|~{3,})/)?.[1];
		if (fence) {
			if (marker && marker[0] === fence[0] && marker.length >= fence.length) fence = null;
		} else if (marker) fence = marker;
		else out.push([index + 1, line.replace(/(`+)[\s\S]*?\1/g, '')]);
	});
	return out;
}

const mdxParser = remark().use(remarkMdx);
const words = (value: string) => value.split(/\s+/).filter(Boolean).length;

type Node = { type: string; children?: Node[] };
function withoutCode(node: Node): Node {
	if (!node.children) return node;
	return {
		...node,
		children: node.children
			.filter((child) => !/^(mdxjsEsm|mdxFlowExpression|mdxTextExpression)$/.test(child.type))
			.map(withoutCode),
	};
}

// The same set of keys the route's `src/includes/**/*.{md,mdx}` glob produces, matched exactly.
const includeFiles = new Map(
	walk('src/includes', /\.mdx?$/).map((file) => [`/${file.split(path.sep).join('/')}`, file])
);
const readInclude = (key: string) => {
	const file = includeFiles.get(key);
	return file === undefined ? undefined : fs.readFileSync(file, 'utf8');
};

const files = process.argv.slice(2).length > 0 ? process.argv.slice(2) : walk(ROOT);
const problems: string[] = [];
const thin: string[] = [];
const unknown = new Map<string, Set<string>>();

for (const file of files) {
	const body = fs.readFileSync(file, 'utf8');
	const lang = file.includes(`${path.sep}pt-br${path.sep}`) ? 'pt-br' : 'en';
	let markdown: string;
	try {
		markdown = await mdxToMarkdown(body, {
			lang,
			readInclude,
			onUnknown: (name) => {
				if (!unknown.has(name)) unknown.set(name, new Set());
				unknown.get(name)!.add(file);
			},
		});
	} catch (error) {
		problems.push(`${file}: conversion failed: ${(error as Error).message}`);
		continue;
	}

	for (const [line, text] of proseLines(markdown))
		for (const [kind, pattern] of LEAKS)
			if (pattern.test(text))
				problems.push(`${file}: ${kind} in the Markdown, line ${line}: ${text.trim()}`);

	const prose = words(
		toString(withoutCode(mdxParser.parse(body.replace(/^---[\s\S]*?---\n?/, '')) as Node) as never)
	);
	if (prose > 0 && words(markdown) < prose * 0.95)
		thin.push(`${file}: ${words(markdown)} words in the Markdown for ${prose} in the MDX prose`);
}

for (const [name, pages] of unknown)
	problems.push(`no rule for ${name}, used in ${pages.size} page(s), e.g. ${[...pages][0]}`);

console.log(`Checked ${files.length} page(s).`);
if (thin.length > 0) console.log(`\nPages with fewer words than their prose:\n${thin.join('\n')}`);
if (problems.length > 0) {
	console.log(`\n${problems.length} problem(s):\n${problems.join('\n')}`);
	process.exit(1);
}
console.log('No MDX left in any Markdown twin.');
