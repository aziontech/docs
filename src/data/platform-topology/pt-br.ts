import type { PlatformTopologyContent } from './types';

// Manter em sincronia com o passo a passo de "Topologia dos Recursos de Plataforma" na visão
// geral de Fundamentos (src/content/docs/pt-br/pages/menu-principal/ponto-de-partida/fundamentos.mdx).
const OBRIGATORIO = { label: 'Obrigatório', severity: 'info' } as const;
const OPCIONAL = { label: 'Opcional', severity: 'secondary' } as const;

export const ptBr: PlatformTopologyContent = {
	lang: 'pt-br',
	ariaLabel: 'Topologia dos Recursos de Plataforma',
	referenceLabel: 'Ler a referência',
	links: [{ from: 'connector', to: 'store-ai' }],
	columns: [
		[
			{
				id: 'workload',
				icon: 'ai ai-workloads',
				kind: 'Workload',
				tag: OBRIGATORIO,
				role: 'Recebe o tráfego',
				items: [
					{
						id: 'domains',
						label: 'Domínios',
						href: '/pt-br/documentacao/plataforma/workloads/domains/',
					},
					{
						id: 'certificate-manager',
						label: 'Certificate Manager',
						href: '/pt-br/documentacao/plataforma/certificate-manager/',
					},
				],
				href: '/pt-br/documentacao/plataforma/workloads/',
			},
		],
		[
			{
				id: 'firewall',
				icon: 'ai ai-edge-firewall',
				kind: 'Firewall',
				tag: OPCIONAL,
				role: 'Filtra requisições',
				terminal: true,
				items: [
					{ id: 'waf', label: 'WAF', href: '/pt-br/documentacao/secure/waf/' },
					{
						id: 'ddos-protection',
						label: 'DDoS Protection',
						href: '/pt-br/documentacao/plataforma/ddos-protection/',
					},
					{
						id: 'bot-manager',
						label: 'Bot Manager',
						href: '/pt-br/documentacao/secure/bot-manager/',
					},
					{
						id: 'network-shield',
						label: 'Network Shield',
						href: '/pt-br/documentacao/secure/network-shield/',
					},
				],
				href: '/pt-br/documentacao/plataforma/firewall/',
			},
			{
				id: 'application',
				icon: 'ai ai-edge-application',
				kind: 'Aplicação',
				tag: { label: 'Obrigatória', severity: 'info' },
				role: 'Serve o conteúdo',
				items: [
					{
						id: 'functions',
						label: 'Functions',
						href: '/pt-br/documentacao/build/functions/',
					},
					{
						id: 'rules-engine',
						label: 'Rules Engine',
						href: '/pt-br/documentacao/plataforma/applications/rules-engine/',
					},
					{ id: 'cache', label: 'Cache', href: '/pt-br/documentacao/build/cache/' },
					{
						id: 'image-processor',
						label: 'Image Processor',
						href: '/pt-br/documentacao/build/image-processor/',
					},
				],
				href: '/pt-br/documentacao/plataforma/applications/',
			},
			{
				id: 'custom-pages',
				icon: 'ai ai-custom-pages',
				kind: 'Custom Pages',
				tag: OPCIONAL,
				role: 'Páginas de erro',
				terminal: true,
				href: '/pt-br/documentacao/plataforma/custom-pages/',
			},
		],
		[
			{
				id: 'store-ai',
				icon: 'ai ai-store',
				kind: 'Store e AI',
				tag: OPCIONAL,
				role: 'Dados e modelos',
				terminal: true,
				items: [
					{
						id: 'sql-database',
						label: 'SQL Database',
						href: '/pt-br/documentacao/store/sql-database/',
					},
					{
						id: 'kv-store',
						label: 'KV Store',
						href: '/pt-br/documentacao/store/kv-store/',
					},
					{
						id: 'ai-inference',
						label: 'AI Inference',
						href: '/pt-br/documentacao/build/ai-inference/',
					},
					{
						id: 'object-storage',
						label: 'Object Storage',
						href: '/pt-br/documentacao/store/object-storage/',
					},
				],
				href: '/pt-br/documentacao/build/functions/',
			},
			{
				id: 'connector',
				icon: 'ai ai-edge-connectors',
				kind: 'Connector',
				tag: OBRIGATORIO,
				role: 'HTTP ou storage',
				items: [
					{
						id: 'load-balancer',
						label: 'Load Balancer',
						href: '/pt-br/documentacao/plataforma/load-balancer/',
					},
					{
						id: 'origin-shield',
						label: 'Origin Shield',
						href: '/pt-br/documentacao/secure/origin-shield/',
					},
				],
				href: '/pt-br/documentacao/plataforma/connectors/',
			},
		],
		[
			{
				id: 'origin',
				icon: 'pi pi-server',
				kind: 'Origem',
				tag: { label: 'Sua', severity: 'contrast' },
				role: 'Seu servidor',
				terminal: true,
				href: '/pt-br/documentacao/plataforma/connectors/origins/',
			},
		],
	],
};
