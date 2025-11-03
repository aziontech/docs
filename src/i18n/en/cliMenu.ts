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
	{ text: 'Dev Tools', header: true, onlyMobile: true, anchor: true, type: 'learn', slug: '/documentation/devtools/', key: 'devTools' },

	/// START HERE :::: DO NOT REMOVE the strings above, it's a work around for header on mobile /// 

	{ text: 'Overview', header: true, anchor: true, type: 'learn', key: 'overview', slug: '/documentation/products/cli/overview' },
	{ text: 'First Steps', header: true, anchor: true, type: 'learn', key: 'firstSteps', slug: '/documentation/products/cli/first-steps' },

	{ text: 'Commands', header: true, key: 'commands', type: 'learn', items: [
		{ text: 'Applications', slug: '/documentation/products/cli/edge-applications', key: 'commands/edgeApp' },
		{ text: 'Functions', slug: '/documentation/products/cli/edge-functions', key: 'commands/edgeFunctions' },
		{ text: 'Functions Instances', slug: '/documentation/products/cli/edge-functions-instances', key: 'commands/edgeFunctions/instances' },
		{ text: 'Domains', slug: '/documentation/products/cli/domains', key: 'commands/Domains' },
		{ text: 'Origins', slug: '/documentation/products/cli/origins', key: 'commands/Origins' },
		{ text: 'Cache Settings', slug: '/documentation/products/cli/cache-settings', key: 'commands/CacheSettings' },
		{ text: 'Rules Engine', slug: '/documentation/products/cli/rules-engine', key: 'commands/rulesEngine' },
		{ text: 'Variables', slug: '/documentation/products/cli/variables', key: 'commands/variables' },
	] },

	{ text: 'Guides', header: true, type: 'learn', key: 'guides', items: [
		{ text: 'Installing Azion CLI manually', slug: '/documentation/products/guides/cli-installing-manually', key: 'guides/installCLI' },
		{ text: 'Autocomplete', slug: '/documentation/products/guides/cli-auto-complete', key: 'guides/autocomplete' },
		{ text: 'Configuring Output', slug: '/documentation/products/guides/cli-output-configuration', key: 'guides/configuringOutput' },
		{ text: 'Running the CLI on macOS', slug: '/documentation/products/guides/cli-running-macos', key: 'guides/cliMacOS' },
		{ text: 'Creating an application', slug: '/documentation/products/guides/cli-creating-edge-application', key: 'guides/createEdgeApp' },
		{ text: 'Managing your edge functions', slug: '/documentation/products/guides/cli-managing-edge-functions', key: 'guides/manageEdgeFunc' },
		{ text: 'Creating a function on Azion using the Next.js framework', slug: '/documentation/products/guides/nextjs-ssr-on-azion-platform', key: 'guides/createFunc' },
	] },
] as const;
