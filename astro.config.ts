import { defineConfig } from 'astro/config';

import dynamicImport from 'vite-plugin-dynamic-import';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import vue from '@astrojs/vue';

import preact from '@astrojs/preact';

import AutoImport from 'astro-auto-import';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkSmartypants from 'remark-smartypants';

import { asideAutoImport, astroAsides } from './integrations/astro-asides';
import { astroDocsExpressiveCode } from './integrations/expressive-code';

import { sitemap } from './integrations/sitemap';
import { autolinkConfig } from './plugins/rehype-autolink-config';

import rehypeSlug from './plugins/rehype-slug-config'
import { rehypei18nAutolinkHeadings } from './plugins/rehype-i18n-autolink-headings';
import { rehypeOptimizeStatic } from './plugins/rehype-optimize-static';
import { rehypeTasklistEnhancer } from './plugins/rehype-tasklist-enhancer';
import { rehypeLinks } from './plugins/rehypeLinks.mjs';


export default defineConfig({
	site: 'https://docs.azion.com/',
	trailingSlash: 'always',
	build: {
		assets: '_astro_docs'
	},
	integrations: [
		AutoImport({ imports: [asideAutoImport] }),
		preact({ compat: true }),
		sitemap(),
		astroAsides(),

		astroDocsExpressiveCode(),
		mdx(),
		tailwind({ applyBaseStyles: false }),
		vue({ appEntrypoint: '/src/_vue.config.js' })
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
		]
	},
	vite: {
		ssrBuild: true,
		ssr: {
      noExternal: [
        '@astrojs/vue',
        '@aziontech/azion-web-kit'
      ],
      external: [
        'algoliasearch',
        'instantsearch.js',
        'vue-instantsearch/vue3/es',
      ]
    },
    server: {
      fs: {
        allow: ['..']
      }
    },
		plugins: [
			dynamicImport()
		]
	}
});
