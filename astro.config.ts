import mdx from '@astrojs/mdx';
import preact from '@astrojs/preact';
import { defineConfig } from 'astro/config';

import AutoImport from 'astro-auto-import';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkSmartypants from 'remark-smartypants';
import dynamicImport from 'vite-plugin-dynamic-import'

import { asideAutoImport, astroAsides } from './integrations/astro-asides';
// import { theme } from './integrations/expressive-code';
// import astroExpressiveCode from 'astro-expressive-code';
import { astroDocsExpressiveCode } from './integrations/expressive-code';

import { sitemap } from './integrations/sitemap';
import { autolinkConfig } from './plugins/rehype-autolink-config';
import { rehypei18nAutolinkHeadings } from './plugins/rehype-i18n-autolink-headings';
import { rehypeOptimizeStatic } from './plugins/rehype-optimize-static';
import { rehypeTasklistEnhancer } from './plugins/rehype-tasklist-enhancer';
import { rehypeLinks } from './plugins/rehypeLinks.mjs';


// https://astro.build/config
export default defineConfig({
	site: 'https://www.azion.com/',
	trailingSlash: 'always', // for server
	build: {
		assets: '_astro_docs'
		// inlineStylesheets: 'always'
	},
	integrations: [
		AutoImport({
			imports: [asideAutoImport],
		}),
		preact({ compat: true }),
		sitemap(),
		astroAsides(),
		astroDocsExpressiveCode(),
		mdx(),
	],
	markdown: {
		// Override with our own config
		smartypants: false,
		remarkPlugins: [
			[remarkSmartypants, { dashes: false }],
			// Add our custom plugin that marks links to fallback language pages
		],
		rehypePlugins: [
			rehypeSlug,
			// This adds links to headings
			rehypeLinks,
			[rehypeAutolinkHeadings, autolinkConfig],
			// Tweak GFM task list syntax
			rehypeTasklistEnhancer(),
			// Translates the autolink headings anchors
			rehypei18nAutolinkHeadings(),
			// Collapse static parts of the hast to html
			rehypeOptimizeStatic,
		],
	},
	vite: {
		plugins: [
			dynamicImport()
		]
	}
});
