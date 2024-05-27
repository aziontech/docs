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
	// { label: 'Documentation', header: true, onlyMobile: true, anchor: true, type: 'learn', slug: '/documentation/', key: 'documentation' },
	// { label: 'Guides', header: true, onlyMobile: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/', key: 'guides' },
	// { label: 'Dev Tools', header: true, onlyMobile: true, anchor: true, type: 'learn', slug: '/documentation/devtools/', key: 'devTools' },

	{ label: 'Core concepts', header: true, anchor: true, type: 'learn', slug: '/documentation/products/core-concepts/', key: 'beforeBegin/core', hasLabel: 'menu.begin' },

	{ label: 'Get help', header: true, anchor: true, type: 'learn', slug: 'documentation/products/get-help/', key: 'getHelp' },

	{ label: 'Welcome to the edge', header: true, anchor: true, type: 'learn', slug: '/documentation/products/get-started/', key: 'getStarted/welcome', hasLabel: "menu.getStarted" },
	{ label: 'Start with a template', header: true, anchor: true, type: 'learn', slug: '/documentation/products/start-with-a-template/', key: 'getStarted/template' },
	{ label: 'Go live with Azion', header: true, anchor: true, type: 'learn', slug: '/documentation/products/go-live-with-azion/', key: 'getStarted/goLive' },
	{ label: 'Visualize metrics', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/use-real-time-metrics/', key: 'getStarted/viewMetrics', addBorder: true },


	{ label: 'Build', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/build/overview/', key: 'build', hasLabel: 'menu.journey' },
	{ label: 'Secure', header: true, anchor: true, type: 'learn', slug: '/documentation/products/secure/overview/', key: 'secure' },
	{ label: 'Deploy', header: true, anchor: true, type: 'learn', slug: '/documentation/products/deploy/overview/', key: 'deploy' },
	{ label: 'Observe', header: true, anchor: true, type: 'learn', slug: 'documentation/products/observe/overview/', key: 'observe' },

	{ label: 'Configure a domain', header: true, anchor: true, type: 'learn', key: 'configureDomain', slug: '/documentation/products/guides/configure-a-domain/', hasLabel: 'menu.domains' },
	{ label: 'Create digital certificate', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/create-a-digital-certificate/', key: 'certificateDomain' },
	{ label: 'Point domain to Azion', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/point-domain-to-azion/', key: 'pointDomain' },
	{ label: 'Migrate NS to Azion', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/migrate-ns-to-azion/', key: 'migrateDomain' },




	{ label: 'Create account', header: true, anchor: true, type: 'learn', key: 'account/createAccount', slug: '/documentation/products/accounts/creating-account/', hasLabel: 'menu.account' },

	{
		label: 'Configure account', header: true, type: 'learn', key: 'manageAccount', items: [
			{ label: 'Users', header: true, anchor: true, type: 'learn', key: 'account/Users', slug: '/documentation/products/guides/users-management/' },
			{ label: 'Teams permissions', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/teams-permissions/', key: 'account/teamsPermissions' },
			{ label: 'Activity history', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/activity-history/', key: 'account/activityHistory' },
			{ label: 'Credentials', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/credentials/', key: 'account/credentials' },
			{ label: 'SSO', header: true, anchor: true, type: 'learn', slug: 'documentation/products/guides/sso/', key: 'account/sso' },
			{ label: 'MFA', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/multi-factor-authentication/', key: 'account/mfa' },
			{ label: 'Billing and subscriptions', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/billing-and-subscriptions/', key: 'account/billingAndSubscriptions' },
		]
	},


	{
		label: 'Configure profile', header: true, type: 'learn', key: 'manageProfile', addBorder: true, items: [
			{ label: 'Personal tokens', header: true, anchor: true, type: 'learn', key: 'accountsProfile/personalTokens', slug: '/documentation/products/guides/personal-tokens/' },
			{ label: 'Settings', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/account-settings/', key: 'accountsProfile/settings' },
			{ label: 'Delete account', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/delete-account/', key: 'accountsProfile/deleteAccount' },
		]
	},


	{
		label: 'Developer tools', header: true, type: 'learn', key: 'developerTools', hasLabel: 'menu.addResources', items: [
			{ label: 'API', header: true, anchor: true, type: 'learn', key: 'devtools/api', slug: '/documentation/products/overview-azion-api/' },
			{ label: 'CLI', header: true, anchor: true, type: 'learn', key: 'devtools/cli', slug: '/documentation/products/cli/' },
			{ label: 'API GraphQL Playground', header: true, anchor: true, type: 'learn', slug: '/documentation/products/devtools/graphql-playground/', key: 'devtools/graphQLplayground' },
			{ label: 'Edge Runtime', header: true, anchor: true, type: 'learn', slug: '/documentation/devtools/runtime/overview/', key: 'devtools/runtime' },
			{ label: 'SDK', header: true, anchor: true, type: 'learn', slug: '/documentation/devtools/sdk/go/', key: 'devtools/sdk' },
			{ label: 'Terraform', header: true, anchor: true, type: 'learn', slug: '/documentation/products/terraform-provider/', key: 'devtools/terraform' },
			{ label: 'GitHub', header: true, anchor: true, type: 'learn', slug: 'https://github.com/aziontech/', key: 'devtools/gitHub' },

		]
	},

	{ label: 'Migrate to Azion', header: true, anchor: true, type: 'learn', slug: '/documentation/products/migrate-to-azion/', key: 'migrateAzion' },

	{
		label: 'Templates and integrations', header: true, type: 'learn', key: 'templatesIntegrationsRef', addBorder: true, items: [
			{ label: 'Overview', header: true, anchor: true, type: 'learn', key: 'templatesIntegrations/overview', slug: '/documentation/products/marketplace/templates-and-integrations-overview/' },
			{ label: 'Understand Azion Templates', header: true, anchor: true, type: 'learn', key: 'templatesIntegrations/templates', slug: '/documentation/products/marketplace/templates/' },
			{ label: 'Use a template', header: true, anchor: true, type: 'learn', slug: '/documentation/products/use-a-template-via-azion-console/', key: 'templatesIntegrations/createPublishTemplate' },
			{ label: 'Understand Azion Integrations', header: true, anchor: true, type: 'learn', key: 'templatesIntegrations/integrations', slug: '/documentation/products/marketplace/integrations/' },
			{ label: 'Install an integration', header: true, anchor: true, type: 'learn', key: 'templatesIntegrations/installIntegration', slug: '/documentation/products/marketplace/install-an-integration/' },
			{ label: 'Update an integration', header: true, anchor: true, type: 'learn', key: 'templatesIntegrations/updateIntegration', slug: '/documentation/products/marketplace/update-an-integration/' },
			{ label: 'How to become an ISV', header: true, anchor: true, type: 'learn', key: 'templatesIntegrations/isv', slug: '/documentation/products/marketplace/isv-signup/' },
		]
	},


	{
		label: 'Build', header: true, type: 'learn', key: 'buildRef', hasLabel: 'menu.reference', items: [
			{ label: 'Edge Application', header: true, anchor: true, type: 'learn', key: 'reference/edgeApplication', slug: '/documentation/products/build/edge-application/' },
			{ label: 'Application Accelerator', header: true, anchor: true, type: 'learn', key: 'reference/applicationAcceleration', slug: '/documentation/products/build/edge-application/application-accelerator/' },
			{ label: 'Edge Cache', header: true, anchor: true, type: 'learn', key: 'reference/edgeCaching', slug: '/documentation/products/build/edge-application/edge-caching/' },
			{ label: 'Edge Functions', header: true, anchor: true, type: 'learn', key: 'reference/edge Functions', slug: '/documentation/products/build/edge-application/edge-functions/' },
			{ label: 'Image Processor', header: true, anchor: true, type: 'learn', key: 'reference/imageProcessor', slug: '/documentation/products/build/edge-application/image-processor/' },
			{ label: 'Load Balancer', header: true, anchor: true, type: 'learn', key: 'reference/loadBalancer', slug: '/documentation/products/build/edge-application/load-balancer/' },
			{ label: 'Tiered Cache', header: true, anchor: true, type: 'learn', key: 'reference/l2Caching', slug: '/documentation/products/edge-application/l2-caching/' },
			{ label: 'Main Settings', header: true, anchor: true, type: 'learn', key: 'reference/mainSettings', slug: '/documentation/products/edge-application/build/main-settings/' },
			{ label: 'Cache Settings', header: true, anchor: true, type: 'learn', key: 'reference/cacheSettings', slug: '/documentation/products/edge-application/cache-settings/' },
			{ label: 'Edge Functions Instances', header: true, anchor: true, type: 'learn', key: 'reference/edgeFunctionsInstancesApplication', slug: '/documentation/products/build/edge-application/edge-functions-instances/' },
			{ label: 'Device Groups', header: true, anchor: true, type: 'learn', key: 'reference/deviceGroups', slug: '/documentation/products/build/edge-application/device-groups/' },
			{ label: 'Digital Certificates', header: true, anchor: true, type: 'learn', key: 'reference/digitalCertificates', slug: '/documentation/products/build/edge-application/digital-certificates/' },
			{ label: 'Error Responses', header: true, anchor: true, type: 'learn', key: 'reference/errorResponses', slug: '/documentation/products/build/edge-application/error-responses/' },
			{ label: 'Origins', header: true, anchor: true, type: 'learn', key: 'reference/origins', slug: '/documentation/products/build/edge-application/origins/' },
			{ label: 'Real-Time Purge', header: true, anchor: true, type: 'learn', key: 'reference/realTimePurge', slug: '/documentation/products/build/edge-application/real-time-purge/' },
			{ label: 'Rules Engine', header: true, anchor: true, type: 'learn', key: 'reference/rulesEngineedgeApplication', slug: '/documentation/products/build/edge-application/rules-engine/' },
		]
	},
	{
		label: 'Secure', header: true, type: 'learn', key: 'secureRef', items: [
			{ label: 'Edge Firewall', header: true, anchor: true, type: 'learn', key: 'reference/edgeFirewall', slug: '/documentation/products/secure/edge-firewall/' },
			{ label: 'DDoS Protection', header: true, anchor: true, type: 'learn', key: 'reference/ddosProtection', slug: '/documentation/products/secure/edge-firewall/ddos-protection/' },
			{ label: 'DDoS Mitigation', header: true, anchor: true, type: 'learn', key: 'reference/ddosMitigation', slug: '/documentation/products/secure/edge-firewall/ddos-protection/ddos-mitigation/' },
			{ label: 'Network Layer Protection', header: true, anchor: true, type: 'learn', key: 'reference/networkLayerProtection', slug: '/documentation/products/secure/edge-firewall/network-layer-protection/' },
			{ label: 'Network Lists', header: true, anchor: true, type: 'learn', key: 'reference/networkLists', slug: '/documentation/products/secure/edge-firewall/network-layer-protection/network-lists/' },
			{ label: 'Web Application Firewall', header: true, anchor: true, type: 'learn', key: 'reference/webApplicationFirewall', slug: '/documentation/products/secure/edge-firewall/web-application-firewall/' },
			{ label: 'WAF Rule Sets', header: true, anchor: true, type: 'learn', key: 'reference/wafRuleSets', slug: '/documentation/products/secure/edge-firewall/web-application-firewall/rules-engine/' },
			{ label: 'WAF Custom Allowed Rules', header: true, anchor: true, type: 'learn', key: 'reference/wafCustomAllowedRules', slug: '/documentation/products/secure/edge-firewall/web-application-firewall/custom-allowed-rules/' },
			{ label: 'Edge Functions', header: true, anchor: true, type: 'learn', key: 'reference/edgeFunctionsFirewall', slug: '/documentation/products/secure/edge-firewall/edge-functions/' },
			{ label: 'Edge Functions Instances', header: true, anchor: true, type: 'learn', key: 'reference/edgeFunctionsInstancesFirewall', slug: '/documentation/products/secure/edge-firewall/edge-functions-instances/' },
			{ label: 'Rules Engine', header: true, anchor: true, type: 'learn', key: 'reference/rulesEngineFirewall', slug: '/documentation/products/secure/edge-firewall/rules-engine/' },
			{ label: 'Edge DNS', header: true, anchor: true, type: 'learn', key: 'reference/intelligentDNS', slug: '/documentation/products/secure/edge-dns/' },
			{ label: 'DNSSEC Compatibility', header: true, anchor: true, type: 'learn', key: 'reference/dnssecCompatibility', slug: '/documentation/products/secure/edge-dns/dnssec-compatibility/' },

		]
	},
	{
		label: 'Deploy', header: true, type: 'learn', key: 'deployRef', items: [
			{ label: 'Edge Orchestrator', header: true, anchor: true, type: 'learn', key: 'reference/edgeOrchestrator', slug: '/documentation/products/deploy/edge-orchestrator/' },
			{ label: 'Edge Services', header: true, anchor: true, type: 'learn', key: 'reference/edgeServices', slug: '/documentation/products/deploy/edge-orchestrator/edge-services/' },
			{ label: 'Edge Node', header: true, anchor: true, type: 'learn', key: 'reference/edgeNode', slug: '/documentation/products/deploy/edge-orchestrator/edge-node/' },

		]
	},
	{
		label: 'Observe', header: true, type: 'learn', key: 'observeRef', items: [
			{ label: 'Data Stream', header: true, anchor: true, type: 'learn', key: 'reference/dataStreaming', slug: '/documentation/products/observe/data-stream/' },
			{ label: 'Edge Pulse', header: true, anchor: true, type: 'learn', key: 'reference/edgePulse', slug: '/documentation/products/observe/edge-pulse/' },
			{ label: 'Real-Time Events', header: true, anchor: true, type: 'learn', key: 'reference/realTimeEvents', slug: '/documentation/products/observe/real-time-events/' },
			{ label: 'Real-Time Metrics', header: true, anchor: true, type: 'learn', key: 'reference/realTimeMetrics', slug: '/documentation/products/observe/real-time-metrics/' },
			{ label: 'Historical Real-Time Metrics', header: true, anchor: true, type: 'learn', key: 'reference/historicalRealTimeMetrics', slug: '/documentation/products/historical-real-time-metrics/' },

		]
	},
	{
		label: 'Marketplace', header: true, type: 'learn', key: 'mktpRef', items: [
			{ label: 'Marketplace', header: true, anchor: true, type: 'learn', key: 'mktp', slug: '/documentation/products/marketplace/' },
			{ label: 'Permissions', header: true, anchor: true, type: 'learn', key: 'mktp/permissions', slug: '/documentation/products/guides/permissions-marketplace/' },
			{ label: 'Marketplace Seller Guide', header: true, anchor: true, type: 'learn', key: 'mktp/sellerGuide', slug: '/documentation/products/marketplace/marketplace-seller-guide/' },
		]
	},

	{
		label: 'Accounts', key: 'accountsRef', items: [
			{ label: 'Activity History', header: true, type: 'learn', key: 'accounts/ActivityHistory', slug: '/documentation/products/accounts/activity-history/' },
			{ label: 'Clients', key: 'accounts/Clients', slug: '/documentation/products/accounts/accounts/' },
			{ label: 'Account settings', key: 'accounts/accountSettings', slug: '/documentation/products/accounts/account-settings/' },
			{ label: 'Billing', key: 'accounts/billing', slug: '/documentation/products/accounts/billing-and-subscriptions/' },
			{ label: 'Multi-Factor Authentication', key: 'accounts/MFA', slug: '/documentation/products/accounts/multi-factor-authentication/' },
			{ label: 'Personal Tokens', key: 'accounts/personalTokens', slug: '/documentation/products/accounts/personal-tokens/' },
			{ label: 'Social Login', key: 'accounts/socialLogin', slug: '/documentation/products/accounts/social-login/' },
			{ label: 'Single Sign-On', key: 'accounts/SSO', slug: '/documentation/products/accounts/single-sign-on/' },
			{ label: 'Teams Permissions', key: 'accounts/teamsPermissions', slug: '/documentation/products/accounts/teams-permissions/' },
			{ label: 'Users Management', key: 'accounts/usersManagement', slug: '/documentation/products/accounts/users-management/' },
			{ label: 'Your Settings', key: 'accounts/youtSettings', slug: '/documentation/products/accounts/your-settings/' },

		]
	},




	{ label: 'Technical Support', header: true, anchor: true, type: 'learn', slug: '/documentation/services/support/', key: 'technicalSupport' },

	{
		label: 'Professional Services', header: true, type: 'learn', key: 'professionalServices', items: [
			{ label: 'Integration Services', header: true, anchor: true, type: 'learn', slug: '/documentation/services/integration-services/', key: 'professionalServices/integrationServices' },
			{ label: 'Managed Configurations', header: true, anchor: true, type: 'learn', slug: '/documentation/services/managed-configurations/', key: 'professionalServices/managedConfigurations' },
			{ label: 'Technical Account Manager', header: true, anchor: true, type: 'learn', slug: '/documentation/services/technical-account-manager/', key: 'professionalServices/TAM' },
			{ label: 'Best Practices Review', header: true, anchor: true, type: 'learn', slug: '/documentation/services/best-practices-review/', key: 'professionalServices/bestPracticesReview' },
			{ label: 'Instructor-Led Training', header: true, anchor: true, type: 'learn', slug: '/documentation/services/instructor-led-training/', key: 'professionalServices/customEducationPrograms' },
			{ label: 'Security Response Team', header: true, anchor: true, type: 'learn', slug: '/documentation/services/security-response-team/', key: 'professionalServices/SRT' },
			{ label: 'Business Events Support', header: true, anchor: true, type: 'learn', slug: '/documentation/services/business-events-support/', key: 'professionalServices/businessEventsSupport' },
			{ label: 'Slack Channel', header: true, anchor: true, type: 'learn', slug: '/documentation/services/slack-channel/', key: 'professionalServices/SlackChannel' },
		]
	},

	{
		label: 'Glossary', header: true, anchor: true, type: 'learn', slug: '/documentation/products/azion-glossary/', key: 'glossary', addBorder: true
	},

	
	{
		label: 'System Status', header: true, anchor: true, type: 'learn', slug: 'https://status.azion.com/', key: 'systemStatus'
	},

	{
		label: 'Release Notes', header: true, anchor: true, type: 'learn', slug: '/documentation/products/release-notes/', key: 'releaseNotes'
	},

	{
		label: 'Agreements', header: true, anchor: true, type: 'learn', slug: '/documentation/agreements/', key: 'agreements'
	},
	{
		label: 'Pricing', header: true, anchor: true, type: 'learn', slug: '/documentation/products/pricing/', key: 'pricing'
	},
	{
		label: 'Compliance', header: true, type: 'learn', key: 'compliance', items: [
			{ label: 'SOC', header: true, anchor: true, type: 'learn', slug: '/documentation/compliance/soc/', key: 'compliance/soc' },
			{ label: 'PCI DSS', header: true, anchor: true, type: 'learn', slug: '/documentation/compliance/pci-dss-certification/', key: 'compliance/pci-dss' },
		]
	},

	{
		label: 'Shared Responsibility Model', header: true, anchor: true, type: 'learn', slug: '/documentation/shared-responsibility/', key: 'sharedResponsibility'
	},

	{
		label: 'Azion Network Program', header: true, anchor: true, type: 'learn', slug: '/documentation/products/azion-network-program/', key: 'azionNetworkProgram'
	},

] as const;
