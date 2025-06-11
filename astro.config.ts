import { SITE_URL } from './src/consts';
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import vue from '@astrojs/vue';
import preact from '@astrojs/preact';
import AutoImport from 'astro-auto-import';

import cssnano from 'cssnano';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkSmartypants from 'remark-smartypants';

import { asideAutoImport, astroAsides } from './integrations/astro-asides';
import AzionExpressiveCode from './integrations/expressive-code';

import { sitemap } from './integrations/sitemap';
import { autoLinks } from './plugins/rehype-autolink-config';

import rehypeSlug from './plugins/rehype-slug-config'
import { rehypei18nAutolinkHeadings } from './plugins/rehype-i18n-autolink-headings';
import { rehypeOptimizeStatic } from './plugins/rehype-optimize-static';
import { rehypeTasklistEnhancer } from './plugins/rehype-tasklist-enhancer';
import rehypeScrollableTables from './plugins/rehype-scrollable-tables.js'

const productionBuild = import.meta.env.PROD;

export default defineConfig({
	site: SITE_URL,
	build: {
		inlineStylesheets: 'always',
		assets: '_astro_docs'
	},
	integrations: [
		AutoImport({ imports: [asideAutoImport] }),
		preact({ compat: true }),
		sitemap(),
		astroAsides(),
		AzionExpressiveCode(),
		mdx(),
		tailwind({ applyBaseStyles: false }),
		vue({ appEntrypoint: '/src/vue.config.js' })
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
			rehypeScrollableTables,
			// This adds links to headings
			// rehypeLinks, // disabling target Blank
			[rehypeAutolinkHeadings, autoLinks],
			// Tweak GFM task list syntax
			rehypeTasklistEnhancer(),
			// Translates the autolink headings anchors
			rehypei18nAutolinkHeadings(),
			// Collapse static parts of the hast to html
			rehypeOptimizeStatic,
		]
	},
	compressHTML: productionBuild ? true : false,
	trailingSlash: 'always', // for server
	vite: {
		ssrBuild: true,
		server: {
      fs: {
        allow: ['..']
      }
    },
	plugins: [
		cssnano({
			preset: [
			'default', {
				discardComments: { removeAll: true },
				minifyFontValues: { removeQuotes: false }
			}
			]
		})
	],
	ssr: {
      noExternal: ['@astrojs/vue', 'azion-webkit', 'azion-theme'],
      external: ['vue']
    },
		optimizeDeps: {
			include: ['vue', 'primevue/config']
		}
	}
});
