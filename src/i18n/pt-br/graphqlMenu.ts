import { NavDictionary } from '../translation-checkers';

 export default NavDictionary([
	{ text: 'Documentação',  slug: 'documentation', key: 'documentation' },
	{ text: 'Guias',  slug: 'guides', key: 'guides' },
	{ text: 'Dev Tools',  slug: 'devTools', key: 'devTools' },
	{ text: 'Learn',  slug: 'Learn', key: 'Learn' },

	/// START HERE :::: DO NOT REMOVE the strings above, it's a work around for header on mobile /// 

	{ text: 'Visão geral', key: 'overview', slug: '/documentacao/produtos/graphql-api/visao-geral' },
	{ text: 'Primeiros Passos', key: 'firstSteps', slug: '/documentacao/produtos/graphql-api-primeiros-passos' },
	{ text: 'Queries', slug: '/documentacao/produtos/graphql-api-queries', key: 'queries' },
	{ text: 'Exemplos de queries', slug: '/documentacao/produtos/graphql-api-exemplos-queries', key: 'queries/examples' },
	{ text: 'Recursos', slug: '/documentacao/produtos/graphql-api-recursos', key: 'features' },
	{ text: 'Limites', slug: '/documentacao/produtos/graphql-api-limites', key: 'limits' },
	{ text: 'Mensagens de erro', slug: '/documentacao/produtos/graphql-api-mensagens-erro', key: 'queries/error-responses' },

	{ text: 'Guias', key: 'guides' },
	{ text: 'Como rodar requisições da GraphQL no Postman', slug: '/documentacao/produtos/guias/consultar-graphql-postman', key: 'guides/graphql-postman' },
	{ text: 'Como consultar metadados com a GraphQL API', slug: '/documentacao/produtos/guias/graphql-metadados', key: 'guides/graphql-metadata' },
	{ text: 'Como realizar consultas agregando dados com a GraphQL API', slug: '/documentacao/produtos/guias/graphql-dados-agregados', key: 'guides/graphql-aggregated-data' },
	{ text: 'Como selecionar Top X queries com a GraphQL API', slug: '/documentacao/produtos/guias/graphql-query-top-x', key: 'guides/graphql-top-x' },

]);
