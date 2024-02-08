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
	{ text: 'Login', header: true, anchor: true, slug: '/documentation/products/cli/login/', key: 'cli/login' },
	{ text: 'Logout', header: true, anchor: true, slug: '/documentation/products/cli/logout/', key: 'cli/logout' },
	{ text: 'Create', header: true, anchor: true, slug: '/documentation/devtools/cli/create/', key: 'cli/create' },
	{ text: 'List', header: true, anchor: true, slug: '/documentation/devtools/cli/list/', key: 'cli/list' },
	{ text: 'Describe', header: true, anchor: true, slug: '/documentation/devtools/cli/describe/', key: 'cli/describe' },
	{ text: 'Update', header: true, anchor: true, slug: '/documentation/devtools/cli/update/', key: 'cli/update' },
	{ text: 'Delete', header: true, anchor: true, slug: '/documentation/devtools/cli/delete/', key: 'cli/delete' },






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
