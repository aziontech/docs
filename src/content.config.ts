import type { CollectionEntry } from 'astro:content';
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const baseSchema = z.object({
	type: z.literal('base').optional().default('base'),
	title: z.string(),
	description: z.string().optional(),
	permalink: z.string().optional(),
	namespace: z.string().optional(),
	menu_namespace: z.string().optional().default('nav'),
	meta_tags: z.string().optional(),
	og_image: z.string().optional(),
	i18nReady: z.boolean().default(false),
	githubURL: z.url().optional(),
	hasREADME: z.boolean().optional(),
})

export const homeSchema = baseSchema.extend({
	type: z.literal('homepage'),
	product_cards: z.array(z.object({
		title: z.string(),
		cards: z.array(z.object({
			title: z.string(),
			description: z.string(),
			icon: z.string(),
			link: z.string(),
		})),
	}))
})

export type HomepageEntry = CollectionEntry<'docs'> & {
	data: z.infer<typeof homeSchema>;
};

export function isHomepageEntry(entry: CollectionEntry<'docs'>): entry is HomepageEntry {
	return entry.data.type === 'homepage';
}

export function createIsLangEntry(lang: string) {
	return function isLangEntry(entry: CollectionEntry<'docs'>): boolean {
		return entry.id.startsWith(lang + '/');
	};
}

export const isEnglishEntry = createIsLangEntry('en');

const docs = defineCollection({
	loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/docs' }),
	schema: z.union([baseSchema, homeSchema]),
});

export const collections = { docs };
