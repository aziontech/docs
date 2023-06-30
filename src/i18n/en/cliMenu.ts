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

	/// START HERE :::: DO NOT REMOVE the strings above, it's a work around for header on mobile /// 

	{ text: 'Overview', header: true, anchor: true, type: 'learn', key: 'overview', slug: 'documentacao' },
	{ text: 'First Steps', header: true, anchor: true, type: 'learn', key: 'overview', slug: 'documentacao' },

	{ text: 'Commands', header: true, key: 'commands', type: 'learn' },
	{ text: 'Edge Applications', slug: 'documentation/products/accounts/account-settings', key: 'commands/edgeApp' },
	{ text: 'Edge Functions', slug: 'documentation/products/accounts/users-and-teams', key: 'commands/edgeFunctions' },
	{ text: 'Edge Functions Instances', slug: 'documentation/products/accounts/billing', key: 'commands/edgeFunctions/instances' },
	{ text: 'Domains', slug: 'documentation/products/credentials', key: 'commands/Domains' },
	{ text: 'Origins', slug: 'documentation/products/accounts/activity-history', key: 'commands/Origins' },
	{ text: 'Cache Settings', slug: 'documentation/products/accounts/teams-permissions', key: 'commands/CacheSettings' },
	{ text: ' Rules Engine', slug: 'documentation/products/accounts/single-sign-on', key: 'commands/rulesEngine' },

	{ text: 'Guides', header: true, type: 'learn', key: 'overview' },
	{ text: 'Installing Azion CLI manually', slug: 'documentation/products/accounts/account-settings', key: 'guides/installCLI' },
	{ text: 'Autocomplete', slug: 'documentation/products/accounts/users-and-teams', key: 'guides/autocomplete' },
	{ text: 'Configuring Output', slug: 'documentation/products/accounts/billing', key: 'guides/configuringOutput' },
	{ text: 'Running the CLI on macOS', slug: 'documentation/products/credentials', key: 'guides/cliMacOS' },
	{ text: 'Creating an edge application', slug: 'documentation/products/accounts/activity-history', key: 'guides/createEdgeApp' },
	{ text: 'Managing your edge functions', slug: 'documentation/products/accounts/teams-permissions', key: 'guides/manageEdgeFunc' },
	{ text: 'Creating a function on Azion using the Next.js framework', slug: 'documentation/products/accounts/single-sign-on', key: 'guides/createFunc' },

] as const;
