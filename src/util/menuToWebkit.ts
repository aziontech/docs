import type { NavDict, UIDictionaryKeys } from '~/i18n/translation-checkers';
import { isURL, modelSlug } from '~/util';

/**
 * Adapter from the docs navigation data (`NavDict`, the hand-written trees in
 * `src/i18n/{en,pt-br}/*.ts`) to the shape @aziontech/webkit's `Menu` renders
 * in data-driven mode (`MenuGroupNode[]` — see the component's injection-key
 * types). The data files stay untouched: they also feed prev/next pagination
 * (`getNavLinks`) and the `NavDictionary` translation matching, so everything
 * webkit-specific is derived here at render time.
 *
 * Mapping, per node: `key → id`, `text → label`, `slug → href` (through
 * `modelSlug`, which keeps the `/en/` fallback for untranslated pt-br pages),
 * external URL → `target: '_blank'`, `items → children`, and
 * `isFallback → tagValue: 'EN'` — the language-fallback marker the previous
 * sidebar dropped. `hasLabel` only exists on top-level nodes (verified across
 * all 13 menu namespaces) and becomes the enclosing group's label.
 *
 * In webkit's model a container is not a destination: a node with `children`
 * renders as a fold trigger with no href. The two nodes in the data that carry
 * both `slug` and `items` (Applications in `nav`, KV Store in `runtimeMenu`)
 * keep their page reachable through an injected first child that repeats the
 * node's own label and link.
 */

export interface WebkitMenuNode {
	id: string;
	label: string;
	href?: string;
	target?: '_self' | '_blank';
	tagValue?: string;
	children?: WebkitMenuNode[];
}

export interface WebkitMenuGroup {
	label?: string;
	items: WebkitMenuNode[];
}

export interface SidebarMenuModel {
	groups: WebkitMenuGroup[];
	/** Id of the row matching the current page; '' when none matches. */
	activeId: string;
	/** Ids of the folds above the active row, so it is visible on arrival. */
	expandedIds: string[];
}

interface BuildOptions {
	lang: string;
	/** Path of the current page without its leading slash (e.g. `en/documentation/.../`). */
	currentPageMatch: string;
	/** Drop `onlyMobile` entries (the desktop rail); the mobile drawer keeps them. */
	filterMobile?: boolean;
	/** Resolves a `hasLabel` UI-dictionary key to its translated group title. */
	translateLabel: (key: UIDictionaryKeys) => string;
}

type NavItem = NavDict[number];

export function buildSidebarMenu(items: NavDict, options: BuildOptions): SidebarMenuModel {
	const { lang, currentPageMatch, filterMobile = false, translateLabel } = options;

	let activeId = '';
	const expandedIds: string[] = [];

	const isCurrent = (item: Pick<NavItem, 'slug'>) =>
		Boolean(item.slug) && `${lang}${item.slug}` === currentPageMatch;

	const toNode = (item: NavItem, ancestors: string[]): WebkitMenuNode | null => {
		if (filterMobile && item.onlyMobile) return null;
		if (!item.text) return null;

		const id = item.key ?? item.slug ?? item.text;
		const href = item.slug ? modelSlug(item.slug, item.isFallback, lang) : undefined;

		if (item.items?.length) {
			const children = item.items
				.map((child) => toNode(child, [...ancestors, id]))
				.filter((child): child is WebkitMenuNode => child !== null);

			// A fold trigger has no href in webkit's Menu, so a container that is
			// also a page keeps that page reachable as its own first row.
			if (href) {
				const selfId = `${id}__index`;
				if (isCurrent(item)) {
					activeId = selfId;
					expandedIds.push(...ancestors, id);
				}
				children.unshift({
					id: selfId,
					label: item.text,
					href,
					target: isURL(item.slug) ? '_blank' : '_self',
					tagValue: item.isFallback ? 'EN' : undefined
				});
			}

			return { id, label: item.text, children };
		}

		if (isCurrent(item)) {
			activeId = id;
			expandedIds.push(...ancestors);
		}

		return {
			id,
			label: item.text,
			href,
			target: isURL(item.slug) ? '_blank' : '_self',
			tagValue: item.isFallback ? 'EN' : undefined
		};
	};

	// `hasLabel` partitions the top level into sections: a node carrying one
	// starts a new group titled by it; nodes before the first label form an
	// untitled group.
	const groups: WebkitMenuGroup[] = [];
	let current: WebkitMenuGroup = { items: [] };

	for (const item of items) {
		if (item.hasLabel) {
			if (current.items.length) groups.push(current);
			current = { label: translateLabel(item.hasLabel), items: [] };
		}
		const node = toNode(item, []);
		if (node) current.items.push(node);
	}
	if (current.items.length) groups.push(current);

	return { groups, activeId, expandedIds: [...new Set(expandedIds)] };
}
