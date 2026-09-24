import { execFileSync } from 'node:child_process';
import { readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { getCollection } from 'astro:content';

import { navRoot, navTree, navVideos, topNav, type Lang, type NavTree } from './schema';
import {
	buildNavIndex,
	buildDirectory,
	buildGuidesHome,
	buildTopNav,
	pageHref,
	resolveBreadcrumb,
	resolveNeighbours,
	resolveSidebar,
	treeHref,
	type NavData,
	type NavIndex,
	type Crumb,
	type PageFacts,
	type GuidesHomeModel,
	type MenuGroupNode,
	type Neighbour,
	type PageIndex,
	type SidebarLabels,
	type SidebarModel,
	type TopNavModel,
	withSlashes,
} from './resolve';
import rootJson from './root.json';
import topNavJson from './topnav.json';
import videosJson from './videos.json';

const treeModules = import.meta.glob<{ default: unknown }>('./trees/*.json', { eager: true });

let cachedTrees: Map<string, NavTree> | null = null;
let cachedPages: PageIndex | null = null;
const cachedIndex = new Map<Lang, NavIndex>();

function loadTrees(): Map<string, NavTree> {
	if (cachedTrees) return cachedTrees;
	const trees = new Map<string, NavTree>();
	for (const [file, mod] of Object.entries(treeModules)) {
		const parsed = navTree.safeParse(mod.default);
		if (!parsed.success) {
			throw new Error(
				`Invalid nav tree ${file}: ${parsed.error.issues
					.map((i) => `${i.path.join('.')} ${i.message}`)
					.join('; ')}`
			);
		}
		if (trees.has(parsed.data.id))
			throw new Error(`Duplicate nav tree id "${parsed.data.id}" (${file})`);
		trees.set(parsed.data.id, parsed.data);
	}
	cachedTrees = trees;
	return trees;
}

async function loadPages(): Promise<PageIndex> {
	if (cachedPages) return cachedPages;
	const pages: PageIndex = new Map();
	for (const entry of await getCollection('docs')) {
		const namespace = entry.data.namespace?.trim();
		if (!namespace) continue;
		const lang = entry.id.split('/')[0] as Lang;
		if (lang !== 'en' && lang !== 'pt-br') continue;
		const facts = {
			permalink: entry.data.permalink?.trim(),
			title: entry.data.title?.trim(),
			description: entry.data.description?.trim(),
			updated: pageUpdated(entry.filePath, entry.body),
		};
		const existing = pages.get(namespace) ?? {};
		existing[lang] = facts;
		pages.set(namespace, existing);
	}
	cachedPages = pages;
	return pages;
}

const SWEEP_FILES = 100;

let cachedDates: Map<string, string> | null = null;
let sweepDates: Map<string, string> | null = null;

function lastUpdated(filePath?: string): string | undefined {
	if (!filePath) return undefined;
	if (!cachedDates || !sweepDates) {
		const dates = new Map<string, string>();
		const sweeps = new Map<string, string>();
		try {
			const log = execFileSync(
				'git',
				[
					'log',
					'--format=%cI',
					'--name-only',
					'--diff-filter=AMR',
					'--',
					'src/content/docs',
					'src/data',
					'src/includes',
				],
				{
					encoding: 'utf8',
					maxBuffer: 64 * 1024 * 1024,
				}
			);
			let date = '';
			let files: string[] = [];
			const flush = () => {
				const target = files.length > SWEEP_FILES ? sweeps : dates;
				for (const file of files) if (!target.has(file)) target.set(file, date);
				files = [];
			};
			for (const line of log.split('\n')) {
				if (!line) continue;
				if (/^\d{4}-\d{2}-\d{2}T/.test(line)) {
					flush();
					date = line;
				} else {
					files.push(line);
				}
			}
			flush();
		} catch {
			// no git: dates fall back to mtime
		}
		cachedDates = dates;
		sweepDates = sweeps;
	}
	const fromGit = cachedDates.get(filePath) ?? sweepDates.get(filePath);
	if (fromGit) return fromGit;
	try {
		return statSync(filePath).mtime.toISOString();
	} catch {
		return undefined;
	}
}

export async function getNavData(): Promise<NavData> {
	const root = navRoot.parse(rootJson);
	const config = topNav.parse(topNavJson);
	const videos = navVideos.parse(videosJson);
	return { root, trees: loadTrees(), topnav: config, videos, pages: await loadPages() };
}

export async function getSidebar(
	pathname: string,
	lang: Lang,
	labels: SidebarLabels
): Promise<SidebarModel> {
	return resolveSidebar(await getNavData(), await getNavIndex(lang), pathname, lang, labels);
}

export async function getTopNav(lang: Lang): Promise<TopNavModel | null> {
	return buildTopNav(await getNavData(), lang);
}

export async function getDirectory(
	lang: Lang,
	labels: { products: string; guides: string; devtools: string }
): Promise<MenuGroupNode[]> {
	return buildDirectory(await getNavData(), lang, labels);
}

export async function getGuidesHome(treeId: string, lang: Lang): Promise<GuidesHomeModel> {
	return buildGuidesHome(await getNavData(), treeId, lang);
}

export async function getBreadcrumb(pathname: string, lang: Lang): Promise<Crumb[]> {
	return resolveBreadcrumb(await getNavData(), await getNavIndex(lang), pathname, lang);
}

export async function getNeighbours(
	pathname: string,
	lang: Lang
): Promise<{ previous?: Neighbour; next?: Neighbour }> {
	return resolveNeighbours(await getNavData(), await getNavIndex(lang), pathname, lang);
}

export async function getNavIndex(lang: Lang): Promise<NavIndex> {
	const hit = cachedIndex.get(lang);
	if (hit) return hit;
	const index = buildNavIndex(await getNavData(), lang);
	cachedIndex.set(lang, index);
	return index;
}

const CONTENT_IMPORT = /^import\s[^;]*?from\s+['"]([^'"]+\.mdx?)['"]/gm;
const FENCED_CODE = /^(```|~~~)[\s\S]*?^\1/gm;

const cachedPartials = new Map<string, string[]>();

function partialsOf(filePath: string, body: string): string[] {
	const found: string[] = [];
	for (const [, source] of body.replace(FENCED_CODE, '').matchAll(CONTENT_IMPORT)) {
		found.push(source.startsWith('~/') ? join('src', source.slice(2)) : join(dirname(filePath), source));
	}
	return found;
}

function contentDependencies(filePath: string, body: string): string[] {
	const seen = new Set<string>();
	const visit = (partials: string[]) => {
		for (const partial of partials) {
			if (seen.has(partial)) continue;
			seen.add(partial);
			let nested = cachedPartials.get(partial);
			if (!nested) {
				try {
					nested = partialsOf(partial, readFileSync(partial, 'utf8'));
				} catch {
					nested = [];
				}
				cachedPartials.set(partial, nested);
			}
			visit(nested);
		}
	};
	visit(partialsOf(filePath, body));
	return [...seen];
}

function pageUpdated(filePath?: string, body?: string): string | undefined {
	if (!filePath) return undefined;
	return [filePath, ...contentDependencies(filePath, body ?? '')]
		.map(lastUpdated)
		.filter((date): date is string => Boolean(date))
		.sort((a, b) => Date.parse(a) - Date.parse(b))
		.pop();
}

export async function getTreeId(pathname: string, lang: Lang): Promise<string | undefined> {
	return (await getNavIndex(lang)).get(withSlashes(pathname.split('?')[0].split('#')[0]))?.treeId;
}

const cachedFacts = new Map<Lang, Map<string, PageFacts>>();

export async function getPageFacts(pathname: string, lang: Lang): Promise<PageFacts | undefined> {
	let byHref = cachedFacts.get(lang);
	if (!byHref) {
		byHref = new Map();
		for (const entry of (await getNavData()).pages.values()) {
			const facts = entry[lang];
			if (facts?.permalink) byHref.set(`/${lang}${withSlashes(facts.permalink)}`, facts);
		}
		cachedFacts.set(lang, byHref);
	}
	return byHref.get(withSlashes(pathname.split('?')[0].split('#')[0]));
}

export async function getPageHref(namespace: string, lang: Lang): Promise<string | undefined> {
	return pageHref(await getNavData(), namespace, lang);
}

export async function getTreeHref(treeId: string, lang: Lang): Promise<string | undefined> {
	const data = await getNavData();
	const tree = data.trees.get(treeId);
	return tree ? treeHref(data, tree, lang) : undefined;
}

export type { Lang } from './schema';
export type {
	Crumb,
	CatalogEntry,
	GuidesHomeModel,
	MenuGroupNode,
	MenuNode,
	NavIndex,
	NavLocation,
	Neighbour,
	PageFacts,
	SidebarHeader,
	SidebarLabels,
	SidebarModel,
	TopNavModel,
} from './resolve';
