/**
 * This configures the navigation sidebar.
 * All other languages follow this ordering/structure and will fall back to
 * English for any entries they haven’t translated.
 *
 * - All entries MUST include `text` and `key`
 * - Heading entries MUST include `header: true` and `type`
 * - Link entries MUST include `slug` (which excludes the language code)
 */
import { NavDictionary } from '../translation-checkers';

export default NavDictionary([

	
	{ text: 'Ponto de Partida', slug: 'documentacao/produtos/ponto-de-partida/', key: 'gettingStarted' },

	{ text: 'Contas e Perfil', key: 'accountsProfile' },
	{ text: 'Criar uma Conta', slug: 'documentacao/produtos/gestao-de-contas/criar-conta', key: 'accountsProfile/createAccount' },
	{ text: 'Account Settings', slug: 'documentacao/produtos/gestao-de-contas/account-settings', key: 'accountsProfile/settings' },
	{ text: 'Users Managements', slug: 'documentacao/produtos/gestao-de-contas/usuarios-e-times', key: 'accountsProfile/usersManagement' },
	{ text: 'Faturamento', slug: 'documentacao/produtos/gestao-de-contas/faturamento', key: 'accountsProfile/billing' },
	{ text: 'Credenciais', slug: 'documentacao/produtos/credenciais/', key: 'accountsProfile/credentials' },
	{ text: 'Activity History', slug: 'documentacao/produtos/gestao-de-contas/activity-history', key: 'accountsProfile/activityHistory' },
	{ text: 'Teams Permissions', slug: 'documentacao/produtos/gestao-de-contas/teams-permissions', key: 'accountsProfile/teamsPermissions' },
	{ text: 'Single Sign-On (SSO)', slug: 'documentacao/produtos/gestao-de-contas/single-sign-on', key: 'accountsProfile/singleSignOn' },
	{ text: 'Your Settings', slug: 'documentacao/produtos/gestao-de-contas/your-settings', key: 'accountsProfile/yourSettings' },
	{ text: 'Personal Tokens', slug: 'documentacao/produtos/gestao-de-contas/personal-tokens', key: 'accountsProfile/personalTokens' },
	{ text: 'Login Social', slug: 'documentacao/produtos/gestao-de-contas/social-login', key: 'accountsProfile/socialLogin' },
	{ text: 'Grupos e Clientes', slug: 'documentacao/produtos/gestao-de-contas/clients', key: 'accountsProfile/GroupsAndClients' },
	{ text: 'Multi-Factor Authentication', slug: 'documentacao/produtos/gestao-de-contas/multi-factor-authentication', key: 'accountsProfile/multiFactorAuth' },

	{ text: 'Edge Application', slug: 'documentacao/produtos/edge-application', key: 'edgeApplication' },
	{ text: 'Application Acceleration', slug: 'documentacao/produtos/edge-application/application-acceleration', key: 'applicationAcceleration' },
	{ text: 'Edge Caching', slug: 'documentacao/produtos/edge-application/edge-caching', key: 'edgeCaching' },
	{ text: 'Edge Functions', slug: 'documentacao/produtos/edge-application/edge-functions', key: 'edgeFunctions' },
	{ text: 'Image Processor', slug: 'documentacao/produtos/edge-application/image-processor', key: 'imageProcessor' },
	{ text: 'Load Balancer', slug: 'documentacao/produtos/edge-application/load-balancer', key: 'loadBalancer' },

	{ text: 'Edge Firewall', slug: 'documentacao/produtos/edge-firewall', key: 'edgefirewall' },
	{ text: 'DDoS Protection', slug: 'documentacao/produtos/edge-firewall/ddos-protection', key: 'ddosProtection' },
	{ text: 'Network Layer Protection', slug: 'documentacao/produtos/edge-firewall/network-layer-protection', key: 'networkLayerProtection' },
	{ text: 'Web Application Firewall', slug: 'documentacao/produtos/edge-firewall/web-application-firewall', key: 'webApplicationFirewall' },
	{ text: 'Intelligent DNS', slug: 'documentacao/produtos/intelligent-dns', key: 'intelligentDNS' },


	{ text: 'Edge Orchestrator', slug: 'documentacao/produtos/edge-orchestrator', key: 'edgeOrchestrator' },
	{ text: 'Edge Node', slug: 'documentacao/produtos/edge-orchestrator/edge-node', key: 'edgeNode' },
	{ text: 'Edge Services', slug: 'documentacao/produtos/edge-orchestrator/edge-services', key: 'edgeServices' },

	{ text: 'Data Streaming', slug: 'documentacao/produtos/data-streaming', key: 'dataStreaming' },
	{ text: 'Edge Pulse', slug: 'documentacao/produtos/edge-pulse', key: 'edgePulse' },
	{ text: 'Real-Time Events', slug: 'documentacao/produtos/real-time-events', key: 'realTimeEvents' },
	{ text: 'Real-Time Metrics', slug: 'documentacao/produtos/real-time-metrics', key: 'realTimeMetrics' },

	{ text: 'Marketplace', slug: 'documentacao/produtos/marketplace', key: 'marketplace' },

	{ text: 'Serviços', key: 'Services' },
	{ text: 'Integration Services', slug: 'documentacao/servicos/solutions-lab/integration-services', key: 'integrationServices' },
	{ text: 'Suporte', slug: 'documentacao/servicos/suporte', key: 'support' },


	{ text: 'API',slug: 'https://api.azion.com', key: 'api' },
	{ text: 'GraphQL API', slug: 'documentacao/produtos/graphql-api', key: 'graphQLAPI' },
	{ text: 'Azion CLI', slug: 'documentacao/produtos/cli', key: 'azionCLI' },
	{ text: 'Edge Runtime', slug: 'documentacao/produtos/edge-application/edge-functions/runtime/visao-geral', key: 'edgeRuntime' },
	{ text: 'SDK', slug: 'documentacao/devtools/sdk/go', key: 'sdkGO' },
	{ text: 'Terraform', slug: 'documentacao/produtos/terraform-provider', key: 'terraform' },

	{ text: 'Changelog', slug: 'documentacao/produtos//changelog', key: 'changelog' },
	{ text: 'System Status', slug: 'https://status.azion.com', key: 'systemStatus' },
	{ text: 'Azion Network Program', slug: 'documentacao/produtos/azion-network-program', key: 'azionNetworkProgram' },

	// install: 'Instalação',
	// 'editor-setup': 'Configuração do Editor',
	// 'guides/upgrade-to/v2': 'Atualize para a v2',
	// coreConcepts: 'Principais Conceitos',
	// 'concepts/why-astro': 'Por que Astro?',
	// 'concepts/islands': 'Ilhas Astro',
	// 'concepts/mpa-vs-spa': 'MPA vs. SPA',
	// basics: 'Fundamentos',
	// 'core-concepts/project-structure': 'Estrutura de Projetos',
	// 'core-concepts/astro-components': 'Componentes',
	// 'core-concepts/astro-pages': 'Páginas',
	// 'core-concepts/layouts': 'Layouts',
	// 'guides/markdown-content': 'Markdown e MDX',
	// 'core-concepts/routing': 'Roteamento',
	// features: 'Guias',
	// 'core-concepts/astro-syntax': 'Sintaxe do Astro',
	// 'guides/styling': 'Estilização e CSS',
	// 'core-concepts/framework-components': 'Frameworks de UI',
	// 'guides/content-collections': 'Coleções de Conteúdo',
	// 'guides/imports': 'Importações',
	// 'guides/server-side-rendering': 'Renderização no lado do Servidor (SSR)',
	// 'guides/data-fetching': 'Busca de Dados',
	// 'guides/publish-to-npm': 'Publique no NPM',
	// examples: 'Receitas',
	// 'guides/migrate-to-astro': 'Migre para o Astro',
	// 'guides/cms': 'Conecte um CMS',
	// 'guides/backend': 'Adicione serviços de backend',
	// 'guides/integrations-guide': 'Adicione integrações',
	// 'guides/deploy': 'Faça deploy do seu site',
	// 'guides/recipes': 'Mais Receitas',
	// // 'core-concepts/sharing-state': 'Compartilhamento de Estado',
	// // 'guides/rss': 'RSS',
	// 'guides/troubleshooting': 'Solução de Problemas',
	// 'guides/images': 'Imagens',
	// // 'guides/fonts': 'Fontes',
	// 'guides/testing': 'Testes',
	// 'guides/client-side-scripts': 'Scripts & Manipulação de Eventos',
	// configuration: 'Configuração',
	// 'guides/configuring-astro': 'O Arquivo de Configuração Astro',
	// 'guides/typescript': 'TypeScript',
	// 'guides/aliases': 'Atalhos de Importação',
	// 'guides/environment-variables': 'Variáveis de Ambiente',
	// reference: 'Referência',
	// 'reference/directives-reference': 'Diretivas de Template',
	// 'reference/adapter-reference': 'API de Adaptadores',
	// 'reference/integrations-reference': 'API de Integrações',
	// 'reference/cli-reference': 'A CLI do Astro',
	// 'reference/api-reference': 'API de Runtime',
	// 'reference/configuration-reference': 'Configuração',
	// 'reference/error-reference': 'Referência de Erros',
	// tutorials: 'Tutoriais',
	// 'blog-tutorial': 'Construa um Blog',
]);
