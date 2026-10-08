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
	algoliaIndex,
	algoliaModel,
	algoliaInputPlaceholder,
};
