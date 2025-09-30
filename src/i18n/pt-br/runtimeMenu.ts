/**
 * This configures the navigation sidebar.
 * All other languages follow this ordering/structure and will fall back to
 * English for any entries they haven’t translated.
 *
 * - All entries MUST include `text` and `key`
 * - Heading entries MUST include `header: true` and `type`
 * - Link entries MUST include `slug` (which excludes the language code)
 */
 export default[
	{ text: 'Documentação', header: true, onlyMobile: true, anchor: true, slug: '/documentacao/', key: 'documentation' },
	{ text: 'Guias',header: true, onlyMobile: true, anchor: true, slug: '/documentacao/produtos/guias/', key: 'guides' },
	{ text: 'Dev Tools',header: true, onlyMobile: true, anchor: true, slug: '/documentacao/produtos/dev-tools/', key: 'devTools' },

	/// START HERE :::: DO NOT REMOVE the strings above, it's a work around for header on mobile /// 

	{ text: 'Visão geral' , header: true, anchor: true, type: 'learn',  key: 'overview', slug: '/documentacao/runtime/visao-geral/', hasLabel:'menu.runtime' },
	{ text: 'Referências de API', header: true, type: 'learn',  key: 'apiReference', items: [
		{ text: 'Handlers', slug: '/documentacao/produtos/edge-application/edge-functions/runtime/api-reference/handlers/', key: 'runtime/handlers' },
		{ text: 'Variáveis de Ambiente', slug: '/documentacao/produtos/edge-application/edge-functions/runtime/api-reference/environment-variables/', key: 'runtime/variables' },
		{ text: 'Metadados', slug: '/documentacao/produtos/edge-application/edge-functions/runtime/api-reference/metadata/', key: 'runtime/metadata' },
		{ text: 'Cache', slug: '/documentacao/runtime/api-reference/cache/', key: 'runtime/cache-api' },
		{ text: 'Network List', slug: '/documentacao/produtos/edge-application/edge-functions/runtime/api-reference/network-list/', key: 'runtime/network-list' },
		{ text: 'Object Storage', slug: '/documentacao/runtime/api-reference/storage/', key: 'runtime/storage-api' },
		{ text: 'SQL Database', slug: '/documentacao/runtime/api-reference/edge-sql/', key: 'runtime/storage-api' },
		{ text: 'Web APIs', slug: '/documentacao/runtime-apis/javascript/', key: 'runtime/web-standards' },
		{ text: 'WebSocket', slug: '/documentacao/runtime/api-reference/websocket/', key: 'runtime/websocket' },
	] },

	{ text: 'Compatibilidade', header: true, type: 'learn', key: 'runtime/compatibility', items: [
		{ text: 'Web frameworks', header: true, anchor: true, type: 'learn', key: 'runtime/frameworks', slug: '/documentacao/produtos/devtools/azion-edge-runtime/compatibilidade-frameworks/' },
		{ text: 'Node.js', header: true, anchor: true, type: 'learn', key: 'runtime/node', slug: '/documentacao/produtos/devtools/azion-edge-runtime/compatibilidade/node/' },
		{ text: 'Use polyfills', header: true, anchor: true, type: 'learn', key: 'runtime/polyfills', slug: '/documentacao/devtools/guias/use-polyfills/' },
	]},

	{ text: 'Exemplos em JavaScript', header: true, anchor: true, type: 'learn', slug: '/documentacao/devtools/javascript-exemplos/', key: 'runtime/jsExamples' },
	{ text: 'Debugging', header: true, anchor: true,  type: 'learn', slug: '/documentacao/devtools/debugging/', key: 'runtime/debugging' },
	
	{ text: 'Desenvolvimento', header: true, type: 'learn',  key: 'development', items: [
		{ text: 'Editor de Código', slug: '/documentacao/produtos/edge-application/edge-functions/runtime-api/code-editor/', key: 'runtime/code-editor' },
		{ text: 'Preview Deployment', slug: '/documentacao/produtos/edge-application/edge-functions/runtime-api/preview-deployment/', key: 'runtime/preview-deployment' },
	] },


];
