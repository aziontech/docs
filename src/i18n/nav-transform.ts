import type { NavDict, UIDictionaryKeys } from './translation-checkers';

/**
 * Shape of src/i18n/nav.menu.json — the hand-curated, bilingual source of truth
 * for the main sidebar ("menu is data"). Validated by scripts/lint-navcheck.ts.
 */
export interface NavMenuJson {
	mobileAnchors: NavAnchor[];
	groups: NavGroup[];
}
export interface NavAnchor {
	key: string;
	label: LocalizedText;
	slug: LocalizedSlug;
}
export interface NavGroup {
	/** "grp/..." — namespaced so group keys never collide with row keys */
	key: string;
	/** ui.ts key rendered as the non-clickable overline label (via hasLabel) */
	ui: string;
	/** icon class rendered next to the label */
	icon?: string;
	items: NavEntry[];
}
export interface NavEntry {
	key: string;
	label: LocalizedText;
	/** absent -> toggle-only row (must have items) */
	slug?: LocalizedSlug;
	icon?: string;
	items?: NavEntry[];
}
/** pt-br absent -> falls back to the English text */
export type LocalizedText = { en: string; 'pt-br'?: string };
/** pt-br absent -> isFallback entry linking the /en/ page (never a /pt-br/ 404) */
export type LocalizedSlug = { en: string; 'pt-br'?: string };

const isURL = (slug: string) => /^https?:\/\//.test(slug);

export function navFromJson(menu: NavMenuJson, lang: 'en' | 'pt-br'): NavDict {
	const toEntry = (e: NavEntry): NavDict[number] => {
		const out: NavDict[number] = { text: e.label[lang] ?? e.label.en, key: e.key };
		if (e.icon) out.icon = e.icon;
		if (e.slug) {
			out.slug = e.slug[lang] ?? e.slug.en;
			if (!e.slug[lang] && !isURL(e.slug.en)) out.isFallback = true;
		}
		if (e.items?.length) out.items = e.items.map(toEntry);
		return out;
	};
	const nav: NavDict = menu.mobileAnchors.map((a) => ({
		text: a.label[lang] ?? a.label.en,
		slug: a.slug[lang] ?? a.slug.en,
		onlyMobile: true,
		header: true,
		anchor: true,
		type: 'learn',
		key: a.key,
	}));
	for (const group of menu.groups) {
		const rows = group.items.map(toEntry);
		if (rows.length) {
			rows[0].hasLabel = group.ui as UIDictionaryKeys;
			if (group.icon) rows[0].labelIcon = group.icon;
		}
		nav.push(...rows);
	}
	return nav;
}
