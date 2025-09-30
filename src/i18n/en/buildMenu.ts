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
    { text: 'Documentation', header: true, onlyMobile: true, anchor: true, type: 'learn', slug: '/documentation/', key: 'documentation' },
    { text: 'Guides', header: true, onlyMobile: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/', key: 'guides' },
    { text: 'Dev Tools', header: true, onlyMobile: true, anchor: true, type: 'learn', slug: '/documentation/devtools/', key: 'devTools' },

    /// START HERE :::: DO NOT REMOVE the strings above, it's a work around for header on mobile /// 
    { text: 'Overview', header: true, anchor: true, slug: '/documentation/products/guides/build/overview/', key: 'buildOverview', hasLabel: 'menu.build' },
    { text: 'Build an application', header: true, anchor: true, slug: '/documentation/products/guides/build/build-an-application/', key: 'buildEdgeApps' },

    {
        text: 'Edit an application', header: true, type: 'learn', key: 'editEdgeApp', items: [
            { text: 'Configure main settings', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/build/configure-main-settings/', key: 'mainSettings' },
            { text: 'Create device groups', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/build/create-device-groups/', key: 'deviceGroups' },
            { text: 'Set error pages', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/build/set-error-pages/', key: 'errorPages' },
            { text: 'Work with origins', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/build/work-with-origins/', key: 'origins' },
            { text: 'Tune cache settings', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/build/tune-cache-settings/', key: 'cacheSettings' },
            { text: 'Work with rules engine', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/build/work-with-rules-engine/', key: 'rules' },
            { text: 'Instantiate an function', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/build/instantiate-edge-functions/', key: 'functions' },
        ]
    },

    {
        text: 'Advanced configurations', header: true, type: 'learn', key: 'advancedConfig', addBorder: true, items: [
            { text: 'Process images', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/build/process-images/', key: 'processImages' },
            { text: 'Configure multiple origins', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/build/multiple-origins/', key: 'multiOrigin' },
        ]
    },



    { text: 'CLI', header: true, anchor: true, type: 'learn', slug: '/documentation/products/build/develop-with-azion/cli/', key: 'developCli', hasLabel: 'menu.buildDev' },
    { text: 'Azion IDE', header: true, anchor: true, type: 'learn', slug: '/documentation/products/build/develop-with-azion/code-editor/', key: 'developIDE' },
    { text: 'Local Development', header: true, anchor: true, type: 'learn', slug: '/documentation/products/build/develop-with-azion/local-dev/', key: 'developLocalDev' },
    { text: 'SDKs', header: true, anchor: true, type: 'learn', slug: '/documentation/products/build/develop-with-azion/sdk/go/', key: 'developSDK' },
    { text: 'Terraform', header: true, anchor: true, type: 'learn', slug: '/documentation/products/build/develop-with-azion/terraform-provider/', key: 'developTerraform' },
    { text: 'Azion Runtime', header: true, anchor: true, type: 'learn', slug: '/documentation/products/build/develop-with-azion/runtime-apis/', key: 'developEdgeRuntime' },


    { text: 'Framework specific guides', header: true, anchor: true, type: 'learn', slug: '/documentation/products/build/develop-with-azion/frameworks-specific/overview/', key: 'frameworkAngular' },

    {
        text: 'Language specific guides', header: true, type: 'learn', key: 'languageSpecifics', addBorder: true, items: [
            { text: 'JavaScript', slug: '/documentation/products/build/develop-with-azion/language-specific/javascript/', key: 'devJS' },
            { text: 'WebAssembly', slug: '/documentation/products/build/develop-with-azion/language-specific/wasm/', key: 'devWasm' },
        ]
    },

    { text: 'Environment Variables', header: true, anchor: true, type: 'learn', slug: '/documentation/products/build/develop-with-azion/environment-variables/', key: 'envVars', hasLabel: 'menu.buildData', addBorder: true, },


    { text: 'Understand metrics', header: true, anchor: true, type: 'learn', slug: '/documentation/products/build/troubleshooting/understand-metrics/', key: 'understandMetrics', hasLabel: 'menu.buildTroubleshoot' },
    { text: 'Debug applications', header: true, anchor: true, type: 'learn', slug: '/documentation/products/build/troubleshooting/debug-applications/', key: 'debugApps', addBorder: true, },


] as const;
