/**
 * The docs home used to be an MDX entry in the `docs` collection. It is now a
 * pair of real Astro pages, so its copy lives here as structured data: one
 * module per language, one component rendering both, and one synthetic
 * collection entry keeping the JSON/llms/canonical/sitemap endpoints whole.
 */

import type { DocCardGroupCols, DocCardGroupMobileCols } from '@aziontech/webkit/doc-card-group';

export type Lang = 'en' | 'pt-br';

/** An inline link in the "Also useful:" line that closes most sections. */
export interface DocLink {
	label: string;
	href: string;
}

export interface Card {
	icon: string;
	title: string;
	href: string;
	/** Call-to-action label. Cards without one render title + body only. */
	link?: string;
	target?: '_self' | '_blank';
	/** Column spans for the cards that stretch across a row. */
	class?: string;
	body?: string;
}

/** The trailing line of links some sections carry, e.g. "Also useful: …". */
export interface SectionFooter {
	prefix: string;
	links: DocLink[];
}

export interface Section {
	heading: Heading;
	intro: string;
	cols: DocCardGroupCols;
	mobileCols?: DocCardGroupMobileCols;
	cards: Card[];
	footer?: SectionFooter;
}

/** A section heading: `slug` is the anchor id, `text` the visible label. */
export interface Heading {
	depth: number;
	slug: string;
	text: string;
}

export interface Hero {
	title: string;
	description: string;
	buttonLabel: string;
	buttonLink: string;
	note: string;
	prompt: string;
	promptLabel: string;
	promptCopiedLabel: string;
	promptTooltip: string;
}

/**
 * The first section carries a bespoke two-pane block above its cards, so it is
 * typed apart from the uniform card sections that follow it.
 */
export interface InterfaceSection {
	heading: Heading;
	intro: string;
	agent: {
		id: string;
		title: string;
		body: string;
		copyLabel: string;
		copiedLabel: string;
		tooltip: string;
		prompt: string;
	};
	guided: {
		/** Anchor id: the rail and the agent-setup links target this cell. */
		id: string;
		title: string;
		buttonLabel: string;
		buttonHref: string;
	};
	cols: DocCardGroupCols;
	cards: Card[];
}

/**
 * The frontmatter the layouts used to read off the collection entry. `type` and
 * `i18nReady` carry the defaults `baseSchema` used to apply, so the shape still
 * satisfies `CollectionEntry<'docs'>['data']`.
 */
export interface DocsHomeMeta {
	type: 'base';
	i18nReady: boolean;
	title: string;
	description: string;
	meta_tags?: string;
	namespace: string;
	permalink: string;
	page_header: false;
	meta_tag_robots_no_index: false;
}

/**
 * The trailing previous/next pair, the same one that closes every reading page.
 * The home has nothing before it, so only the `next` half is filled.
 */
export interface DocsHomePagination {
	nextTitle: string;
	nextHref: string;
}

export interface DocsHomeContent {
	lang: Lang;
	/** Collection id the deleted MDX used to have; endpoints still key off it. */
	id: string;
	/** Path the deleted MDX used to have, for the "edit this page" link. */
	filePath: string;
	meta: DocsHomeMeta;
	hero: Hero;
	interfaceSection: InterfaceSection;
	sections: Section[];
	pagination: DocsHomePagination;
}
