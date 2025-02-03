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
	{ text: 'Usage', header: true, type: 'learn', key: 'usage', items: [
		{ text: 'Client', slug: '/documentation/products/azion-lib/client/', key: 'usage/`client`' },
		{ text: 'Config', key: 'usage/config', slug: '/documentation/products/azion-lib/config/' },
		{ text: 'Cookies', header: true, key: 'usage/cookies', slug: '/documentation/products/azion-lib/cookies/' },
		{ text: 'Domains', header: true, key: 'usage/domains', slug: '/documentation/products/azion-lib/domains/' },
	] },
	
] as const;
