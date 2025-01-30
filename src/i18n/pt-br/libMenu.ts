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
		{ text: 'Config', key: 'usage/config', slug: '/documentacao/produtos/azion-lib/config/' },
		{ text: 'Cookies', header: true, key: 'usage/cookies', slug: '/documentacao/produtos/azion-lib/cookies/' },
		{ text: 'Domains', header: true, key: 'usage/domains', slug: '/documentacao/produtos/azion-lib/domains/' },
		{ text: 'JWT', header: true, key: 'usage/jwt', slug: '/documentacao/produtos/azion-lib/jwt/' },
		{ text: 'Purge', header: true, key: 'usage/purge', slug: '/documentacao/produtos/azion-lib/purge/' },
		{ text: 'SQL', header: true, key: 'usage/sql', slug: '/documentacao/produtos/azion-lib/sql/' },
		{ text: 'Storage', header: true, key: 'usage/store', slug: '/documentacao/produtos/azion-lib/storage/' },
		{ text: 'Types', header: true, key: 'usage/types', slug: '/documentacao/produtos/azion-lib/types/' },
		{ text: 'Utils', header: true, key: 'usage/utils', slug: '/documentacao/produtos/azion-lib/utils/' },
		{ text: 'WASM Image Processor', header: true, key: 'usage/wasm-image-processor', slug: '/documentacao/produtos/azion-lib/wasm-image-processor/' },
	] },
] as const;
