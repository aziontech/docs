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

	{ text: 'Overview', header: true, anchor: true, type: 'learn', key: 'overview', slug: '/documentation/products/azion-lib/overview' },

	{ text: 'Usage', header: true, key: 'commands', type: 'learn', items: [
		{ text: 'Ai Client', slug: '/documentation/products/azion-lib/ai-client/', key: 'usage/ai-client' },
		{ text: 'Application', slug: '/documentation/products/azion-lib/application/', key: 'usage/application' },
		{ text: 'Client', slug: '/documentation/products/azion-lib/client/', key: 'usage/client' },
		{ text: 'Config', slug: '/documentation/products/azion-lib/config/', key: 'usage/config' },
		{ text: 'Cookies', slug: '/documentation/products/azion-lib/cookies/', key: 'usage/cookies' },
		{ text: 'Domains', slug: '/documentation/products/azion-lib/domains/', key: 'usage/domains' },
		{ text: 'JWT', slug: '/documentation/products/azion-lib/jwt/', key: 'usage/jwt' },
		{ text: 'Purge', slug: '/documentation/products/azion-lib/purge/', key: 'usage/purge' },
		{ text: 'SQL', slug: '/documentation/products/azion-lib/sql/', key: 'usage/sql' },
		{ text: 'Storage', slug: '/documentation/products/azion-lib/storage/', key: 'usage/storage' },
		{ text: 'Types', slug: '/documentation/products/azion-lib/types/', key: 'usage/types' },
		{ text: 'Unenv', slug: '/documentation/products/azion-lib/unenv/', key: 'usage/unenv' },
		{ text: 'Utils', slug: '/documentation/products/azion-lib/utils/', key: 'usage/utils' },
		{ text: 'WASM Image Processor', slug: '/documentation/products/azion-lib/wasm-image-processor/', key: 'usage/wasm' },
	] },
] as const;
