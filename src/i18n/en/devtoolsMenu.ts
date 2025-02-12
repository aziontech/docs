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

	{ text: 'CLI', header: true, anchor: true, type: 'learn', key: 'devtools/cli', slug: '/documentation/products/azion-cli/overview/', hasLabel:'menu.devTools' },
	{ text: 'Azion Lib', header: true, anchor: true, type: 'learn', key: 'devtools/azionlib', slug: '/documentation/products/azion-lib/overview/'},
	{ text: 'API', header: true, anchor: true, type: 'learn', key: 'devtools/api', slug: 'https://api.azion.com/' },
	{ text: 'API GraphQL', header: true, anchor: true, type: 'learn', slug: '/documentation/devtools/graphql-api/', key: 'devtools/graphQL' },
	{ text: 'SDK',header: true, anchor: true, type: 'learn', slug: '/documentation/devtools/sdk/go/', key: 'devtools/sdk' },
	{ text: 'Terraform', header: true, anchor: true, type: 'learn', slug: '/documentation/products/terraform-provider/', key: 'devtools/terraform' },
	{ text: 'Console Kit', header: true, anchor: true, type: 'learn', slug: '/documentation/devtools/console-kit/', key: 'devtools/consoleKit' },

] as const;
