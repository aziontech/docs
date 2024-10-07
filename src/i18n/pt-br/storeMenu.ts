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
		text: 'Documentação',
		header: true,
		onlyMobile: true,
		anchor: true,
		slug: '/documentacao/',
		key: 'documentation',
	},
	{
		text: 'Guias',
		header: true,
		onlyMobile: true,
		anchor: true,
		slug: '/documentacao/produtos/guias/',
		key: 'guides',
	},
	{
		text: 'Dev Tools',
		header: true,
		onlyMobile: true,
		anchor: true,
		slug: '/documentacao/produtos/dev-tools/',
		key: 'devTools',
	},

	/// START HERE :::: DO NOT REMOVE the strings above, it's a work around for header on mobile ///
	{
		text: 'Visão geral',
		header: true,
		anchor: true,
		slug: '/documentacao/produtos/store/visao-geral/',
		key: 'storeOverview',
		hasLabel: 'menu.store',
	},

	{
		text: 'Operações com buckets',
		header: true,
		type: 'learn',
		key: 'edgeStorage/api',
		hasLabel: 'menu.storage',
		items: [
			{
				text: 'Crie um bucket',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentacao/produtos/store/storage/criar-bucket/',
				key: 'createBucket',
			},
			{
				text: 'Liste buckets',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentacao/produtos/store/storage/listar-buckets/',
				key: 'listBucket',
			},
			{
				text: 'Atualize um bucket',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentacao/produtos/store/storage/atualizar-buckets/',
				key: 'updateBucket',
			},
			{
				text: 'Exclua um bucket',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentacao/produtos/store/storage/deletar-buckets/',
				key: 'deleteBucket',
			},
			{
				text: 'Crie um objeto',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentacao/produtos/store/storage/upload-de-objeto/',
				key: 'postObject',
			},
			{
				text: 'Atualize um objeto',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentacao/produtos/store/storage/atualizar-objeto/',
				key: 'putObject',
			},
			{
				text: 'Liste objetos',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentacao/produtos/store/storage/listar-objetos/',
				key: 'listObjects',
			},
			{
				text: 'Exclua um objeto',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentacao/products/store/storage/deletar-objeto/',
				key: 'deleteObject',
			},
			{
				text: 'Use um bucket como origem',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentacao/produtos/store/storage/usar-bucket-como-origin/',
				key: 'useBucketAsOrigin',
			},
		],
	},

	{
		text: 'Compatibilidade com o protocolo S3',
		header: true,
		type: 'learn',
		key: 'edgeStorage/s3',
		items: [
			{
				text: 'Aproveite a compatibilidade com S3',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentacao/produtos/store/storage/s3-protocol-para-edge-storage/',
				key: 'headObject',
			},
		],
	},

	{
		text: 'Gerencie bancos de dados',
		header: true,
		type: 'learn',
		hasLabel: 'menu.edgeSQL',
		key: 'edgeSQL/databases',
		items: [
			{
				text: 'Crie um banco de dados',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentacao/produtos/store/sql/criar-banco-de-dados/',
				key: 'createDatabase',
			},
			{
				text: 'Liste os bancos de dados',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentacao/produtos/store/sql/listar-bancos-de-dados/',
				key: 'listDatabases',
			},
			{
				text: 'Consulte informações de um banco',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentacao/produtos/store/sql/recuperar-informacoes-do-banco/',
				key: 'retrieveDatabaseInfo',
			},
			{
				text: 'Exclua um banco de dados',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentacao/produtos/store/sql/deletar-database/',
				key: 'deleteDatabase',
			},
		],
	},

	{
		text: 'Trabalhe com tabelas',
		header: true,
		type: 'learn',
		key: 'edgeSQL/tables',
		items: [
			{
				text: 'Crie uma tabela',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentacao/produtos/store/sql/criar-tabela/',
				key: 'createTable',
			},
			{
				text: 'Insira dados em uma tabela',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentacao/produtos/store/sql/inserir-dados-em-tabela/',
				key: 'insertIntoTable',
			},
			{
				text: 'Consulte linhas de uma tabela',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentacao/produtos/store/sql/recuperar-dados-edge-sql/',
				key: 'queryTableRows',
			},
			{
				text: 'Exclua um registro',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentacao/produtos/store/sql/deletar-registro/',
				key: 'deleteRecord',
			},
		],
	},
] as const;
