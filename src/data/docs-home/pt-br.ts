import type { DocsHomeContent } from './types';

const AGENT_PROMPT =
	'Me ajude a configurar a Azion neste projeto. Faça o seguinte: 1. Instale a Azion CLI: curl -fsSL https://cli.azion.app/install.sh | bash. 2. Conecte o servidor MCP da Azion (https://mcp.azion.com) para pesquisar a documentação atual da Azion; configuração por ferramenta: https://www.azion.com/pt-br/documentacao/agent-setup/. 3. Revise o projeto e verifique se ele já está vinculado à Azion; se não estiver, execute azion link e siga as instruções. 4. Sugira os próximos passos mais relevantes.';

export const ptBr: DocsHomeContent = {
	lang: 'pt-br',
	id: 'pt-br/homes/doc-home',
	filePath: 'src/pages/pt-br/documentacao/index.astro',

	meta: {
		type: 'base',
		i18nReady: false,
		title: 'Página Inicial da Documentação',
		description:
			'Azion é a plataforma de edge computing full-stack que simplifica como você constrói, protege e escala aplicações modernas.',
		namespace: 'documentation_home',
		permalink: '/documentacao/',
		page_header: false,
		meta_tag_robots_no_index: false,
	},

	hero: {
		title: 'Bem-vindo à Documentação Azion',
		description:
			'Tornamos toda aplicação rápida e confiável. Faça o deploy em uma rede global, com segurança de nível corporativo e sem cold starts.',
		buttonLabel: 'Começar',
		buttonLink: '/pt-br/documentacao/primeiro-deploy/',
		note: 'O prompt entrega ao seu agente de código a CLI, a documentação ao vivo via MCP e este projeto vinculado.',
		prompt: AGENT_PROMPT,
		promptLabel: 'Copiar prompt',
		promptCopiedLabel: 'Prompt copiado!',
		promptTooltip: 'Copia um prompt de configuração para sua ferramenta de IA',
	},

	interfaceSection: {
		heading: { depth: 2, slug: 'comece-pela-interface', text: 'Comece pela interface' },
		intro: 'Entregue o Console a um agente de código, ou conduza você mesmo: visualmente, pelo terminal ou pela API.',
		agent: {
			id: 'your-ai-agent-fluent-in-azion',
			title: 'Seu agente de IA, fluente em Azion',
			body: 'Um prompt ensina a plataforma a qualquer agente de código: nomes atuais dos produtos, documentação ao vivo pelo servidor MCP da Azion e deploys reais com a CLI.',
			copyLabel: 'Copiar prompt',
			copiedLabel: 'Prompt copiado!',
			tooltip: 'Copia um prompt de configuração para sua ferramenta de IA',
			prompt: AGENT_PROMPT,
		},
		guided: {
			id: 'agent-setup',
			title: 'Prefere o caminho guiado?',
			buttonLabel: 'Configurar agente',
			buttonHref: '/pt-br/documentacao/agent-setup/',
		},
		cols: 3,
		cards: [
			{
				icon: 'ai ai-azion',
				title: 'Console',
				href: '/pt-br/documentacao/guias/plataforma/conta-e-billing/como-acessar-o-azion-console/',
				link: 'Acessar o Console',
				body: 'Configure visualmente: aplicações, regras de firewall, métricas e eventos.',
			},
			{
				icon: 'ai ai-azion-cli',
				title: 'CLI',
				href: '/pt-br/documentacao/devtools/cli/',
				link: 'Instalar a CLI',
				body: 'Fique no terminal: vincule um projeto, execute localmente e faça o deploy com um único binário.',
			},
			{
				icon: 'ai ai-azion-api',
				title: 'API',
				href: '/pt-br/documentacao/devtools/api/',
				link: 'Chamar a API',
				class: 'sm:col-span-2 lg:col-span-1',
				body: 'Controle a partir dos seus sistemas: crie e altere recursos via REST, com autenticação por token.',
			},
		],
	},

	sections: [
		{
			heading: { depth: 2, slug: 'comece-pelo-objetivo', text: 'Comece pelo objetivo' },
			intro: 'Construa algo, deixe mais rápido, proteja ou rode IA em cima.',
			cols: 2,
			cards: [
				{
					icon: 'ai ai-build-pillar',
					title: 'Construa sua aplicação',
					href: '/pt-br/documentacao/primeiro-deploy/',
					body: 'Faça o deploy a partir de um template, de um repositório ou da CLI.',
				},
				{
					icon: 'pi pi-gauge',
					title: 'Acelere sua aplicação',
					href: '/pt-br/documentacao/guias/performance-e-confiabilidade/cache-e-purge/cache-settings/',
					body: 'Armazene respostas em cache para que a origem pare de se repetir.',
				},
				{
					icon: 'ai ai-secure-pillar',
					title: 'Proteja sua aplicação',
					href: '/pt-br/documentacao/guias/seguranca-de-aplicacoes/firewall-e-waf/proteja-seu-dominio/',
					body: 'Um firewall na frente, com uma regra de bloqueio que você pode verificar.',
				},
				{
					icon: 'ai ai-ai-pillar',
					title: 'Execute inferência de IA',
					href: '/pt-br/documentacao/guias/desenvolvimento-de-aplicacoes/frameworks/ai-inference-starter-kit/',
					body: 'Um modelo hospedado atrás de um endpoint compatível com OpenAI.',
				},
			],
			footer: {
				prefix: 'Também útil:',
				links: [
					{ label: 'Observe', href: '/pt-br/documentacao/observe/data-stream/' },
					{ label: 'Arquiteturas', href: '/pt-br/documentacao/guias/?kind=reference-architecture' },
				],
			},
		},

		{
			heading: { depth: 2, slug: 'templates-prontos', text: 'Templates prontos' },
			intro: 'Faça o deploy em um passo, com CI/CD já configurado.',
			cols: 4,
			mobileCols: 2,
			cards: [
				{ icon: 'ai-cor ai-react', title: 'React', href: '/pt-br/documentacao/guias/desenvolvimento-de-aplicacoes/frameworks/react-boilerplate/' },
				{ icon: 'ai-cor ai-next', title: 'Next.js', href: '/pt-br/documentacao/guias/desenvolvimento-de-aplicacoes/frameworks/nextjs-static-boilerplate/' },
				{ icon: 'ai ai-astro', title: 'Astro', href: '/pt-br/documentacao/guias/desenvolvimento-de-aplicacoes/frameworks/astro-boilerplate/' },
				{ icon: 'ai-cor ai-vue', title: 'Vue.js', href: '/pt-br/documentacao/guias/desenvolvimento-de-aplicacoes/frameworks/vue-vite-boilerplate/' },
				{ icon: 'ai-cor ai-angular', title: 'Angular', href: '/pt-br/documentacao/guias/desenvolvimento-de-aplicacoes/frameworks/angular-boilerplate/' },
				{ icon: 'ai ai-gatsby', title: 'Gatsby Blog', href: '/pt-br/documentacao/guias/desenvolvimento-de-aplicacoes/frameworks/gatsby/' },
				{ icon: 'ai ai-hono', title: 'Hono', href: '/pt-br/documentacao/guias/desenvolvimento-de-aplicacoes/frameworks/hono/' },
				{ icon: 'ai ai-hugo', title: 'Hugo', href: '/pt-br/documentacao/guias/desenvolvimento-de-aplicacoes/frameworks/hugo-boilerplate/' },
			],
			footer: {
				prefix: 'Também útil:',
				links: [
					{ label: 'Primeiro deploy', href: '/pt-br/documentacao/primeiro-deploy/' },
					{
						label: 'Compatibilidade de frameworks',
						href: '/pt-br/documentacao/devtools/runtime/frameworks/compatibilidade-frameworks/',
					},
				],
			},
		},

		{
			heading: { depth: 2, slug: 'pare-ataques', text: 'Pare ataques' },
			intro: 'Tudo o que você precisa para proteger aplicações, APIs e o tráfego que chega até elas.',
			cols: 3,
			cards: [
				{
					icon: 'ai ai-edge-firewall',
					title: 'Adicione um firewall',
					href: '/pt-br/documentacao/guias/seguranca-de-aplicacoes/firewall-e-waf/trabalhar-com-rules-engine/',
					body: 'Vincule-o ao seu workload e comprove uma regra de bloqueio com curl.',
				},
				{
					icon: 'ai ai-waf-rules',
					title: 'Bloqueie ataques de injeção',
					href: '/pt-br/documentacao/guias/seguranca-de-aplicacoes/firewall-e-waf/criar-waf-rule-set/',
					body: 'Um conjunto de regras contra SQL Injection, com os bloqueios visíveis nos eventos.',
				},
				{
					icon: 'pi pi-list-check',
					title: 'Ajuste falsos positivos',
					href: '/pt-br/documentacao/guias/seguranca-de-aplicacoes/firewall-e-waf/tune-waf/',
					body: 'Transforme falsos positivos do WAF em regras permitidas.',
				},
				{
					icon: 'pi pi-microchip',
					title: 'Negue bots maliciosos',
					href: '/pt-br/documentacao/guias/desenvolvimento-de-aplicacoes/integracoes/bot-manager-lite/',
					body: 'Negue requisições automatizadas com pontuação acima do seu limite.',
				},
				{
					icon: 'pi pi-map',
					title: 'Listas de bloqueio de rede',
					href: '/pt-br/documentacao/guias/seguranca-de-aplicacoes/bots-e-rede/blocklists-enderecos-ip-edge/',
					body: 'Descarte tráfego indesejado antes que ele chegue à sua aplicação.',
				},
				{
					icon: 'pi pi-key',
					title: 'Instale certificados TLS',
					href: '/pt-br/documentacao/guias/seguranca-de-aplicacoes/tls-e-certificados/criar-certificado-digital/',
					body: 'Envie um certificado e uma chave e verifique o handshake.',
				},
				{
					icon: 'pi pi-arrow-right-arrow-left',
					title: 'Envie para um SIEM',
					href: '/pt-br/documentacao/produtos/secure/automatizar/integrar-siems/',
					class: 'sm:col-span-2 lg:col-span-3',
					body: 'Transmita eventos do WAF e do firewall para onde sua equipe acompanha.',
				},
			],
			footer: {
				prefix: 'Referência, quando você precisar dos detalhes:',
				links: [
					{ label: 'DDoS Protection', href: '/pt-br/documentacao/plataforma/ddos-protection/' },
					{ label: 'WAF Rule Sets', href: '/pt-br/documentacao/secure/waf/rule-sets/' },
					{ label: 'WAF Exceptions', href: '/pt-br/documentacao/secure/waf/custom-allowed-rules/' },
					{ label: 'Bot Manager', href: '/pt-br/documentacao/secure/bot-manager/' },
				],
			},
		},

		{
			heading: {
				depth: 2,
				slug: 'avalie-riscos-e-comprove-conformidade',
				text: 'Avalie riscos e comprove conformidade',
			},
			intro: 'O que a plataforma cobre, o que fica com você e onde estão as evidências quando um auditor pedir.',
			cols: 3,
			cards: [
				{
					icon: 'pi pi-verified',
					title: 'Modelo de Responsabilidade Compartilhada',
					href: '/pt-br/documentacao/fundamentos/responsabilidade-compartilhada/',
					body: 'O que a Azion cobre e o que continua sendo seu.',
				},
				{
					icon: 'pi pi-id-card',
					title: 'Governança, Risco e Conformidade',
					href: '/pt-br/documentacao/guias/seguranca-de-aplicacoes/acesso-e-compliance/governanca-risco-conformidade/',
					body: 'As ferramentas e certificações por trás do seu trabalho de conformidade.',
				},
				{
					icon: 'pi pi-wallet',
					title: 'Conformidade PCI DSS',
					href: '/pt-br/documentacao/fundamentos/pci-dss-certification/',
					body: 'PCI DSS 4.0 Nível 1 e o que ele cobre para dados de portadores de cartão.',
				},
				{
					icon: 'pi pi-lock',
					title: 'Conformidade SOC',
					href: '/pt-br/documentacao/fundamentos/soc/',
					body: 'Relatórios SOC 2 Tipo 2 e SOC 3, duas vezes por ano.',
				},
				{
					icon: 'pi pi-history',
					title: 'Histórico de Atividades',
					href: '/pt-br/documentacao/guias/plataforma/conta-e-billing/activity-history/',
					body: 'A trilha de auditoria: quem alterou o quê, e quando.',
				},
				{
					icon: 'pi pi-users',
					title: 'Equipe de Resposta de Segurança',
					href: '/pt-br/documentacao/servicos/security-response-team/',
					body: 'A Azion mitiga em seu nome durante um ataque.',
				},
			],
			footer: {
				prefix: 'Governança de acesso:',
				links: [
					{ label: 'Single Sign-On', href: '/pt-br/documentacao/fundamentos/single-sign-on/' },
					{ label: 'Multi-Factor Authentication', href: '/pt-br/documentacao/fundamentos/multi-factor-authentication/' },
					{ label: 'Teams Permissions', href: '/pt-br/documentacao/fundamentos/teams-permissions/' },
					{
						label: 'Acesso Condicional',
						href: '/pt-br/documentacao/guias/seguranca-de-aplicacoes/acesso-e-compliance/conditional-access-by-ip-address/',
					},
				],
			},
		},

		{
			heading: { depth: 2, slug: 'acompanhe', text: 'Acompanhe' },
			intro: 'Notas de release conforme as novidades são lançadas, além do blog, do canal no YouTube e do Discord onde as dúvidas são respondidas.',
			cols: 3,
			cards: [
				{
					icon: 'pi pi-megaphone',
					title: 'Notas de release',
					href: '/pt-br/documentacao/changelog/',
					body: 'O que mudou nos produtos Azion, assim que é lançado.',
				},
				{
					icon: 'pi pi-book',
					title: 'Blog',
					href: 'https://www.azion.com/pt-br/blog/',
					link: 'Ler o blog',
					target: '_blank',
					body: 'Posts de engenharia e como os clientes rodam na Azion.',
				},
				{
					icon: 'pi pi-youtube',
					title: 'YouTube',
					href: 'https://www.youtube.com/aziontech',
					link: 'Assistir no YouTube',
					target: '_blank',
					body: 'Passo a passo, demos e sessões gravadas.',
				},
				{
					icon: 'pi pi-discord',
					title: 'Discord',
					href: 'https://discord.com/invite/Yp9N7RMVZy',
					link: 'Entrar no Discord',
					target: '_blank',
					body: 'Tire dúvidas e troque experiências com outros desenvolvedores.',
				},
				{
					icon: 'pi pi-pencil',
					title: 'Guia de estilo',
					href: '/pt-br/documentacao/guia-de-estilo/',
					class: 'sm:col-span-2 lg:col-span-2',
					body: 'Como a Azion escreve documentação: voz, estrutura e convenções.',
				},
			],
		},
	],

	pagination: {
		nextTitle: 'Configurar agente',
		nextHref: '/pt-br/documentacao/agent-setup/',
	},
};
