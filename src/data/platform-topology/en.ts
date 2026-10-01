import type { PlatformTopologyContent } from './types';

// Keep in sync with the "Platform resources topology" walkthrough on the Fundamentals overview
// (src/content/docs/en/pages/main-menu/get-started/fundamentals.mdx).
const REQUIRED = { label: 'Required', severity: 'info' } as const;
const OPTIONAL = { label: 'Optional', severity: 'secondary' } as const;

export const en: PlatformTopologyContent = {
	lang: 'en',
	ariaLabel: 'Platform resources topology',
	referenceLabel: 'Read the reference',
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
						href: '/en/documentation/platform/workloads/#certificate-manager',
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
					{ id: 'waf', label: 'WAF', href: '/en/documentation/platform/firewall/#waf' },
					{
						id: 'ddos-protection',
						label: 'DDoS Protection',
						href: '/en/documentation/platform/workloads/#ddos-protection',
					},
					{
						id: 'bot-manager',
						label: 'Bot Manager',
						href: '/en/documentation/platform/firewall/#bot-manager',
					},
					{
						id: 'network-shield',
						label: 'Network Shield',
						href: '/en/documentation/platform/firewall/#network-shield',
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
						href: '/en/documentation/platform/functions/',
					},
					{
						id: 'rules-engine',
						label: 'Rules Engine',
						href: '/en/documentation/platform/applications/rules-engine/',
					},
					{ id: 'cache', label: 'Cache', href: '/en/documentation/platform/applications/#cache' },
					{
						id: 'image-processor',
						label: 'Image Processor',
						href: '/en/documentation/platform/applications/#image-processor',
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
				href: '/en/documentation/platform/workloads/#custom-pages',
			},
		],
		[
			{
				id: 'connector',
				icon: 'ai ai-edge-connectors',
				kind: 'Connector',
				tag: REQUIRED,
				role: 'HTTP or storage',
				items: [
					{
						id: 'storage-connector',
						label: 'Storage connector',
						href: '/en/documentation/platform/connectors/#object-storage',
					},
					{
						id: 'load-balancer',
						label: 'Load Balancer',
						href: '/en/documentation/platform/connectors/load-balancer/',
					},
					{
						id: 'origin-shield',
						label: 'Origin Shield',
						href: '/en/documentation/platform/connectors/origin-shield/',
					},
				],
				href: '/en/documentation/platform/connectors/',
			},
			{
				id: 'store',
				icon: 'ai ai-store',
				kind: 'Store',
				tag: OPTIONAL,
				role: 'Data and files',
				terminal: true,
				items: [
					{
						id: 'sql-database',
						label: 'SQL Database',
						href: '/en/documentation/platform/sql-database/',
					},
					{
						id: 'kv-store',
						label: 'KV Store',
						href: '/en/documentation/platform/kv-store/',
					},
					{
						id: 'object-storage',
						label: 'Object Storage',
						href: '/en/documentation/platform/object-storage/',
					},
				],
			},
			{
				id: 'ai',
				icon: 'ai ai-ai-pillar',
				kind: 'AI',
				tag: OPTIONAL,
				role: 'Runs models',
				terminal: true,
				items: [
					{
						id: 'ai-inference',
						label: 'AI Inference',
						href: '/en/documentation/platform/ai-inference/',
					},
				],
			},
		],
		[
			{
				id: 'origin',
				icon: 'pi pi-server',
				kind: 'Origin',
				role: 'Your server',
				examples: ['On-premises', 'Cloud', 'Colocation'],
				terminal: true,
				href: '/en/documentation/platform/connectors/',
			},
		],
	],
};
