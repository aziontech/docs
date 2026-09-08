import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

import { navRedirects, navRoot, navTree, navVideos, topNav, type Lang, type NavRedirects, type NavTree } from '../../../src/nav/schema';
import type { NavData, PageIndex } from '../../../src/nav/resolve';

export const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const NAV_DIR = path.join(REPO_ROOT, 'src/nav');
const CONTENT_DIR = path.join(REPO_ROOT, 'src/content/docs');

export interface CorpusPage {
	lang: Lang;
	file: string;
	namespace: string;
	permalink: string;
	title: string;
	description: string;
	hasMenuNamespace: boolean;
	menuNamespace: string;
}

function walk(dir: string, out: string[] = []): string[] {
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) walk(full, out);
		else if (/\.mdx?$/.test(entry.name)) out.push(full);
	}
	return out;
}

export function readCorpus(): CorpusPage[] {
	const pages: CorpusPage[] = [];
	for (const file of walk(CONTENT_DIR)) {
		const rel = path.relative(CONTENT_DIR, file);
		const lang = rel.split(path.sep)[0] as Lang;
		if (lang !== 'en' && lang !== 'pt-br') continue;
		const data = matter.read(file).data as Record<string, unknown>;
		pages.push({
			lang,
			file: rel,
			namespace: String(data.namespace ?? '').trim(),
			permalink: String(data.permalink ?? '').trim(),
			title: String(data.title ?? '').trim(),
			description: String(data.description ?? data.Description ?? '').trim(),
			hasMenuNamespace: 'menu_namespace' in data,
			menuNamespace: String(data.menu_namespace ?? '').trim(),
		});
	}
	return pages;
}

export function toPageIndex(corpus: CorpusPage[]): PageIndex {
	const pages: PageIndex = new Map();
	for (const page of corpus) {
		if (!page.namespace) continue;
		const existing = pages.get(page.namespace) ?? {};
		existing[page.lang] = { permalink: page.permalink, title: page.title, description: page.description };
		pages.set(page.namespace, existing);
	}
	return pages;
}

function readJson(file: string): unknown {
	return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export interface LoadResult {
	data: NavData;
	redirects: NavRedirects;
	exempt: Record<string, string>;
	corpus: CorpusPage[];
	issues: string[];
}

export function loadNav(): LoadResult {
	const issues: string[] = [];

	const rootParsed = navRoot.safeParse(readJson(path.join(NAV_DIR, 'root.json')));
	if (!rootParsed.success) {
		for (const issue of rootParsed.error.issues) issues.push(`root.json: ${issue.path.join('.')} ${issue.message}`);
	}

	const topParsed = topNav.safeParse(readJson(path.join(NAV_DIR, 'topnav.json')));
	if (!topParsed.success) {
		for (const issue of topParsed.error.issues) issues.push(`topnav.json: ${issue.path.join('.')} ${issue.message}`);
	}

	const redirectsPath = path.join(NAV_DIR, 'redirects.json');
	const redirectsParsed = navRedirects.safeParse(fs.existsSync(redirectsPath) ? readJson(redirectsPath) : {});
	if (!redirectsParsed.success) {
		for (const issue of redirectsParsed.error.issues) issues.push(`redirects.json: ${issue.path.join('.')} ${issue.message}`);
	}

	const videosPath = path.join(NAV_DIR, 'videos.json');
	const videosParsed = navVideos.safeParse(fs.existsSync(videosPath) ? readJson(videosPath) : []);
	if (!videosParsed.success) {
		for (const issue of videosParsed.error.issues) issues.push(`videos.json: ${issue.path.join('.')} ${issue.message}`);
	}

	const trees = new Map<string, NavTree>();
	const treeDir = path.join(NAV_DIR, 'trees');
	const treeFiles = fs.existsSync(treeDir) ? fs.readdirSync(treeDir).filter((f) => f.endsWith('.json')).sort() : [];
	for (const file of treeFiles) {
		const parsed = navTree.safeParse(readJson(path.join(treeDir, file)));
		if (!parsed.success) {
			for (const issue of parsed.error.issues) issues.push(`trees/${file}: ${issue.path.join('.')} ${issue.message}`);
			continue;
		}
		if (trees.has(parsed.data.id)) issues.push(`trees/${file}: duplicate tree id "${parsed.data.id}"`);
		trees.set(parsed.data.id, parsed.data);
		if (file !== `${parsed.data.id}.json`) issues.push(`trees/${file}: file should be named ${parsed.data.id}.json`);
	}

	const exemptPath = path.join(NAV_DIR, 'exempt.json');
	const exempt = fs.existsSync(exemptPath) ? (readJson(exemptPath) as Record<string, string>) : {};

	const corpus = readCorpus();

	return {
		data: {
			root: rootParsed.success ? rootParsed.data : { groups: [] as never },
			trees,
			topnav: topParsed.success ? topParsed.data : undefined,
			videos: videosParsed.success ? videosParsed.data : [],
			pages: toPageIndex(corpus),
		},
		redirects: redirectsParsed.success ? redirectsParsed.data : {},
		exempt,
		corpus,
		issues,
	};
}
