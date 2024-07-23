
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
    { text: 'Overview', header: true, anchor: true, slug: '/documentation/products/secure/overview/', key: 'secureOverview', hasLabel: 'menu.store' },

    {
        text: 'Manage buckets', header: true, type: 'learn', key: 'editEdgeFirewall', hasLabel: 'menu.edgeFirewall', items: [
            { text: 'Create a bucket', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/secure/edge-firewall-configure-main-settings/', key: 'secureMainSettings' },
            { text: 'List buckets', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/secure/instantiate-edge-functions/', key: 'secureFunctions' },
            { text: 'Edit a bucket', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/secure/instantiate-edge-functions/', key: 'secureFunctions' },

        ]
    },

    {
        text: 'Work with objects', header: true, type: 'learn', key: 'secureAdvancedConfig', items: [
            { text: 'Manage bots', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/secure/manage-bots/', key: 'manageBots' },
           
        ]
    },


    { text: 'Edge SQL', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/secure/ciphers/', key: 'ciphers', hasLabel: 'menu.secureTransportLayerSecurity' },

] as const;
