import type { DevtoolsHomeContent } from './types';

export const ptBr: DevtoolsHomeContent = {
	lang: 'pt-br',

	hero: {
		title: 'Ferramentas de desenvolvimento',
		description:
			'Conecte um agente de código, execute um projeto localmente, faça o deploy e automatize a plataforma com Azion CLI, APIs, Go SDK e o servidor MCP.',
		buttonLabel: 'Faça o deploy do seu site',
		buttonLink: '/pt-br/documentacao/fundamentos/primeiro-deploy/',
	},

	promptPreview: {
		label: 'Ver prompt',
		hideLabel: 'Ocultar prompt',
		title: 'Prompt de configuração',
		copyLabel: 'Copiar prompt',
		copiedLabel: 'Prompt copiado',
	},

	tools: {
		heading: { depth: 2, slug: 'todas-as-ferramentas', text: 'Todas as ferramentas' },
		intro: 'Cada ferramenta de desenvolvimento, agrupada pelo trabalho que faz.',
		cards: {
			'agent-setup': { icon: 'pi pi-microchip-ai', link: 'Escolha seu agente' },
			mcp: { icon: 'pi pi-server', link: 'Conecte o servidor MCP' },
			cli: { icon: 'ai ai-azion-cli', link: 'Instale a CLI' },
			runtime: { icon: 'ai ai-edge-functions', link: 'Veja as APIs' },
			'azion-lib': { icon: 'ai ai-edge-libraries', link: 'Instale a biblioteca' },
			sdk: { icon: 'pi pi-box', link: 'Instale o SDK' },
			api: { icon: 'ai ai-azion-api', link: 'Chame a API' },
			graphql: { icon: 'ai ai-graphql', link: 'Explore o GraphQL' },
			terraform: { icon: 'ai ai-terraform', link: 'Veja como funciona' },
			'console-kit': { icon: 'pi pi-palette', link: 'Personalize o Console' },
		},
		footer: {
			prefix: 'Também útil:',
			links: [
				{ label: 'Changelog', href: '/pt-br/documentacao/changelog/' },
				{ label: 'Referência da API da Azion', href: 'https://api.azion.com/' },
				{ label: 'docs-llms.txt', href: '/pt-br/docs-llms.txt' },
			],
		},
	},
};
