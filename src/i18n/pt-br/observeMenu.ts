
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
	{ text: 'Guias', header: true, onlyMobile: true, anchor: true, slug: '/documentacao/produtos/guias/', key: 'guides' },
	{ text: 'Dev Tools', header: true, onlyMobile: true, anchor: true, slug: '/documentacao/produtos/dev-tools/', key: 'devTools' },
	{ text: 'Learn', header: true, onlyMobile: true, anchor: true, slug: 'https://learn.azion.com/', key: 'Learn' },


    /// START HERE :::: DO NOT REMOVE the strings above, it's a work around for header on mobile /// 
    { text: 'Visão geral', header: true, anchor: true, slug: '/documentacao/produtos/observe/visao-geral/', key: 'observeOverview', hasLabel: 'menu.secure' },
    { text: 'Observe métricas', header: true, anchor: true, slug: '/documentacao/produtos/observe/observe-metriccas/', key: 'observeMetrics' },
    { text: 'Observe logs', header: true, anchor: true, slug: '/documentacao/produtos/observe/observe-logs/', key: 'observeLogs' },
    { text: 'Transmita dados', header: true, anchor: true, slug: '/documentacao/produtos/observe/transmita-dados/', key: 'streamData', addBorder: true },


    /// REAL-TIME EVENTS ///

    {
        text: 'Analise logs', header: true, type: 'learn', key: 'observeanalyzeLogs', hasLabel: 'menu.realTimeEvents', children: [
            { text: 'Entenda logs', header: true, anchor: true, type: 'learn', slug: 'xx', key: 'observeUnderstandLogs' },
            { text: 'Adicione filtros', header: true, anchor: true, type: 'learn', slug: 'xx', key: 'observeEventsAddFilters' },
            { text: 'Use GraphQL API', header: true, anchor: true, type: 'learn', slug: 'documentacao/produtos/graphql-api/visao-geral/', key: 'observeGql' },
            { text: 'Use o playground da GraphQL API', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/devtools/playground-graphql/', key: 'observeGqlPlayground' },

        ]
    },


    { text: 'xxx', header: true, anchor: true, type: 'learn', slug: 'xxx', key: 'xxx', hasLabel: 'menu.afterQueryingLogs' },
    { text: 'xxx', header: true, anchor: true, type: 'learn', slug: 'xxx', key: 'xxx' },
    { text: 'xxx', header: true, anchor: true, type: 'learn', slug: 'xxx', key: 'xxx' },


    {
        text: 'Integre com Grafana', header: true, type: 'learn', key: 'observeIntegrateGrafana', hasLabel: 'menu.edgeFirewall', children: [
            { text: 'Personalize uma tabela de logs', header: true, anchor: true, type: 'learn', slug: 'xx', key: 'observeCustomizeTableGrafana' },
            { text: 'Use melhores práticas', header: true, anchor: true, type: 'learn', slug: 'xx', key: 'observeBestPracticesGrafana' },

        ]
    },

    /// DATA STREAMING//

   {
        text: 'Edite um streaming', header: true, type: 'learn', key: 'observeEditDataStreaming', hasLabel: 'menu.dataStreaming', children: [
            { text: 'Configure main settings', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/guias/como-usar-data-streaming/', key: 'observeConfigureMainSettings' },
            { text: 'Adicione um payload', header: true, anchor: true, type: 'learn', slug: 'xx', key: 'observeSetPayload' },
        ]
    },


    { text: 'Apache Kafka', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/guias/observe/conector-apache-kafka/', key: 'observeIntegrationsApache', hasLabel: 'menu.observeIntegrations' },
    { text: 'AWS Kinesis Data Firehose', header: true, anchor: true, type: 'learn', slug: 'xxx', key: 'observeIntegrationsAws' },
    { text: 'Azure Blob Storage', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/guias/azure-blob-endpoint/', key: 'observeIntegrationsBlob' },
    { text: 'Azure Monitor', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/guias/azure-monitor-endpoint/', key: 'observeIntegrationsMonitor' },
    { text: 'Datadog', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/guias/datadog-endpoint/', key: 'observeIntegrationsDatadog' },
    { text: 'Elasticsearch', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/guias/elasticsearch-endpoint/', key: 'observeIntegrationsElasticsearch' },
    { text: 'Google BigQuery', header: true, anchor: true, type: 'learn', slug: 'xxx', key: 'observeIntegrationsBigQuery' },
    { text: 'IBM QRadar', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/guias/observe/conector-ibm-qradar/', key: 'observeIntegrationsQRadar' },
    { text: 'S3 - Simple Storage Service', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/guias/amazon-s3-endpoint/', key: 'observeIntegrationsS3' },
    { text: 'Splunk', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/guias/splunk-endpoint/', key: 'observeIntegrationsSplunk' },
    { text: 'Standard HTTP/HTTPS POST', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/guias/observe/conector-standard-https-post/', key: 'observeIntegrationsStandardHttp' },


    { text: 'Configure sampling', header: true, anchor: true, type: 'learn', slug: 'xx', key: 'observeConfigureSampling', hasLabel: 'menu.observeAdvanced' },
    { text: 'Selecione variáveis', header: true, anchor: true, type: 'learn', slug: 'xx', key: 'observeSelectVariables' },

    { text: 'Monitore métricas', header: true, anchor: true, type: 'learn', slug: 'xx', key: 'observeDtsUndersandMetrics', hasLabel: 'menu.observeTroubleshoot' },

    /// REAL-TIME METRICS ///

    {
        text: 'Monitore métricas', header: true, type: 'learn', key: 'observeMonitorMetrics', hasLabel: 'menu.realTimeEvents', children: [
            { text: 'Analise métricas', header: true, anchor: true, type: 'learn', slug: 'xx', key: 'observeAnalyzeMetrics' },
            { text: 'Adicione filtros', header: true, anchor: true, type: 'learn', slug: 'xx', key: 'observeMetricsAddFilters' },
            { text: 'Use GraphQL API', header: true, anchor: true, type: 'learn', slug: 'documentacao/produtos/graphql-api/visao-geral/', key: 'observeGql' },
            { text: 'Use o playground da GraphQL API', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/devtools/playground-graphql/', key: 'observeGqlPlayground' },
        ]
    },


    {
        text: 'Integre com Grafana', header: true, type: 'learn', key: 'observeIntegrateGrafana', hasLabel: 'menu.observeIntegrations', children: [
            { text: 'Personalize um dashboard', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/guias/azion-plugin-grafana/', key: 'observeCustomizeDash' },
            { text: 'Use um dashboard pré-configurado', header: true, anchor: true, type: 'learn', slug: '/produtos/guias/azion-plugin-grafana-dash-pre-configurado/', key: 'observePreBuiltDash' },
            { text: 'Use melhores práticas', header: true, anchor: true, type: 'learn', slug: 'xx', key: 'observeBestPracticesGrafana' },

        ]
    },


] as const;
