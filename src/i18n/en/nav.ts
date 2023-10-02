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
	{ text: 'Documentation', header: true, onlyMobile: true, anchor: true, type: 'learn', slug: '/documentation/', key: 'documentation' },
	{ text: 'Guides', header: true, onlyMobile: true, anchor: true, type: 'learn', slug: '/documentation/products/guides/', key: 'guides' },
	{ text: 'Dev Tools', header: true, onlyMobile: true, anchor: true, type: 'learn', slug: '/documentation/products/dev-tools/', key: 'devTools' },
	{ text: 'Learn', header: true, onlyMobile: true, anchor: true, type: 'learn', slug: 'https://learn.azion.com/', key: 'Learn' },

	{ text: 'Getting Started', header: true, anchor: true, type: 'learn', slug: 'documentation/products/getting-started', key: 'gettingStarted' },


	{ text: 'Accounts and Profile', header: true, type: 'learn', key: 'accountsProfile', addBorder: true, children: [
		{ text: 'Create Account', slug: 'documentation/products/accounts/creating-account', key: 'accountsProfile/createAccount' },
		{ text: 'Account Settings', slug: 'documentation/products/accounts/account-settings', key: 'accountsProfile/settings' },
		{ text: 'Users Managements', slug: 'documentation/products/accounts/users-and-teams', key: 'accountsProfile/usersManagement' },
		{ text: 'Billing', slug: 'documentation/products/accounts/billing', key: 'accountsProfile/billing' },
		{ text: 'Credentials', slug: 'documentation/products/credentials', key: 'accountsProfile/credentials' },
		{ text: 'Activity History', slug: 'documentation/products/accounts/activity-history', key: 'accountsProfile/activityHistory' },
		{ text: 'Teams Permissions', slug: 'documentation/products/accounts/teams-permissions', key: 'accountsProfile/teamsPermissions' },
		{ text: 'Single Sign-On (SSO)', slug: 'documentation/products/accounts/single-sign-on', key: 'accountsProfile/singleSignOn' },
		{ text: 'Your Settings', slug: 'documentation/products/accounts/your-settings', key: 'accountsProfile/yourSettings' },
		{ text: 'Personal Tokens', slug: 'documentation/products/accounts/personal-tokens', key: 'accountsProfile/personalTokens' },
		{ text: 'Social Login', slug: 'documentation/products/accounts/social-login', key: 'accountsProfile/socialLogin' },
		{ text: 'Groups and Clients', slug: 'documentation/products/accounts/clients', key: 'accountsProfile/GroupsAndClients' },
		{ text: 'Multi-Factor Authentication', slug: 'documentation/products/accounts/multi-factor-authentication', key: 'accountsProfile/multiFactorAuth' },
	] },


	{ text: 'Build', header: true, type: 'learn', key: 'Build', hasLabel: "menu.label", children: [
		{ text: 'Edge Application', isProduct: true, slug: 'documentation/products/edge-application', key: 'edgeApplication' },
		{ text: 'Application Acceleration', slug: 'documentation/products/edge-application/application-acceleration', key: 'applicationAcceleration' },
		{ text: 'Edge Caching', slug: 'documentation/products/edge-application/edge-caching', key: 'edgeCaching' },
		{ text: 'Edge Functions', slug: 'documentation/products/edge-application/edge-functions', key: 'edgeFunctions' },
		{ text: 'Image Processor', slug: 'documentation/products/edge-application/image-processor', key: 'imageProcessor' },
		{ text: 'Load Balancer', slug: 'documentation/products/edge-application/load-balancer', key: 'loadBalancer' },
	] },


	{ text: 'Secure', header: true, type: 'learn', key: 'Secure',  children: [
		{ text: 'Edge Firewall', slug: 'documentation/products/edge-firewall', key: 'edgefirewall' },
		{ text: 'DDoS Protection', slug: 'documentation/products/edge-firewall/ddos-protection', key: 'ddosProtection' },
		{ text: 'Network Layer Protection', slug: 'documentation/products/edge-firewall/network-layer-protection', key: 'networkLayerProtection' },
		{ text: 'Web Application Firewall', slug: 'documentation/products/edge-firewall/web-application-firewall', key: 'webApplicationFirewall' },
		{ text: 'Intelligent DNS', slug: 'documentation/products/intelligent-dns', key: 'intelligentDNS' },
	] },

	{ text: 'Deploy', header: true, type: 'learn', key: 'Deliver', children: [
		{ text: 'Edge Orchestrator', slug: 'documentation/products/edge-orchestrator', key: 'edgeOrchestrator' },
		{ text: 'Edge Node', slug: 'documentation/products/edge-orchestrator/edge-node', key: 'edgeNode' },
		{ text: 'Edge Services', slug: 'documentation/products/edge-orchestrator/edge-services', key: 'edgeServices' },
	] },


	{ text: 'Observe', header: true, type: 'learn', key: 'Observe', addBorder: true, children: [
		{ text: 'Data Streaming', slug: 'documentation/products/data-streaming', key: 'dataStreaming' },
		{ text: 'Edge Pulse', slug: 'documentation/products/edge-pulse', key: 'edgePulse' },
		{ text: 'Real-Time Events', slug: 'documentation/products/real-time-events', key: 'realTimeEvents' },
		{ text: 'Real-Time Metrics', slug: 'documentation/products/real-time-metrics', key: 'realTimeMetrics' },
	
	] },

	{ text: 'Marketplace', header: true, anchor: true, type: 'learn', slug: 'documentation/products/marketplace', key: 'marketplace' },
	
	{ text: 'Technical Support', header: true, anchor: true, type: 'learn', slug: '/documentation/services/support/', key: 'technicalSupport' },
	{
		text: 'Professional Services', header: true, type: 'learn', key: 'professionalServices', children: [
			{ text: 'Integration Services', header: true, anchor: true, type: 'learn', slug: '/documentation/services/solutions-lab/integration-services/', key: 'professionalServices/integrationServices' },
			{ text: 'Technical Account Manager', header: true, anchor: true, type: 'learn', slug: '/documentation/services/technical-account-manager/', key: 'professionalServices/TAM' },
			{ text: 'Best Practices Review', header: true, anchor: true, type: 'learn', slug: '/documentation/services/best-practices-review/', key: 'professionalServices/bestPracticesReview' },
			{ text: 'Custom Education Programs', header: true, anchor: true, type: 'learn', slug: '/documentation/services/custom-education-programs/', key: 'professionalServices/customEducationPrograms' },
			{ text: 'Security Response Team', header: true, anchor: true, type: 'learn', slug: '/documentation/services/security-response-team/', key: 'professionalServices/SRT' },
			{ text: 'Business Events Support', header: true, anchor: true, type: 'learn', slug: '/documentation/services/business-events-support/', key: 'professionalServices/businessEventsSupport' },
			{ text: 'Slack Channel', header: true, anchor: true, type: 'learn', slug: '/documentation/services/slack-channel/', key: 'professionalServices/SlackChannel' },
		]
	},	


	{ text: 'Dev Tools', header: true, type: 'learn', key: 'devtools', addBorder: true, children: [
		{ text: 'API', slug: 'https://api.azion.com', key: 'api' },
		{ text: 'GraphQL API', slug: 'documentation/products/graphql-api', key: 'graphQLAPI' },
		{ text: 'Azion CLI', slug: '/documentation/products/azion-cli/overview/', key: 'azionCLI' },
		{ text: 'Edge Runtime', slug: 'documentation/products/edge-application/edge-functions/runtime/overview', key: 'edgeRuntime' },
		{ text: 'SDK', slug: 'documentation/devtools/sdk/go', key: 'sdkGO' },
		{ text: 'Terraform', slug: 'documentation/products/terraform-provider', key: 'terraform' },
	]},

	{ text: 'Changelog', header: true, type: 'learn', anchor: true, slug: 'documentation/products/changelog', key: 'changelog' },
	{ text: 'System Status', header: true, type: 'learn', anchor: true, slug: 'https://status.azion.com', key: 'systemStatus' },
	{ text: 'Azion Network Program', header: true, type: 'learn', anchor: true, slug: 'documentation/products/azion-network-program', key: 'azionNetworkProgram' },

] as const;
