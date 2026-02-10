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
	{ text: 'Dev Tools', header: true, onlyMobile: true, anchor: true, type: 'learn', slug: '/documentation/devtools/', key: 'devTools' },

	/// START HERE :::: DO NOT REMOVE the strings above, it's a work around for header on mobile /// 

	{ text: 'Overview', header: true, anchor: true, type: 'learn', key: 'overview', slug: '/documentation/devtools/graphql-api/overview/' },
	{ text: 'First Steps', header: true, anchor: true, type: 'learn', key: 'firstSteps', slug: '/documentation/devtools/graphql-api/first-steps/' },
	{ text: 'Queries', header: true, anchor: true, type: 'learn', slug: '/documentation/devtools/graphql-api/queries/', key: 'queries' },
	{ text: 'Queries Examples', header: true, anchor: true, type: 'learn', slug: '/documentation/devtools/graphql-api/queries-examples/', key: 'queries/examples' },
	{ text: 'Features',header: true, anchor: true, type: 'learn', slug: '/documentation/devtools/graphql-api/features/', key: 'features' },
	{ text: 'GraphiQL Playground',header: true, anchor: true, type: 'learn', slug: '/documentation/products/devtools/graphql-playground/', key: 'playground' },

	{ text: 'Fields', header: true, key: 'fields', type: 'learn', items: [
		{ text: 'Real-Time Events GQL', slug: '/documentation/devtools/graphql-api/features/gql-real-time-events-fields/', key: 'fields/Events' },
		{ text: 'Real-Time Metrics GQL', slug: '/documentation/devtools/graphql-api/features/gql-real-time-metrics-fields/', key: 'fields/Metrics' },
		{ text: 'Billing GQL', slug: '/documentation/devtools/graphql-api/features/gql-billing-fields/', key: 'fields/Billing' },
		{ text: 'Accounting GQL', slug: '/documentation/devtools/graphql-api/features/gql-accounting-fields/', key: 'fields/Accounting' },
		{ text: 'Consumption GQL', slug: '/documentation/devtools/graphql-api/features/gql-consumption-fields/', key: 'fields/Consumption' },
	]
},

	{ text: 'Limits', header: true, anchor: true, type: 'learn', slug: '/documentation/devtools/graphql-api/limits/', key: 'limits' },
	{ text: 'Error Responses', header: true, anchor: true, type: 'learn', slug: '/documentation/devtools/graphql-api/error-responses/', key: 'queries/error-responses' },

	{ text: 'Guides', header: true, type: 'learn', key: 'guides', items: [
		{ text: 'How to query GraphQL requests on Postman', slug: '/documentation/products/guides/query-graphql-postman', key: 'guides/graphql-postman' },
		{ text: 'How to query metadata', slug: '/documentation/products/guides/graphql-metadata', key: 'guides/graphql-metadata' },
		{ text: 'How to query aggregated data', slug: '/documentation/products/guides/graphql-aggregated-data', key: 'guides/graphql-aggregated-data' },
		{ text: 'How to select Top X queries', slug: '/documentation/products/guides/graphql-top-x-query', key: 'guides/graphql-top-x' },
		{ text: 'How to query Connected Users data', slug: '/documentation/products/guides/query-connected-users-data-with-graphql/', key: 'guides/connected-users-graphql' },
		{ text: 'How to query Bot Manager data', slug: '/documentation/products/guides/query-bot-manager-data-with-graphql/', key: 'guides/bot-data-graphql' },
		{ text: 'How to query the top URLs impacted by bots', slug: '/documentation/products/guides/query-bot-manager-breakdown-data-with-graphql/', key: 'guides/bot-breakdown-data-graphql' },
		{ text: 'How to identify the Top IPs generating attack traffic', slug: '/documentation/products/guides/query-top-ips-attack-traffic-with-graphql/', key: 'guides/top-ips-graphql' },
		{ text: 'How to identify the top attacks', slug: '/documentation/products/guides/query-top-attacks-with-graphql/', key: 'guides/bot-top-attacks-graphql' },
		{ text: 'How to query HTTP request events blocked', slug: '/documentation/products/guides/query-httpbreakdownmetrics-data-with-graphql/', key: 'guides/httpbreakdownmetrics-data' },
		{ text: 'How to query usage data from Functions', slug: '/documentation/products/guides/query-edge-functions-usage-data-with-graphql/', key: 'guides/edge-functions-usage-data' },
		{ text: 'How to query usage data from Image Processor', slug: '/documentation/products/guides/query-image-processor-usage-data-with-graphql/', key: 'guides/image-processor-usage-data' },
		{ text: 'How to query usage data from Applications', slug: '/documentation/products/guides/query-edge-application-usage-data-with-graphql/', key: 'guides/edge-application-usage-data' },
		{ text: 'How to query usage data from Data Stream', slug: '/documentation/products/guides/query-data-stream-usage-data-with-graphql/', key: 'guides/data-stream-usage-data' },
		{ text: 'How to query usage data from Tiered Cache', slug: '/documentation/products/guides/query-tiered-cache-usage-data-with-graphql/', key: 'guides/tiered-cache-usage-data' }

	] },


] as const;
