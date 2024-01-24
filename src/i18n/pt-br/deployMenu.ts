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
		slug: '/documentacao/produtos/deploy/visao-geral/',
		key: 'deployOverview',
		hasLabel: 'menu.deploy',
	},
	{
		text: 'Implante um edge service',
		header: true,
		anchor: true,
		slug: '/documentacao/produtos/deploy/implantar-servico/',
		key: 'deployService',
	},
	{
		text: 'Configure um edge node',
		header: true,
		type: 'learn',
		key: 'configEdgeNode',
		children: [
			{
				text: 'Gere credenciais',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentacao/produtos/guias/deploy/gerar-credentials/',
				key: 'generateCredentials',
			},
			{
				text: 'Instale o agente',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentacao/produtos/guias/deploy/instalar-orchestrator-agent/',
				key: 'installAgent',
			},
			{
				text: 'Autorize um edge node',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentacao/produtos/guias/deploy/autorizar-edge-node/',
				key: 'authNode',
			},
			{
				text: 'Acompanhe logs',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentacao/produtos/guias/deploy/verificar-logs/',
				key: 'watchLogs',
			},
			{
				text: 'Crie um edge service',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentacao/produtos/guias/deploy/criar-edge-service/',
				key: 'createService',
			},
			{
				text: 'Vincule um edge service',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentacao/produtos/guias/deploy/vincular-servico/',
				key: 'bindService',
			},
			{
				text: 'Provisione arquivos',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentacao/produtos/guias/deploy/provisionar-arquivos/',
				key: 'provisionFiles',
			},
			{
				text: 'Trabalhe com variáveis',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentacao/produtos/guias/deploy/trabalhar-com-variaveis/',
				key: 'workVariables',
			},
			{
				text: 'Desvincule um edge service',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentacao/produtos/guias/deploy/desvincular-servico/',
				key: 'unbindService',
			},
		],
	},
	{
		text: 'Configurações avançadas',
		header: true,
		type: 'learn',
		key: 'configEdgeNode',
		children: [
			{
				text: 'Explore o uso',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentacao/produtos/deploy/avancado/explore-uso/',
				key: 'exploreUsage',
			},
			{
				text: 'Execute scripts',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentacao/produtos/guias/deploy/avancado/rodar-scripts/',
				key: 'runScripts',
			},
			{
				text: 'Desinstale o agente',
				header: true,
				anchor: true,
				type: 'learn',
				slug: '/documentacao/produtos/guias/deploy/avancado/desinstalar-agent/',
				key: 'uninstallNode',
			},
		],
	},
	{
		text: 'Azion API',
		header: true,
		anchor: true,
		type: 'learn',
		slug: '/documentacao/produtos/deploy/automatizar/api/',
		key: 'deployAutomateAPI',
		hasLabel: 'menu.secureAutomate',
	},
	{
		text: 'Zero-touch provisioning',
		header: true,
		anchor: true,
		type: 'learn',
		slug: '/documentacao/produtos/deploy/automatizar/zero-touch-provisioning/',
		key: 'zeroTouchProvisioning',
	},
] as const;
