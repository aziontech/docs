import { NavDictionary } from '../translation-checkers';

 export default NavDictionary([
	{ text: 'Documentação',  slug: 'documentation', key: 'documentation' },
	{ text: 'Guias',  slug: 'guides', key: 'guides' },
	{ text: 'Dev Tools',  slug: 'devTools', key: 'devTools' },
	{ text: 'Learn',  slug: 'Learn', key: 'Learn' },

	/// START HERE :::: DO NOT REMOVE the strings above, it's a work around for header on mobile /// 

	{ text: 'Visão geral', key: 'overview', slug: '/documentacao/produtos/edge-application/edge-functions/runtime/visao-geral/' },
	{ text: 'Referências de API', key: 'apiReference' },
	{ text: 'Web Standards', slug: '/documentacao/produtos/edge-application/edge-functions/runtime-apis/javascript/', key: 'runtime/web-standards' },
	{ text: 'Metadados', slug: '/documentacao/produtos/edge-application/edge-functions/runtime/api-reference/metadata/', key: 'runtime/metadata' },
	{ text: 'Network List', slug: '/documentacao/produtos/edge-application/edge-functions/runtime/api-reference/network-list/', key: 'runtime/network-list' },
	
	{ text: 'Exemplos em JavaScript', slug: '/documentacao/produtos/edge-application/edge-functions/javascript-examples/', key: 'runtime/jsExamples' },
	{ text: 'Debugging', slug: '/documentacao/produtos/edge-application/edge-functions/debugging/', key: 'runtime/debugging' },
	
	{ text: 'Desenvolvimento', key: 'development' },
	{ text: 'Editor de Código', slug: '/documentacao/produtos/edge-application/edge-functions/runtime-api/code-editor/', key: 'runtime/code-editor' },
	{ text: 'Preview Deployment', slug: '/documentacao/produtos/edge-application/edge-functions/runtime-api/preview-deployment/', key: 'runtime/preview-deployment' },

]);
