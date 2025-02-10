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

	/// START HERE :::: DO NOT REMOVE the strings above, it's a work around for header on mobile /// 

	{ text: 'Visão Geral', header: true, anchor: true, type: 'learn', key: 'overview', slug: '/documentacao/produtos/azion-lib/overview' },

	{ text: 'Uso', header: true, key: 'commands', type: 'learn', items: [
		{ text: 'Client', slug: '/documentacao/produtos/azion-lib/client/', key: 'usage/client' },
		{ text: 'Config', slug: '/documentacao/produtos/azion-lib/config/', key: 'usage/config' },
		{ text: 'Cookies', slug: '/documentacao/produtos/azion-lib/cookies/', key: 'usage/cookies' },
		{ text: 'Domains', slug: '/documentacao/produtos/azion-lib/domains/', key: 'usage/domains' },
		{ text: 'JWT', slug: '/documentacao/produtos/azion-lib/jwt/', key: 'usage/jwt' },
		{ text: 'Purge', slug: '/documentacao/produtos/azion-lib/purge/', key: 'usage/purge' },
		{ text: 'SQL', slug: '/documentacao/produtos/azion-lib/sql/', key: 'usage/sql' },
		{ text: 'Storage', slug: '/documentacao/produtos/azion-lib/storage/', key: 'usage/storage' },
		{ text: 'Types', slug: '/documentacao/produtos/azion-lib/types/', key: 'usage/types' },
		{ text: 'Utils', slug: '/documentacao/produtos/azion-lib/utils/', key: 'usage/utils' },
		{ text: 'WASM Image Processor', slug: '/documentacao/produtos/azion-lib/wasm-image-processor/', key: 'usage/wasm' },
	] },
] as const;
