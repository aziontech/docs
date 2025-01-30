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
	{ text: 'Documentation', header: true, onlyMobile: true, anchor: true, type: 'learn', slug: '/documentation/', key: 'documentation' },
	{ text: 'Guides', header: true, onlyMobile: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/', key: 'guides' },
	{ text: 'Dev Tools', header: true, onlyMobile: true, anchor: true, type: 'learn', slug: '/documentation/devtools/', key: 'devTools' },

	/// START HERE :::: DO NOT REMOVE the strings above, it's a work around for header on mobile /// 

	{ text: 'Overview', header: true, anchor: true, type: 'learn', key: 'overview', slug: '/documentation/products/azion-lib/overview' },
	{ text: 'Usage', header: true, type: 'learn', key: 'usage', items: [
		{ text: 'Client', slug: '/documentation/products/azion-lib/client/', key: 'usage/`client`' },
		{ text: 'Config', key: 'usage/config', slug: '/documentation/products/azion-lib/config/' },
		{ text: 'Cookies', header: true, key: 'usage/cookies', slug: '/documentation/products/azion-lib/cookies/' },
		{ text: 'Domains', header: true, key: 'usage/domains', slug: '/documentation/products/azion-lib/domains/' },
		{ text: 'JWT', header: true, key: 'usage/jwt', slug: '/documentation/products/azion-lib/jwt/' },
		{ text: 'Purge', header: true, key: 'usage/purge', slug: '/documentation/products/azion-lib/purge/' },
		{ text: 'SQL', header: true, key: 'usage/sql', slug: '/documentation/products/azion-lib/sql/' },
		{ text: 'Storage', header: true, key: 'usage/store', slug: '/documentation/products/azion-lib/storage/' },
		{ text: 'Types', header: true, key: 'usage/types', slug: '/documentation/products/azion-lib/types/' },
		{ text: 'Utils', header: true, key: 'usage/utils', slug: '/documentation/products/azion-lib/utils/' },
		{ text: 'WASM Image Processor', header: true, key: 'usage/wasm-image-processor', slug: '/documentation/products/azion-lib/wasm-image-processor/' },
	] },
	
] as const;
