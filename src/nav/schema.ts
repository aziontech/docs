import { z } from 'astro/zod';

export const LANGS = ['en', 'pt-br'] as const;
export type Lang = (typeof LANGS)[number];

/** A string that may differ per language; `pt-br` falls back to `en` when absent. */
const localized = z.object({
	en: z.string().min(1),
	'pt-br': z.string().min(1).optional(),
});

export type Localized = z.infer<typeof localized>;

const segmentString = z.string().regex(/^[a-z0-9-]+$/);

/** A URL segment, translated when the Portuguese path differs. */
const localizedSegment = z.union([
	segmentString,
	z.object({ en: segmentString, 'pt-br': segmentString.optional() }),
]);

export type LocalizedSegment = z.infer<typeof localizedSegment>;

const baseNode = z.object({
	/** Namespace of the page this row points at. */
	page: z.string().min(1).optional(),
	/** Id of the tree this row hands the reader over to. */
	tree: z.string().min(1).optional(),
	/** Absolute URL, for a row that leaves the docs. */
	href: z.url().optional(),
	/** Query string appended to the resolved destination, e.g. a hub's filter. */
	query: z.string().min(1).optional(),
	/** Overrides the page title as the row label. */
	label: localized.optional(),
	/** Overrides the last URL segment; defaults to the page's current one. */
	slug: localized.optional(),
	/** Leading glyph class, e.g. `pi pi-arrow-left`. */
	icon: z.string().min(1).optional(),
	/** Trailing badge text, e.g. `v3`. */
	tag: z.string().min(1).optional(),
	/** Adds a segment to the URL of every page nested under this row. */
	segment: localizedSegment.optional(),
	/** Listed here but owned by another node; exempt from the single-home rule. */
	linkOnly: z.boolean().optional(),
	/** Points at the shared coming-soon page, so it claims no URL of its own. */
	placeholder: z.boolean().optional(),
	/** Tree ids this guide belongs to; drives the guides home filter. */
	products: z.array(z.string().min(1)).optional(),
	/** Content type in the guides catalog; a fold's value covers the rows beneath it. */
	kind: z.enum(['learning-path', 'tutorial', 'reference-architecture']).optional(),
});

export type NavNode = z.infer<typeof baseNode> & { items?: NavNode[] };

export const navNode: z.ZodType<NavNode> = baseNode
	.extend({ items: z.lazy(() => z.array(navNode)).optional() })
	.refine(
		(n) => [n.page, n.tree, n.href].filter(Boolean).length <= 1,
		{ message: 'a row points at a page, a tree or an href — never more than one' },
	)
	.refine((n) => Boolean(n.page || n.tree || n.href || n.items?.length || n.placeholder), {
		message: 'a row needs a destination or children',
	})
	.refine((n) => Boolean(n.label || n.page || n.tree), {
		message: 'a row with no page or tree needs an explicit label',
	});

export const navGroup = z.object({
	/** Static section title; omit for an unlabeled block. */
	label: localized.optional(),
	/** Adds a segment to the URL of every page under this group. */
	segment: localizedSegment.optional(),
	items: z.array(navNode).min(1),
});

export type NavGroup = z.infer<typeof navGroup>;

export const CATEGORIES = [
	'fundamentals',
	'platform',
	'build',
	'store',
	'secure',
	'observe',
	'devtools',
	'guides',
	'other',
] as const;

export const navTree = z.object({
	id: z.string().regex(/^[a-z0-9-]+$/),
	title: localized,
	/** One-line summary, shown in the top-nav product directory. */
	description: localized.optional(),
	category: z.enum(CATEGORIES),
	/** Tree the back row returns to; `root` is the catalog. */
	parent: z.string().min(1).default('root'),
	/** URL prefix under `/documentation` | `/documentacao`. */
	path: localized,
	/** Namespace of the tree's landing page. */
	root: z.string().min(1).optional(),
	/** Kept out of the root catalog; reached from the top nav or a card. */
	unlisted: z.boolean().optional(),
	groups: z.array(navGroup).min(1),
});

export type NavTree = z.infer<typeof navTree>;

export const navRoot = z.object({ groups: z.array(navGroup).min(1) });

export type NavRoot = z.infer<typeof navRoot>;

const topNavColumn = z.object({
	label: localized,
	items: z.array(z.object({ tree: z.string().min(1) })).min(1),
});

export const topNav = z.object({
	products: z.array(topNavColumn).min(1),
	devtools: z.array(topNavColumn).min(1),
	guides: z.string().min(1),
});

export type TopNav = z.infer<typeof topNav>;

/** Videos from the Azion channel; listed in the guides catalog, never in a tree. */
export const navVideos = z.array(
	z.object({
		href: z.url(),
		title: localized,
		description: localized.optional(),
		/** Tree ids the video belongs to; drives the topic filter. */
		products: z.array(z.string().min(1)).optional(),
	}),
);

export type NavVideos = z.infer<typeof navVideos>;

/** Namespace of a discarded page, mapped to what replaces it. */
export const navRedirects = z.record(
	z.string(),
	z.object({
		/** Namespace of the replacement page. */
		page: z.string().min(1).optional(),
		/** Tree whose landing page replaces it. */
		tree: z.string().min(1).optional(),
		/** Literal target, for a replacement outside the collection. */
		path: z.string().min(1).optional(),
		reason: z.string().min(1),
	}),
);

export type NavRedirects = z.infer<typeof navRedirects>;
