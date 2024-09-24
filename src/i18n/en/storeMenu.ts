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
		slug: '/documentation/products/store/overview/',
		key: 'secureOverview',
		hasLabel: 'menu.store',
	},

	{
		text: 'Bucket operations',
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
				slug: '/documentation/products/store/storage/create-bucket/',
				key: 'createBucket',
			},
			{
				text: 'List buckets',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentation/products/store/storage/list-buckets/',
				key: 'listBucket',
			},
			{
				text: 'Update a bucket',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentation/products/store/storage/update-buckets/',
				key: 'updateBucket',
			},
			{
				text: 'Delete a bucket',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentation/products/store/storage/delete-buckets/',
				key: 'deleteBucket',
			},
			{
				text: 'Create an object',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentation/products/store/storage/upload-object/',
				key: 'postObject',
			},
			{
				text: 'Update an object',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentation/products/store/storage/update-object/',
				key: 'putObject',
			},
			{
				text: 'List objects',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentation/products/store/storage/list-objects/',
				key: 'listObjects',
			},
			{
				text: 'Delete an object',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentation/products/store/storage/delete-object/',
				key: 'deleteObject',
			},
			{
				text: 'Use a bucket as origin',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentation/products/store/storage/use-bucket-as-origin/',
				key: 'useBucketAsOrigin',
			},
		],
	},

	{
		text: 'S3 Protocol compatibility',
		header: true,
		type: 'learn',
		key: 'edgeStorage/s3',
		items: [
			{
				text: 'Leverage S3 compatibility',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentation/products/store/storage/s3-protocol-for-edge-storage/',
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
				slug: '/documentation/products/store/sql/create-database/',
				key: 'createDatabase',
			},
			{
				text: 'List databases',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentation/products/store/sql/list-databases/',
				key: 'listDatabases',
			},
			{
				text: 'Delete a database',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentation/products/store/sql/delete-database/',
				key: 'deleteDatabase',
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
				slug: '/documentation/products/store/sql/create-table/',
				key: 'createTable',
			},
			{
				text: 'Insert into a table',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentation/products/store/sql/insert-into-table/',
				key: 'insertIntoTable',
			},
			{
				text: 'Query table rows',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentation/products/store/sql/retrieve-data-edge-sql/',
				key: 'queryTableRows',
			},
			{
				text: 'Delete a record',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentation/products/store/sql/delete-record/',
				key: 'deleteRecord',
			},
		],
	},
] as const;
