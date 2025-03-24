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
	{ text: 'SDK',header: true, anchor: true, type: 'learn', slug: '/documentacao/devtools/sdk/go/', key: 'devtools/sdk' },
	{ text: 'Terraform', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/terraform-provider/', key: 'devtools/terraform' },


] as const;
