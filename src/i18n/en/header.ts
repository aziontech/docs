const menu = {
	menu: [
		{
			label: 'Documentation',
			href: '/en/documentation/',
		},
		{
			label: 'Guides',
			href: '/en/documentation/products/guides/',
		},
		{
			label: 'DevTools',
			href: '/en/documentation/devtools/',
		},
	],
};

const menuSecondary = [
	{
		text: 'Contact',
		title: 'Contact',
		link: '/en/contact-sales/',
		target: '_self',
	},
	{
		text: 'Sign In',
		title: 'Sign In',
		link: 'https://console.azion.com/login',
		target: '_blank',
	},
	{
		text: 'Start Free',
		title: 'Start Free',
		backgroundColor: 'dark',
		link: 'https://console.azion.com/signup',
		target: '_blank',
	},
];

const menuSecondaryMobile = [
	{
		items: [
			{
				label: 'Carreers',
				tags: ["we're hiring!"],
				url: '/en/careers/jobs/',
			},
			{
				label: 'Support',
				url: '/en/pricing/',
			},
			{
				label: 'Privacy policy',
				url: '/en/documentation/agreements/privacy-policy/',
			},
		],
	},
];

const bottomButtonsMobile = [
	{
		label: 'Start Free',
		urlTitle: 'Start Free',
		url: 'https://console.azion.com/singup',
		destak: true,
	},
	{
		label: 'Sign In',
		urlTitle: 'Azion Console Sign In',
		url: 'https://console.azion.com/login',
	},
	{
		label: 'Contact',
		url: '/en/contact-sales/',
		urlTitle: 'Contact Page',
		icon: 'pi pi-chevron-right text-xs',
	},
];

const algoliaIndex = [
	{
		name: `azion-site-en`,
		label: 'site',
		activeIndex: 1,
	},
	{
		name: `azion-doc-en`,
		label: 'docs',
		activeIndex: 2,
	},
	{
		name: `azion-blog-en`,
		label: 'blog',
		activeIndex: 3,
	},
	{
		name: `azion-cases-en`,
		label: 'cases',
		activeIndex: 4,
	},
];

const algoliaModel = [{ label: 'All' }, { label: 'Docs' }, { label: 'Blog' }];

const algoliaInputPlaceholder = 'Type to search';

export const communityData = {
	label: 'Join our community',
	href: 'https://discord.com/invite/pM8ANzztuB',
};

export default {
	menu,
	menuSecondary,
	menuSecondaryMobile,
	bottomButtonsMobile,
	algoliaIndex,
	algoliaModel,
	algoliaInputPlaceholder,
	communityData,
};
