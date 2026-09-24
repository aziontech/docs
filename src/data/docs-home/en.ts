import type { DocsHomeContent } from './types';

const AGENT_PROMPT =
	'Help me set up Azion in this project. Do the following: 1. Install the Azion CLI: curl -fsSL https://cli.azion.app/install.sh | bash. 2. Connect the Azion MCP server (https://mcp.azion.com) so you can search current Azion docs; per-tool setup: https://www.azion.com/en/documentation/agent-setup/. 3. Review the project and check whether it is already linked to Azion; if it is not, run azion link and follow the prompts. 4. Suggest the most relevant next steps.';

export const en: DocsHomeContent = {
	lang: 'en',
	id: 'en/homes/home-docs',
	filePath: 'src/pages/en/documentation/index.astro',

	meta: {
		type: 'base',
		i18nReady: false,
		title: 'Documentation Home',
		description:
			'Azion is the full-stack edge computing platform that simplifies how you build, secure, and scale modern applications.',
		meta_tags: 'documentation, azion',
		namespace: 'documentation_home',
		permalink: '/documentation/',
		page_header: false,
		meta_tag_robots_no_index: false,
	},

	hero: {
		title: 'Welcome to Azion Docs',
		description:
			'We make every application fast and reliable. Deploy on a global network, with enterprise-grade security and no cold starts.',
		buttonLabel: 'Get started',
		buttonLink: '/en/documentation/first-deploy/',
		note: 'The prompt hands your coding agent the CLI, live docs over MCP, and this project linked.',
		prompt: AGENT_PROMPT,
		promptLabel: 'Copy prompt',
		promptCopiedLabel: 'Prompt copied!',
		promptTooltip: 'Copies a setup prompt for your AI coding tool',
	},

	interfaceSection: {
		heading: { depth: 2, slug: 'start-by-interface', text: 'Start by interface' },
		intro:
			'Hand the Console to a coding agent, or drive it yourself: visually, from the terminal, or over the API.',
		agent: {
			id: 'your-ai-agent-fluent-in-azion',
			title: 'Your AI agent, fluent in Azion',
			body: 'One prompt teaches any coding agent the platform: current product names, live docs through the Azion MCP server, and real deploys with the CLI.',
			copyLabel: 'Copy prompt',
			copiedLabel: 'Prompt copied!',
			tooltip: 'Copies a setup prompt for your AI coding tool',
			prompt: AGENT_PROMPT,
		},
		guided: {
			id: 'agent-setup',
			title: 'Prefer the guided route?',
			buttonLabel: 'Agent setup',
			buttonHref: '/en/documentation/agent-setup/',
		},
		cols: 3,
		cards: [
			{
				icon: 'ai ai-azion',
				title: 'Console',
				href: '/en/documentation/guides/platform/account-and-billing/how-to-access-azion-console/',
				link: 'Access the Console',
				body: 'Configure it visually: applications, firewall rules, metrics, and events.',
			},
			{
				icon: 'ai ai-azion-cli',
				title: 'CLI',
				href: '/en/documentation/devtools/cli/',
				link: 'Install the CLI',
				body: 'Stay in the terminal: link a project, run it locally, and deploy with a single binary.',
			},
			{
				icon: 'ai ai-azion-api',
				title: 'API',
				href: '/en/documentation/devtools/api/',
				link: 'Call the API',
				class: 'sm:col-span-2 lg:col-span-1',
				body: 'Drive it from your own systems: create and change resources over REST, token authenticated.',
			},
		],
	},

	sections: [
		{
			heading: { depth: 2, slug: 'start-by-objective', text: 'Start by objective' },
			intro: 'Build something, make it faster, lock it down, or run AI on it.',
			cols: 2,
			cards: [
				{
					icon: 'ai ai-build-pillar',
					title: 'Build your application',
					href: '/en/documentation/first-deploy/',
					body: 'Deploy from a template, a repo, or the CLI.',
				},
				{
					icon: 'pi pi-gauge',
					title: 'Accelerate your application',
					href: '/en/documentation/guides/application-performance/cache-and-purge/cache-settings/',
					body: 'Cache responses so your origin stops repeating itself.',
				},
				{
					icon: 'ai ai-secure-pillar',
					title: 'Secure your application',
					href: '/en/documentation/guides/application-security/firewall-and-waf/firewall-protect-your-domain/',
					body: 'A firewall in front, with a block rule you can verify.',
				},
				{
					icon: 'ai ai-ai-pillar',
					title: 'Execute AI inference',
					href: '/en/documentation/guides/application-development/frameworks/ai-inference-starter-kit/',
					body: 'A hosted model behind an OpenAI-compatible endpoint.',
				},
			],
			footer: {
				prefix: 'Also useful:',
				links: [
					{ label: 'Observe', href: '/en/documentation/observe/data-stream/' },
					{ label: 'Architectures', href: '/en/documentation/guides/?kind=reference-architecture' },
				],
			},
		},

		{
			heading: { depth: 2, slug: 'ready-made-templates', text: 'Ready-made templates' },
			intro: 'Deploy in one step, with CI/CD already wired up.',
			cols: 4,
			mobileCols: 2,
			cards: [
				{
					icon: 'ai-cor ai-react',
					title: 'React',
					href: '/en/documentation/guides/application-development/frameworks/react-boilerplate/',
				},
				{
					icon: 'ai-cor ai-next',
					title: 'Next.js',
					href: '/en/documentation/guides/application-development/frameworks/nextjs-static-boilerplate/',
				},
				{
					icon: 'ai ai-astro',
					title: 'Astro',
					href: '/en/documentation/guides/application-development/frameworks/astro-boilerplate/',
				},
				{
					icon: 'ai-cor ai-vue',
					title: 'Vue.js',
					href: '/en/documentation/guides/application-development/frameworks/vue-vite-boilerplate/',
				},
				{
					icon: 'ai-cor ai-angular',
					title: 'Angular',
					href: '/en/documentation/guides/application-development/frameworks/angular-boilerplate/',
				},
				{
					icon: 'ai ai-gatsby',
					title: 'Gatsby Blog',
					href: '/en/documentation/guides/application-development/frameworks/gatsby/',
				},
				{
					icon: 'ai ai-hono',
					title: 'Hono',
					href: '/en/documentation/guides/application-development/frameworks/hono/',
				},
				{
					icon: 'ai ai-hugo',
					title: 'Hugo',
					href: '/en/documentation/guides/application-development/frameworks/hugo-boilerplate/',
				},
			],
			footer: {
				prefix: 'Also useful:',
				links: [
					{ label: 'First deploy', href: '/en/documentation/first-deploy/' },
					{
						label: 'Frameworks compatibility',
						href: '/en/documentation/devtools/runtime/frameworks/frameworks-compatibility/',
					},
				],
			},
		},

		{
			heading: { depth: 2, slug: 'stop-attacks', text: 'Stop attacks' },
			intro:
				'Everything you need to protect applications, APIs, and the traffic that reaches them.',
			cols: 3,
			cards: [
				{
					icon: 'ai ai-edge-firewall',
					title: 'Add a firewall',
					href: '/en/documentation/guides/application-security/firewall-and-waf/work-with-rules-engine/',
					body: 'Bind it to your workload and prove a deny rule with curl.',
				},
				{
					icon: 'ai ai-waf-rules',
					title: 'Block injection attacks',
					href: '/en/documentation/guides/application-security/firewall-and-waf/create-waf-rule-set/',
					body: 'A SQL Injection rule set, with the blocks visible in events.',
				},
				{
					icon: 'pi pi-list-check',
					title: 'Tune false positives',
					href: '/en/documentation/guides/application-security/firewall-and-waf/tune-waf/',
					body: 'Turn WAF false positives into allowed rules.',
				},
				{
					icon: 'pi pi-microchip',
					title: 'Deny bad bots',
					href: '/en/documentation/guides/application-development/integrations/bot-manager-lite/',
					body: 'Deny automated requests that score above your threshold.',
				},
				{
					icon: 'pi pi-map',
					title: 'Network blocklists',
					href: '/en/documentation/guides/application-security/bots-and-network/blocklists-ip-addresses-edge/',
					body: 'Drop unwanted traffic before it reaches your application.',
				},
				{
					icon: 'pi pi-key',
					title: 'Install TLS certificates',
					href: '/en/documentation/guides/application-security/tls-and-certificates/create-a-digital-certificate/',
					body: 'Upload a certificate and key, then check the handshake.',
				},
				{
					icon: 'pi pi-arrow-right-arrow-left',
					title: 'Stream to SIEM',
					href: '/en/documentation/products/secure/automate/integrate-siems/',
					class: 'sm:col-span-2 lg:col-span-3',
					body: 'Stream WAF and firewall events where your team watches.',
				},
			],
			footer: {
				prefix: 'Reference, when you need the details:',
				links: [
					{ label: 'DDoS Protection', href: '/en/documentation/platform/ddos-protection/' },
					{ label: 'WAF Rule Sets', href: '/en/documentation/secure/waf/rules-set/' },
					{ label: 'WAF Exceptions', href: '/en/documentation/secure/waf/custom-allowed-rules/' },
					{ label: 'Bot Manager', href: '/en/documentation/secure/bot-manager/' },
				],
			},
		},

		{
			heading: {
				depth: 2,
				slug: 'assess-risk-and-prove-compliance',
				text: 'Assess risk and prove compliance',
			},
			intro:
				'What the platform covers, what stays with you, and where the evidence lives when an auditor asks for it.',
			cols: 3,
			cards: [
				{
					icon: 'pi pi-verified',
					title: 'Shared Responsibility Model',
					href: '/en/documentation/fundamentals/shared-responsibility/',
					body: 'What Azion covers, and what stays yours.',
				},
				{
					icon: 'pi pi-id-card',
					title: 'Governance, Risk and Compliance',
					href: '/en/documentation/guides/application-security/access-and-compliance/governance-risk-compliance/',
					body: 'The tools and certifications behind your compliance work.',
				},
				{
					icon: 'pi pi-wallet',
					title: 'PCI DSS compliance',
					href: '/en/documentation/fundamentals/pci-dss-certification/',
					body: 'PCI DSS 4.0 Level 1, and what it covers for cardholder data.',
				},
				{
					icon: 'pi pi-lock',
					title: 'SOC compliance',
					href: '/en/documentation/fundamentals/soc/',
					body: 'SOC 2 Type 2 and SOC 3 reports, twice a year.',
				},
				{
					icon: 'pi pi-history',
					title: 'Activity History',
					href: '/en/documentation/guides/platform/account-and-billing/activity-history/',
					body: 'The audit trail: who changed what, and when.',
				},
				{
					icon: 'pi pi-users',
					title: 'Security Response Team',
					href: '/en/documentation/services/security-response-team/',
					body: 'Azion mitigates on your behalf during an attack.',
				},
			],
			footer: {
				prefix: 'Access governance:',
				links: [
					{ label: 'Single Sign-On', href: '/en/documentation/fundamentals/single-sign-on/' },
					{
						label: 'Multi-Factor Authentication',
						href: '/en/documentation/fundamentals/multi-factor-authentication/',
					},
					{ label: 'Teams Permissions', href: '/en/documentation/fundamentals/teams-permissions/' },
					{
						label: 'Conditional Access',
						href: '/en/documentation/guides/application-security/access-and-compliance/conditional-access-by-ip-address/',
					},
				],
			},
		},

		{
			heading: { depth: 2, slug: 'follow-along', text: 'Follow along' },
			intro:
				'Release notes as things ship, plus the blog, the YouTube channel, and the Discord where questions get answered.',
			cols: 3,
			cards: [
				{
					icon: 'pi pi-megaphone',
					title: 'Release notes',
					href: '/en/documentation/changelog/',
					body: 'What changed in Azion products, as it ships.',
				},
				{
					icon: 'pi pi-book',
					title: 'Blog',
					href: 'https://www.azion.com/en/blog/',
					link: 'Read the blog',
					target: '_blank',
					body: 'Engineering posts and how customers run on Azion.',
				},
				{
					icon: 'pi pi-youtube',
					title: 'YouTube',
					href: 'https://www.youtube.com/aziontech',
					link: 'Watch on YouTube',
					target: '_blank',
					body: 'Walkthroughs, demos, and recorded sessions.',
				},
				{
					icon: 'pi pi-discord',
					title: 'Discord',
					href: 'https://discord.com/invite/Yp9N7RMVZy',
					link: 'Join the Discord',
					target: '_blank',
					body: 'Ask questions and compare notes with other builders.',
				},
				{
					icon: 'pi pi-pencil',
					title: 'Style guide',
					href: '/en/documentation/style-guide/',
					class: 'sm:col-span-2 lg:col-span-2',
					body: 'How Azion writes documentation: voice, structure, and conventions.',
				},
			],
		},
	],

	pagination: {
		nextTitle: 'Agent setup',
		nextHref: '/en/documentation/agent-setup/',
	},
};
