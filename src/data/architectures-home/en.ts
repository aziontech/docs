import type { ArchitecturesHomeContent } from './types';

export const en: ArchitecturesHomeContent = {
	lang: 'en',

	hero: {
		title: 'Use Cases',
		description:
			'Each use case is a validated design that shows how Azion products combine to solve it: the components, the flows, and the decisions behind each one.',
	},

	directory: {
		heading: { depth: 2, slug: 'all-use-cases', text: 'All use cases' },
		intro: 'Every use case, grouped by the solution it serves.',
		cardLink: 'Read the use case',
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
				{ label: 'How Azion works', href: '/en/documentation/fundamentals/how-it-works/' },
				{ label: 'use cases llms.txt', href: '/en/documentation/architectures/llms.txt' },
			],
		},
	},
};
