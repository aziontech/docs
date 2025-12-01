const securityInformation = {
	title: 'Você está protegido pela Azion',
	tags: [
		{
			title: 'SOC 2 Type 2 / SOC 3',
			icon: 'pi pi-check',
		},
		{
			title: 'PCI DSS',
			icon: 'pi pi-check',
		},
	],
};

const listData = [
	{
		title: 'Empresa',
		list: [
			{
				title: 'Sobre nós',
				link: '/pt-br/sobre-nos/',
			},
			{
				title: 'Nossa rede',
				link: '/pt-br/produtos/nossa-rede/',
			},
			{
				title: 'Carreiras',
				link: '/pt-br/carreiras/',
				flag: 'Estamos contratando!',
			},
			{
				title: 'Compliance',
				link: '/pt-br/compliance/',
			},
			{
				title: 'Política de privacidade',
				link: '/pt-br/documentacao/contratos/politica-de-privacidade/',
			},
			{
				title: 'Oi AI, Aprenda sobre a gente',
				link: 'https://www.azion.com/for-ai.md',
			},
		],
	},
	{
		title: 'Recursos',
		list: [
			{
				title: 'Blog',
				link: '/pt-br/blog/',
			},
			{
				title: 'Resource Hub',
				link: '/pt-br/resource-hub/',
			},
			{
				title: 'Central de Aprendizagem',
				link: '/pt-br/learning/',
			},
			{
				title: 'Marketplace',
				link: '/pt-br/marketplace/',
			},
			{
				title: 'Sob Ataque?',
				link: '/pt-br/lp/emergencia-ataque-cibernetico/',
			},
		],
	},
	{
		title: 'Ponto de partida',
		list: [
			{
				title: 'Conta Gratuita',
				link: 'https://console.azion.com/signup',
			},
			{
				title: 'Ponto de partida',
				link: '/pt-br/documentacao/produtos/visao-geral-da-plataforma-da-azion/',
			},
			{
				title: 'Preços',
				link: '/pt-br/precos/',
			},
			{
				title: 'Contate Vendas',
				link: '/pt-br/contate-vendas/',
			},
			{
				title: 'Serviços Profissionais',
				link: '/pt-br/servicos-profissionais/',
			},
		],
	},
	{
		title: 'Desenvolvedor',
		list: [
			{
				title: 'Documentação',
				link: '/pt-br/documentacao/',
			},
			{
				title: 'API',
				link: 'https://api.azion.com/v4',
			},
			{
				title: 'Nossa Comunidade',
				icon: true,
				link: 'https://discord.com/invite/pM8ANzztuB',
			},
			{
				title: 'Release Notes',
				link: '/pt-br/documentacao/produtos/release-notes/',
			},
		],
	},
];

const cta = {
	text: 'Para vendas e suporte, entre em contato no ',
	phone: '0800 883 6313',
};

const copyright = '© Azion Technologies ou suas afiliadas. Todos os direitos reservados.';

const footerContent = {
	title: 'Azion',
	description: 'A plataforma web para<br /> workloads modernos',
};

export default {
	footerContent,
	securityInformation,
	listData,
	cta,
	copyright,
};
