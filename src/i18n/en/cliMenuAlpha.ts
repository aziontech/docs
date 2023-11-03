/**
 * This configures the navigation sidebar.
 * All other languages follow this ordering/structure and will fall back to
 * English for any entries they haven’t translated.
 *
 * - All entries MUST include `text` and `key`
 * - Heading entries MUST include `header: true` and `type`
 * - Link entries MUST include `slug` (which excludes the language code)
 */
export default [
	{ text: 'Documentation', header: true, onlyMobile: true, anchor: true, type: 'learn', slug: '/documentation/', key: 'documentation' },
	{ text: 'Guides', header: true, onlyMobile: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/', key: 'guides' },
	{ text: 'Dev Tools', header: true, onlyMobile: true, anchor: true, type: 'learn', slug: '/documentation/products/dev-tools/', key: 'devTools' },
	{ text: 'Learn', header: true, onlyMobile: true, anchor: true, type: 'learn', slug: 'https://learn.azion.com/', key: 'Learn' },

	/// START HERE :::: DO NOT REMOVE the strings above, it's a work around for header on mobile /// 

	{ text: 'Overview', header: true, anchor: true, type: 'learn', key: 'overview', slug: '/documentation/products/azion-cli/overview/' },

	{ text: 'Init, build, and deploy', header: true, anchor: true, slug: '/documentation/products/azion-cli/create-application/', key: 'cli/createJourney' },
	{ text: 'Dev command', header: true, anchor: true, slug: '/documentation/products/cli/dev-command/', key: 'cli/localDev' },
	{ text: 'Link command', header: true, anchor: true, slug: '/documentation/products/cli/link-command/', key: 'cli/link' },
	{ text: 'Personal tokens command', header: true, anchor: true, slug: '/documentation/products/cli/personal-tokens/', key: 'cli/personalTokens' },

	{
        text: 'Framework specific guides', header: true, type: 'learn', key: 'cli/frameworks', children: [
            { text: 'Angular', header: true, anchor: true, type: 'learn', slug: '/documentation/products/build/develop-with-azion/frameworks-specific/angular/', key: 'cli/angular' },
            { text: 'Astro', header: true, anchor: true, type: 'learn', slug: '/documentation/products/build/develop-with-azion/frameworks-specific/astro/', key: 'cli/astro' },
            { text: 'Hexo', header: true, anchor: true, type: 'learn', slug: '/documentation/products/build/develop-with-azion/frameworks-specific/hexo/', key: 'cli/hexo' },
            { text: 'Next', header: true, anchor: true, type: 'learn', slug: '/documentation/products/build/develop-with-azion/frameworks-specific/next/', key: 'cli/next' },
			{ text: 'React', header: true, anchor: true, type: 'learn', slug: '/documentation/products/build/develop-with-azion/frameworks-specific/react/', key: 'cli/react' },
			{ text: 'Vite', header: true, anchor: true, type: 'learn', slug: '/documentation/products/build/develop-with-azion/frameworks-specific/vite/', key: 'cli/vite' },
            { text: 'Vue', header: true, anchor: true, type: 'learn', slug: '/documentation/products/build/develop-with-azion/frameworks-specific/vue/', key: 'cli/vue' },
        ]
    },

] as const;
