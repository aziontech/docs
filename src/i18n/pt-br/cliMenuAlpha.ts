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
	{ text: 'Documentação', header: true, onlyMobile: true, anchor: true, slug: '/documentacao/', key: 'documentation' },
	{ text: 'Guias', header: true, onlyMobile: true, anchor: true, slug: '/documentacao/produtos/guias/', key: 'guides' },
	{ text: 'Dev Tools', header: true, onlyMobile: true, anchor: true, slug: '/documentacao/produtos/dev-tools/', key: 'devTools' },
	/// START HERE :::: DO NOT REMOVE the strings above, it's a work around for header on mobile /// 

	{ text: 'Visão geral', header: true, anchor: true, type: 'learn', key: 'overview', slug: '/documentacao/produtos/azion-cli/visao-geral/', hasLabel:'menu.cli' },

	{ text: 'Init, build e deploy', header: true, anchor: true, slug: '/documentacao/produtos/azion-cli/criar-application/', key: 'cli/createJourney' },
	{ text: 'Dev', header: true, anchor: true, slug: '/documentacao/produtos/azion-cli/dev-comando/', key: 'cli/localDev' },
	{ text: 'Link', header: true, anchor: true, slug: '/documentacao/produtos/azion-cli/link-comando/', key: 'cli/link' },
	{ text: 'Login', header: true, anchor: true, slug: '/documentacao/produtos/cli/login/', key: 'cli/login' },
	{ text: 'Logout', header: true, anchor: true, slug: '/documentacao/produtos/cli/logout/', key: 'cli/logout' },
	{ text: 'Create', header: true, anchor: true, slug: '/documentacao/devtools/cli/create/', key: 'cli/create' },
	{ text: 'List', header: true, anchor: true, slug: '/documentacao/devtools/cli/list/', key: 'cli/list' },
	{ text: 'Describe', header: true, anchor: true, slug: '/documentacao/devtools/cli/describe/', key: 'cli/describe' },
	{ text: 'Update', header: true, anchor: true, slug: '/documentacao/devtools/cli/update/', key: 'cli/update' },
	{ text: 'Delete', header: true, anchor: true, slug: '/documentacao/devtools/cli/delete/', key: 'cli/delete' },

	{
		text: 'Guias específicos por framework', header: true, type: 'learn', key: 'cli/frameworks', children: [
			{ text: 'Angular', slug: '/documentacao/produtos/cli/frameworks/angular/', key: 'cli/angular' },
			{ text: 'Astro', slug: '/documentacao/produtos/cli/frameworks/astro/', key: 'cli/astro' },
			{ text: 'Hexo', slug: '/documentacao/produtos/cli/frameworks/hexo/', key: 'cli/hexo' },
			{ text: 'Next', slug: '/documentacao/produtos/cli/frameworks/next/', key: 'cli/next' },
			{ text: 'React', slug: '/documentacao/produtos/cli/frameworks/react/', key: 'cli/react' },
			{ text: 'Vite', slug: '/documentacao/produtos/cli/frameworks/vite/', key: 'cli/vite' },
			{ text: 'Vue', slug: '/documentacao/produtos/cli/frameworks/vue/', key: 'cli/vue' },

		]
	},


] as const;
