import type { ArchitecturesHomeContent } from './types';

export const en: ArchitecturesHomeContent = {
	lang: 'en',

	hero: {
		title: 'Architectures',
		description:
			'Validated designs that show how Azion products combine to implement a use case: the components, the flows, and the decisions behind each one.',
		buttonLabel: 'Deploy a template',
		buttonLink: '/en/documentation/marketplace/templates/',
	},

	directory: {
		heading: { depth: 2, slug: 'all-architectures', text: 'All architectures' },
		intro: 'Every architecture, grouped by the solution it serves.',
		cardLink: 'Read the architecture',
		icons: {
			'build-and-run-applications': 'ai ai-build-pillar',
			'improve-performance-and-reliability': 'pi pi-gauge',
			'build-and-run-ai-workloads': 'ai ai-ai-pillar',
			'secure-applications-and-networks': 'ai ai-secure-pillar',
			'deliver-media-and-streaming': 'pi pi-video',
		},
		footer: {
			prefix: 'Also useful:',
			links: [
				{ label: 'Guides', href: '/en/documentation/guides/' },
				{ label: 'How Azion works', href: '/en/documentation/platform/' },
				{ label: 'architectures llms.txt', href: '/en/documentation/architectures/llms.txt' },
			],
		},
	},
};
