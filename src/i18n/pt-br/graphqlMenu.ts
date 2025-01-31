
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
	{ text: 'Documentação', header: true, onlyMobile: true, anchor: true, slug: '/documentacao/', key: 'documentation' },
	{ text: 'Guias',header: true, onlyMobile: true, anchor: true, slug: '/documentacao/produtos/guias/', key: 'guides' },
	{ text: 'Dev Tools',header: true, onlyMobile: true, anchor: true, slug: '/documentacao/produtos/dev-tools/', key: 'devTools' },

	/// START HERE :::: DO NOT REMOVE the strings above, it's a work around for header on mobile /// 

	{ text: 'Visão geral', header: true, anchor: true, type: 'learn', key: 'overview', slug: '/documentacao/produtos/graphql-api/visao-geral' },
	{ text: 'Primeiros passos', header: true, anchor: true, type: 'learn', key: 'firstSteps', slug: '/documentacao/produtos/graphql-api-primeiros-passos' },
	{ text: 'Queries', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/graphql-api-queries', key: 'queries' },
	{ text: 'Exemplos de queries' , header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/graphql-api-exemplos-queries', key: 'queries/examples' },
	{ text: 'Recursos', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/graphql-api-recursos', key: 'features' },

	{ text: 'Campos', header: true, key: 'fields', type: 'learn', items: [
		{ text: 'Real-Time Events GQL', slug: '/documentacao/devtools/graphql-api/recursos/campos-gql-real-time-events/', key: 'fields/Events' },
		{ text: 'Real-Time Metrics GQL', slug: '/documentacao/devtools/graphql-api/recursos/campos-gql-real-time-metrics/', key: 'fields/Metrics' },
		{ text: 'Billing GQL', slug: '/documentacao/devtools/graphql-api/recursos/campos-gql-billing/', key: 'fields/Billing' },
		{ text: 'Accounting GQL', slug: '/documentacao/devtools/graphql-api/recursos/campos-gql-accounting/', key: 'fields/Accounting' },
	]
},

	{ text: 'Limites', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/graphql-api-limites', key: 'limits' },
	{ text: 'Mensagens de erro', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/graphql-api-mensagens-erro', key: 'queries/error-responses' },

	{ text: 'Guias', header: true, type: 'learn', key: 'guides', items: [
		{ text: 'Como rodar requisições da GraphQL no Postman', slug: '/documentacao/produtos/guias/consultar-graphql-postman', key: 'guides/graphql-postman' },
		{ text: 'Como consultar metadados', slug: '/documentacao/produtos/guias/graphql-metadados', key: 'guides/graphql-metadata' },
		{ text: 'Como realizar consultas agregando dados', slug: '/documentacao/produtos/guias/graphql-dados-agregados', key: 'guides/graphql-aggregated-data' },
		{ text: 'Como selecionar Top X queries', slug: '/documentacao/produtos/guias/graphql-query-top-x', key: 'guides/graphql-top-x' },
		{ text: 'Como consultar dados de usuários conectados', slug: '/documentacao/produtos/guias/query-dados-connected-users-com-graphql/', key: 'guides/connected-users-graphql' },
		{ text: 'Como consultar dados do Bot Manager', slug: '/documentacao/produtos/guias/consultar-dados-bot-manager-com-graphql/', key: 'guides/bot-data-graphql' },
		{ text: 'Como consultar as principais URLs impactadas por bots', slug: '/documentacao/produtos/guias/consultar-dados-bot-manager-breakdown-com-graphql/', key: 'guides/bot-breakdown-data-graphql' }
	] },


];
