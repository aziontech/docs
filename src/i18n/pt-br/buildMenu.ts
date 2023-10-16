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

    { text: 'Visão geral',header: true, anchor: true, type: 'learn', key: 'overview', slug: '/documentacao/produtos/guias/build/visao-geral/', hasLabel:'menu.build' },
	{ text: 'Construa uma aplicação',header: true, anchor: true, type: 'learn', key: 'firstSteps', slug: '/documentacao/produtos/guias/build/criar-uma-aplicacao/' },

	{ text: 'Edite uma aplicação',header: true,  type: 'learn',  key: 'editEdgeApp', children: [
		{ text: 'Configure main settings', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/guias/build/definir-configuracoes-principais/', key: 'mainSettings' },
            { text: 'Criar device groups', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/guias/build/criar-device-groups/', key: 'deviceGroups' },
            { text: 'Definir páginas de erro', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/guias/build/configurar-paginas-de-erro/', key: 'errorPages' },
            { text: 'Trabalhar com origins', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/guias/build/definir-origens/', key: 'origins' },
            { text: 'Ajustar cache settings', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/guias/build/ajustar-cache-settings/', key: 'cacheSettings' },
            { text: 'Trabalhar com rules engine', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/guias/build/trabalhar-com-rules-engine/', key: 'rules' },
            { text: 'Instanciar uma edge function', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/guias/build/instanciar-edge-functions/', key: 'functions' },
        ]
    },

    {
        text: 'Configurações avançadas', header: true, type: 'learn', key: 'advancedConfig', addBorder: true, children: [
            { text: 'Processar imagens', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/guias/build/processar-imagens/', key: 'processImages', hasLabel: 'menu.buildAdvanced' },
            { text: 'Multi-origin', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/guias/build/configure-multiplas-origens/', key: 'multiOrigin' },
        ]
    },

    { text: 'CLI', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/build/desenvolvimento-azion/cli/', key: 'developCli', hasLabel: 'menu.buildDev' },
    { text: 'Azion IDE', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/build/desenvolvimento-azion/code-editor/', key: 'developIDE' },
    { text: 'Desenvolvimento local', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/build/desenvolvimento-azion/local-dev/', key: 'developLocalDev' },
    { text: 'SDKs', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/build/desenvolvimento-azion/sdk/go/', key: 'developSDK' },
    { text: 'Terraform', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/build/desenvolvimento-azion/terraform-provider/', key: 'developTerraform' },
    { text: 'Edge Runtime', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/build/desenvolvimento-azion/runtime/', key: 'developEdgeRuntime' },


    { text: 'Guias específicos por framework', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/build/develop-with-azion/frameworks-specific/visao-geral/', key: 'frameworkAngular' },

    {
        text: 'Guias específicos por linguagem', header: true, type: 'learn', key: 'languageSpecifics', addBorder: true, children: [
            { text: 'JavaScript', slug: '/documentacao/produtos/desenvolvimento-azion/linguagens/javascript/', key: 'devJS' },
            { text: 'WebAssembly', slug: '/documentacao/produtos/build/desenvolvimento-azion/linguagens/wasm/', key: 'devWasm' },
        ]
    },

    { text: 'Environment Variables', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/build/environment-variables/', key: 'envVars', hasLabel: 'menu.buildData', addBorder: true, },


    { text: 'Monitorar métricas', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/build/troubleshooting/monitorar-metricas/', key: 'understandMetrics', hasLabel: 'menu.buildTroubleshoot' },
    { text: 'Debugar aplicações', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/build/troubleshooting/debug-aplicacoes/', key: 'debugApps', addBorder: true, },


] as const;
