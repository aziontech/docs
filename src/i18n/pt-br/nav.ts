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

	{ text: 'Conceitos básicos', slug: '/documentacao/produtos/conceitos-basicos/', key: 'beforeBegin/core' },
	{ text: 'Obter ajuda', slug: '/documentacao/produtos/obter-ajuda/', key: 'getHelp' },

	{ text: 'Boas-vindas ao edge', slug: '/documentacao/produtos/ponto-de-partida/', key: 'getStarted/welcome' },
	{ text: 'Começar com um template', slug: '/documentacao/produtos/comecar-com-um-template/', key: 'getStarted/template' },
	{ text: 'Rodar na rede da Azion', slug: '/documentacao/produtos/rodar-na-rede-da-azion/', key: 'getStarted/goLive' },
	{ text: 'Métricas', slug: '/documentacao/produtos/guias/usar-real-time-metrics/', key: 'getStarted/viewMetrics' },


	{ text: 'Build', slug: '/documentacao/produtos/guias/build/visao-geral/', key: 'build' },
	{ text: 'Secure', slug: '/documentacao/produtos/secure/', key: 'secure' },
	{ text: 'Deploy', slug: '/documentacao/produtos/deploy/', key: 'deploy' },
	{ text: 'Observe', slug: '/documentacao/produtos/observe/', key: 'observe' },

	{ text: 'Configurar um domínio', key: 'configureDomain', slug: '/documentacao/produtos/guias/configurar-dominio/' },
	{ text: 'Criar um certificado digital', slug: '/documentacao/produtos/guias/criar-certificado-digital/', key: 'certificateDomain' },
	{ text: 'Apontar um domínio para a Azion', slug: '/documentacao/produtos/guias/apontar-dominio-para-a-azion/', key: 'pointDomain' },
	{ text: 'Migrar NS para a Azion', slug: '/documentacao/produtos/guias/migrar-ns-para-a-azion', key: 'migrateDomain' },

	{ text: 'Criar uma conta', key: 'account/createAccount', slug: '/documentacao/produtos/contas/criar-uma-conta/' },

	{ text: 'Configurar conta', key: 'manageAccount' },
	{ text: 'Usuários', key: 'account/Users', slug: '/documentacao/produtos/guias/users-management/' },
	{ text: 'Times', slug: '/documentacao/produtos/guias/teams-permissions/', key: 'account/teamsPermissions' },
	{ text: 'Activity history', slug: '/documentacao/produtos/guias/activity-history/', key: 'account/activityHistory' },
	{ text: 'Credenciais', slug: '/documentacao/produtos/guias/credentials/', key: 'account/credentials' },
	{ text: 'SSO', slug: '/documentacao/produtos/guias/sso/', key: 'account/sso' },
	{ text: 'MFA', slug: '/documentacao/produtos/guias/multi-factor-authentication/', key: 'account/mfa' },
	{ text: 'Faturamento e assinaturas', slug: '/documentacao/produtos/guias/billing-and-subscriptions/', key: 'account/billingAndSubscriptions' },


	{ text: 'Configurar perfis', key: 'manageProfile' },
	{ text: 'Personal tokens', key: 'accountsProfile/personalTokens', slug: '/documentacao/produtos/guias/personal-tokens/' },
	{ text: 'Configurações', slug: '/documentacao/produtos/guias/configuracoes-de-conta/', key: 'accountsProfile/settings' },
	{ text: 'Deletar conta', slug: '/documentacao/produtos/guias/contas/excluir-conta/', key: 'accountsProfile/deleteAccount' },


	{ text: 'Developer tools', key: 'developerTools' },
	{ text: 'API', key: 'devtools/api', slug: '/documentacao/produtos/devtools/primeiros-passos-api/' },
	{ text: 'CLI', key: 'devtools/cli', slug: '/documentacao/produtos/cli/' },
	{ text: 'API GraphQL Playground', slug: '/documentacao/produtos/devtools/playground-graphql/', key: 'devtools/graphQLplayground' },
	{ text: 'Edge Runtime', slug: '/documentacao/produtos/edge-application/edge-functions/runtime/visao-geral/', key: 'devtools/runtime' },
	{ text: 'SDK', slug: '/documentacao/devtools/sdk/go/', key: 'devtools/sdk' },
	{ text: 'Terraform', slug: '/documentacao/produtos/terraform-provider/', key: 'devtools/terraform' },
	{ text: 'GitHub', slug: 'https://github.com/aziontech/', key: 'devtools/gitHub' },

	{ text: 'Templates e integrações ', key: 'templatesIntegrationsRef' },
	{ text: 'Usar um template', slug: '/documentacao/produtos/usar-um-template-via-rtm/', key: 'templatesIntegrations/createPublishTemplate' },


	{
		text: 'Build', key: 'buildRef'
	},
	{ text: 'Edge Application', key: 'reference/edgeApplication', slug: '/documentacao/produtos/edge-application/' },
	{ text: 'Application Acceleration', key: 'reference/applicationAcceleration', slug: '/documentacao/produtos/edge-application/application-acceleration/' },
	{ text: 'Edge Caching', key: 'reference/edgeCaching', slug: '/documentacao/produtos/edge-application/edge-caching/' },
	{ text: 'Edge Functions', key: 'reference/edge Functions', slug: '/documentacao/produtos/edge-application/edge-functions/' },
	{ text: 'Image Processor', key: 'reference/imageProcessor', slug: '/documentacao/produtos/edge-application/image-processor/' },
	{ text: 'Load Balancer', key: 'reference/loadBalancer', slug: '/documentacao/produtos/edge-application/load-balancer/' },
	{ text: 'L2 Caching', key: 'reference/l2Caching', slug: '/documentacao/produtos/edge-application/l2-caching/' },
	{ text: 'Main Settings', key: 'reference/mainSettings', slug: '/documentacao/produtos/edge-application/main-settings/' },
	{ text: 'Cache Settings', key: 'reference/cacheSettings', slug: '/documentacao/produtos/edge-application/cache-settings/' },
	{ text: 'Edge Functions Instances', key: 'reference/edgeFunctionsInstancesApplication', slug: '/documentacao/produtos/edge-application/edge-functions-instances/' },
	{ text: 'Device Groups', key: 'reference/deviceGroups', slug: '/documentacao/produtos/edge-application/device-groups/' },
	{ text: 'Digital Certificates', key: 'reference/digitalCertificates', slug: '/documentacao/produtos/edge-application/digital-certificates/' },
	{ text: 'Error Responses', key: 'reference/errorResponses', slug: '/documentacao/produtos/edge-application/error-responses/' },
	{ text: 'Origins', key: 'reference/origins', slug: '/documentacao/produtos/edge-application/origins/' },
	{ text: 'Real-Time Purge', key: 'reference/realTimePurge', slug: '/documentacao/produtos/edge-application/real-time-purge/' },
	{ text: 'Rules Engine', key: 'reference/rulesEngineedgeApplication', slug: '/documentacao/produtos/edge-application/rules-engine/' },

	{
		text: 'Secure', key: 'secureRef'
	},
	{ text: 'Edge Firewall', key: 'reference/edgeFirewall', slug: '/documentacao/produtos/edge-firewall/' },
	{ text: 'DDoS Protection', key: 'reference/ddosProtection', slug: '/documentacao/produtos/edge-firewall/ddos-protection/' },
	{ text: 'DDoS Mitigation', key: 'reference/ddosMitigation', slug: '/documentacao/produtos/edge-firewall/ddos-protection/ddos-mitigation/' },
	{ text: 'Network Layer Protection', key: 'reference/networkLayerProtection', slug: '/documentacao/produtos/edge-firewall/network-layer-protection/' },
	{ text: 'Network Lists', key: 'reference/networkLists', slug: '/documentacao/produtos/edge-firewall/network-layer-protection/network-lists/' },
	{ text: 'Web Application Firewall', key: 'reference/webApplicationFirewall', slug: '/documentacao/produtos/edge-firewall/web-application-firewall/' },
	{ text: 'WAF Rule Sets', key: 'reference/wafRuleSets', slug: '/documentacao/produtos/edge-firewall/waf-rule-sets/' },
	{ text: 'WAF Custom Allowed Rules', key: 'reference/wafCustomAllowedRules', slug: '/documentacao/produtos/edge-firewall/web-application-firewall/custom-allowed-rules/' },
	{ text: 'Edge Functions', key: 'reference/edgeFunctionsFirewall', slug: '/documentacao/produtos/edge-firewall/edge-functions/firewall/' },
	{ text: 'Edge Functions Instances', key: 'reference/edgeFunctionsInstancesFirewall', slug: '/documentacao/produtos/edge-firewall/edge-functions-instances/' },
	{ text: 'Rules Engine', key: 'reference/rulesEngineFirewall', slug: '/documentacao/produtos/edge-firewall/rules-engine/' },
	{ text: 'Intelligent DNS', key: 'reference/intelligentDNS', slug: '/documentacao/produtos/intelligent-dns/' },
	{ text: 'Compatibilidade com DNSSEC', key: 'reference/dnssecCompatibility', slug: '/documentacao/produtos/intelligent-dns/compatibilidade-dnssec/' },


	{ text: 'Deploy', key: 'deployRef' },
	{ text: 'Edge Orchestrator', key: 'reference/edgeOrchestrator', slug: '/documentacao/produtos/edge-orchestrator/' },
	{ text: 'Edge Services', key: 'reference/edgeServices', slug: '/documentacao/produtos/edge-orchestrator/edge-services/' },
	{ text: 'Edge Node', key: 'reference/edgeNode', slug: '/documentacao/produtos/edge-orchestrator/edge-node/' },

	{ text: 'Observe', key: 'observeRef' },
	{ text: 'Data Streaming', key: 'reference/dataStreaming', slug: '/documentacao/produtos/data-streaming/' },
	{ text: 'Edge Pulse', key: 'reference/edgePulse', slug: '/documentacao/produtos/edge-pulse/' },
	{ text: 'Real-Time Events', key: 'reference/realTimeEvents', slug: '/documentacao/produtos/real-time-events/' },
	{ text: 'Real-Time Metrics', key: 'reference/realTimeMetrics', slug: '/documentacao/produtos/real-time-metrics/' },
	{ text: 'Real-Time Metrics Histórico', key: 'reference/historicalRealTimeMetrics', slug: '/documentacao/produtos/real-time-metrics-historico/' },

	{ text: 'Marketplace', key: 'mktpRef' },
	{ text: 'Marketplace', key: 'mktp', slug: '/documentacao/produtos/marketplace/' },
	{ text: 'Marketplace Independent Software Vendor', key: 'mktp/isv', slug: '/documentacao/produtos/marketplace/isv-signup/' },
	{ text: 'Marketplace Seller Guide', key: 'mktp/sellerGuide', slug: '/documentacao/produtos/marketplace/marketplace-seller-guide/' },

	{
		text: 'Contas', key: 'accountsRef'
	},
	{ text: 'Activity History', key: 'accounts/ActivityHistory', slug: '/documentacao/produtos/gestao-de-contas/activity-history/' },
	{ text: 'Clients', key: 'accounts/Clients', slug: '/documentacao/produtos/gestao-de-contas/clients/' },
	{ text: 'Configurações de conta', key: 'accounts/accountSettings', slug: '/documentacao/produtos/gestao-de-contas/account-settings/' },
	{ text: 'Faturamento', key: 'accounts/billing', slug: '/documentacao/produtos/gestao-de-contas/faturamento/' },
	{ text: 'Multi-Factor Authentication', key: 'accounts/MFA', slug: '/documentacao/produtos/gestao-de-contas/multi-factor-authentication/' },
	{ text: 'Personal Tokens', key: 'accounts/personalTokens', slug: '/documentacao/produtos/gestao-de-contas/personal-tokens/' },
	{ text: 'Social Login', key: 'accounts/socialLogin', slug: '/documentacao/produtos/gestao-de-contas/social-login/' },
	{ text: 'Single Sign-On', key: 'accounts/SSO', slug: '/documentacao/produtos/gestao-de-contas/single-sign-on/' },
	{ text: 'Teams Permissions', key: 'accounts/teamsPermissions', slug: '/documentacao/produtos/gestao-de-contas/teams-permissions/' },
	{ text: 'Users Management', key: 'accounts/usersManagement', slug: '/documentacao/produtos/gestao-de-contas/usuarios-e-times/' },
	{ text: 'Your Settings', key: 'accounts/youtSettings', slug: '/documentacao/produtos/gestao-de-contas/your-settings/' },

	{ text: 'Technical Support', slug: '/documentacao/servicos/suporte/', key: 'technicalSupport' },

	{ text: 'Professional Services', key: 'professionalServicesRef' },
	{ text: 'Integration Services', slug: '/documentacao/servicos/solutions-lab/integration-services/', key: 'professionalServices/integrationServices' },
	{ text: 'Technical Account Manager', slug: '/documentacao/servicos/technical-account-manager/', key: 'professionalServices/TAM' },
	{ text: 'Best Practices Review', slug: '/documentacao/servicos/best-practices-review/', key: 'professionalServices/bestPracticesReview' },
	{ text: 'Custom Education Programs', slug: '/documentacao/servicos/custom-education-programs/', key: 'professionalServices/customEducationPrograms' },
	{ text: 'Security Response Team', slug: '/documentacao/servicos/security-response-team/', key: 'professionalServices/SRT' },
	{ text: 'Business Events Support', slug: '/documentacao/servicos/business-events-support/', key: 'professionalServices/businessEventsSupport' },
	{ text: 'Slack Channel', slug: '/documentacao/servicos/slack-channel/', key: 'professionalServices/SlackChannel' },

	{
		text: 'Glossário', slug: '/documentacao/produtos/glossario-azion/', key: 'glossary'
	},

	{
		text: 'System Status', slug: 'https://status.azion.com/', key: 'systemStatus'
	},

	{
		text: 'Contratos', slug: '/documentacao/contratos/', key: 'agreements'
	},

	{
		text: 'Modelo de Responsabilidade Compartilhada', slug: '/documentacao/responsabilidade-compartilhada/', key: 'sharedResponsibility'
	},

	{
		text: 'Azion Network Program', slug: '/documentacao/produtos/azion-network-program/', key: 'azionNetworkProgram'
	},

]);
