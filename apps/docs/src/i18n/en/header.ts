const menuSecondaryMobile = [
	{
		// label: 'Documents',
		items: [
			{
				label: 'Careers',
				// icon: 'pi pi-briefcase',
				tags: ["we're hiring!"],
				url: '/en/careers/jobs/',
			},
			{
				label: 'Success Stories',
				// icon: 'pi pi-dollar'
				url: '/en/resource-hub/',
			},
			{
				label: 'Support',
				// icon: 'pi pi-question-circle'
				url: '/en/pricing/',
			},
			{
				label: 'Privacy policy',
				// icon: 'pi pi-exclamation-triangle'
				url: '/en/documentation/agreements/privacy-policy/',
			},
		],
	},
];

const bottomButtonsMobile = [
	{
		label: 'Free Account',
		urlTitle: 'Azion Console Free Account',
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
		url: '/en/contact/',
		urlTitle: 'Contact Page',
		icon: 'pi pi-chevron-right text-body-xs',
	},
];

const algoliaIndex = [
	{
		name: `azion-doc-en`,
		label: 'docs',
		activeIndex: 1,
	},
	{
		name: `azion-site-en`,
		label: 'site',
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

const algoliaModel = [
	{ label: 'All' },
	{ label: 'Docs' },
	{ label: 'Site' },
	{ label: 'Blog' },
	{ label: 'Cases' },
];

const algoliaInputPlaceholder = 'Type to search';

export default {
	menuSecondaryMobile,
	bottomButtonsMobile,
	algoliaIndex,
	algoliaModel,
	algoliaInputPlaceholder,
};
