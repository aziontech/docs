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
	{ text: 'Documentation', header: true, onlyMobile: true, anchor: true, slug: '/documentation/', key: 'documentation' },
	{ text: 'Guides', header: true, onlyMobile: true, anchor: true, slug: '/documentation/guides/', key: 'guides' },
	{ text: 'Dev Tools', header: true, onlyMobile: true, anchor: true, slug: '/documentation/devtools/', key: 'devTools' },

	/// START HERE :::: DO NOT REMOVE the strings above, it's a work around for header on mobile /// 

	{ text: 'Overview', header: true, anchor: true, type: 'learn', key: 'overview', slug: '/documentation/devtools/mcp/' },
	{ text: 'How it works', header: true, anchor: true, type: 'learn', key: 'howItWorks', slug: '/documentation/devtools/mcp/how-it-works/' },
	{ text: 'Configuration', header: true, anchor: true, type: 'learn', key: 'configuration', slug: '/documentation/devtools/mcp/configuration/' },
	{ text: 'Examples', header: true, anchor: true, type: 'learn', key: 'examples', slug: '/documentation/devtools/mcp/examples/' },
	{ text: 'Local Development', header: true, anchor: true, type: 'learn', key: 'localDevelopment', slug: '/documentation/devtools/mcp/local-development/' },
	{ text: 'Troubleshooting', header: true, anchor: true, type: 'learn', key: 'troubleshooting', slug: '/documentation/devtools/mcp/troubleshooting/' },
] as const;
