/**
 * This configures the navigation sidebar.
 * All other languages follow this ordering/structure and will fall back to
 * English for any entries they haven’t translated.
 *
 * - All entries MUST include `text` and `key`
 * - Heading entries MUST include `header: true` and `type`
 * - Link entries MUST include `slug` (which excludes the language code)
 */
import { NavDictionary } from '../translation-checkers';

export default NavDictionary([

	/**{ text: 'Core concepts', header: true, anchor: true, type: 'learn', slug: '/documentation/products/core-concepts/', key: 'beforeBegin/core', hasLabel:'menu.begin' },

	{ text: 'Understand your account WIP', header: true, anchor: true, type: 'learn', slug: '/documentation/', key: 'accountsProfile/createAccount' },

	{ text: 'Get help', header: true, anchor: true, type: 'learn', slug: 'documentation/products/get-help/', key: 'getHelp' },

	{ text: 'Welcome to the edge', header: true, anchor: true, type: 'learn', slug: '/documentation/products/get-started/', key: 'getStarted/welcome', hasLabel: "menu.getStarted" },
	{ text: 'Start with a template', header: true, anchor: true, type: 'learn', slug: '/documentation/products/start-with-a-template/', key: 'getStarted/template' },
	{ text: 'Go live with Azion', header: true, anchor: true, type: 'learn', slug: '/documentation/products/go-live-with-azion/', key: 'getStarted/goLive' },
	{ text: 'View metrics', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/use-real-time-metrics/', key: 'getStarted/viewMetrics', addBorder: true },


	{ text: 'Build', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/build/overview/', key: 'build', hasLabel: 'menu.journey' },
	{ text: 'Secure', header: true, anchor: true, type: 'learn', slug: 'documentation/products/secure', key: 'secure' },
	{ text: 'Deploy', header: true, anchor: true, type: 'learn', slug: 'documentation/products/deploy', key: 'deploy' },
	{ text: 'Observe', header: true, anchor: true, type: 'learn', slug: 'documentation/products/observe', key: 'observe' },

	{ text: 'Configure a domain', header: true, anchor: true, type: 'learn', key: 'configureDomain', slug: '/documentation/products/guides/configure-a-domain/', hasLabel: 'menu.domains' },
	{ text: 'Create digital certificate', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/create-a-digital-certificate/', key: 'certificateDomain' },
	{ text: 'Point domain to Azion', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/point-domain-to-azion/', key: 'pointDomain' },
	{ text: 'Migrate NS to Azion', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/migrate-ns-to-azion/', key: 'migrateDomain' },




	{ text: 'Create account', header: true, anchor: true, type: 'learn', key: 'account/createAccount', slug: '/documentation/products/accounts/creating-account/', hasLabel: 'menu.account' },

	{
		text: 'Manage account', header: true, type: 'learn', key: 'accountsAccount', children: [
			{ text: 'Users', header: true, anchor: true, type: 'learn', key: 'account/Users', slug: '/documentation/products/guides/users-management/' },
			{ text: 'Teams permissions', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/teams-permissions/', key: 'account/teamsPermissions' },
			{ text: 'Activity history', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/activity-history/', key: 'account/activityHistory' },
			{ text: 'Credentials', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/credentials/' },
			{ text: 'SSO', header: true, anchor: true, type: 'learn', slug: 'documentation/products/guides/sso/', key: 'account/sso' },
			{ text: 'MFA', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/multi-factor-authentication/', key: 'account/mfa' },
			{ text: 'Billing and subscription', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/billing-and-subscriptions/', key: 'account/billingAndSubscriptions' },
		]
	},


	{
		text: 'Manage profile', header: true, type: 'learn', key: 'accountsProfile', addBorder: true, children: [
			{ text: 'Personal tokens', header: true, anchor: true, type: 'learn', key: 'accountsProfile/personalTokens', slug: '/documentation/products/guides/personal-tokens/' },
			{ text: 'Settings', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/account-settings/', key: 'accountsProfile/settings' },
			{ text: 'Delete account', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/delete-account/', key: 'accountsProfile/deleteAccount' },
		]
	},


	{
		text: 'Developer tools', header: true, type: 'learn', key: 'accountsProfile', hasLabel: 'menu.addResources', children: [
			{ text: 'API', header: true, anchor: true, type: 'learn', key: 'devtools/api', slug: 'https://api.azion.com/' },
			{ text: 'CLI', header: true, anchor: true, type: 'learn', key: 'devtools/cli', slug: '/documentation/products/cli/' },
			{ text: 'API GraphQL Playground', header: true, anchor: true, type: 'learn', slug: '/documentation/products/devtools/graphql-playground/', key: 'devtools/graphQLplayground' },
			{ text: 'Edge Runtime', header: true, anchor: true, type: 'learn', slug: '/documentation/products/edge-application/edge-functions/runtime/overview/', key: 'devtools/runtime' },
			{ text: 'SDK', header: true, anchor: true, type: 'learn', slug: '/documentation/devtools/sdk/go/', key: 'devtools/sdk' },
			{ text: 'Terraform', header: true, anchor: true, type: 'learn', slug: '/documentation/products/terraform-provider/', key: 'devtools/terraform' },
			{ text: 'Platform Kit WIP', header: true, anchor: true, type: 'learn', slug: '/documentation/', key: 'devtools/platformKit' },
			{ text: 'GitHub', header: true, anchor: true, type: 'learn', slug: 'https://github.com/aziontech/', key: 'devtools/gitHub' },

		]
	},

	{ text: 'Migrate to Azion WIP', header: true, anchor: true, type: 'learn', slug: '/documentation/', key: 'migrateAzion' },

	{
		text: 'Templates and integrations WIP', header: true, type: 'learn', key: 'accountsProfile', addBorder: true, children: [
			{ text: 'Understand Azion Templates WIP', header: true, anchor: true, type: 'learn', key: 'templatesIntegrations/understandTemplates', slug: '/documentation/' },
			{ text: 'Use a template WIP', header: true, anchor: true, type: 'learn', key: 'templatesIntegrations/useTemplate', slug: '/documentation/' },
			{ text: 'Build an integration WIP', header: true, anchor: true, type: 'learn', slug: '/documentation/', key: 'templatesIntegrations/buildIntegration' },
			{ text: 'Create and publish a template WIP', header: true, anchor: true, type: 'learn', slug: '/documentation/', key: 'templatesIntegrations/createPublishTemplate' },
		]
	},


	{
		text: 'Build', header: true, type: 'learn', key: 'accountsProfile', hasLabel: 'menu.reference', children: [
			{ text: 'Edge Application', header: true, anchor: true, type: 'learn', key: 'reference/edgeApplication', slug: '/documentation/products/edge-application/' },
			{ text: 'Application Acceleration', header: true, anchor: true, type: 'learn', key: 'reference/applicationAcceleration', slug: '/documentation/products/edge-application/application-acceleration/' },
			{ text: 'Edge Caching', header: true, anchor: true, type: 'learn', key: 'reference/edgeCaching', slug: '/documentation/products/edge-application/edge-caching/' },
			{ text: 'Edge Functions', header: true, anchor: true, type: 'learn', key: 'reference/edge Functions', slug: '/documentation/products/edge-application/edge-functions/' },
			{ text: 'Image Processor', header: true, anchor: true, type: 'learn', key: 'reference/imageProcessor', slug: '/documentation/products/edge-application/image-processor/' },
			{ text: 'Load Balancer', header: true, anchor: true, type: 'learn', key: 'reference/loadBalancer', slug: '/documentation/products/edge-application/load-balancer/' },
			{ text: 'L2 Caching', header: true, anchor: true, type: 'learn', key: 'reference/l2Caching', slug: '/documentation/products/edge-application/l2-caching/' },
			{ text: 'Cache Settings', header: true, anchor: true, type: 'learn', key: 'reference/cacheSettings', slug: '/documentation/products/edge-application/cache-settings/' },
			{ text: 'Edge Functions Instances', header: true, anchor: true, type: 'learn', key: 'reference/edgeFunctionsInstancesApplication', slug: '/documentation/products/edge-application/edge-functions-instances/' },
			{ text: 'Device Groups', header: true, anchor: true, type: 'learn', key: 'reference/deviceGroups', slug: '/documentation/products/edge-application/device-groups/' },
			{ text: 'Digital Certificates', header: true, anchor: true, type: 'learn', key: 'reference/digitalCertificates', slug: '/documentation/products/edge-application/digital-certificates/' },
			{ text: 'Error Responses', header: true, anchor: true, type: 'learn', key: 'reference/errorResponses', slug: '/documentation/products/edge-application/error-responses/' },
			{ text: 'Origins', header: true, anchor: true, type: 'learn', key: 'reference/origins', slug: '/documentation/products/edge-application/origins/' },
			{ text: 'Real-Time Purge', header: true, anchor: true, type: 'learn', key: 'reference/realTimePurge', slug: '/documentation/products/edge-application/real-time-purge/' },
			{ text: 'Rules Engine', header: true, anchor: true, type: 'learn', key: 'reference/rulesEngineedgeApplication', slug: '/documentation/products/edge-application/rules-engine/' },
		]
	},
	{
		text: 'Secure', header: true, type: 'learn', key: 'accountsProfile', children: [
			{ text: 'Edge Firewall', header: true, anchor: true, type: 'learn', key: 'reference/edgeFirewall', slug: '/documentation/products/edge-firewall/' },
			{ text: 'DDoS Protection', header: true, anchor: true, type: 'learn', key: 'reference/ddosProtection', slug: '/documentation/products/edge-firewall/ddos-protection/' },
			{ text: 'DDoS Mitigation', header: true, anchor: true, type: 'learn', key: 'reference/ddosMitigation', slug: '/documentation/products/edge-firewall/ddos-protection/ddos-mitigation/' },
			{ text: 'Network Layer Protection', header: true, anchor: true, type: 'learn', key: 'reference/networkLayerProtection', slug: '/documentation/products/edge-firewall/network-layer-protection/' },
			{ text: 'Network Lists', header: true, anchor: true, type: 'learn', key: 'reference/networkLists', slug: '/documentation/products/edge-firewall/network-layer-protection/network-lists/' },
			{ text: 'Web Application Firewall', header: true, anchor: true, type: 'learn', key: 'reference/webApplicationFirewall', slug: '/documentation/products/edge-firewall/web-application-firewall/' },
			{ text: 'WAF Rule Sets', header: true, anchor: true, type: 'learn', key: 'reference/wafRuleSets', slug: '/documentation/products/edge-firewall/waf-rule-sets/' },
			{ text: 'WAF Custom Allowed Rules', header: true, anchor: true, type: 'learn', key: 'reference/wafCustomAllowedRules', slug: '/documentation/products/edge-firewall/web-application-firewall/waf-custom-allowed-rules/' },
			{ text: 'Edge Functions', header: true, anchor: true, type: 'learn', key: 'reference/edgeFunctionsFirewall', slug: '/documentation/products/edge-firewall/edge-functions/firewall/' },
			{ text: 'Edge Functions Instances', header: true, anchor: true, type: 'learn', key: 'reference/edgeFunctionsInstancesFirewall', slug: '/documentation/products/edge-firewall/edge-functions-instances/' },
			{ text: 'Access Permissions', header: true, anchor: true, type: 'learn', key: 'reference/accessPermissions', slug: '/documentation/products/edge-firewall/access-permissions/' },
			{ text: 'Rules Engine', header: true, anchor: true, type: 'learn', key: 'reference/rulesEngineFirewall', slug: '/documentation/products/edge-firewall/rules-engine/' },
			{ text: 'Intelligent DNS', header: true, anchor: true, type: 'learn', key: 'reference/intelligentDNS', slug: '/documentation/products/intelligent-dns/' },
			{ text: 'DNSSEC Compatibility', header: true, anchor: true, type: 'learn', key: 'reference/dnssecCompatibility', slug: '/documentation/products/intelligent-dns/dnssec-compatibility/' },

		]
	},
	{
		text: 'Deploy', header: true, type: 'learn', key: 'accountsProfile', children: [
			{ text: 'Edge Orchestrator', header: true, anchor: true, type: 'learn', key: 'reference/edgeOrchestrator', slug: '/documentation/products/edge-orchestrator/' },
			{ text: 'Edge Services', header: true, anchor: true, type: 'learn', key: 'reference/edgeServices', slug: '/documentation/products/edge-orchestrator/edge-services/' },
			{ text: 'Edge Node', header: true, anchor: true, type: 'learn', key: 'reference/edgeNode', slug: '/documentation/products/edge-orchestrator/edge-node/' },

		]
	},
	{
		text: 'Observe', header: true, type: 'learn', key: 'accountsProfile', children: [
			{ text: 'Data Streaming', header: true, anchor: true, type: 'learn', key: 'reference/dataStreaming', slug: '/documentation/products/data-streaming/' },
			{ text: 'Edge Pulse', header: true, anchor: true, type: 'learn', key: 'reference/edgePulse', slug: '/documentation/products/edge-pulse/' },
			{ text: 'Real-Time Events', header: true, anchor: true, type: 'learn', key: 'reference/realTimeEvents', slug: '/documentation/products/real-time-events/' },
			{ text: 'Real-Time Metrics', header: true, anchor: true, type: 'learn', key: 'reference/realTimeMetrics', slug: '/documentation/products/real-time-metrics/' },
			{ text: 'Historical Real-Time Metrics', header: true, anchor: true, type: 'learn', key: 'reference/historicalRealTimeMetrics', slug: '/documentation/products/historical-real-time-metrics/' },

		]
	},
	{
		text: 'Marketplace', header: true, type: 'learn', key: 'mktp', children: [
			{ text: 'Marketplace', header: true, anchor: true, type: 'learn', key: 'mktp', slug: '/documentation/products/marketplace/' },
			{ text: 'Marketplace Independent Software Vendor', header: true, anchor: true, type: 'learn', key: 'mktp/isv', slug: '/documentation/products/marketplace/isv-signup/' },
			{ text: 'Marketplace Seller Guide', header: true, anchor: true, type: 'learn', key: 'mktp/sellerGuide', slug: '/documentation/products/marketplace/marketplace-seller-guide/' },
		]
	},

	{
        text: 'Professional Services', header: true, type: 'learn', key: 'professionalServices', children: [
            { text: 'Service Plans', header: true, anchor: true, type: 'learn', key: 'professionalServices/servicePlans', slug: '/documentation/services/service-plans/' },
            { text: 'Integration Services', header: true, anchor: true, type: 'learn', slug: '/documentation/services/solutions-lab/integration-services/', key: 'professionalServices/integrationServices' },
            { text: 'Technical Account Manager', header: true, anchor: true, type: 'learn', slug: '/documentation/services/technical-account-manager/', key: 'professionalServices/TAM' },
            { text: 'Best Practices Review', header: true, anchor: true, type: 'learn', slug: '/documentation/services/best-practices-review/', key: 'professionalServices/bestPracticesReview' },
            { text: 'Custom Education Programs', header: true, anchor: true, type: 'learn', slug: '/documentation/services/custom-education-programs/', key: 'professionalServices/customEducationPrograms' },
            { text: 'Security Response Team', header: true, anchor: true, type: 'learn', slug: '/documentation/services/security-response-team/', key: 'professionalServices/SRT' },
            { text: 'Technical Support', header: true, anchor: true, type: 'learn', slug: '/documentation/services/support/', key: 'professionalServices/technicalSupport' },
            { text: 'Business Events Support', header: true, anchor: true, type: 'learn', slug: '/documentation/services/business-events-support/', key: 'professionalServices/businessEventsSupport' },
            { text: 'Slack Channel', header: true, anchor: true, type: 'learn', slug: '/documentation/services/slack-channel/', key: 'professionalServices/SlackChannel' },
        ]
    },

	{
		text: 'Limits WIP', header: true, anchor: true, type: 'learn', slug: '/documentation/', key: 'limits'
	},

	{
		text: 'Glossary', header: true, anchor: true, type: 'learn', slug: '/documentation/products/azion-glossary/', key: 'glossary', addBorder: true
	},


	{
		text: 'System Status', header: true, anchor: true, type: 'learn', slug: 'https://status.azion.com/', key: 'systemStatus'
	},

	{
		text: 'Agreements', header: true, anchor: true, type: 'learn', slug: '/documentation/agreements/', key: 'agreements'
	},

	{
		text: 'Azion Network Program', header: true, anchor: true, type: 'learn', slug: '/documentation/products/azion-network-program/', key: 'azionNetworkProgram'
	},


**/

    { text: 'Core concepts',  slug: '/documentation/products/core-concepts/', key: 'beforeBegin/core' },

	/**

	{ text: 'Ponto de Partida', slug: 'documentacao/produtos/ponto-de-partida/', key: 'gettingStarted' },

	{ text: 'Contas e Perfil', key: 'accountsProfile' },
	{ text: 'Criar uma Conta', slug: 'documentacao/produtos/gestao-de-contas/criar-conta', key: 'accountsProfile/createAccount' },
	{ text: 'Account Settings', slug: 'documentacao/produtos/gestao-de-contas/account-settings', key: 'accountsProfile/settings' },
	{ text: 'Users Managements', slug: 'documentacao/produtos/gestao-de-contas/usuarios-e-times', key: 'accountsProfile/usersManagement' },
	{ text: 'Faturamento', slug: 'documentacao/produtos/gestao-de-contas/faturamento', key: 'accountsProfile/billing' },
	{ text: 'Credenciais', slug: 'documentacao/produtos/credenciais/', key: 'accountsProfile/credentials' },
	{ text: 'Activity History', slug: 'documentacao/produtos/gestao-de-contas/activity-history', key: 'accountsProfile/activityHistory' },
	{ text: 'Teams Permissions', slug: 'documentacao/produtos/gestao-de-contas/teams-permissions', key: 'accountsProfile/teamsPermissions' },
	{ text: 'Single Sign-On (SSO)', slug: 'documentacao/produtos/gestao-de-contas/single-sign-on', key: 'accountsProfile/singleSignOn' },
	{ text: 'Your Settings', slug: 'documentacao/produtos/gestao-de-contas/your-settings', key: 'accountsProfile/yourSettings' },
	{ text: 'Personal Tokens', slug: 'documentacao/produtos/gestao-de-contas/personal-tokens', key: 'accountsProfile/personalTokens' },
	{ text: 'Login Social', slug: 'documentacao/produtos/gestao-de-contas/social-login', key: 'accountsProfile/socialLogin' },
	{ text: 'Grupos e Clientes', slug: 'documentacao/produtos/gestao-de-contas/clients', key: 'accountsProfile/GroupsAndClients' },
	{ text: 'Multi-Factor Authentication', slug: 'documentacao/produtos/gestao-de-contas/multi-factor-authentication', key: 'accountsProfile/multiFactorAuth' },

	{ text: 'Edge Application', slug: 'documentacao/produtos/edge-application', key: 'edgeApplication' },
	{ text: 'Application Acceleration', slug: 'documentacao/produtos/edge-application/application-acceleration', key: 'applicationAcceleration' },
	{ text: 'Edge Caching', slug: 'documentacao/produtos/edge-application/edge-caching', key: 'edgeCaching' },
	{ text: 'Edge Functions', slug: 'documentacao/produtos/edge-application/edge-functions', key: 'edgeFunctions' },
	{ text: 'Image Processor', slug: 'documentacao/produtos/edge-application/image-processor', key: 'imageProcessor' },
	{ text: 'Load Balancer', slug: 'documentacao/produtos/edge-application/load-balancer', key: 'loadBalancer' },

	{ text: 'Edge Firewall', slug: 'documentacao/produtos/edge-firewall', key: 'edgefirewall' },
	{ text: 'DDoS Protection', slug: 'documentacao/produtos/edge-firewall/ddos-protection', key: 'ddosProtection' },
	{ text: 'Network Layer Protection', slug: 'documentacao/produtos/edge-firewall/network-layer-protection', key: 'networkLayerProtection' },
	{ text: 'Web Application Firewall', slug: 'documentacao/produtos/edge-firewall/web-application-firewall', key: 'webApplicationFirewall' },
	{ text: 'Intelligent DNS', slug: 'documentacao/produtos/intelligent-dns', key: 'intelligentDNS' },


	{ text: 'Edge Orchestrator', slug: 'documentacao/produtos/edge-orchestrator', key: 'edgeOrchestrator' },
	{ text: 'Edge Node', slug: 'documentacao/produtos/edge-orchestrator/edge-node', key: 'edgeNode' },
	{ text: 'Edge Services', slug: 'documentacao/produtos/edge-orchestrator/edge-services', key: 'edgeServices' },

	{ text: 'Data Streaming', slug: 'documentacao/produtos/data-streaming', key: 'dataStreaming' },
	{ text: 'Edge Pulse', slug: 'documentacao/produtos/edge-pulse', key: 'edgePulse' },
	{ text: 'Real-Time Events', slug: 'documentacao/produtos/real-time-events', key: 'realTimeEvents' },
	{ text: 'Real-Time Metrics', slug: 'documentacao/produtos/real-time-metrics', key: 'realTimeMetrics' },

	{ text: 'Marketplace', slug: 'documentacao/produtos/marketplace', key: 'marketplace' },

	{ text: 'Technical Support', slug: '/documentacao/servicos/suporte/', key: 'technicalSupport' },

	{ text: 'Integration Services', slug: '/documentacao/servicos/solutions-lab/integration-services/', key: 'professionalServices/integrationServices' },
	{ text: 'Technical Account Manager', slug: '/documentacao/servicos/technical-account-manager/', key: 'professionalServices/TAM' },
	{ text: 'Best Practices Review', slug: '/documentacao/servicos/best-practices-review/', key: 'professionalServices/bestPracticesReview' },
	{ text: 'Custom Education Programs', slug: '/documentacao/servicos/custom-education-programs/', key: 'professionalServices/customEducationPrograms' },
	{ text: 'Security Response Team', slug: '/documentacao/servicos/security-response-team/', key: 'professionalServices/SRT' },
	{ text: 'Business Events Support', slug: '/documentacao/servicos/business-events-support/', key: 'professionalServices/businessEventsSupport' },
	{ text: 'Slack Channel', slug: '/documentacao/servicos/slack-channel/', key: 'professionalServices/SlackChannel' },


	{ text: 'API', slug: 'https://api.azion.com', key: 'api' },
	{ text: 'GraphQL API', slug: 'documentacao/produtos/graphql-api', key: 'graphQLAPI' },
	{ text: 'Azion CLI', slug: 'documentacao/produtos/azion-cli/visao-geral', key: 'azionCLI' },
	{ text: 'Edge Runtime', slug: 'documentacao/produtos/edge-application/edge-functions/runtime/visao-geral', key: 'edgeRuntime' },
	{ text: 'SDK', slug: 'documentacao/devtools/sdk/go', key: 'sdkGO' },
	{ text: 'Terraform', slug: 'documentacao/produtos/terraform-provider', key: 'terraform' },

	{ text: 'Changelog', slug: 'documentacao/produtos/changelog', key: 'changelog' },
	{ text: 'System Status', slug: 'https://status.azion.com', key: 'systemStatus' },
	{ text: 'Azion Network Program', slug: 'documentacao/produtos/azion-network-program', key: 'azionNetworkProgram' },
	**/
]);
