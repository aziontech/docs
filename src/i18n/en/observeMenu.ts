
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
    { text: 'Dev Tools', header: true, onlyMobile: true, anchor: true, type: 'learn', slug: '/documentation/products/dev-tools/', key: 'devTools' },
    { text: 'Learn', header: true, onlyMobile: true, anchor: true, type: 'learn', slug: 'https://learn.azion.com/', key: 'Learn' },

    
    /// START HERE :::: DO NOT REMOVE the strings above, it's a work around for header on mobile /// 
    { text: 'Overview', header: true, anchor: true, slug: '/documentation/products/observe/overview/', key: 'secureOverview', hasLabel: 'menu.secure' },
    { text: 'Observe metrics', header: true, anchor: true, slug: '/documentation/products/observe/observe-metrics/', key: 'secureApps' },
    { text: 'Observe logs', header: true, anchor: true, slug: '/documentation/products/observe/observe-logs/', key: 'secureInfra' },
    { text: 'Stream data', header: true, anchor: true, slug: '/documentation/products/observe/stream-data/', key: 'secureDns', addBorder: true },


        /// REAL-TIME EVENTS ///

    {
        text: 'Analyze logs', header: true, type: 'learn', key: 'observeanalyzeLogs', hasLabel: 'menu.realTimeEvents', children: [
            { text: 'Understand logs', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/observe/understand-logs/', key: 'observeUnderstandLogs' },
            { text: 'Add filters', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/observe/add-filters-events', key: 'observeEventsAddFilters' },
            { text: 'GraphQL API', header: true, anchor: true, type: 'learn', slug: '/documentation/devtools/graphql-api/overview/', key: 'observeGql' },
            { text: 'Use GraphQL API playground', header: true, anchor: true, type: 'learn', slug: '/documentation/products/devtools/graphql-playground/', key: 'observeGqlPlayground' },
            
        ]
    },


    { text: 'xxx', header: true, anchor: true, type: 'learn', slug: '/documentation/products/observe/', key: 'xxx', hasLabel: 'menu.afterQueryingLogs' },
    { text: 'xxx', header: true, anchor: true, type: 'learn', slug: '/documentation/products/observe/', key: 'xxx' },
    { text: 'xxx', header: true, anchor: true, type: 'learn', slug: '/documentation/products/observe/', key: 'xxx' },


    { text: 'Integrate with Grafana', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/observe/integrate-grafana', key: 'observeIntegrateGrafana', hasLabel: 'menu.observeIntegrations' },
    { text: 'Customize log table on Grafana', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/observe/azion-plugin-grafana-customize-log-table/', key: 'observeCustomizeTableGrafana' },
    { text: 'Use best practices on Grafana', header: true, anchor: true, type: 'learn', slug: '/documentation/products/observe/', key: 'observeBestPracticesGrafana' },

    /// DATA STREAMING ///

    {
        text: 'Edit a data streaming', header: true, type: 'learn', key: 'observeEditDataStreaming', hasLabel: 'menu.dataStreaming', children: [
            { text: 'Configure main settings', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/use-data-streaming/', key: 'observeConfigureMainSettings' },
            { text: 'Set a payload', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/observe/data-streaming-set-payload/', key: 'observeSetPayload' },
            
        ]
    },

    { text: 'Apache Kafka', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/observe/connector-apache-kafka/', key: 'observeIntegrationsApache', hasLabel: 'menu.observeIntegrations' },
    { text: 'AWS Kinesis Data Firehose', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/endpoint-amazon-kinesis/', key: 'observeIntegrationsAws' },
    { text: 'Azure Blob Storage', header: true, anchor: true, type: 'learn', slug: 'documentation/products/guides/endpoint-azure-blob/', key: 'observeIntegrationsBlob' },
    { text: 'Azure Monitor', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/endpoint-azure-monitor/', key: 'observeIntegrationsMonitor' },
    { text: 'Datadog', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/endpoint-datadog/', key: 'observeIntegrationsDatadog' },
    { text: 'Elasticsearch', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/endpoint-elasticsearch/', key: 'observeIntegrationsElasticsearch' },
    { text: 'Google BigQuery', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/endpoint-google-bigquery/', key: 'observeIntegrationsBigQuery' },
    { text: 'IBM QRadar', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/observe/connector-ibm-qradar/', key: 'observeIntegrationsQRadar' },
    { text: 'S3 - Simple Storage Service', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/endpoint-amazon-s3/', key: 'observeIntegrationsS3' },
    { text: 'Splunk', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/endpoint-splunk/', key: 'observeIntegrationsSplunk' },
    { text: 'Standard HTTP/HTTPS POST', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/observe/connector-standard-https-post/', key: 'observeIntegrationsStandardHttp' },




    { text: 'Configure sampling', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/observe/configure-sampling/', key: 'observeConfigureSampling', hasLabel: 'menu.observeAdvanced' },
    { text: 'Select variables', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/observe/data-streaming-select-variables/', key: 'observeSelectVariables' },  


    { text: 'Understand metrics', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/observe/data-streaming-understand-metrics/', key: 'observeDtsUndersandMetrics', hasLabel: 'menu.observeTroubleshoot', addBorder: true },


    /// REAL-TIME METRICS ///

    {
        text: 'Monitor metrics', header: true, type: 'learn', key: 'observeMonitorMetrics', hasLabel: 'menu.realTimeEvents', children: [
            { text: 'Analyze metrics', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/observe/analyze-metrics/', key: 'observeAnalyzeMetrics' },
            { text: 'Add filters', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/observe/add-filters-metrics/', key: 'observeMetricsAddFilters' },
            { text: 'GraphQL API', header: true, anchor: true, type: 'learn', slug: '/documentation/devtools/graphql-api/overview/', key: 'observeGql' },
            { text: 'Use GraphQL API playground', header: true, anchor: true, type: 'learn', slug: '/documentation/products/devtools/graphql-playground/', key: 'observeGqlPlayground' },
            
        ]
    },

    { text: 'Integrate with Grafana', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/observe/integrate-grafana', key: 'observeIntegrateGrafana', hasLabel: 'menu.observeIntegrations' },
    { text: 'Customize dashboard on Grafana', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/azion-plugin-grafana/', key: 'observeCustomizeDash' },
    { text: 'Use pre-built dashboard on Grafana', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/azion-plugin-grafana-pre-built-dash/', key: 'observePreBuiltDash' },
    { text: 'Use best practices on Grafana', header: true, anchor: true, type: 'learn', slug: '/documentation/products/observe/', key: 'observeBestPracticesGrafana' },


] as const;
