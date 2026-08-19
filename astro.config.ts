import { SITE_URL } from './src/consts';
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';
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
		AutoImport({
			imports: [asideAutoImport, { '~/components/Video.astro': [['default', 'Video']] }],
		}),
		preact({ compat: true }),
		sitemap(),
		astroAsides(),
		AzionExpressiveCode(),
		mdx(),
		vue({ appEntrypoint: '/src/vue.config.js' })
	],
	markdown: {
		// Astro 7 defaults to the Sätteri (Rust) markdown pipeline, which does not
		// run remark/rehype plugins. Keep the unified() processor until the custom
		// plugins below are ported to Sätteri (planned as a follow-up).
		processor: unified() as any,
		// Override with our own config
		smartypants: false,
		// The plugins below were written against unified 10 typings; they run
		// fine on the unified() processor but Astro 7's plugin types reject them.
		remarkPlugins: [
			[remarkSmartypants, { dashes: false }],
			// Add our custom plugin that marks links to fallback language pages
		] as any,
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
		] as any
	},
	compressHTML: productionBuild ? true : false,
	trailingSlash: 'always', // for server
	vite: {
		server: {
      fs: {
        allow: ['..']
      }
    },
	plugins: [
		tailwindcss(),
		{
			// Astro 7 renders static pages in a dedicated `prerender` Vite
			// environment that does not inherit the legacy `ssr.noExternal`
			// list (and Astro overwrites `environments.prerender` wholesale in
			// its build config).
			name: 'azion:server-noexternal',
			configEnvironment(name: string) {
				if (name === 'client') return null;
				return {
					resolve: {
						noExternal: ['@astrojs/vue', 'azion-theme'],
						external: ['vue']
					}
				};
			}
		},
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
      noExternal: ['@astrojs/vue', 'azion-theme'],
      external: ['vue']
    },
		optimizeDeps: {
			include: ['vue']
		}
	}
});
