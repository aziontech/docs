import { getCollection } from 'astro:content';

import { navRoot, navTree, navVideos, topNav, type Lang, type NavTree } from './schema';
import {
	buildNavIndex,
	buildDirectory,
	buildGuidesHome,
	buildTopNav,
	resolveBreadcrumb,
	resolveNeighbours,
	resolveSidebar,
	type NavData,
	type NavLocation,
	type Crumb,
	type GuidesHomeModel,
	type MenuGroupNode,
	type Neighbour,
	type PageIndex,
	type SidebarModel,
	type TopNavModel,
} from './resolve';
import rootJson from './root.json';
import topNavJson from './topnav.json';
import videosJson from './videos.json';

const treeModules = import.meta.glob<{ default: unknown }>('./trees/*.json', { eager: true });

let cachedTrees: Map<string, NavTree> | null = null;
let cachedPages: PageIndex | null = null;
const cachedIndex = new Map<Lang, Map<string, NavLocation>>();

function loadTrees(): Map<string, NavTree> {
	if (cachedTrees) return cachedTrees;
	const trees = new Map<string, NavTree>();
	for (const [file, mod] of Object.entries(treeModules)) {
		const parsed = navTree.safeParse(mod.default);
		if (!parsed.success) {
			throw new Error(`Invalid nav tree ${file}: ${parsed.error.issues.map((i) => `${i.path.join('.')} ${i.message}`).join('; ')}`);
		}
		if (trees.has(parsed.data.id)) throw new Error(`Duplicate nav tree id "${parsed.data.id}" (${file})`);
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
		};
		const existing = pages.get(namespace) ?? {};
		existing[lang] = facts;
		pages.set(namespace, existing);
	}
	cachedPages = pages;
	return pages;
}

export async function getNavData(): Promise<NavData> {
	const root = navRoot.parse(rootJson);
	const config = topNav.parse(topNavJson);
	const videos = navVideos.parse(videosJson);
	return { root, trees: loadTrees(), topnav: config, videos, pages: await loadPages() };
}

export async function getSidebar(pathname: string, lang: Lang): Promise<SidebarModel> {
	return resolveSidebar(await getNavData(), pathname, lang);
}

export async function getTopNav(lang: Lang): Promise<TopNavModel | null> {
	return buildTopNav(await getNavData(), lang);
}

export async function getDirectory(
	lang: Lang,
	labels: { products: string; guides: string; devtools: string },
): Promise<MenuGroupNode[]> {
	return buildDirectory(await getNavData(), lang, labels);
}

export async function getGuidesHome(treeId: string, lang: Lang): Promise<GuidesHomeModel> {
	return buildGuidesHome(await getNavData(), treeId, lang);
}

export async function getBreadcrumb(pathname: string, lang: Lang): Promise<Crumb[]> {
	return resolveBreadcrumb(await getNavData(), pathname, lang);
}

export async function getNeighbours(
	pathname: string,
	lang: Lang,
): Promise<{ previous?: Neighbour; next?: Neighbour }> {
	return resolveNeighbours(await getNavData(), pathname, lang);
}

/** Permalink → tree location, memoized per language for the whole build. */
export async function getNavIndex(lang: Lang): Promise<Map<string, NavLocation>> {
	const hit = cachedIndex.get(lang);
	if (hit) return hit;
	const index = buildNavIndex(await getNavData(), lang);
	cachedIndex.set(lang, index);
	return index;
}

export type { Lang } from './schema';
export type {
	Crumb,
	CatalogEntry,
	GuidesHomeModel,
	MenuGroupNode,
	MenuNode,
	NavLocation,
	Neighbour,
	SidebarHeader,
	SidebarModel,
	TopNavModel,
} from './resolve';
