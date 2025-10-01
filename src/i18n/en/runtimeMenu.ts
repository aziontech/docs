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

	{ text: 'Overview', header: true, anchor: true, type: 'learn', key: 'overview', slug: '/documentation/products/edge-application/edge-functions/runtime/overview', hasLabel: 'menu.runtime' },
	{ text: 'API Reference', header: true, type: 'learn', key: 'apiReference', items: [
		{ text: 'Handlers', slug: '/documentation/products/edge-application/edge-functions/runtime/api-reference/handlers', key: 'runtime/handlers' },
		{ text: 'Environment Variables', slug: '/documentation/products/edge-application/edge-functions/runtime/api-reference/environment-variables', key: 'runtime/variables' },
		{ text: 'Metadata', slug: '/documentation/products/edge-application/edge-functions/runtime/api-reference/metadata', key: 'runtime/metadata' },
		{ text: 'Cache', slug: '/documentation/runtime/api-reference/cache/', key: 'runtime/cache-api' },
		{ text: 'Network List interface', slug: '/documentation/products/edge-application/edge-functions/runtime/api-reference/network-list', key: 'runtime/network-list' },
		{ text: 'Object Storage', slug: '/documentation/runtime/api-reference/storage/', key: 'runtime/storage-api' },
		{ text: 'SQL Database', slug: '/documentation/runtime/api-reference/edge-sql/', key: 'runtime/storage-api' },
		{ text: 'WebSocket', slug: '/documentation/runtime/api-reference/websocket/', key: 'runtime/websocket' },
	]},

	{ text: 'Compatibility', header: true, type: 'learn', key: 'runtime/compatibility', items: [
		{ text: 'Web frameworks', header: true, anchor: true, type: 'learn', key: 'runtime/frameworks', slug: '/documentation/products/devtools/azion-edge-runtime/frameworks-compatibility/' },
		{ text: 'Node.js', header: true, anchor: true, type: 'learn', key: 'runtime/node', slug: '/documentation/products/azion-edge-runtime/compatibility/node/' },
		{ text: 'Use polyfills', header: true, anchor: true, type: 'learn', key: 'runtime/polyfills', slug: '/documentation/devtools/guides/use-polyfills/' },
	]},

    { text: 'JavaScript Examples', header: true, anchor: true, type: 'learn', slug: '/documentation/products/edge-application/edge-functions/javascript-examples', key: 'runtime/jsExamples' },
	{ text: 'Debugging', header: true, anchor: true, type: 'learn', slug: '/documentation/products/edge-application/edge-functions/debugging', key: 'runtime/debugging' },
	
    { text: 'Development', header: true, type: 'learn', key: 'development', items: [
			{ text: 'Code Editor', slug: '/documentation/products/edge-application/edge-functions/runtime-api/code-editor', key: 'runtime/code-editor' },
			{ text: 'Preview Deployment', slug: '/documentation/products/edge-application/edge-functions/runtime-api/preview-deployment', key: 'runtime/preview-deployment' },
		] },


] as const;
