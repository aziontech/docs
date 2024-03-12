
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
    { text: 'Overview', header: true, anchor: true, slug: '/documentation/products/secure/overview/', key: 'secureOverview', hasLabel: 'menu.secure' },
    { text: 'Secure an application', header: true, anchor: true, slug: '/documentation/products/secure/secure-application/', key: 'secureApps' },
    { text: 'Secure an infrastructure', header: true, anchor: true, slug: '/documentation/products/secure/secure-infrastructure/', key: 'secureInfra' },
    { text: 'Secure a DNS', header: true, anchor: true, slug: '/documentation/products/secure/secure-dns/', key: 'secureDns', addBorder: true },

    {
        text: 'Edit a firewall', header: true, type: 'learn', key: 'editEdgeFirewall', hasLabel: 'menu.edgeFirewall', children: [
            { text: 'Configure main settings', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/secure/edge-firewall-configure-main-settings/', key: 'secureMainSettings' },
            { text: 'Instantiate an edge function', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/secure/instantiate-edge-functions/', key: 'secureFunctions' },
            { text: 'Work with rules engine', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/secure/work-with-rules-engine/', key: 'secureRules' },
            
        ]
    },

    {
        text: 'Advanced configurations', header: true, type: 'learn', key: 'secureAdvancedConfig', children: [
            { text: 'Manage bots', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/secure/manage-bots/', key: 'manageBots', hasLabel: 'menu.secureAdvanced' },
            { text: 'Activate DDoS', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/secure/activate-ddos/', key: 'activateDdos' },
            { text: 'Create WAF rule set', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/secure/create-waf-rule-set/', key: 'wafRuleSet' },
            { text: 'Tune WAF', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/secure/tune-waf/', key: 'tuneWaf' },
            { text: 'Block Tor networks', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/secure/block-tor-networks/', key: 'blockTor' },
        ]
    },


    { text: 'Select TLS ciphers', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/secure/ciphers/', key: 'ciphers', hasLabel: 'menu.secureTransportLayerSecurity' },
    { text: 'Configure mTLS', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/secure/mtls/', key: 'mtls' },
    { text: 'Manage Digital Certificates', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/secure/digital-certificates/', key: 'digitalCertificates' },


    { text: 'Edge Functions', header: true, anchor: true, type: 'learn', slug: '/documentation/products/secure/automate/functions/', key: 'automateEdgeFunctions', hasLabel: 'menu.secureAutomate' },
    { text: 'SDK', header: true, anchor: true, type: 'learn', slug: '/documentation/products/secure/automate/sdk/', key: 'automateSdk' },
    { text: 'Terraform', header: true, anchor: true, type: 'learn', slug: '/documentation/products/secure/automate/terraform/', key: 'automateTerraform' },
    { text: 'Protect origin', header: true, anchor: true, type: 'learn', slug: '/documentation/products/secure/automate/origin-shield/', key: 'automateOriginShield' },
    { text: 'Integrate with SIEMs', header: true, anchor: true, type: 'learn', slug: '/documentation/products/secure/automate/integrate-siems/', key: 'automateIntegrateSiems' },


    { text: 'Understand metrics', header: true, anchor: true, type: 'learn', slug: '/documentation/products/secure/troubleshoot/edge-firewall-understand-metrics/', key: 'firewallUnderstandMetrics', hasLabel: 'menu.secureTroubleshoot', addBorder: true },


    {
        text: 'Edit a zone', header: true, type: 'learn', key: 'editIntelligentDns', hasLabel: 'menu.intelligentDns', children: [
            { text: 'Configure main settings', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/secure/edge-dns-configure-main-settings/', key: 'intelligentDnsMainSettings' },
            { text: 'Add records', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/secure/add-records/', key: 'addRecords' },
            
        ]
    },

    {
        text: 'Advanced configurations', header: true, type: 'learn', key: 'secureAdvancedConfig', children: [
            { text: 'Access root domain', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/secure/access-root-domain/', key: 'anames', hasLabel: 'menu.secureAdvanced' },
            { text: 'Activate DNSSEC', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/secure/activate-dnssec/', key: 'activateDnssec' },
            { text: 'Authenticate Let\'s Encrypt certificate', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/secure/lets-encrypt-record/', key: 'authenticateLetsEncryptCertificate' },
            { text: 'Perform DNS load balance', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/secure/load-balance-dns/', key: 'dnsLoadBalance' },

        ]
    },


    { text: 'Understand metrics', header: true, anchor: true, type: 'learn', slug: '/documentation/products/secure/troubleshoot/edge-dns-understand-metrics/', key: 'intelligentDnsUnderstandMetrics', hasLabel: 'menu.secureTroubleshoot' },
    { text: 'Test zone', header: true, anchor: true, type: 'learn', slug: '/documentation/products/secure/troubleshoot/test-zone/', key: 'testZone' }


] as const;
