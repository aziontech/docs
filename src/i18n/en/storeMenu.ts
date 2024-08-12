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
	{
		text: 'Documentation',
		header: true,
		onlyMobile: true,
		anchor: true,
		type: 'learn',
		slug: '/documentation/',
		key: 'documentation',
	},
	{
		text: 'Guides',
		header: true,
		onlyMobile: true,
		anchor: true,
		type: 'learn',
		slug: '/documentation/products/guides/',
		key: 'guides',
	},
	{
		text: 'Dev Tools',
		header: true,
		onlyMobile: true,
		anchor: true,
		type: 'learn',
		slug: '/documentation/devtools/',
		key: 'devTools',
	},

	/// START HERE :::: DO NOT REMOVE the strings above, it's a work around for header on mobile ///
	{
		text: 'Overview',
		header: true,
		anchor: true,
		slug: '/documentation/products/secure/overview/',
		key: 'secureOverview',
		hasLabel: 'menu.store',
	},

	{
		text: 'Rest API Operations',
		header: true,
		type: 'learn',
		key: 'edgeStorage/api',
		hasLabel: 'menu.storage',
		items: [
			{
				text: 'Create a bucket',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentation/products/guides/upload-and-download-objects-from-bucket/',
				key: 'createBucket',
			},
			{
				text: 'List buckets',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentation/products/guides/upload-and-download-objects-from-bucket/',
				key: 'listBucket',
			},
			{
				text: 'Update a bucket',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentation/products/guides/upload-and-download-objects-from-bucket/',
				key: 'updateBucket',
			},
			{
				text: 'Delete a bucket',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentation/products/guides/upload-and-download-objects-from-bucket/',
				key: 'deleteBucket',
			},
			{
				text: 'Create an object',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentation/products/guides/create-and-modify-bucket/',
				key: 'postObject',
			},
			{
				text: 'Update an object',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentation/products/guides/create-and-modify-bucket/',
				key: 'putObject',
			},
			{
				text: 'List objects',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentation/products/guides/secure/list-objects/',
				key: 'listObjects',
			},
			{
				text: 'Get object information',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentation/products/guides/secure/get-object/',
				key: 'getObject',
			},
			{
				text: 'Delete an object',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentation/products/guides/secure/delete-object/',
				key: 'deleteObject',
			},
			{
				text: 'Delete multiple objects',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentation/products/guides/secure/delete-objects/',
				key: 'deleteObjects',
			},
			{
				text: 'Use a bucket as origin',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentation/products/guides/use-bucket-as-origin/',
				key: 'deleteObjects',
			},
		],
	},

	{
		text: 'S3 Protocol Operations',
		header: true,
		type: 'learn',
		key: 'edgeStorage/s3',
		items: [
			{
				text: 'Leverage S3 compatibility',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentation/products/guides/secure/head-object/',
				key: 'headObject',
			},
		],
	},

	{
		text: 'Manage databases',
		header: true,
		type: 'learn',
		hasLabel: 'menu.edgeSQL',
		key: 'edgeSQL/databases',
		items: [
			{
				text: 'Create a database',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentation/products/guides/secure/aggregate-functions/',
				key: 'aggregateFunctions',
			},
			{
				text: 'List databases',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentation/products/guides/secure/aggregate-functions/',
				key: 'aggregateFunctions',
			},
			{
				text: 'Retrieve database info',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentation/products/guides/secure/aggregate-functions/',
				key: 'aggregateFunctions',
			},
			{
				text: 'Delete a database',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentation/products/guides/secure/commit-transaction/',
				key: 'commitTransaction',
			},
		
		],
	},

	{
		text: 'Work with tables',
		header: true,
		type: 'learn',
		key: 'edgeSQL/tables',
		items: [
			{
				text: 'Create a table',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentation/products/guides/secure/alter-table/',
				key: 'alterTable',
			},
			{
				text: 'Insert into a table',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentation/products/guides/secure/analyze/',
				key: 'analyze',
			},
			{
				text: 'Query table rows',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentation/products/guides/secure/attach-database/',
				key: 'attachDatabase',
			},
			{
				text: 'Update a record',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentation/products/guides/secure/begin-transaction/',
				key: 'beginTransaction',
			},
			{
				text: 'Delete a record',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentation/products/guides/secure/comment/',
				key: 'comment',
			},
		],
	},
] as const;
	