import type { ArchitecturesHomeContent } from './types';

export const ptBr: ArchitecturesHomeContent = {
	lang: 'pt-br',

	hero: {
		title: 'Casos de uso',
		description:
			'Cada caso de uso é um design validado que mostra como os produtos Azion se combinam para resolvê-lo: os componentes, os fluxos e as decisões por trás de cada um.',
	},

	directory: {
		heading: { depth: 2, slug: 'todos-os-casos-de-uso', text: 'Todos os casos de uso' },
		intro: 'Todo caso de uso, agrupado pela solução que atende.',
		cardLink: 'Leia o caso de uso',
		icons: {
			'build-and-run-applications': 'ai ai-build-pillar',
			'improve-performance-and-reliability': 'pi pi-gauge',
			'build-and-run-ai-workloads': 'ai ai-ai-pillar',
			'secure-applications-and-networks': 'ai ai-secure-pillar',
			'deliver-media-and-streaming': 'pi pi-video',
		},
		footer: {
			prefix: 'Também útil:',
			links: [
				{ label: 'Guias', href: '/pt-br/documentacao/guias/' },
				{ label: 'Como a Azion funciona', href: '/pt-br/documentacao/fundamentos/como-funciona/' },
				{ label: 'llms.txt dos casos de uso', href: '/pt-br/documentacao/casos-de-uso/llms.txt' },
			],
		},
	},
};
