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

	{ text: 'Overview', header: true, anchor: true, type: 'learn', key: 'overview', slug: '/documentation/products/edge-application/edge-functions/runtime/overview' },
	{ text: 'API Reference', header: true, anchor: true, type: 'learn', key: 'firstSteps', slug: '/documentation/products/edge-application/edge-functions/runtime-apis/javascript' },
	{ text: 'Web Standards', slug: '/documentation/products/edge-application/edge-functions/runtime-apis/javascript', key: 'runtime/web-standards' },
	{ text: 'Metadata API', slug: '/documentation/products/edge-application/edge-functions/runtime/api-reference/metadata', key: 'runtime/metadata' },
	{ text: 'Network List interface', slug: '/documentation/products/edge-application/edge-functions/runtime/api-reference/network-list', key: 'runtime/network-list' },

    { text: 'Edge Functions - JavaScript Examples', header: true, anchor: true, type: 'learn', slug: '/documentation/products/edge-application/edge-functions/javascript-examples', key: 'runtime/jsExamples' },
	{ text: 'Debugging', header: true, anchor: true, type: 'learn', slug: '/documentation/products/edge-application/edge-functions/debugging', key: 'runtime/debugging' },
	
    { text: 'Development', header: true, type: 'learn', key: 'development' },
    { text: 'Code Editor', slug: '/documentation/products/edge-application/edge-functions/runtime-api/code-editor', key: 'runtime/code-editor' },
	{ text: 'Preview Deployment', slug: '/documentation/products/edge-application/edge-functions/runtime-api/preview-deployment', key: 'runtime/preview-deployment' },

] as const;
