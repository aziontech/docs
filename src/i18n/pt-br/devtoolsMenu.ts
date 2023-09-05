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
	{ text: 'Learn',header: true, onlyMobile: true, anchor: true, slug: 'https://learn.azion.com/', key: 'Learn' },

	/// START HERE :::: DO NOT REMOVE the strings above, it's a work around for header on mobile /// 

	{ text: 'CLI', header: true, anchor: true, type: 'learn', key: 'devtools/cli', slug: 'documentacao/produtos/azion-cli/visao-geral' },
	{ text: 'API', header: true, anchor: true, type: 'learn', key: 'devtools/api', slug: 'https://api.azion.com/' },
	{ text: 'API GraphQL', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/graphql-api/', key: 'devtools/graphQL' },
	{ text: 'Edge Runtime',header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/edge-application/edge-functions/runtime/visao-geral/', key: 'devtools/runtime' },
	{ text: 'SDK',header: true, anchor: true, type: 'learn', slug: '/documentacao/devtools/sdk/go/', key: 'devtools/sdk' },
	{ text: 'Terraform', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/terraform-provider/', key: 'devtools/terraform' },

] as const;