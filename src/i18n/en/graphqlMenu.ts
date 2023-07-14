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
	{ text: 'Dev Tools', header: true, onlyMobile: true, anchor: true, type: 'learn', slug: '/documentation/products/dev-tools/', key: 'devTools' },
	{ text: 'Learn', header: true, onlyMobile: true, anchor: true, type: 'learn', slug: 'https://learn.azion.com/', key: 'Learn' },

	/// START HERE :::: DO NOT REMOVE the strings above, it's a work around for header on mobile /// 

	{ text: 'Overview', header: true, anchor: true, type: 'learn', key: 'overview', slug: '/documentation/products/graphql-api-overview' },
	{ text: 'First Steps', header: true, anchor: true, type: 'learn', key: 'firstSteps', slug: '/documentation/products/graphql-api-first-steps' },
	{ text: 'Queries', header: true, anchor: true, type: 'learn', slug: '/documentation/products/graphql-api-queries', key: 'queries' },
	{ text: 'Queries Examples',header: true, anchor: true, type: 'learn', slug: '/documentation/products/graphql-api-queries-examples', key: 'queries/examples' },
	{ text: 'Features',header: true, anchor: true, type: 'learn', slug: '/documentation/products/graphql-api-features', key: 'features' },
	{ text: 'Limits', header: true, anchor: true, type: 'learn', slug: '/documentation/products/graphql-api-limits', key: 'limits' },
	{ text: 'Error Responses', header: true, anchor: true, type: 'learn', slug: '/documentation/products/graphql-api-error-responses', key: 'queries/error-responses' },

	{ text: 'Guides', header: true, type: 'learn', key: 'guides' },
	{ text: 'How to query GraphQL requests on Postman', slug: '/documentation/products/guides/query-graphql-postman', key: 'guides/graphql-postman' },
	{ text: 'How to query metadata with GraphQL API', slug: '/documentation/products/guides/graphql-metadata', key: 'guides/graphql-metadata' },
	{ text: 'How to query aggregated data with GraphQL API', slug: '/documentation/products/guides/graphql-aggregated-data', key: 'guides/graphql-aggregated-data' },
	{ text: 'How to select Top X queries with GraphQL API', slug: '/documentation/products/guides/graphql-top-x-query', key: 'guides/graphql-top-x' },

] as const;
