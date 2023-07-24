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
	{ text: 'Learn',header: true, onlyMobile: true, anchor: true, slug: 'https://learn.azion.com/', key: 'Learn' },

	/// START HERE :::: DO NOT REMOVE the strings above, it's a work around for header on mobile /// 

	{ text: 'Visão geral' , header: true, anchor: true, type: 'learn',  key: 'overview', slug: '/documentacao/produtos/edge-application/edge-functions/runtime/visao-geral/' },
	{ text: 'Referências de API', header: true, type: 'learn',  key: 'apiReference', children: [
		{ text: 'Variáveis de Ambiente', slug: '/documentacao/produtos/edge-application/edge-functions/runtime/api-reference/environment-variables/', key: 'runtime/variables' },
		{ text: 'Web Standards', slug: '/documentacao/produtos/edge-application/edge-functions/runtime-apis/javascript/', key: 'runtime/web-standards' },
		{ text: 'Metadados', slug: '/documentacao/produtos/edge-application/edge-functions/runtime/api-reference/metadata/', key: 'runtime/metadata' },
		{ text: 'Network List', slug: '/documentacao/produtos/edge-application/edge-functions/runtime/api-reference/network-list/', key: 'runtime/network-list' },
	] },

	
	{ text: 'Exemplos em JavaScript', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/edge-application/edge-functions/javascript-examples/', key: 'runtime/jsExamples' },
	{ text: 'Debugging', header: true, anchor: true,  type: 'learn', slug: '/documentacao/produtos/edge-application/edge-functions/debugging/', key: 'runtime/debugging' },
	
	{ text: 'Desenvolvimento', header: true, type: 'learn',  key: 'development', children: [
		{ text: 'Editor de Código', slug: '/documentacao/produtos/edge-application/edge-functions/runtime-api/code-editor/', key: 'runtime/code-editor' },
		{ text: 'Preview Deployment', slug: '/documentacao/produtos/edge-application/edge-functions/runtime-api/preview-deployment/', key: 'runtime/preview-deployment' },
	] },


];
