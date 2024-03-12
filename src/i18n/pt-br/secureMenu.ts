
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
    { text: 'Documentação', header: true, onlyMobile: true, anchor: true, slug: '/documentacao/', key: 'documentation' },
	{ text: 'Guias',header: true, onlyMobile: true, anchor: true, slug: '/documentacao/produtos/guias/', key: 'guides' },
	{ text: 'Dev Tools',header: true, onlyMobile: true, anchor: true, slug: '/documentacao/produtos/dev-tools/', key: 'devTools' },


    /// START HERE :::: DO NOT REMOVE the strings above, it's a work around for header on mobile /// 
    { text: 'Visão geral', header: true, anchor: true, slug: '/documentacao/produtos/secure/visao-geral/', key: 'secureOverview', hasLabel: 'menu.secure' },
    { text: 'Proteja sua aplicação', header: true, anchor: true, slug: '/documentacao/produtos/secure/proteja-aplicacao/', key: 'secureApps' },
    { text: 'Proteja sua infraestrutura', header: true, anchor: true, slug: '/documentacao/produtos/secure/proteja-infraestrutura/', key: 'secureInfra' },
    { text: 'Proteja seu DNS', header: true, anchor: true, slug: '/documentacao/produtos/secure/proteja-dns/', key: 'secureDns', addBorder: true },

    {
        text: 'Edite um firewall', header: true, type: 'learn', key: 'editEdgeFirewall', hasLabel: 'menu.edgeFirewall', children: [
            { text: 'Configure main settings', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/guias/secure/edge-firewall-definir-main-settings/', key: 'secureMainSettings' },
            { text: 'Instancie uma edge function', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/guias/secure/instanciar-edge-functions/', key: 'secureFunctions' },
            { text: 'Trabalhe com rules engine', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/guias/secure/trabalhar-com-rules-engine/', key: 'secureRules' },

        ]
    },

    {
        text: 'Configurações avançadas', header: true, type: 'learn', key: 'secureAdvancedConfig', children: [
            { text: 'Gerencie bots', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/guias/secure/gerenciar-bots/', key: 'manageBots', hasLabel: 'menu.secureAdvanced' },
            { text: 'Ative proteção contra DDoS', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/guias/secure/ativar-ddos/', key: 'activateDdos' },
            { text: 'Adicione uma rule set de WAF', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/guias/secure/criar-waf-rule-set/', key: 'wafRuleSet' },
            { text: 'Tune WAF', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/guias/secure/tune-waf/', key: 'tuneWaf' },
            { text: 'Bloqueie redes Tor', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/guias/secure/bloquear-redes-tor/', key: 'blockTor' },
        ]
    },


    { text: 'Selecione cifras TLS', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/guias/secure/cifras/', key: 'ciphers', hasLabel: 'menu.secureTransportLayerSecurity' },
    { text: 'Configure mTLS', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/guias/secure/mtls/', key: 'mtls' },
    { text: 'Gerencie certificados digitais', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/guias/secure/certificado-digital', key: 'digitalCertificates' },


    { text: 'Edge Functions', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/secure/automarizar/functions/', key: 'automateEdgeFunctions', hasLabel: 'menu.secureAutomate' },
    { text: 'SDK', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/secure/automarizar/sdk/', key: 'automateSdk' },
    { text: 'Terraform', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/secure/automarizar/terraform/', key: 'automateTerraform' },
    { text: 'Proteja origem', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/secure/automarizar/origin-shield/', key: 'automateOriginShield' },
    { text: 'Integre com SIEMs', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/secure/automarizar/integrar-siems/', key: 'automateIntegrateSiems' },


    { text: 'Monitore métricas', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/secure/troubleshoot/edge-firewall-monitorar-metricas/', key: 'firewallUnderstandMetrics', hasLabel: 'menu.secureTroubleshoot', addBorder: true },


    {
        text: 'Edite uma zona', header: true, type: 'learn', key: 'editIntelligentDns', hasLabel: 'menu.intelligentDns', children: [
            { text: 'Configure main settings', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/guias/secure/edge-dns-definir-main-settings/', key: 'intelligentDnsMainSettings' },
            { text: 'Adicione registros', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/guias/secure/adicionar-registros/', key: 'addRecords' },

        ]
    },

    {
        text: 'Configurações avançadas', header: true, type: 'learn', key: 'secureAdvancedConfig', children: [
            { text: 'Acesse root domain', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/guias/secure/acessar-root-domain/', key: 'anames', hasLabel: 'menu.secureAdvanced' },
            { text: 'Ative DNSSEC', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/guias/secure/ativar-dnssec/', key: 'activateDnssec' },
            { text: 'Autentique certificado Let\'s Encrypt', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/guias/secure/registro-lets-encrypt/', key: 'authenticateLetsEncryptCertificate' },
            { text: 'Realize balanceamento de carga', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/guias/secure/balanceamento-de-carga-dns/', key: 'dnsLoadBalance' },
        ]
    },


    { text: 'Monitore metricas', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/secure/troubleshoot/edge-dns-monitorar-metricas/', key: 'intelligentDnsUnderstandMetrics', hasLabel: 'menu.secureTroubleshoot' },
    { text: 'Teste uma zona', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/guias/secure/testar-zona/', key: 'testZone' },


] as const;
