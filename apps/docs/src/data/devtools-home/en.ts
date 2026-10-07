import type { DevtoolsHomeContent } from './types';

export const en: DevtoolsHomeContent = {
	lang: 'en',

	hero: {
		title: 'Developer tools',
		description:
			'Connect a coding agent, run a project locally, deploy it, and automate the platform with Azion CLI, APIs, and the MCP server.',
		buttonLabel: 'Deploy your site',
		buttonLink: '/en/documentation/fundamentals/first-deploy/',
	},

	promptPreview: {
		label: 'Show prompt',
		hideLabel: 'Hide prompt',
		title: 'Setup prompt',
		copyLabel: 'Copy prompt',
		copiedLabel: 'Prompt copied',
	},

	tools: {
		heading: { depth: 2, slug: 'all-tools', text: 'All tools' },
		intro: 'Every developer tool, grouped by the job it does.',
		cards: {
			'agent-setup': { icon: 'pi pi-microchip-ai', link: 'Pick your agent' },
			mcp: { icon: 'pi pi-server', link: 'Connect the MCP server' },
			cli: { icon: 'ai ai-azion-cli', link: 'Install the CLI' },
			runtime: { icon: 'ai ai-edge-functions', link: 'Browse the APIs' },
			'azion-lib': { icon: 'ai ai-edge-libraries', link: 'Install the library' },
			api: { icon: 'ai ai-azion-api', link: 'Call the API' },
			graphql: { icon: 'ai ai-graphql', link: 'Explore GraphQL' },
			terraform: { icon: 'ai ai-terraform', link: 'Install the provider' },
		},
		footer: {
			prefix: 'Also useful:',
			links: [
				{ label: 'Changelog', href: '/en/documentation/changelog/' },
				{ label: 'Azion API reference', href: 'https://api.azion.com/' },
				{ label: 'docs-llms.txt', href: '/en/docs-llms.txt' },
			],
		},
	},
};
