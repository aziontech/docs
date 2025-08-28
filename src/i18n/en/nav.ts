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
	{ text: 'Azion platform overview', header: true, anchor: true, type: 'learn', slug: '/documentation/products/azion-platform-overview/', key: 'getStarted/welcome' },
	{ text: 'Build your application', header: true, anchor: true, type: 'learn', key: 'build', items: [
		{ text: 'Overview', header: true, anchor: true, slug: '/documentation/products/guides/build/overview/', key: 'buildOverview' },
		{ text: 'Build an application', header: true, anchor: true, slug: '/documentation/products/guides/build/build-an-application/', key: 'buildEdgeApps' },
		{ text: 'Develop with Azion', header: true, anchor: true, key: 'buildWithAzion', items: [
			{ text: '      API', header: true, anchor: true, type: 'learn', key: 'devtools/api', slug: '/documentation/products/overview-azion-api/' },
			{ text: '      CLI', header: true, anchor: true, type: 'learn', slug: '/documentation/products/build/develop-with-azion/cli/', key: 'developCli' },
			{ text: '      API GraphiQL Playground', header: true, anchor: true, type: 'learn', slug: '/documentation/products/devtools/graphql-playground/', key: 'devtools/graphQLplayground' },
			{ text: '      Azion IDE', header: true, anchor: true, type: 'learn', slug: '/documentation/products/build/develop-with-azion/code-editor/', key: 'developIDE' },
			{ text: '      Local Development', header: true, anchor: true, type: 'learn', slug: '/documentation/products/build/develop-with-azion/local-dev/', key: 'developLocalDev' },
			{ text: '      SDK', header: true, anchor: true, type: 'learn', slug: '/documentation/products/build/develop-with-azion/sdk/go/', key: 'developSDK' },
			{ text: '      Terraform', header: true, anchor: true, type: 'learn', slug: '/documentation/products/build/develop-with-azion/terraform-provider/', key: 'developTerraform' },
			{ text: '      GitHub', header: true, anchor: true, type: 'learn', slug: 'https://github.com/aziontech/', key: 'devtools/gitHub' },
			{ text: '      Azion Runtime', header: true, anchor: true, type: 'learn', slug: '/documentation/products/build/develop-with-azion/runtime-apis/', key: 'developEdgeRuntime' },
			{ text: '      Framework specific guides', header: true, anchor: true, type: 'learn', slug: '/documentation/products/build/develop-with-azion/frameworks-specific/overview/', key: 'frameworkAngular' },

    {
        text: '      Language specific guides', header: true, type: 'learn', key: 'languageSpecifics', addBorder: true, items: [
					{ text: '      JavaScript', header: true, anchor: true, type: 'learn', slug: '/documentation/products/build/develop-with-azion/language-specific/javascript/', key: 'devJS' },
					{ text: '      WebAssembly', header: true, anchor: true, type: 'learn', slug: '/documentation/products/build/develop-with-azion/language-specific/wasm/', key: 'devWasm' },
        ]
    },
			
		] },
		{
			text: 'Edit an application', header: true, anchor: true, type: 'learn', key: 'editEdgeApp', items: [
				{ text: '      Configure main settings', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/build/configure-main-settings/', key: 'mainSettings' },
				{ text: '      Create device groups', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/build/create-device-groups/', key: 'deviceGroups' },
				{ text: '      Set error pages', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/build/set-error-pages/', key: 'errorPages' },
				{ text: '      Work with origins', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/build/work-with-origins/', key: 'origins' },
				{ text: '      Tune cache settings', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/build/tune-cache-settings/', key: 'cacheSettings' },
				{ text: '      Work with rules engine', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/build/work-with-rules-engine/', key: 'rules' },
				{ text: '      Instantiate an edge function', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/build/instantiate-edge-functions/', key: 'functions' },
			]
		},
		{
			text: 'Advanced configurations', header: true, anchor: true, type: 'learn', key: 'advancedConfig', addBorder: true, items: [
				{ text: '      Process images', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/build/process-images/', key: 'processImages' },
				{ text: '      Configure multiple origins', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/build/multiple-origins/', key: 'multiOrigin' },
			]
		},
		{ text: 'Environment Variables', header: true, anchor: true, type: 'learn', slug: '/documentation/products/build/develop-with-azion/environment-variables/', key: 'envVars', addBorder: true, },
		{
			text: 'Troubleshoot', header: true, anchor: true, type: 'learn', key: 'troubleshootBuild', items: [
				{ text: '      Understand metrics', header: true, anchor: true, type: 'learn', slug: '/documentation/products/build/troubleshooting/understand-metrics/', key: 'understandMetrics' },
				{ text: '      Debug applications', header: true, anchor: true, type: 'learn', slug: '/documentation/products/build/troubleshooting/debug-applications/', key: 'debugApps', addBorder: true, },
			]
		},
	]},
	{ text: 'Secure your application', header: true, anchor: true, type: 'learn', key: 'secure', items:
		[
			{ text: 'Overview', header: true, anchor: true, slug: '/documentation/products/secure/overview/', key: 'secureOverview' },
			{ text: 'Secure an application', header: true, anchor: true, slug: '/documentation/products/secure/secure-application/', key: 'secureApps' },
			{ text: 'Secure an infrastructure', header: true, anchor: true, slug: '/documentation/products/secure/secure-infrastructure/', key: 'secureInfra' },
			{
				text: 'Edit a firewall', header: true, type: 'learn', key: 'editEdgeFirewall', items: [
					{ text: '      Configure main settings', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/secure/edge-firewall-configure-main-settings/', key: 'secureMainSettings' },
					{ text: '      Instantiate an edge function', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/secure/instantiate-edge-functions/', key: 'secureFunctions' },
					{ text: '      Work with rules engine', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/secure/work-with-rules-engine/', key: 'secureRules' },
					{ text: '      Protect your domain', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/secure/edge-firewall-protect-your-domain/', key: 'secureDomain' },
				]
			},
			{
				text: 'Configure WAF', header: true, type: 'learn', key: 'secureWAF', items: [
					{ text: '      Create WAF rule set', header: true, type: 'learn', key: 'createRuleSet', slug: '/documentation/products/guides/secure/create-waf-rule-set/' },
					{ text: '      Check WAF mode', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/how-to-check-your-waf-mode/', key: 'wafMode' },
					{ text: '      Configure Custom Allowed Rule', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/secure/configure-waf-allowed-rules/', key: 'customAllowedRules' },
					{ text: '      Tune WAF', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/secure/tune-waf/', key: 'tuneWaf' },
					{ text: '      Find score of blocked requests', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/how-to-find-waf-score/', key: 'wafRequestsScore' }
				]
			},
			{
				text: 'Advanced configurations', header: true, type: 'learn', key: 'secureAdvancedConfig', items: [
					{ text: '      Manage bots', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/secure/manage-bots/', key: 'manageBots' },
					{ text: '      Block Tor networks', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/secure/block-tor-networks/', key: 'blockTor' },
				]
			},
			{ 
				text: 'Transport Layer Security', header: true, anchor: true, type: 'learn', key: 'tls', items: [
					{ text: '      Select TLS ciphers', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/secure/ciphers/', key: 'ciphers' },
					{ text: '      Configure mTLS', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/secure/mtls/', key: 'mtls' },
					{ text: '      Manage Digital Certificates', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/secure/digital-certificates/', key: 'digitalCertificates' },
				] 
			},
			{
				text: 'Automate with Azion', header: true, type: 'learn', key: 'automateSecure', items: [
					{ text: '      Edge Functions', header: true, anchor: true, type: 'learn', slug: '/documentation/products/secure/automate/functions/', key: 'automateEdgeFunctions' },
					{ text: '      SDK', header: true, anchor: true, type: 'learn', slug: '/documentation/products/secure/automate/sdk/', key: 'automateSdk' },
					{ text: '      Terraform', header: true, anchor: true, type: 'learn', slug: '/documentation/products/secure/automate/terraform/', key: 'automateTerraform' },
					{ text: '      Integrate with SIEMs', header: true, anchor: true, type: 'learn', slug: '/documentation/products/secure/automate/integrate-siems/', key: 'automateIntegrateSiems' },		
				]
			},

			
			
		]
	},
	{ text: 'Migrate to Azion', header: true, type: 'learn', key: 'menu.migrateAzion', items: [
		{ text: 'Migrate your application', header: true, anchor: true, type: 'learn', slug: '/documentation/products/migrate-to-azion/', key: 'migrateAzion'},
		{ text: '      Configure a domain', header: true, anchor: true, type: 'learn', key: 'configureDomain', slug: '/documentation/products/guides/configure-a-domain/' },
		{ text: '      Create digital certificate', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/create-a-digital-certificate/', key: 'certificateDomain' },
		{ text: '      Point domain to Azion', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/point-domain-to-azion/', key: 'pointDomain' },
		{ text: 'Migrate Nameservers', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/migrate-ns-to-azion/', key: 'migrateDomain' },
		 	
	] 
	},
	{ text: 'Check our pricing', header: true, anchor: true, type: 'learn', slug: '/documentation/products/pricing/', key: 'pricing'},
	{ text: 'Get help', header: true, anchor: true, type: 'learn', slug: '/documentation/products/get-help/', key: 'getStarted/getHelp' },
	{
		text: 'Build', header: true, type: 'learn', key: 'buildRef', hasLabel: 'menu.reference', items: [
			{ text: 'AI Inference', header: true, anchor: true, type: 'learn', key: 'reference/edgeAI', slug: '/documentation/products/ai/ai-inference/' },
			{ text: 'Edge Application', header: true, anchor: true, type: 'learn', key: 'reference/edgeApplication', slug: '/documentation/products/build/edge-application/' },
			
				
				{ text: '      Application Accelerator', header: true, anchor: true, type: 'learn', key: 'reference/applicationAcceleration', slug: '/documentation/products/build/edge-application/application-accelerator/' },
				{ text: '      Edge Cache', header: true, anchor: true, type: 'learn', key: 'reference/edgeCaching', slug: '/documentation/products/build/edge-application/edge-cache/' },
				{ text: '      Edge Functions', header: true, anchor: true, type: 'learn', key: 'reference/edge Functions', slug: '/documentation/products/build/edge-application/edge-functions/' },
				{ text: '      Image Processor', header: true, anchor: true, type: 'learn', key: 'reference/imageProcessor', slug: '/documentation/products/build/edge-application/image-processor/' },
				{ text: '      Load Balancer', header: true, anchor: true, type: 'learn', key: 'reference/loadBalancer', slug: '/documentation/products/secure/edge-connector/load-balancer/' },
				{ text: '      Tiered Cache', header: true, anchor: true, type: 'learn', key: 'reference/l2Caching', slug: '/documentation/products/build/edge-application/tiered-cache/' },
									
			
		]
	},
	{
		text: 'Store', header: true, type: 'learn', key: 'storeRef', items: [
			{ text: 'Edge Storage', header: true, anchor: true, type: 'learn', key: 'reference/storage', slug: '/documentation/products/store/edge-storage/' },
			{ text: 'Edge SQL', header: true, anchor: true, type: 'learn', key: 'reference/sql', slug: '/documentation/products/store/edge-sql/' },
		]
	},
	{
		text: 'Secure', header: true, type: 'learn', key: 'secureRef', items: [
			{ text: 'Edge Firewall', header: true, anchor: true, type: 'learn', key: 'reference/edgeFirewall', slug: '/documentation/products/secure/edge-firewall/' },
			{
				text: 'Edge Firewall add-ons', header: true, type: 'learn', key: 'reference/edgeApplicationAddons', items: [
					{ text: '      DDoS Protection', header: true, anchor: true, type: 'learn', key: 'reference/ddosProtection', slug: '/documentation/products/secure/edge-firewall/ddos-protection/' },
					{ text: '      DDoS Mitigation', header: true, anchor: true, type: 'learn', key: 'reference/ddosMitigation', slug: '/documentation/products/secure/edge-firewall/ddos-protection/ddos-mitigation/' },
					{ text: '      Web Application Firewall', header: true, anchor: true, type: 'learn', key: 'reference/webApplicationFirewall', slug: '/documentation/products/secure/edge-firewall/web-application-firewall/' },
					{ text: '      Network Layer Protection', header: true, anchor: true, type: 'learn', key: 'reference/networkLayerProtection', slug: '/documentation/products/secure/edge-firewall/network-layer-protection/' },	
					{ text: '      Bot Manager', header: true, anchor: true, type: 'learn', key: 'reference/botManager', slug: '/documentation/products/secure/edge-firewall/bot-manager/' },
					{ text: '      Bot Manager Lite', header: true, anchor: true, type: 'learn', key: 'reference/botManagerLite', slug: '/documentation/products/secure/edge-firewall/bot-manager-lite/' },
					{ text: '      Origin Shield', header: true, anchor: true, type: 'learn', key: 'reference/originShield', slug: '/documentation/products/secure/secure-infrastructure/' },
					{ text: '      Edge Functions', header: true, anchor: true, type: 'learn', key: 'reference/edgeFunctionsFirewall', slug: '/documentation/products/secure/edge-firewall/edge-functions/' },
				],				
			},
			{ text: 'Edge DNS', header: true, anchor: true, type: 'learn', key: 'reference/intelligentDNS', slug: '/documentation/products/secure/edge-dns/' },
		]
	},
	{
		text: 'Deploy', header: true, type: 'learn', key: 'deployRef', items: [
			{ text: 'Edge Orchestrator', header: true, anchor: true, type: 'learn', key: 'reference/edgeOrchestrator', slug: '/documentation/products/deploy/edge-orchestrator/' },
			{ text: 'Edge Services', header: true, anchor: true, type: 'learn', key: 'reference/edgeServices', slug: '/documentation/products/deploy/edge-orchestrator/edge-services/' },
			{ text: 'Edge Node', header: true, anchor: true, type: 'learn', key: 'reference/edgeNode', slug: '/documentation/products/deploy/edge-orchestrator/edge-node/' },
		]
	},
	{
		text: 'Observe', header: true, type: 'learn', key: 'observeRef', items: [
			{ text: 'Data Stream', header: true, anchor: true, type: 'learn', key: 'reference/dataStreaming', slug: '/documentation/products/observe/data-stream/' },
			{ text: 'Edge Pulse', header: true, anchor: true, type: 'learn', key: 'reference/edgePulse', slug: '/documentation/products/observe/edge-pulse/' },
			{ text: 'Real-Time Events', header: true, anchor: true, type: 'learn', key: 'reference/realTimeEvents', slug: '/documentation/products/observe/real-time-events/' },
			{ text: 'Real-Time Metrics', header: true, anchor: true, type: 'learn', key: 'reference/realTimeMetrics', slug: '/documentation/products/observe/real-time-metrics/' },
			{ text: 'Historical Real-Time Metrics', header: true, anchor: true, type: 'learn', key: 'reference/historicalRealTimeMetrics', slug: '/documentation/products/observe/historical-real-time-metrics/' },
		]
	},
	{
		text: 'Marketplace', header: true, type: 'learn', key: 'mktpRef', items: [
			{ text: 'Marketplace', header: true, anchor: true, type: 'learn', key: 'mktp', slug: '/documentation/products/marketplace/' },
			{ text: 'Permissions', header: true, anchor: true, type: 'learn', key: 'mktp/permissions', slug: '/documentation/products/marketplace/permissions-marketplace/' },
			{ text: 'Marketplace Seller Guide', header: true, anchor: true, type: 'learn', key: 'mktp/sellerGuide', slug: '/documentation/products/marketplace/marketplace-seller-guide/' },
		]
	},
	{
		text: 'Accounts', key: 'accountsRef', items: [
			{ text: 'Create account', header: true, anchor: true, type: 'learn', key: 'account/createAccount', slug: '/documentation/products/accounts/creating-account/' },
			{
				text: 'Configure account', header: true, type: 'learn', key: 'manageAccount', items: [
					{ text: '      Users', header: true, anchor: true, type: 'learn', key: 'account/Users', slug: '/documentation/products/guides/users-management/' },
					{ text: '      Teams permissions', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/teams-permissions/', key: 'account/teamsPermissions' },
					{ text: '      Activity history', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/activity-history/', key: 'account/activityHistory' },
					{ text: '      Account Lockout Policy', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/configure-account-lockout-policy/', key: 'account/accountLockoutPolicy' },
					{ text: '      Conditional Access by IP Address', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/conditional-access-by-ip-address/', key: 'account/conditionalAccess' },
					{ text: '      SSO', header: true, anchor: true, type: 'learn', slug: 'documentation/products/guides/sso/', key: 'account/sso' },
					{ text: '      MFA', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/multi-factor-authentication/', key: 'account/mfa' },
					{ text: '      User Session Timeout', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/configure-user-session-timeout/', key: 'account/user-session-timeout' },
					{ text: '      Billing and subscriptions', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/billing-and-subscriptions/', key: 'account/billingAndSubscriptions' },
					{ text: '      Activity History', header: true, type: 'learn', key: 'accounts/ActivityHistory', slug: '/documentation/products/accounts/activity-history/' },
					{ text: '      Clients', key: 'accounts/Clients', slug: '/documentation/products/accounts/accounts/' },
					{ text: '      Account settings', key: 'accounts/accountSettings', slug: '/documentation/products/accounts/account-settings/' },
					{ text: '      Billing', key: 'accounts/billing', slug: '/documentation/products/accounts/billing-and-subscriptions/' },	
				]
			},
			{
				text: 'Configure profile', header: true, type: 'learn', key: 'manageProfile', items: [
					{ text: '      Personal tokens', header: true, anchor: true, type: 'learn', key: 'accountsProfile/personalTokens', slug: '/documentation/products/guides/personal-tokens/' },
					{ text: '      Settings', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/account-settings/', key: 'accountsProfile/settings' },
					{ text: '      Your Settings', key: 'accounts/yourSettings', slug: '/documentation/products/accounts/your-settings/' },
					{ text: '      Delete account', header: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/delete-account/', key: 'accountsProfile/deleteAccount' },
				]
			},
			{
				text: 'Security and policies', header: true, type: 'learn', key: 'accountPolicies', items: [
					{ text: '      Account Lockout Policy', key: 'accounts/accountLockoutPolicy', slug: '/documentation/products/accounts/account-lockout-policy/' },
					{ text: '      Multi-Factor Authentication', key: 'accounts/MFA', slug: '/documentation/products/accounts/multi-factor-authentication/' },
					{ text: '      Personal Tokens', key: 'accounts/personalTokens', slug: '/documentation/products/accounts/personal-tokens/' },
					{ text: '      Social Login', key: 'accounts/socialLogin', slug: '/documentation/products/accounts/social-login/' },
					{ text: '      Single Sign-On', key: 'accounts/SSO', slug: '/documentation/products/accounts/single-sign-on/' },
					{ text: '      Teams Permissions', key: 'accounts/teamsPermissions', slug: '/documentation/products/accounts/teams-permissions/' },
					{ text: '      Users Management', key: 'accounts/usersManagement', slug: '/documentation/products/accounts/users-management/' },
					{ text: '      User Session Timeout', key: 'accounts/userSessionTimeout', slug: '/documentation/products/accounts/user-session-timeout/' },
				]
			},		
		]
	},
	{ text: 'Find your solution', header: true, anchor: true, type: 'learn', slug: '/documentation/architectures/', key: 'findSolutions'},
	{ text: 'Release Notes', header: true, anchor: true, type: 'learn', slug: '/documentation/products/release-notes/', key: 'releaseNotes'},
	
	{
		text: 'Templates and integrations', header: true, type: 'learn', key: 'templatesIntegrationsRef', hasLabel: 'menu.addResources', items: [
			{ text: 'Overview', header: true, anchor: true, type: 'learn', key: 'templatesIntegrations/overview', slug: '/documentation/products/marketplace/templates-and-integrations-overview/' },
			{ text: 'Understand Azion Templates', header: true, anchor: true, type: 'learn', key: 'templatesIntegrations/templates', slug: '/documentation/products/marketplace/templates/' },
			{ text: 'Use a template', header: true, anchor: true, type: 'learn', slug: '/documentation/products/use-a-template-via-azion-console/', key: 'templatesIntegrations/createPublishTemplate' },
			{ text: 'Understand Azion Integrations', header: true, anchor: true, type: 'learn', key: 'templatesIntegrations/integrations', slug: '/documentation/products/marketplace/integrations/' },
			{ text: 'Install an integration', header: true, anchor: true, type: 'learn', key: 'templatesIntegrations/installIntegration', slug: '/documentation/products/marketplace/install-an-integration/' },
			{ text: 'Update an integration', header: true, anchor: true, type: 'learn', key: 'templatesIntegrations/updateIntegration', slug: '/documentation/products/marketplace/update-an-integration/' },
			{ text: 'How to become an ISV', header: true, anchor: true, type: 'learn', key: 'templatesIntegrations/isv', slug: '/documentation/products/marketplace/isv-signup/' },
		]
	},
	{
		text: 'Support', header: true, type: 'learn', key: 'support', items: [
			{ text: 'Technical Support', header: true, anchor: true, type: 'learn', slug: '/documentation/services/support/', key: 'technicalSupport' },
			{
				text: 'Professional Services', header: true, type: 'learn', key: 'professionalServices', items: [
					{ text: '      Integration Services', header: true, anchor: true, type: 'learn', slug: '/documentation/services/integration-services/', key: 'professionalServices/integrationServices' },
					{ text: '      Managed Configurations', header: true, anchor: true, type: 'learn', slug: '/documentation/services/managed-configurations/', key: 'professionalServices/managedConfigurations' },
					{ text: '      Technical Account Manager', header: true, anchor: true, type: 'learn', slug: '/documentation/services/technical-account-manager/', key: 'professionalServices/TAM' },
					{ text: '      Best Practices Review', header: true, anchor: true, type: 'learn', slug: '/documentation/services/best-practices-review/', key: 'professionalServices/bestPracticesReview' },
					{ text: '      Instructor-Led Training', header: true, anchor: true, type: 'learn', slug: '/documentation/services/instructor-led-training/', key: 'professionalServices/customEducationPrograms' },
					{ text: '      Security Response Team', header: true, anchor: true, type: 'learn', slug: '/documentation/services/security-response-team/', key: 'professionalServices/SRT' },
					{ text: '      Business Events Support', header: true, anchor: true, type: 'learn', slug: '/documentation/services/business-events-support/', key: 'professionalServices/businessEventsSupport' },
					{ text: '      Slack Channel', header: true, anchor: true, type: 'learn', slug: '/documentation/services/slack-channel/', key: 'professionalServices/SlackChannel' },
				]
			},
		]
	},
	{
		text: 'Legal', header: true, type: 'learn', key: 'legal', items: [
			{ text: 'Agreements', header: true, anchor: true, type: 'learn', slug: '/documentation/agreements/', key: 'agreements'},
			{
				text: 'Compliance', header: true, type: 'learn', key: 'compliance', items: [
					{ text: '      SOC', header: true, anchor: true, type: 'learn', slug: '/documentation/compliance/soc/', key: 'compliance/soc' },
					{ text: '      PCI DSS', header: true, anchor: true, type: 'learn', slug: '/documentation/compliance/pci-dss-certification/', key: 'compliance/pci-dss' },
				]
			},
			{ text: 'Data Privacy FAQs', header: true, anchor: true, type: 'learn', slug: '/documentation/agreements/faqs/', key: 'datafaqs'},
			{ text: 'Shared Responsibility Model', header: true, anchor: true, type: 'learn', slug: '/documentation/shared-responsibility/', key: 'sharedResponsibility' },
			{ text: 'Azion Network Program', header: true, anchor: true, type: 'learn', slug: '/documentation/products/azion-network-program/', key: 'azionNetworkProgram' },
		]
	},
	{ text: 'Glossary', header: true, anchor: true, type: 'learn', slug: '/documentation/products/azion-glossary/', key: 'glossary', addBorder: true },
	{ text: 'System Status', header: true, anchor: true, type: 'learn', slug: 'https://status.azion.com/', key: 'systemStatus'},
] as const;
