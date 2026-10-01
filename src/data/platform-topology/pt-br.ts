import type { PlatformTopologyContent } from './types';

// Manter em sincronia com o passo a passo de "Topologia dos Recursos de Plataforma" na visão
// geral de Fundamentos (src/content/docs/pt-br/pages/menu-principal/ponto-de-partida/fundamentos.mdx).
const OBRIGATORIO = { label: 'Obrigatório', severity: 'info' } as const;
const OPCIONAL = { label: 'Opcional', severity: 'secondary' } as const;

export const ptBr: PlatformTopologyContent = {
	lang: 'pt-br',
	ariaLabel: 'Topologia dos Recursos de Plataforma',
	referenceLabel: 'Ler a referência',
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
						href: '/pt-br/documentacao/plataforma/workloads/certificate-manager/',
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
					{ id: 'waf', label: 'WAF', href: '/pt-br/documentacao/plataforma/firewall/waf/' },
					{
						id: 'ddos-protection',
						label: 'DDoS Protection',
						href: '/pt-br/documentacao/plataforma/workloads/ddos-protection/',
					},
					{
						id: 'bot-manager',
						label: 'Bot Manager',
						href: '/pt-br/documentacao/plataforma/firewall/bot-manager/',
					},
					{
						id: 'network-shield',
						label: 'Network Shield',
						href: '/pt-br/documentacao/plataforma/firewall/network-shield/',
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
						href: '/pt-br/documentacao/plataforma/functions/',
					},
					{
						id: 'rules-engine',
						label: 'Rules Engine',
						href: '/pt-br/documentacao/plataforma/applications/rules-engine/',
					},
					{
						id: 'cache',
						label: 'Cache',
						href: '/pt-br/documentacao/plataforma/applications/cache/',
					},
					{
						id: 'image-processor',
						label: 'Image Processor',
						href: '/pt-br/documentacao/plataforma/applications/image-processor/',
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
				href: '/pt-br/documentacao/plataforma/workloads/custom-pages/',
			},
		],
		[
			{
				id: 'connector',
				icon: 'ai ai-edge-connectors',
				kind: 'Connector',
				tag: OBRIGATORIO,
				role: 'HTTP ou storage',
				items: [
					{
						id: 'storage-connector',
						label: 'Connector storage',
						href: '/pt-br/documentacao/plataforma/connectors/#object-storage',
					},
					{
						id: 'load-balancer',
						label: 'Load Balancer',
						href: '/pt-br/documentacao/plataforma/connectors/load-balancer/',
					},
					{
						id: 'origin-shield',
						label: 'Origin Shield',
						href: '/pt-br/documentacao/plataforma/connectors/origin-shield/',
					},
				],
				href: '/pt-br/documentacao/plataforma/connectors/',
			},
			{
				id: 'store',
				icon: 'ai ai-store',
				kind: 'Store',
				tag: OPCIONAL,
				role: 'Dados e arquivos',
				terminal: true,
				items: [
					{
						id: 'sql-database',
						label: 'SQL Database',
						href: '/pt-br/documentacao/plataforma/sql-database/',
					},
					{
						id: 'kv-store',
						label: 'KV Store',
						href: '/pt-br/documentacao/plataforma/kv-store/',
					},
					{
						id: 'object-storage',
						label: 'Object Storage',
						href: '/pt-br/documentacao/plataforma/object-storage/',
					},
				],
			},
			{
				id: 'ai',
				icon: 'ai ai-ai-pillar',
				kind: 'AI',
				tag: OPCIONAL,
				role: 'Executa modelos',
				terminal: true,
				items: [
					{
						id: 'ai-inference',
						label: 'AI Inference',
						href: '/pt-br/documentacao/plataforma/ai-inference/',
					},
				],
			},
		],
		[
			{
				id: 'origin',
				icon: 'pi pi-server',
				kind: 'Origem',
				role: 'Seu servidor',
				examples: ['On-premises', 'Nuvem', 'Colocation'],
				terminal: true,
				href: '/pt-br/documentacao/plataforma/connectors/',
			},
		],
	],
};
