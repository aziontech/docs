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
	{ text: 'API', header: true, anchor: true, type: 'learn', key: 'devtools/api', slug: 'https://api.azion.com/', hasLabel:'menu.devTools' },
	{ text: 'API GraphQL', header: true, anchor: true, type: 'learn', slug: '/documentation/devtools/graphql-api/', key: 'devtools/graphQL' },
	{ text: 'Azion Lib', header: true, anchor: true, type: 'learn', key: 'devtools/azionlib', slug: '/documentation/products/azion-lib/overview/' },
	{ text: 'CLI', header: true, anchor: true, type: 'learn', key: 'devtools/cli', slug: 'documentation/products/azion-cli/overview' },
	{ text: 'Console Kit', header: true, anchor: true, type: 'learn', slug: '/documentation/devtools/console-kit/', key: 'devtools/consoleKit' },
	{ text: 'SDK', header: true, anchor: true, type: 'learn', slug: '/documentation/devtools/sdk/go/', key: 'devtools/sdk' },
	{ text: 'Terraform', header: true, anchor: true, type: 'learn', key: 'devtools/terraform', items: [
		{ text: 'Overview', header: true, anchor: true, type: 'learn', slug: '/documentation/products/terraform-provider/', key: 'devtools/terraform/overview' },
		{ text: 'Getting Started', header: true, anchor: true, type: 'learn', slug: '/documentation/products/terraform-provider/getting-started/', key: 'devtools/terraform/getting-started' },
		{ text: 'Examples', header: true, anchor: true, type: 'learn', key: 'devtools/terraform/examples', items: [
			{ text: 'Exploring Resources', header: true, anchor: true, type: 'learn', slug: '/documentation/products/terraform-provider/examples/', key: 'devtools/terraform/examples/overview' },
			{ text: 'Workloads', header: true, anchor: true, type: 'learn', slug: '/documentation/products/terraform-provider/resources/workloads/', key: 'devtools/terraform/examples/workloads' },
			{ text: 'Connectors', header: true, anchor: true, type: 'learn', slug: '/documentation/products/terraform-provider/resources/connectors/', key: 'devtools/terraform/examples/connectors' },
			{ text: 'Applications', header: true, anchor: true, type: 'learn', slug: '/documentation/products/terraform-provider/resources/applications/', key: 'devtools/terraform/examples/applications' },
			{ text: 'Security', header: true, anchor: true, type: 'learn', slug: '/documentation/products/terraform-provider/resources/security/', key: 'devtools/terraform/examples/security' },
			{ text: 'DNS', header: true, anchor: true, type: 'learn', slug: '/documentation/products/terraform-provider/resources/dns/', key: 'devtools/terraform/examples/dns' },
			{ text: 'Certificates', header: true, anchor: true, type: 'learn', slug: '/documentation/products/terraform-provider/resources/certificates/', key: 'devtools/terraform/examples/certificates' },
		]},
		{ text: 'Best Practices', header: true, anchor: true, type: 'learn', slug: '/documentation/products/terraform-provider/best-practices/', key: 'devtools/terraform/best-practices' },
		{ text: 'Migration V3 to V4', header: true, anchor: true, type: 'learn', slug: '/documentation/products/terraform-provider/migration-v3-to-v4/', key: 'devtools/terraform/migration' },
	]},

] as const;
