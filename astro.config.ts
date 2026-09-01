import { SITE_URL } from './src/consts';
import type { AstroUserConfig } from 'astro';
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
import { astroCodeBlocks, codeBlockAutoImport } from './integrations/astro-code-blocks';

import { sitemap } from './integrations/sitemap';
import { autoLinks } from './plugins/rehype-autolink-config';

import rehypeSlug from './plugins/rehype-slug-config'
import { rehypei18nAutolinkHeadings } from './plugins/rehype-i18n-autolink-headings';
import { rehypeOptimizeStatic } from './plugins/rehype-optimize-static';
import { rehypeTasklistEnhancer } from './plugins/rehype-tasklist-enhancer';
import rehypeScrollableTables from './plugins/rehype-scrollable-tables.js'

type MarkdownConfig = NonNullable<AstroUserConfig['markdown']>;

const productionBuild = import.meta.env.PROD;

export default defineConfig({
	site: SITE_URL,
	build: {
		inlineStylesheets: 'always',
		assets: '_astro_docs'
	},
	integrations: [
		AutoImport({
			imports: [
				asideAutoImport,
				codeBlockAutoImport,
				{ '~/components/Video.astro': [['default', 'Video']] },
			],
		}),
		preact({ compat: true }),
		sitemap(),
		astroAsides(),
		astroCodeBlocks(),
		mdx(),
		// No appEntrypoint: the only global Vue plugin was vue-instantsearch,
		// gone with the Algolia dialog (the palette talks to Algolia directly).
		vue()
	],
	markdown: {
		// Astro 7 defaults to the Sätteri (Rust) markdown pipeline, which does not
		// run remark/rehype plugins. Keep the unified() processor until the custom
		// plugins below are ported to Sätteri (planned as a follow-up).
		processor: unified() as unknown as MarkdownConfig['processor'],
		// Override with our own config
		smartypants: false,
		// The plugins below were written against unified 10 typings; they run
		// fine on the unified() processor but Astro 7's plugin types reject them.
		remarkPlugins: [
			[remarkSmartypants, { dashes: false }],
			// Add our custom plugin that marks links to fallback language pages
		] as MarkdownConfig['remarkPlugins'],
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
		] as MarkdownConfig['rehypePlugins'],
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
						// `@aziontech/webkit` has to be bundled, not externalised:
						// its `navigation-menu` entry is an `index.js` that imports
						// `.vue` files, and Node cannot load those on its own
						// ("Unknown file extension .vue"). Components whose entry is
						// itself a `.vue` or a `.ts` happen to work either way, which
						// is why this only surfaced when NavigationMenu was adopted.
						noExternal: ['@astrojs/vue', '@aziontech/theme', '@aziontech/webkit'],
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
      noExternal: ['@astrojs/vue', '@aziontech/theme', '@aziontech/webkit'],
      external: ['vue']
    },
		optimizeDeps: {
			include: ['vue']
		}
	}
});
