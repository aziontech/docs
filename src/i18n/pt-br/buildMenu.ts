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
	{ text: 'Learn',header: true, onlyMobile: true, anchor: true, slug: 'https://learn.azion.com/', key: 'Learn' },

	/// START HERE :::: DO NOT REMOVE the strings above, it's a work around for header on mobile ///

    { text: 'Visão geral',header: true, anchor: true, type: 'learn', key: 'overview', slug: '/documentacao/' },
	{ text: 'Construa uma aplicação',header: true, anchor: true, type: 'learn', key: 'firstSteps', slug: '/documentacao/' },

	{ text: 'Edite uma aplicação',header: true,  type: 'learn',  key: 'editEdgeApp', children: [
		{ text: 'Configure main settings', header: true, anchor: true, type: 'learn', slug: '/documentacao/', key: 'mainSettings' },
            { text: 'Crie device groups', header: true, anchor: true, type: 'learn', slug: '/documentacao/', key: 'deviceGroups' },
            { text: 'Defina páginas de erro', header: true, anchor: true, type: 'learn', slug: '/documentacao/', key: 'errorPages' },
            { text: 'Trabalhe com origins', header: true, anchor: true, type: 'learn', slug: '/documentacao/', key: 'origins' },
            { text: 'Ajuste cache settings', header: true, anchor: true, type: 'learn', slug: '/documentacao/', key: 'cacheSettings' },
            { text: 'Trabalhe com rules engine', header: true, anchor: true, type: 'learn', slug: '/documentacao/', key: 'rules' },
            { text: 'Instancie uma edge function', header: true, anchor: true, type: 'learn', slug: '/documentacao/', key: 'functions' },
        ]
    },

    {
        text: 'Configurações avançadas', header: true, type: 'learn', key: 'advancedConfig', addBorder: true, children: [
            { text: 'Processe imagens', header: true, anchor: true, type: 'learn', slug: '/documentacao/', key: 'processImages', hasLabel: 'menu.buildAdvanced' },
            { text: 'Multi-origin', header: true, anchor: true, type: 'learn', slug: '/documentacao/', key: 'multiOrigin' },
        ]
    },

    { text: 'CLI', header: true, anchor: true, type: 'learn', slug: '/documentacao/', key: 'developCli', hasLabel: 'menu.buildDev' },
    { text: 'Azion IDE', header: true, anchor: true, type: 'learn', slug: '/documentacao/', key: 'developIDE' },
    { text: 'Desenvolvimento local', header: true, anchor: true, type: 'learn', slug: '/documentacao/', key: 'developLocalDev' },
    { text: 'SDKs', header: true, anchor: true, type: 'learn', slug: '/documentacao/', key: 'developSDK' },
    { text: 'Terraform', header: true, anchor: true, type: 'learn', slug: '/documentacao/', key: 'developTerraform' },
    { text: 'Edge Runtime', header: true, anchor: true, type: 'learn', slug: '/documentacao/', key: 'developEdgeRuntime' },


    { text: 'Guias específicos por framework', header: true, anchor: true, type: 'learn', slug: '/documentacao/', key: 'frameworkAngular' },

    {
        text: 'Guias específicos por linguagem', header: true, type: 'learn', key: 'languageSpecifics', addBorder: true, children: [
            { text: 'JavaScript', slug: '/documentacao/', key: 'devJS' },
            { text: 'WebAssembly', slug: '/documentacao/', key: 'devWasm' },
        ]
    },

    { text: 'Environment variables', header: true, anchor: true, type: 'learn', slug: '/documentacao/', key: 'envVars', hasLabel: 'menu.buildData', addBorder: true, },


    { text: 'Monitore métricas', header: true, anchor: true, type: 'learn', slug: '/documentacao/', key: 'understandMetrics', hasLabel: 'menu.buildTroubleshoot' },
    { text: 'Debugue aplicações', header: true, anchor: true, type: 'learn', slug: '/documentacao/', key: 'debugApps', addBorder: true, },


] as const;
