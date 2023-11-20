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
	{ text: 'Learn', header: true, onlyMobile: true, anchor: true, slug: 'https://learn.azion.com/', key: 'Learn' },
	/// START HERE :::: DO NOT REMOVE the strings above, it's a work around for header on mobile /// 

	{ text: 'Visão geral', header: true, anchor: true, type: 'learn', key: 'overview', slug: '/documentacao/produtos/azion-cli/visao-geral/' },

	{ text: 'Init, build e deploy', header: true, anchor: true, slug: '/documentacao/produtos/azion-cli/criar-application/', key: 'cli/createJourney' },
	{ text: 'Comando dev', header: true, anchor: true, slug: '/documentacao/produtos/azion-cli/dev-comando/', key: 'cli/localDev' },
	{ text: 'Comando link', header: true, anchor: true, slug: '/documentacao/produtos/azion-cli/link-comando/', key: 'cli/link' },
	{ text: 'Comando personal tokens', header: true, anchor: true, slug: '/documentacao/produtos/azion-cli/personal-tokens/', key: 'cli/personalTokens' },
	{ text: 'Edge application', header: true, anchor: true, slug: '/documentacao/produtos/cli/edge-application-crud/', key: 'cli/edgeApp' },

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
