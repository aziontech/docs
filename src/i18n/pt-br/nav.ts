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
	{ text: 'Documentação', slug: '/documentacao/', key: 'documentation' },
	{ text: 'Guias', slug: '/documentacao/produtos/guias/', key: 'guides' },
	{ text: 'Dev Tools', slug: '/documentacao/produtos/devtools/', key: 'devTools' },
	{ text: 'Arquiteturas', slug: '/documentacao/arquiteturas/', key: 'architectures' },

	{ text: 'Conceitos básicos', slug: '/documentacao/produtos/conceitos-basicos/', key: 'beforeBegin/core' },
	{ text: 'Obtenha ajuda', slug: '/documentacao/produtos/obter-ajuda/', key: 'getHelp' },

	{ text: 'Boas-vindas ao edge', slug: '/documentacao/produtos/ponto-de-partida/', key: 'getStarted/welcome' },
	{ text: 'Comece com um template', slug: '/documentacao/produtos/comecar-com-um-template/', key: 'getStarted/template' },
	{ text: 'Ative em produção', slug: '/documentacao/produtos/ative-em-producao/', key: 'getStarted/goLive' },
	{ text: 'Visualize métricas', slug: '/documentacao/produtos/guias/usar-real-time-metrics/', key: 'getStarted/viewMetrics' },


	{ text: 'Build', slug: '/documentacao/produtos/guias/build/visao-geral/', key: 'build' },
	{ text: 'Store', slug: '/documentacao/produtos/store/visao-geral/', key: 'store' },
	{ text: 'Secure', slug: '/documentacao/produtos/secure/visao-geral/', key: 'secure' },
	{ text: 'Deploy', slug: '/documentacao/produtos/deploy/visao-geral/', key: 'deploy' },
	{ text: 'Observe', slug: '/documentacao/produtos/observe/visao-geral/', key: 'observe' },

	{ text: 'Configure um domínio', key: 'configureDomain', slug: '/documentacao/produtos/guias/configurar-dominio/' },
	{ text: 'Crie um certificado digital', slug: '/documentacao/produtos/guias/criar-certificado-digital/', key: 'certificateDomain' },
	{ text: 'Aponte um domínio para a Azion', slug: '/documentacao/produtos/guias/apontar-dominio-para-a-azion/', key: 'pointDomain' },
	{ text: 'Migre NS para a Azion', slug: '/documentacao/produtos/guias/migrar-ns-para-a-azion/', key: 'migrateDomain' },

	{ text: 'Crie uma conta', key: 'account/createAccount', slug: '/documentacao/produtos/contas/criar-uma-conta/' },

	{ text: 'Configurar conta', key: 'manageAccount' },
	{ text: 'Usuários', key: 'account/Users', slug: '/documentacao/produtos/guias/users-management/' },
	{ text: 'Times', slug: '/documentacao/produtos/guias/teams-permissions/', key: 'account/teamsPermissions' },
	{ text: 'Activity history', slug: '/documentacao/produtos/guias/activity-history/', key: 'account/activityHistory' },
	{ text: 'Account Lockout Policy', slug: '/documentacao/produtos/guias/configurar-account-lockout-policy/', key: 'account/accountLockoutPolicy' },
	{ text: 'Conditional Access by IP Address', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/guias/conditional-access-by-ip-address/', key: 'account/conditionalAccess' },
	{ text: 'SSO', slug: '/documentacao/produtos/guias/sso/', key: 'account/sso' },
	{ text: 'MFA', slug: '/documentacao/produtos/guias/multi-factor-authentication/', key: 'account/mfa' },
	{ text: 'User Session Timeout', slug: '/documentacao/produtos/guias/configurar-user-session-timeout/', key: 'account/user-session-timeout' },
	{ text: 'Faturamento e assinaturas', slug: '/documentacao/produtos/guias/billing-and-subscriptions/', key: 'account/billingAndSubscriptions' },


	{ text: 'Configurar perfis', key: 'manageProfile' },
	{ text: 'Personal tokens', key: 'accountsProfile/personalTokens', slug: '/documentacao/produtos/guias/personal-tokens/' },
	{ text: 'Configurações', slug: '/documentacao/produtos/guias/configuracoes-de-conta/', key: 'accountsProfile/settings' },
	{ text: 'Deletar conta', slug: '/documentacao/produtos/guias/contas/excluir-conta/', key: 'accountsProfile/deleteAccount' },


	{ text: 'Developer tools', key: 'developerTools' },
	{ text: 'API', key: 'devtools/api', slug: '/documentacao/produtos/devtools/primeiros-passos-api/' },
	{ text: 'CLI', key: 'devtools/cli', slug: '/documentacao/produtos/azion-cli/visao-geral/' },
	{ text: 'API GraphQL Playground', slug: '/documentacao/produtos/devtools/playground-graphql/', key: 'devtools/graphQLplayground' },
	{ text: 'SDK', slug: '/documentacao/devtools/sdk/go/', key: 'devtools/sdk' },
	{ text: 'Terraform', slug: '/documentacao/produtos/terraform-provider/', key: 'devtools/terraform' },
	{ text: 'GitHub', slug: 'https://github.com/aziontech/', key: 'devtools/gitHub' },

	{ text: 'Migre para a Azion', header: true, anchor: true, type: 'learn', slug: '/documentacao/produtos/migrar-para-a-azion/', key: 'migrateAzion' },

	{ text: 'Templates e integrações ', key: 'templatesIntegrationsRef' },
	{ text: 'Visão geral', slug: '/documentacao/produtos/marketplace/visao-geral-templates-e-integracoes/', key: 'templatesIntegrations/overview' },
	{ text: 'Conheça os Azion Templates', slug: '/documentacao/produtos/marketplace/templates/', key: 'templatesIntegrations/templates' },
	{ text: 'Use um template', slug: '/documentacao/produtos/usar-um-template-via-azion-console/', key: 'templatesIntegrations/createPublishTemplate' },
	{ text: 'Conheça as Azion Integrations', slug: '/documentacao/produtos/marketplace/integracoes/', key: 'templatesIntegrations/integrations' },
	{ text: 'Instale uma integração', slug: '/documentacao/produtos/marketplace/instalar-uma-integracao/', key: 'templatesIntegrations/installIntegration' },
	{ text: 'Atualize uma integração', slug: '/documentacao/produtos/marketplace/atualizar-uma-integracao/', key: 'templatesIntegrations/updateIntegration' },
	{ text: 'Seja um ISV', slug: '/documentacao/produtos/marketplace/isv-signup/', key: 'templatesIntegrations/isv' },


	{
		text: 'Build', key: 'buildRef'
	},
	{ text: 'Edge Application', key: 'reference/edgeApplication', slug: '/documentacao/produtos/build/edge-application/' },
	{ text: 'Application Accelerator', key: 'reference/applicationAcceleration', slug: '/documentacao/produtos/build/edge-application/application-accelerator/' },
	{ text: 'Edge Cache', key: 'reference/edgeCaching', slug: '/documentacao/produtos/build/edge-application/edge-cache/' },
	{ text: 'Edge Functions', key: 'reference/edge Functions', slug: '/documentacao/produtos/build/edge-application/edge-functions/' },
	{ text: 'Image Processor', key: 'reference/imageProcessor', slug: '/documentacao/produtos/build/edge-application/image-processor/' },
	{ text: 'Load Balancer', key: 'reference/loadBalancer', slug: '/documentacao/produtos/build/edge-application/load-balancer/' },
	{ text: 'Tiered Cache', key: 'reference/l2Caching', slug: '/documentacao/produtos/build/edge-application/tiered-cache/' },
	{ text: 'Main Settings', key: 'reference/mainSettings', slug: '/documentacao/produtos/build/edge-application/main-settings/' },
	{ text: 'Cache Settings', key: 'reference/cacheSettings', slug: '/documentacao/produtos/build/edge-application/cache-settings/' },
	{ text: 'Edge Functions Instances', key: 'reference/edgeFunctionsInstancesApplication', slug: '/documentacao/produtos/build/edge-application/edge-functions-instances/' },
	{ text: 'Device Groups', key: 'reference/deviceGroups', slug: '/documentacao/produtos/build/edge-application/device-groups/' },
	{ text: 'Error Responses', key: 'reference/errorResponses', slug: '/documentacao/produtos/build/edge-application/error-responses/' },
	{ text: 'Origins', key: 'reference/origins', slug: '/documentacao/produtos/build/edge-application/origins/' },
	{ text: 'Real-Time Purge', key: 'reference/realTimePurge', slug: '/documentacao/produtos/build/edge-application/real-time-purge/' },
	{ text: 'Rules Engine', key: 'reference/rulesEngineedgeApplication', slug: '/documentacao/produtos/build/edge-application/rules-engine/' },
	
	{
		text: 'Store', key: 'storeRef'
	},
	{ text: 'Edge Storage', key: 'reference/storage', slug: '/documentacao/produtos/store/edge-storage/' },
	{ text: 'Edge SQL', key: 'reference/sql', slug: '/documentacao/produtos/store/edge-sql/' },
	{ text: 'Vector Search', key: 'reference/vector-search', slug: '/documentacao/produtos/store/edge-sql/vector-search/' },
	
	{
		text: 'Secure', key: 'secureRef'
	},
	{ text: 'Edge Firewall', key: 'reference/edgeFirewall', slug: '/documentacao/produtos/secure/edge-firewall/' },
	{ text: 'DDoS Protection', key: 'reference/ddosProtection', slug: '/documentacao/produtos/secure/edge-firewall/ddos-protection/' },
	{ text: 'DDoS Mitigation', key: 'reference/ddosMitigation', slug: '/documentacao/produtos/secure/edge-firewall/ddos-protection/ddos-mitigation/' },
	{ text: 'Network Layer Protection', key: 'reference/networkLayerProtection', slug: '/documentacao/produtos/secure/edge-firewall/network-layer-protection/' },
	{ text: 'Network Lists', key: 'reference/networkLists', slug: '/documentacao/produtos/secure/edge-firewall/network-layer-protection/network-lists/' },
	{ text: 'Web Application Firewall', key: 'reference/webApplicationFirewall', slug: '/documentacao/produtos/secure/edge-firewall/web-application-firewall/' },
	{ text: 'WAF Rule Sets', key: 'reference/wafRuleSets', slug: '/documentacao/produtos/secure/edge-firewall/web-application-firewall/rule-sets/' },
	{ text: 'WAF Custom Allowed Rules', key: 'reference/wafCustomAllowedRules', slug: '/documentacao/produtos/secure/edge-firewall/web-application-firewall/custom-allowed-rules/' },
	{ text: 'Bot Manager', key: 'reference/botManager', slug: '/documentacao/produtos/secure/edge-firewall/bot-manager/' },
	{ text: 'Edge Functions', key: 'reference/edgeFunctionsFirewall', slug: '/documentacao/produtos/secure/edge-firewall/edge-functions/' },
	{ text: 'Edge Functions Instances', key: 'reference/edgeFunctionsInstancesFirewall', slug: '/documentacao/produtos/secure/edge-firewall/edge-functions-instances/' },
	{ text: 'Rules Engine', key: 'reference/rulesEngineFirewall', slug: '/documentacao/produtos/secure/edge-firewall/rules-engine/' },
	{ text: 'Digital Certificates', key: 'reference/digitalCertificates', slug: '/documentacao/produtos/build/edge-application/digital-certificates/' },
	{ text: 'Edge DNS', key: 'reference/intelligentDNS', slug: '/documentacao/produtos/secure/edge-dns/' },
	{ text: 'Compatibilidade com DNSSEC', key: 'reference/dnssecCompatibility', slug: '/documentacao/produtos/secure/edge-dns/compatibilidade-dnssec/' },


	{ text: 'Deploy', key: 'deployRef' },
	{ text: 'Edge Orchestrator', key: 'reference/edgeOrchestrator', slug: '/documentacao/produtos/deploy/edge-orchestrator/' },
	{ text: 'Edge Services', key: 'reference/edgeServices', slug: '/documentacao/produtos/deploy/edge-orchestrator/edge-services/' },
	{ text: 'Edge Node', key: 'reference/edgeNode', slug: '/documentacao/produtos/deploy/edge-orchestrator/edge-node/' },

	{ text: 'Observe', key: 'observeRef' },
	{ text: 'Data Stream', key: 'reference/dataStreaming', slug: '/documentacao/produtos/observe/data-stream/' },
	{ text: 'Edge Pulse', key: 'reference/edgePulse', slug: '/documentacao/produtos/observe/edge-pulse/' },
	{ text: 'Real-Time Events', key: 'reference/realTimeEvents', slug: '/documentacao/produtos/observe/real-time-events/' },
	{ text: 'Real-Time Metrics', key: 'reference/realTimeMetrics', slug: '/documentacao/produtos/observe/real-time-metrics/' },
	{ text: 'Real-Time Metrics Histórico', key: 'reference/historicalRealTimeMetrics', slug: '/documentacao/produtos/observe/real-time-metrics-historico/' },

	{ text: 'Marketplace', key: 'mktpRef' },
	{ text: 'Marketplace', key: 'mktp', slug: '/documentacao/produtos/marketplace/' },
	{ text: 'Permissões', key: 'mktp/permissions', slug: '/documentacao/produtos/guias/permissoes-marketplace/' },
	{ text: 'Marketplace Seller Guide', key: 'mktp/sellerGuide', slug: '/documentacao/produtos/marketplace/marketplace-seller-guide/' },

	{
		text: 'Contas', key: 'accountsRef'
	},
	{ text: 'Activity History', key: 'accounts/ActivityHistory', slug: '/documentacao/produtos/gestao-de-contas/activity-history/' },
	{ text: 'Clients', key: 'accounts/Clients', slug: '/documentacao/produtos/gestao-de-contas/contas/' },
	{ text: 'Configurações de conta', key: 'accounts/accountSettings', slug: '/documentacao/produtos/gestao-de-contas/account-settings/' },
	{ text: 'Account Lockout Policy', key: 'accounts/accountLockoutPolicy', slug: '/documentacao/produtos/gestao-de-contas/account-lockout-policy/' },
	{ text: 'Faturamento', key: 'accounts/billing', slug: '/documentacao/produtos/gestao-de-contas/billing-and-subscriptions/' },
	{ text: 'Multi-Factor Authentication', key: 'accounts/MFA', slug: '/documentacao/produtos/gestao-de-contas/multi-factor-authentication/' },
	{ text: 'Personal Tokens', key: 'accounts/personalTokens', slug: '/documentacao/produtos/gestao-de-contas/personal-tokens/' },
	{ text: 'Social Login', key: 'accounts/socialLogin', slug: '/documentacao/produtos/gestao-de-contas/social-login/' },
	{ text: 'Single Sign-On', key: 'accounts/SSO', slug: '/documentacao/produtos/gestao-de-contas/single-sign-on/' },
	{ text: 'Teams Permissions', key: 'accounts/teamsPermissions', slug: '/documentacao/produtos/gestao-de-contas/teams-permissions/' },
	{ text: 'Users Management', key: 'accounts/usersManagement', slug: '/documentacao/produtos/gestao-de-contas/users-management/' },
	{ text: 'User Session Timeout', key: 'accounts/userSessionTimeout', slug: '/documentacao/produtos/gestao-de-contas/user-session-timeout//' },
	{ text: 'Your Settings', key: 'accounts/youtSettings', slug: '/documentacao/produtos/gestao-de-contas/your-settings/' },

	{ text: 'Technical Support', slug: '/documentacao/servicos/suporte/', key: 'technicalSupport' },

	{ text: 'Professional Services', key: 'professionalServicesRef' },
	{ text: 'Integration Services', slug: '/documentacao/servicos/solutions-lab/integration-services/', key: 'professionalServices/integrationServices' },
	{ text: 'Managed Configurations', slug: '/documentacao/servicos/managed-configurations/', key: 'professionalServices/managedConfigurations' },
	{ text: 'Technical Account Manager', slug: '/documentacao/servicos/technical-account-manager/', key: 'professionalServices/TAM' },
	{ text: 'Best Practices Review', slug: '/documentacao/servicos/best-practices-review/', key: 'professionalServices/bestPracticesReview' },
	{ text: 'Instructor-Led Training', slug: '/documentacao/servicos/instructor-led-training/', key: 'professionalServices/customEducationPrograms' },
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
		text: 'Release Notes', slug: '/documentacao/produtos/release-notes/', key: 'releaseNotes'
	},

	{
		text: 'Contratos', slug: '/documentacao/contratos/', key: 'agreements'
	},

	{ text: 'Compliance', key: 'compliance' },
	{ text: 'SOC', key: 'compliance/soc', slug: '/documentacao/compliance/soc/' },
	{ text: 'PCI DSS', key: 'compliance/pci-dss', slug: '/documentacao/compliance/pci-dss-certification/' },

	{
		text: 'Preços', slug: '/documentacao/produtos/precos/', key: 'pricing'
	},

	{
		text: 'Responsabilidade Compartilhada', slug: '/documentacao/responsabilidade-compartilhada/', key: 'sharedResponsibility'
	},

	{
		text: 'Azion Network Program', slug: '/documentacao/produtos/azion-network-program/', key: 'azionNetworkProgram'
	},

]);
