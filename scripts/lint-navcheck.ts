/**
 * lint-navcheck.ts — validates src/i18n/nav.menu.json (curated main-sidebar source)
 * and reports sidebar coverage. Run with: npm run lint:navcheck (tsx).
 *
 * Hard errors (exit 1): JSON slug that resolves to no content permalink in its
 * language; duplicate keys; rows with neither slug nor items; depth > 4; group
 * `ui` key missing from the EN ui dictionary.
 * Informational: rows at depth 4 (target is ≤ 3); "PT twin exists but nav.menu.json
 * has no pt-br slug"; orphan report — pages unreachable from every registered menu.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import type { NavMenuJson, NavEntry } from '../src/i18n/nav-transform';
import { availableMenus } from '../src/data/availableMenu';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LANGS = ['en', 'pt-br'] as const;
type Lang = (typeof LANGS)[number];

const isURL = (slug: string) => /^https?:\/\//.test(slug);
const norm = (slug: string) => slug.replace(/\/+$/, '') + '/';

// ---- content permalinks + namespace pairing ----------------------------------
function walkFiles(dir: string): string[] {
	let out: string[] = [];
	for (const item of fs.readdirSync(dir)) {
		const full = path.join(dir, item);
		if (fs.statSync(full).isDirectory()) out = out.concat(walkFiles(full));
		else if (item.endsWith('.md') || item.endsWith('.mdx')) out.push(full);
	}
	return out;
}

const permalinks: Record<Lang, Set<string>> = { en: new Set(), 'pt-br': new Set() };
const nsByEnPermalink = new Map<string, string>();
const ptPermalinkByNs = new Map<string, string>();
for (const lang of LANGS) {
	for (const file of walkFiles(path.join(ROOT, 'src/content/docs', lang))) {
		const { data } = matter(fs.readFileSync(file, 'utf-8'));
		if (!data.permalink) continue;
		const perm = norm(data.permalink);
		permalinks[lang].add(perm);
		if (lang === 'en' && data.namespace) nsByEnPermalink.set(perm, data.namespace);
		if (lang === 'pt-br' && data.namespace) ptPermalinkByNs.set(data.namespace, perm);
	}
}

// ---- nav.menu.json checks ----------------------------------------------------
const menu: NavMenuJson = JSON.parse(
	fs.readFileSync(path.join(ROOT, 'src/i18n/nav.menu.json'), 'utf-8')
);
const errors: string[] = [];
const warnings: string[] = [];
const seenKeys = new Set<string>();
const depth4: string[] = [];
const untranslated: string[] = [];

function checkKey(key: string) {
	if (seenKeys.has(key)) errors.push(`duplicate key: ${key}`);
	seenKeys.add(key);
}

function checkEntry(e: NavEntry, depth: number) {
	checkKey(e.key);
	if (!e.label?.en) errors.push(`${e.key}: missing label.en`);
	if (!e.slug && !e.items?.length) errors.push(`${e.key}: neither slug nor items`);
	// máx. 5 desde o toggle Modules dentro de Applications (Marcus, 2026-07-24)
	if (depth > 5) errors.push(`${e.key}: depth ${depth} > 5`);
	else if (depth >= 4) depth4.push(e.key);
	if (e.slug) {
		if (!isURL(e.slug.en) && !permalinks.en.has(norm(e.slug.en)))
			errors.push(`${e.key}: slug.en not a content permalink: ${e.slug.en}`);
		if (e.slug['pt-br'] && !permalinks['pt-br'].has(norm(e.slug['pt-br'])))
			errors.push(`${e.key}: slug.pt-br not a content permalink: ${e.slug['pt-br']}`);
		if (!e.slug['pt-br'] && !isURL(e.slug.en)) {
			const ns = nsByEnPermalink.get(norm(e.slug.en));
			if (ns && ptPermalinkByNs.has(ns))
				untranslated.push(`${e.key}: PT twin exists (${ptPermalinkByNs.get(ns)}) but nav falls back to /en/`);
		}
	}
	for (const child of e.items ?? []) checkEntry(child, depth + 1);
}

const { default: enUI } = await import('../src/i18n/en/ui');
const { default: ptUI } = await import('../src/i18n/pt-br/ui');
for (const anchor of menu.mobileAnchors) checkEntry(anchor as NavEntry, 0);
for (const group of menu.groups) {
	checkKey(group.key);
	if (!(group.ui in enUI)) errors.push(`${group.key}: ui key "${group.ui}" missing in en/ui.ts`);
	else if (!(group.ui in ptUI))
		warnings.push(`${group.key}: ui key "${group.ui}" missing in pt-br/ui.ts (falls back to EN)`);
	if (!group.items?.length) errors.push(`${group.key}: empty group`);
	for (const e of group.items) checkEntry(e, 1);
}

// ---- coverage / orphan report ------------------------------------------------
const reachable: Record<Lang, Set<string>> = { en: new Set(), 'pt-br': new Set() };
function collectJson(e: NavEntry) {
	if (e.slug && !isURL(e.slug.en)) {
		reachable.en.add(norm(e.slug.en));
		if (e.slug['pt-br']) reachable['pt-br'].add(norm(e.slug['pt-br']));
	}
	for (const child of e.items ?? []) collectJson(child);
}
menu.mobileAnchors.forEach((a) => collectJson(a as NavEntry));
menu.groups.forEach((g) => g.items.forEach(collectJson));

function collectLegacy(entries: any[], lang: Lang) {
	for (const e of entries ?? []) {
		if (typeof e.slug === 'string' && !isURL(e.slug)) reachable[lang].add(norm(e.slug));
		if (e.items) collectLegacy(e.items, lang);
	}
}
for (const { name, langs } of availableMenus) {
	if (name === 'nav') continue; // the JSON above
	for (const lang of langs as Lang[]) {
		try {
			const mod = await import(`../src/i18n/${lang}/${name}.ts`);
			collectLegacy(mod.default, lang);
		} catch {
			warnings.push(`could not load menu ${lang}/${name}.ts for coverage`);
		}
	}
}

console.log('nav.menu.json: ' + seenKeys.size + ' keys');
if (warnings.length) console.log('\nWarnings:\n  ' + warnings.join('\n  '));
if (depth4.length)
	console.log(`\nRows at depth 4 (target ≤ 3): ${depth4.length}\n  ` + depth4.join('\n  '));
if (untranslated.length)
	console.log(`\nTranslated pages the nav links as /en/ fallback: ${untranslated.length}\n  ` + untranslated.join('\n  '));

for (const lang of LANGS) {
	const orphans = [...permalinks[lang]].filter((p) => !reachable[lang].has(p)).sort();
	const byArea = new Map<string, number>();
	for (const p of orphans) {
		const area = p.split('/').slice(1, 3).join('/');
		byArea.set(area, (byArea.get(area) ?? 0) + 1);
	}
	console.log(
		`\nOrphan report [${lang}]: ${orphans.length} of ${permalinks[lang].size} pages in no menu` +
			(orphans.length ? '\n  ' + [...byArea].sort((a, b) => b[1] - a[1]).map(([a, n]) => `${a}: ${n}`).join('\n  ') : '')
	);
	if (process.env.NAVCHECK_VERBOSE) console.log('  ' + orphans.join('\n  '));
}

if (errors.length) {
	console.error(`\nERRORS (${errors.length}):\n  ` + errors.join('\n  '));
	process.exit(1);
}
console.log('\nnavcheck: OK');
