
 export default [
	{ text: 'Documentação', header: true, onlyMobile: true, anchor: true, slug: 'documentation', key: 'documentation' },
	{ text: 'Guias',header: true, onlyMobile: true, anchor: true, slug: 'guides', key: 'guides' },
	{ text: 'Dev Tools',header: true, onlyMobile: true, anchor: true, slug: 'devTools', key: 'devTools' },
	{ text: 'Learn',header: true, onlyMobile: true, anchor: true, slug: 'Learn', key: 'Learn' },

	/// START HERE :::: DO NOT REMOVE the strings above, it's a work around for header on mobile /// 

	{ text: 'Visão Geral',header: true, anchor: true, type: 'learn', key: 'overview', slug: '/documentacao/produtos/cli/visao-geral/' },
	{ text: 'Primeiros passos',header: true, anchor: true, type: 'learn', key: 'firstSteps', slug: '/documentacao/produtos/cli/primeiros-passos' },

	{ text: 'Comandos',header: true,  type: 'learn',  key: 'commands' },
	{ text: 'Edge Applications', slug: '/documentacao/produtos/cli/edge-applications', key: 'commands/edgeApp' },
	{ text: 'Edge Functions', slug: '/documentacao/produtos/cli/edge-functions', key: 'commands/edgeFunctions' },
	{ text: 'Edge Functions Instances', slug: '/documentacao/produtos/cli/edge-functions-instances', key: 'commands/edgeFunctions/instances' },
	{ text: 'Domains', slug: '/documentacao/produtos/cli/domains', key: 'commands/Domains' },
	{ text: 'Origins', slug: '/documentacao/produtos/cli/origins', key: 'commands/Origins' },
	{ text: 'Cache Settings', slug: '/documentacao/produtos/cli/cache-settings', key: 'commands/CacheSettings' },
	{ text: 'Rules Engine', slug: '/documentacao/produtos/cli/rules-engine', key: 'commands/rulesEngine' },
	{ text: 'Variables', slug: '/documentacao/produtos/cli/variables', key: 'commands/variables' },


	{ text: 'Guias',header: true,  type: 'learn', key: 'guides' },
	{ text: 'Instalando a Azion CLI manualmente', slug: '/documentacao/produtos/guias/cli-instalando-manualmente', key: 'guides/installCLI' },
	{ text: 'Utilizando a funcionalidade Autocomplete', slug: '/documentacao/produtos/guias/cli-auto-complete', key: 'guides/autocomplete' },
	{ text: 'Configuração de Saída', slug: '/documentacao/produtos/guias/cli-configuracao-saida', key: 'guides/configuringOutput' },
	{ text: 'Executando a CLI no macOS', slug: '/documentacao/produtos/guias/cli-executando-macos', key: 'guides/cliMacOS' },
	{ text: 'Criando uma edge application', slug: '/documentacao/produtos/guias/cli-criando-edge-application', key: 'guides/createEdgeApp' },
	{ text: 'Gerenciando suas edge functions', slug: '/documentacao/produtos/guias/cli-gerenciando-edge-functions', key: 'guides/manageEdgeFunc' },
	{ text: 'Criando uma função na plataforma da Azion usando o framework Next.js', slug: '/documentacao/produtos/guias/nextjs-ssr-na-plataforma-azion/', key: 'guides/createFunc' },

];
