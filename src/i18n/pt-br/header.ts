const menuData = {
  items: [
		{
      label: 'Documentação',
      href: '/pt-br/documentacao/',
      items: []
    },
		{
      label: 'Guias',
      href: '/pt-br/documentacao/produtos/guias/',
      items: []
    },
		{
      label: 'DevTools',
      href: '/pt-br/documentacao/produtos/devtools/',
      items: []
    }
  ]
};

const menuSecondary = [
  {
    text: "Contato",
    title: "Contact Sales",
    link: "/pt-br/contate-vendas/",
    destak: false,
  },
  {
    text: "Sign in",
    title: "Azion SSO Login",
    link: "https://console.azion.com/login",
    destak: false,
  },
  {
    text: "Conta Gratuita",
    title: "Crie sua Conta Gratuita",
    link: "https://console.azion.com/signup/",
    destak: true,
  }
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
        url: '/pt-br/casos-de-sucesso/'
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
    name: `azion-site-ptbr`,
    label: 'site',
    activeIndex: 1
  },
  {
    name: `azion-doc-ptbr`,
    label: 'docs',
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
  { label: 'Site' },
  { label: 'Docs' },
  { label: 'Blog' },
  { label: 'Cases' }
];

const algoliaInputPlaceholder = "Digite sua busca"

export default {
  menuData,
  menuSecondary,
  menuSecondaryMobile,
  bottomButtonsMobile,
  algoliaIndex,
  algoliaModel,
  algoliaInputPlaceholder
}
