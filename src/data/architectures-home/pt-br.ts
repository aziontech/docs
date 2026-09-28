import type { ArchitecturesHomeContent } from './types';

export const ptBr: ArchitecturesHomeContent = {
	lang: 'pt-br',

	hero: {
		title: 'Arquiteturas',
		description:
			'Designs validados que mostram como os produtos Azion se combinam para implementar um caso de uso: os componentes, os fluxos e as decisões por trás de cada um.',
		buttonLabel: 'Implante um template',
		buttonLink: '/pt-br/documentacao/marketplace/templates/',
	},

	directory: {
		heading: { depth: 2, slug: 'todas-as-arquiteturas', text: 'Todas as arquiteturas' },
		intro: 'Toda arquitetura, agrupada pela solução que atende.',
		cardLink: 'Leia a arquitetura',
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
				{ label: 'Como a Azion funciona', href: '/pt-br/documentacao/plataforma/' },
				{ label: 'llms.txt das arquiteturas', href: '/pt-br/documentacao/arquiteturas/llms.txt' },
			],
		},
	},
};
