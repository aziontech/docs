const menuData = {
  items: [
		{
      label: 'Documentation',
      href: '/en/documentation/',
      items: []
    },
		{
      label: 'Guides',
      href: '/en/documentation/products/guides/',
      items: []
    },
		{
      label: 'DevTools',
      href: '/en/documentation/devtools/',
      items: []
    }
  ]
};

const menuSecondary = [
  {
    text: "Contact",
    title: "Contact Sales",
    link: "/en/contact-sales/",
    destak: false,
  },
  {
    text: "Sign in",
    title: "Azion SSO Login",
    link: "https://console.azion.com/login",
    destak: false,
  },
  {
    text: "Free account",
    title: "Azion Free Account",
    link: "https://console.azion.com/signup",
    destak: true,
  }
];

const menuSecondaryMobile = [
  {
    // label: 'Documents',
    items: [
      {
        label: 'Carreers',
        // icon: 'pi pi-briefcase',
        tags: ['we\'re hiring!'],
        url: '/en/careers/jobs/'
      },
      {
        label: 'Success Stories',
        // icon: 'pi pi-dollar'
        url: '/en/success-case/'
      },
      {
        label: 'Support',
        // icon: 'pi pi-question-circle'
        url: '/en/pricing/'
      },
      {
        label: 'Privacy policy',
        // icon: 'pi pi-exclamation-triangle'
        url: '/en/documentation/agreements/privacy-policy/'
      }
    ]
  }
];

const bottomButtonsMobile = [
  {
    label: 'Free Account',
    urlTitle: 'Azion Console Free Account',
    url: 'https://console.azion.com/singup',
    destak: true
  },
  {
    label: 'Sign In',
    urlTitle: 'Azion Console Sign In',
    url: 'https://console.azion.com/login'
  },
  {
    label: 'Contact',
    url: '/en/contact-sales/',
    urlTitle: 'Contact Page',
    icon: 'pi pi-chevron-right text-xs'
  }
];

const algoliaIndex = [
	{
    name: `azion-doc-en`,
    label: 'docs',
    activeIndex: 1
  },
  {
    name: `azion-site-en`,
    label: 'site',
    activeIndex: 2
  },
  {
    name: `azion-blog-en`,
    label: 'blog',
    activeIndex: 3
  },
  {
    name: `azion-cases-en`,
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

const algoliaInputPlaceholder = "Type to search"

export default {
  menuData,
  menuSecondary,
  menuSecondaryMobile,
  bottomButtonsMobile,
  algoliaIndex,
  algoliaModel,
  algoliaInputPlaceholder
}
