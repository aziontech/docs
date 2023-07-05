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
	{ text: 'Documentation', header: true, onlyMobile: true, anchor: true, type: 'learn', slug: 'documentation', key: 'documentation' },
	{ text: 'Guides', header: true, onlyMobile: true, anchor: true, type: 'learn', slug: 'guides', key: 'guides' },
	{ text: 'Dev Tools', header: true, onlyMobile: true, anchor: true, type: 'learn', slug: 'devTools', key: 'devTools' },
	{ text: 'Learn', header: true, onlyMobile: true, anchor: true, type: 'learn', slug: 'Learn', key: 'Learn' },

	{ text: 'Getting Started', header: true, anchor: true, type: 'learn', slug: 'documentation/products/getting-started', key: 'Learn' },


	{ text: 'Accounts and Profile', header: true, type: 'learn', key: 'accountsProfile' },
	{ text: 'Create account', slug: 'documentation/products/accounts/creating-account', key: 'accountsProfile/createAccount' },
	{ text: 'Acccount Settings', slug: 'documentation/products/accounts/account-settings', key: 'accountsProfile/settings' },
	{ text: 'Users Managements', slug: 'documentation/products/accounts/users-and-teams', key: 'accountsProfile/usersManagement' },
	{ text: 'Billing', slug: 'documentation/products/accounts/billing', key: 'accountsProfile/billing' },
	{ text: 'Credentials', slug: 'documentation/products/credentials', key: 'accountsProfile/credentials' },
	{ text: 'Activity History', slug: 'documentation/products/accounts/activity-history', key: 'accountsProfile/activityHistory' },
	{ text: 'Teams Permissions', slug: 'documentation/products/accounts/teams-permissions', key: 'accountsProfile/teamsPermissions' },
	{ text: 'Single Sign-On (SSO)', slug: 'documentation/products/accounts/single-sign-on', key: 'accountsProfile/singleSignOn' },
	{ text: 'Your settings', slug: 'documentation/products/accounts/your-settings', key: 'accountsProfile/yourSettings' },
	{ text: 'Personal Tokens', slug: 'documentation/products/accounts/personal-tokens', key: 'accountsProfile/personalTokens' },
	{ text: 'Social Login', slug: 'documentation/products/accounts/social-login', key: 'accountsProfile/socialLogin' },
	{ text: 'Groups and Clients', slug: 'documentation/products/accounts/clients', key: 'accountsProfile/GroupsAndClients' },
	{ text: 'Multi-Factor Authentication', slug: 'documentation/products/accounts/multi-factor-authentication', key: 'accountsProfile/multiFactorAuth' },

	{ text: 'Build', header: true, type: 'learn', key: 'Build' },
	{ text: 'Edge Application', slug: 'documentation/products/edge-application/application-acceleration', key: 'edgeApplication' },
	{ text: 'Edge Caching', slug: 'documentation/products/edge-application/edge-caching', key: 'edgeCaching' },
	{ text: 'Edge Function', slug: 'documentation/products/edge-application/edge-functions', key: 'edgeFunctions' },
	{ text: 'Image Processor', slug: 'documentation/products/edge-application/image-processor', key: 'imageProcessor' },
	{ text: 'Load Balancer', slug: 'documentation/products/edge-application/load-balancer', key: 'loadBalancer' },

	{ text: 'Secure', header: true, type: 'learn', key: 'Secure' },
	{ text: 'DDoS Protection', slug: 'documentation/products/edge-firewall/ddos-protection', key: 'ddosProtection' },
	{ text: 'Network Layer Protection', slug: 'documentation/products/edge-firewall/network-layer-protection', key: 'networkLayerProtection' },
	{ text: 'Web Application Firewall', slug: 'documentation/products/edge-firewall/web-application-firewall', key: 'webApplicationFirewall' },

	{ text: 'Deliver', header: true, type: 'learn', key: 'Deliver' },
	{ text: 'Edge Node', slug: 'documentation/products/edge-orchestrator/edge-node', key: 'edgeNode' },
	{ text: 'Edge Services', slug: 'documentation/products/edge-orchestrator/edge-services', key: 'edgeServices' },

	{ text: 'Observe', header: true, type: 'learn', key: 'Observe' },
	{ text: 'Data Streaming', slug: 'documentation/products/data-streaming', key: 'dataStreaming' },
	{ text: 'Edge Pulse', slug: 'documentation/products/edge-pulse', key: 'edgePulse' },
	{ text: 'Real-Time Metrics', slug: 'documentation/products/real-time-metrics', key: 'realTimeMetrics' },
	{ text: 'Real-Time Events', slug: 'documentation/products/real-time-events', key: 'realTimeEvents' },

	{ text: 'Marketplace', header: true, anchor: true, type: 'learn', slug: 'documentation/products/marketplace', key: 'Marketplace' },

	{ text: 'Services', header: true, type: 'learn', key: 'Services' },
	{ text: 'Integration Services', slug: 'documentation/services/solutions-lab/integration-services', key: 'integrationServices' },
	{ text: 'Support', slug: 'documentation/services/support', key: 'support' },


	{ text: 'API', header: true, anchor: true, type: 'learn', slug: 'https://api.azion.com', key: 'api' },
	{ text: 'GraphQL API', header: true, anchor: true, type: 'learn', slug: 'documentation/products/graphql-api', key: 'graphQLAPI' },
	{ text: 'Azion CLI', header: true, anchor: true, type: 'learn', slug: 'documentation/products/cli', key: 'azionCLI' },
	{ text: 'Edge Runtime', header: true, anchor: true, type: 'learn', slug: 'documentation/products/cli', key: 'edgeRuntime' },


	{ text: 'Changelog', header: true, type: 'learn', anchor: true, slug: 'documentation/products/changelog', key: 'changelog' },
	{ text: 'System Status', header: true, type: 'learn', anchor: true, slug: 'https://status.azion.com', key: 'systemStatus' },
	{ text: 'Azion Network Program', header: true, type: 'learn', anchor: true, slug: 'documentation/products/azion-network-program', key: 'azionNetworkProgram' },


] as const;
