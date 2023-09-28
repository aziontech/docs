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
	{ text: 'Guias',header: true, onlyMobile: true, anchor: true, slug: '/documentacao/produtos/guias/', key: 'guides' },
	{ text: 'Dev Tools',header: true, onlyMobile: true, anchor: true, slug: '/documentacao/produtos/dev-tools/', key: 'devTools' },
	{ text: 'Learn',header: true, onlyMobile: true, anchor: true, slug: 'https://learn.azion.com/', key: 'Learn' },
	/// START HERE :::: DO NOT REMOVE the strings above, it's a work around for header on mobile /// 

	{ text: 'Visão geral', header: true, anchor: true, type: 'learn', key: 'overview', slug: '/documentacao/produtos/azion-cli/visao-geral/' },

	{ text: 'Init, build e deploy', header: true, anchor: true, slug: '/documentacao/produtos/azion-cli/criar-application/', key: 'cli/createJourney' },
	{ text: 'Comando dev', header: true, anchor: true, slug: '/documentacao/produtos/azion-cli/dev-comando/', key: 'cli/localDev' },
	{ text: 'Comando link', header: true, anchor: true, slug: '/documentacao/produtos/azion-cli/link-comando/', key: 'cli/link' },
	{ text: 'Comando personal tokens', header: true, anchor: true, slug: '/documentacao/produtos/azion-cli/personal-tokens/', key: 'cli/personalTokens' },


] as const;
