import { z } from 'astro/zod';

export const LANGS = ['en', 'pt-br'] as const;
export type Lang = (typeof LANGS)[number];

const localized = z.object({
	en: z.string().min(1),
	'pt-br': z.string().min(1).optional(),
});

export type Localized = z.infer<typeof localized>;

const segmentString = z.string().regex(/^[a-z0-9-]+$/);

const httpUrl = z.url({ protocol: /^https?$/ });

const localizedSegment = z.union([
	segmentString,
	z.object({ en: segmentString, 'pt-br': segmentString.optional() }),
]);

export type LocalizedSegment = z.infer<typeof localizedSegment>;

const baseNode = z.object({
	page: z.string().min(1).optional(),
	tree: z.string().min(1).optional(),
	href: httpUrl.optional(),
	query: z.string().min(1).optional(),
	hash: z
		.string()
		.min(1)
		.regex(/^[a-z0-9-]+$/)
		.optional(),
	label: localized.optional(),
	slug: localized.optional(),
	icon: z.string().min(1).optional(),
	tag: z.string().min(1).optional(),
	segment: localizedSegment.optional(),
	linkOnly: z.boolean().optional(),
	placeholder: z.boolean().optional(),
	products: z.array(z.string().min(1)).optional(),
	kind: z.enum(['learning-path', 'tutorial', 'reference-architecture']).optional(),
});

export type NavNode = z.infer<typeof baseNode> & { items?: NavNode[] };

export const navNode: z.ZodType<NavNode> = baseNode
	.extend({ items: z.lazy(() => z.array(navNode)).optional() })
	.refine((n) => [n.page, n.tree, n.href].filter(Boolean).length <= 1, {
		message: 'a row points at a page, a tree or an href — never more than one',
	})
	.refine((n) => Boolean(n.page || n.tree || n.href || n.items?.length || n.placeholder), {
		message: 'a row needs a destination or children',
	})
	.refine((n) => Boolean(n.label || n.page || n.tree), {
		message: 'a row with no page or tree needs an explicit label',
	});

export const navGroup = z.object({
	label: localized.optional(),
	segment: localizedSegment.optional(),
	items: z.array(navNode).min(1),
});

export type NavGroup = z.infer<typeof navGroup>;

export const navTree = z.object({
	id: z.string().regex(/^[a-z0-9-]+$/),
	title: localized,
	description: localized.optional(),
	parent: z.string().min(1).default('root'),
	path: localized,
	root: z.string().min(1).optional(),
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

export const navVideos = z.array(
	z.object({
		href: httpUrl,
		title: localized,
		description: localized.optional(),
		products: z.array(z.string().min(1)).optional(),
	})
);

export type NavVideos = z.infer<typeof navVideos>;

export const navRedirects = z.record(
	z.string(),
	z.object({
		page: z.string().min(1).optional(),
		tree: z.string().min(1).optional(),
		path: z.string().min(1).optional(),
		reason: z.string().min(1),
	})
);

export type NavRedirects = z.infer<typeof navRedirects>;

export const navExempt = z.record(z.string(), z.string().min(1));

export type NavExempt = z.infer<typeof navExempt>;
