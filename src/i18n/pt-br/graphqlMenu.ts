
 export default [
	{ text: 'Documentação', header: true, onlyMobile: true, anchor: true, slug: 'documentation', key: 'documentation' },
	{ text: 'Guias' , header: true, onlyMobile: true, anchor: true, slug: 'guides', key: 'guides' },
	{ text: 'Dev Tools' , header: true, onlyMobile: true, anchor: true,  slug: 'devTools', key: 'devTools' },
	{ text: 'Learn' , header: true, onlyMobile: true,  slug: 'Learn', anchor: true, key: 'Learn' },

	/// START HERE :::: DO NOT REMOVE the strings above, it's a work around for header on mobile /// 

	{ text: 'Visão geral', header: true, anchor: true, type: 'learn', key: 'overview', slug: '/documentacao/produtos/graphql-api/visao-geral' },
	{ text: 'Primeiros passos', header: true, anchor: true, type: 'learn', key: 'firstSteps', slug: '/documentacao/produtos/graphql-api-primeiros-passos' },
	{ text: 'Queries', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/graphql-api-queries', key: 'queries' },
	{ text: 'Exemplos de queries' , header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/graphql-api-exemplos-queries', key: 'queries/examples' },
	{ text: 'Recursos', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/graphql-api-recursos', key: 'features' },
	{ text: 'Limites', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/graphql-api-limites', key: 'limits' },
	{ text: 'Mensagens de erro', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/graphql-api-mensagens-erro', key: 'queries/error-responses' },

	{ text: 'Guias', header: true, type: 'learn', key: 'guides' },
	{ text: 'Como rodar requisições da GraphQL no Postman', slug: '/documentacao/produtos/guias/consultar-graphql-postman', key: 'guides/graphql-postman' },
	{ text: 'Como consultar metadados com a GraphQL API', slug: '/documentacao/produtos/guias/graphql-metadados', key: 'guides/graphql-metadata' },
	{ text: 'Como realizar consultas agregando dados com a GraphQL API', slug: '/documentacao/produtos/guias/graphql-dados-agregados', key: 'guides/graphql-aggregated-data' },
	{ text: 'Como selecionar Top X queries com a GraphQL API', slug: '/documentacao/produtos/guias/graphql-query-top-x', key: 'guides/graphql-top-x' },

];
