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
	{ text: 'API', header: true, anchor: true, type: 'learn', key: 'devtools/api', slug: 'https://api.azion.com/', hasLabel:'menu.devTools' },
	{ text: 'API GraphQL', header: true, anchor: true, type: 'learn', slug: '/documentacao/devtools/graphql-api/', key: 'devtools/graphQL' },
	{ text: 'Azion Lib', header: true, anchor: true, type: 'learn', key: 'devtools/azionlib', slug: '/documentacao/produtos/azion-lib/visao-geral/' },
	{ text: 'CLI', header: true, anchor: true, type: 'learn', key: 'devtools/cli', slug: 'documentacao/produtos/azion-cli/visao-geral' },
	{ text: 'Console Kit', header: true, anchor: true, type: 'learn', slug: '/documentacao/devtools/console-kit/', key: 'devtools/consoleKit' },
	{ text: 'MCP', header: true, anchor: true, type: 'learn', slug: '/documentacao/devtools/mcp/', key: 'devtools/mcp' },
	{ text: 'SDK',header: true, anchor: true, type: 'learn', slug: '/documentacao/devtools/sdk/go/', key: 'devtools/sdk' },
	{ text: 'Terraform', header: true, anchor: true, type: 'learn', key: 'devtools/terraform', items: [
		{ text: 'Visão geral', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/terraform-provider/', key: 'devtools/terraform/overview' },
		{ text: 'Primeiros passos', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/terraform-provider/getting-started/', key: 'devtools/terraform/getting-started' },
		{ text: 'Exemplos', header: true, anchor: true, type: 'learn', key: 'devtools/terraform/examples', items: [
			{ text: 'Explorando recursos', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/terraform-provider/examples/', key: 'devtools/terraform/examples/overview' },
			{ text: 'Workloads', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/terraform-provider/resources/workloads/', key: 'devtools/terraform/examples/workloads' },
			{ text: 'Connectors', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/terraform-provider/resources/connectors/', key: 'devtools/terraform/examples/connectors' },
			{ text: 'Applications', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/terraform-provider/resources/applications/', key: 'devtools/terraform/examples/applications' },
			{ text: 'Security', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/terraform-provider/resources/security/', key: 'devtools/terraform/examples/security' },
			{ text: 'DNS', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/terraform-provider/resources/dns/', key: 'devtools/terraform/examples/dns' },
			{ text: 'Certificates', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/terraform-provider/resources/certificates/', key: 'devtools/terraform/examples/certificates' },
		]},
		{ text: 'Melhores práticas', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/terraform-provider/best-practices/', key: 'devtools/terraform/best-practices' },
		{ text: 'Migração V3 para V4', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/terraform-provider/migration-v3-to-v4/', key: 'devtools/terraform/migration' },
	]},

] as const;
