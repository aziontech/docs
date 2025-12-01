const securityInformation = {
	title: 'You are protected by Azion',
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
		title: 'Company',
		list: [
			{
				title: 'About us',
				link: '/en/about-us/',
			},
			{
				title: 'Our Network',
				link: '/en/products/our-network/',
			},
			{
				title: 'Careers',
				link: '/en/careers/',
			},
			{
				title: 'Compliance',
				link: '/en/compliance/',
			},
			{
				title: 'Privacy Policy',
				link: '/en/documentation/agreements/privacy-policy/',
			},
			{
				title: 'Hey AI, learn about us',
				link: 'https://www.azion.com/for-ai.md',
			},
		],
	},
	{
		title: 'Resources',
		list: [
			{
				title: 'Blog',
				link: '/en/blog/',
			},
			{
				title: 'Resource Hub',
				link: '/en/resource-hub/',
			},
			{
				title: 'Learning',
				link: '/en/learning/',
			},
			{
				title: 'Marketplace',
				link: '/en/marketplace/',
			},
			{
				title: 'Success cases',
				link: '/en/lp/under-attack-mitigation/',
			},
		],
	},
	{
		title: 'Getting Started',
		list: [
			{
				title: 'Start for free',
				link: 'https://console.azion.com/signup',
			},
			{
				title: 'How to start',
				link: '/en/documentation/products/azion-platform-overview/',
			},
			{
				title: 'Pricing',
				link: '/en/pricing/',
			},
			{
				title: 'Contact Sales',
				link: '/en/contact-sales/',
			},
			{
				title: 'Professional Services',
				link: '/en/professional-services/',
			},
		],
	},
	{
		title: 'Developer',
		list: [
			{
				title: 'Documentation',
				link: '/en/documentation/',
			},
			{
				title: 'API',
				link: 'https://api.azion.com/v4',
			},
			{
				title: 'Our Community',
				link: 'https://discord.com/invite/pM8ANzztuB',
				icon: true,
			},
			{
				title: 'Release Notes',
				link: '/en/documentation/products/release-notes/',
			},
		],
	},
];

const cta = {
	text: 'For support and sales, please call ',
	phone: '+1 (833) 33-AZION',
};

const socialButtons = [
	{
		title: 'GitHub',
		target: '_blank',
		link: 'https://github.com/aziontech',
		icon: 'pi pi-github',
	},
	{
		title: 'Linkedin',
		link: 'https://www.linkedin.com/company/aziontech',
		target: '_blank',
		icon: 'pi pi-linkedin',
	},
	{
		title: 'YouTube',
		link: 'https://www.youtube.com/aziontech',
		target: '_blank',
		icon: 'pi pi-youtube',
	},
	{
		title: 'X',
		link: 'https://x.com/aziontech',
		target: '_blank',
		icon: 'ai ai-twitter',
	},
	{
		title: 'Instagram',
		link: 'https://www.instagram.com/aziontech',
		target: '_blank',
		icon: 'pi pi-instagram',
	},
	{
		title: 'Discord',
		target: '_blank',
		link: 'https://discord.gg/pM8ANzztuB',
		icon: 'pi pi-discord',
	},
	{
		title: 'Medium',
		target: '_blank',
		link: 'https://medium.com/aziontech',
		icon: 'ai ai-medium',
	},
];

const copyright = '© Azion Technologies, Inc or its affiliates. All rights reserved.';

const footerContent = {
	title: 'Azion',
	description: 'The web platform for<br /> modern workloads',
};

export default {
	footerContent,
	securityInformation,
	listData,
	cta,
	copyright,
	socialButtons,
};
