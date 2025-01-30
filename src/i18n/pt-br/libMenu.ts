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
	{ text: 'Documentação', header: true, onlyMobile: true, anchor: true, type: 'learn', slug: '/documentacao/', key: 'documentation' },
	{ text: 'Guias', header: true, onlyMobile: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/guias/', key: 'guides' },
	{ text: 'Dev Tools', header: true, onlyMobile: true, anchor: true, type: 'learn', slug: '/documentacao/devtools/', key: 'devTools' },

	/// START HERE :::: DO NOT REMOVE the strings above, it's a work around for header on mobile /// 

	{ text: 'Visão Geral', header: true, anchor: true, type: 'learn', key: 'overview', slug: '/documentacao/produtos/azion-lib/overview' },
	{ text: 'Uso', header: true, type: 'learn', key: 'usage', items: [
		{ text: 'Client', slug: '/documentacao/produtos/azion-lib/client/', key: 'usage/`client`' },
	] },
] as const;
