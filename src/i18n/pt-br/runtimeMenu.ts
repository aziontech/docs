
 export default[
	{ text: 'Documentação', header: true, onlyMobile: true, anchor: true, slug: 'documentation', key: 'documentation' },
	{ text: 'Guias' , header: true, onlyMobile: true, anchor: true, slug: 'guides', key: 'guides' },
	{ text: 'Dev Tools' , header: true, onlyMobile: true, anchor: true,  slug: 'devTools', key: 'devTools' },
	{ text: 'Learn' , header: true, onlyMobile: true,  slug: 'Learn', anchor: true, key: 'Learn' },

	/// START HERE :::: DO NOT REMOVE the strings above, it's a work around for header on mobile /// 

	{ text: 'Visão geral' , header: true, anchor: true, type: 'learn',  key: 'overview', slug: '/documentacao/produtos/edge-application/edge-functions/runtime/visao-geral/' },
	{ text: 'Referências de API', header: true, type: 'learn',  key: 'apiReference' },
	{ text: 'Web Standards', slug: '/documentacao/produtos/edge-application/edge-functions/runtime-apis/javascript/', key: 'runtime/web-standards' },
	{ text: 'Metadados', slug: '/documentacao/produtos/edge-application/edge-functions/runtime/api-reference/metadata/', key: 'runtime/metadata' },
	{ text: 'Network List', slug: '/documentacao/produtos/edge-application/edge-functions/runtime/api-reference/network-list/', key: 'runtime/network-list' },
	
	{ text: 'Exemplos em JavaScript', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/edge-application/edge-functions/javascript-examples/', key: 'runtime/jsExamples' },
	{ text: 'Debugging', slug: '/documentacao/produtos/edge-application/edge-functions/debugging/', key: 'runtime/debugging' },
	
	{ text: 'Desenvolvimento', header: true, type: 'learn',  key: 'development' },
	{ text: 'Editor de Código', slug: '/documentacao/produtos/edge-application/edge-functions/runtime-api/code-editor/', key: 'runtime/code-editor' },
	{ text: 'Preview Deployment', slug: '/documentacao/produtos/edge-application/edge-functions/runtime-api/preview-deployment/', key: 'runtime/preview-deployment' },

];
