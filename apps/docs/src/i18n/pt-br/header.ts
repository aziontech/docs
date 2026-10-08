const algoliaIndex = [
	{
		name: `azion-doc-ptbr`,
		label: 'docs',
		activeIndex: 1,
	},
	{
		name: `azion-site-ptbr`,
		label: 'site',
		activeIndex: 2,
	},
	{
		name: `azion-blog-ptbr`,
		label: 'blog',
		activeIndex: 3,
	},
	{
		name: `azion-cases-ptbr`,
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

const algoliaInputPlaceholder = 'Digite sua busca';

export default {
	algoliaIndex,
	algoliaModel,
	algoliaInputPlaceholder,
};
