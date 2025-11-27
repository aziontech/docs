const menu = {
	menu: [
		{
			label: 'Documentação',
			href: '/pt-br/documentacao/',
		},
		{
			label: 'Guias',
			href: '/pt-br/documentacao/produtos/guias/',
		},
		{
			label: 'DevTools',
			href: '/pt-br/documentacao/produtos/devtools/',
		},
	],
};

const menuSecondary = [
	{
		text: 'Contato',
		title: 'Contato',
		link: '/pt-br/contate-vendas/',
		target: '_self',
	},
	{
		text: 'Entrar',
		title: 'Entrar',
		link: 'https://console.azion.com/login',
		target: '_blank',
	},
	{
		text: 'Comece Grátis',
		title: 'Comece Grátis',
		backgroundColor: 'dark',
		link: 'https://console.azion.com/signup',
		target: '_blank',
	},
];

const menuSecondaryMobile = [
  {
    // label: 'Documents',
    items: [
      {
        label: 'Carreiras',
        // icon: 'pi pi-briefcase',
        tags: ['estamos contratando'],
        url: '/pt-br/carreiras/'
      },
      {
        label: 'Casos de Sucesso',
        // icon: 'pi pi-dollar'
        url: '/pt-br/resource-hub/'
      },
      {
        label: 'Suporte',
        // icon: 'pi pi-question-circle'
        url: '/pt-br/precos/'
      },
      {
        label: 'Política de privacidade',
        // icon: 'pi pi-exclamation-triangle'
        url: '/pt-br/documentacao/contratos/politica-de-privacidade/'
      }
    ]
  }
];

const bottomButtonsMobile = [
  {
    label: 'Conta Gratuita',
    urlTitle: 'Azion Console Conta Gratuita',
    url: 'https://console.azion.com/singup',
    destak: true
  },
  {
    label: 'Sign In',
    urlTitle: 'Azion Console Sign In',
    url: 'https://console.azion.com/login'
  },
  {
    label: 'Contato',
    url: '/pt-br/contate-vendas/',
    urlTitle: 'Contact Page',
    icon: 'pi pi-chevron-right text-xs'
  }
];

const algoliaIndex = [
	{
    name: `azion-doc-ptbr`,
    label: 'docs',
    activeIndex: 1
  },
  {
    name: `azion-site-ptbr`,
    label: 'site',
    activeIndex: 2
  },
  {
    name: `azion-blog-ptbr`,
    label: 'blog',
    activeIndex: 3
  },
  {
    name: `azion-cases-ptbr`,
    label: 'cases',
    activeIndex: 4
  }
];

const algoliaModel = [
  { label: 'All' },
  { label: 'Docs' },
	{ label: 'Site' },
  { label: 'Blog' },
  { label: 'Cases' }
];

const algoliaInputPlaceholder = "Digite sua busca"

export default {
  menu,
  menuSecondary,
  menuSecondaryMobile,
  bottomButtonsMobile,
  algoliaIndex,
  algoliaModel,
  algoliaInputPlaceholder
}
