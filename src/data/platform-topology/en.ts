import type { PlatformTopologyContent } from './types';

// Keep in sync with the "Platform resources topology" walkthrough on the Fundamentals overview
// (src/content/docs/en/pages/main-menu/get-started/fundamentals.mdx).
const REQUIRED = { label: 'Required', severity: 'info' } as const;
const OPTIONAL = { label: 'Optional', severity: 'secondary' } as const;

export const en: PlatformTopologyContent = {
	lang: 'en',
	ariaLabel: 'Platform resources topology',
	referenceLabel: 'Read the reference',
	links: [{ from: 'connector', to: 'store-ai' }],
	columns: [
		[
			{
				id: 'workload',
				icon: 'ai ai-workloads',
				kind: 'Workload',
				tag: REQUIRED,
				role: 'Receives traffic',
				items: [
					{
						id: 'domains',
						label: 'Domains',
						href: '/en/documentation/platform/workloads/domains/',
					},
					{
						id: 'certificate-manager',
						label: 'Certificate Manager',
						href: '/en/documentation/platform/certificate-manager/',
					},
				],
				href: '/en/documentation/platform/workloads/',
			},
		],
		[
			{
				id: 'firewall',
				icon: 'ai ai-edge-firewall',
				kind: 'Firewall',
				tag: OPTIONAL,
				role: 'Filters requests',
				terminal: true,
				items: [
					{ id: 'waf', label: 'WAF', href: '/en/documentation/secure/waf/' },
					{
						id: 'ddos-protection',
						label: 'DDoS Protection',
						href: '/en/documentation/platform/ddos-protection/',
					},
					{
						id: 'bot-manager',
						label: 'Bot Manager',
						href: '/en/documentation/secure/bot-manager/',
					},
					{
						id: 'network-shield',
						label: 'Network Shield',
						href: '/en/documentation/secure/network-shield/',
					},
				],
				href: '/en/documentation/platform/firewall/',
			},
			{
				id: 'application',
				icon: 'ai ai-edge-application',
				kind: 'Application',
				tag: REQUIRED,
				role: 'Serves content',
				items: [
					{
						id: 'functions',
						label: 'Functions',
						href: '/en/documentation/build/functions/',
					},
					{
						id: 'rules-engine',
						label: 'Rules Engine',
						href: '/en/documentation/platform/applications/rules-engine/',
					},
					{ id: 'cache', label: 'Cache', href: '/en/documentation/build/cache/' },
					{
						id: 'image-processor',
						label: 'Image Processor',
						href: '/en/documentation/build/image-processor/',
					},
				],
				href: '/en/documentation/platform/applications/',
			},
			{
				id: 'custom-pages',
				icon: 'ai ai-custom-pages',
				kind: 'Custom Pages',
				tag: OPTIONAL,
				role: 'Error pages',
				terminal: true,
				href: '/en/documentation/platform/custom-pages/',
			},
		],
		[
			{
				id: 'store-ai',
				icon: 'ai ai-store',
				kind: 'Store and AI',
				tag: OPTIONAL,
				role: 'Data and models',
				terminal: true,
				items: [
					{
						id: 'sql-database',
						label: 'SQL Database',
						href: '/en/documentation/store/sql-database/',
					},
					{
						id: 'kv-store',
						label: 'KV Store',
						href: '/en/documentation/store/kv-store/',
					},
					{
						id: 'ai-inference',
						label: 'AI Inference',
						href: '/en/documentation/build/ai-inference/',
					},
					{
						id: 'object-storage',
						label: 'Object Storage',
						href: '/en/documentation/store/object-storage/',
					},
				],
				href: '/en/documentation/build/functions/',
			},
			{
				id: 'connector',
				icon: 'ai ai-edge-connectors',
				kind: 'Connector',
				tag: REQUIRED,
				role: 'HTTP or storage',
				items: [
					{
						id: 'load-balancer',
						label: 'Load Balancer',
						href: '/en/documentation/platform/load-balancer/',
					},
					{
						id: 'origin-shield',
						label: 'Origin Shield',
						href: '/en/documentation/secure/origin-shield/',
					},
				],
				href: '/en/documentation/platform/connectors/',
			},
		],
		[
			{
				id: 'origin',
				icon: 'pi pi-server',
				kind: 'Origin',
				tag: { label: 'Yours', severity: 'contrast' },
				role: 'Your server',
				terminal: true,
				href: '/en/documentation/platform/connectors/origins/',
			},
		],
	],
};
