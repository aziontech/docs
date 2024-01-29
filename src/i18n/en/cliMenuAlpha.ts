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
	{ text: 'Dev Tools', header: true, onlyMobile: true, anchor: true, type: 'learn', slug: '/documentation/devtools/', key: 'devTools' },

	/// START HERE :::: DO NOT REMOVE the strings above, it's a work around for header on mobile /// 

	{ text: 'Overview', header: true, anchor: true, type: 'learn', key: 'overview', slug: '/documentation/products/azion-cli/overview/', hasLabel:'menu.cli' },

	{ text: 'Init, build, and deploy', header: true, anchor: true, slug: '/documentation/products/azion-cli/create-application/', key: 'cli/createJourney' },
	{ text: 'Dev', header: true, anchor: true, slug: '/documentation/products/cli/dev-command/', key: 'cli/localDev' },
	{ text: 'Link', header: true, anchor: true, slug: '/documentation/products/cli/link-command/', key: 'cli/link' },
	{ text: 'Cache Settings', header: true, anchor: true, slug: '/documentation/products/cli/cache-settings-crud/', key: 'cli/cache' },
	{ text: 'Domains', header: true, anchor: true, slug: '/documentation/products/cli/domains-crud/', key: 'cli/domains' },
	{ text: 'Edge Application', header: true, anchor: true, slug: '/documentation/products/cli/edge-application/', key: 'cli/edgeApp' },
	{ text: 'Edge Functions', header: true, anchor: true, slug: '/documentation/products/cli/edge-functions-crud/', key: 'cli/functions' },
	{ text: 'Origins', header: true, anchor: true, slug: '/documentation/products/cli/origins-crud/', key: 'cli/origins' },
	{ text: 'Personal Tokens', header: true, anchor: true, slug: '/documentation/products/cli/personal-tokens/', key: 'cli/personalTokens' },
	{ text: 'Rules Engine', header: true, anchor: true, slug: '/documentation/products/cli/rules-engine-crud/', key: 'cli/rules' },
	{ text: 'Login', header: true, anchor: true, slug: '/documentation/products/cli/login/', key: 'cli/login' },
	{ text: 'Logout', header: true, anchor: true, slug: '/documentation/products/cli/logout/', key: 'cli/logout' },


	{
        text: 'Framework specific guides', header: true, type: 'learn', key: 'cli/frameworks', children: [
            { text: 'Angular', header: true, anchor: true, type: 'learn', slug: '/documentation/products/cli/frameworks/angular/', key: 'cli/angular' },
            { text: 'Astro', header: true, anchor: true, type: 'learn', slug: '/documentation/products/cli/frameworks/astro/', key: 'cli/astro' },
            { text: 'Hexo', header: true, anchor: true, type: 'learn', slug: '/documentation/products/cli/frameworks/hexo/', key: 'cli/hexo' },
            { text: 'Next', header: true, anchor: true, type: 'learn', slug: '/documentation/products/cli/frameworks/next/', key: 'cli/next' },
			{ text: 'React', header: true, anchor: true, type: 'learn', slug: '/documentation/products/cli/frameworks/react/', key: 'cli/react' },
			{ text: 'Vite', header: true, anchor: true, type: 'learn', slug: '/documentation/products/cli/frameworks/vite/', key: 'cli/vite' },
            { text: 'Vue', header: true, anchor: true, type: 'learn', slug: '/documentation/products/cli/frameworks/vue/', key: 'cli/vue' },
        ]
    },

] as const;
