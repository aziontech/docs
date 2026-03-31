/**
 * This configures the navigation sidebar.
 * All other languages follow this ordering/structure and will fall back to
 * English for any entries they haven't translated.
 *
 * - All entries MUST include `text` and `key`
 * - Heading entries MUST include `header: true` and `type`
 * - Link entries MUST include `slug` (which excludes the language code)
 */
export default [
	{ text: 'Documentação', header: true, onlyMobile: true, anchor: true, slug: '/documentacao/', key: 'documentation' },
	{ text: 'Guias',header: true, onlyMobile: true, anchor: true, slug: '/documentacao/produtos/guias/', key: 'guides' },
	{ text: 'Dev Tools',header: true, onlyMobile: true, anchor: true, slug: '/documentacao/produtos/dev-tools/', key: 'devTools' },

	/// START HERE :::: DO NOT REMOVE the strings above, it's a work around for header on mobile /// 

	{ text: 'Visão geral', header: true, anchor: true, type: 'learn', key: 'overview', slug: '/documentacao/devtools/mcp/' },
	{ text: 'Como funciona', header: true, anchor: true, type: 'learn', key: 'howItWorks', slug: '/documentacao/devtools/mcp/como-funciona/' },
	{ text: 'Configuração', header: true, anchor: true, type: 'learn', key: 'configuration', slug: '/documentacao/devtools/mcp/configuracao/' },
	{ text: 'Exemplos', header: true, anchor: true, type: 'learn', key: 'examples', slug: '/documentacao/devtools/mcp/exemplos/' },
	{ text: 'Desenvolvimento local', header: true, anchor: true, type: 'learn', key: 'localDevelopment', slug: '/documentacao/devtools/mcp/desenvolvimento-local/' },
	{ text: 'Solução de problemas', header: true, anchor: true, type: 'learn', key: 'troubleshooting', slug: '/documentacao/devtools/mcp/solucao-de-problemas/' },
] as const;
