import { OGImageRoute } from 'astro-og-canvas';
import { allPages } from '~/content';
import { rtlLanguages } from '~/i18n/languages';
import { getLanguageFromURL } from '~/util';

const skip_og = process.env.SKIP_OG?.toLocaleLowerCase() === 'true';
const paths =  skip_og ? [] : allPages;
const pages = Object.fromEntries(paths.map(({ id, slug, data }) => [id, { data, slug }]));

export const { getStaticPaths, GET } = OGImageRoute({
	param: 'path',
	pages,
	getImageOptions: async (_, { data, slug }: (typeof pages)[string]) => {
		return {
			title: data.title,
			description: data.description,
			dir: rtlLanguages.has(getLanguageFromURL(slug)) ? 'rtl' : 'ltr',
			logo: {
				path: 'public/assets/docs/images/azion-logo.png',
				size: [200],
			},
			border: {
				color: [243, 101, 43],
				width: 4,
				side: 'inline-start'
			},
			bgGradient: [
				[13, 13, 13],
				[30, 30, 30]
			],
			font: {
				title: {
					size: 78,
					families: ['Roboto'], 
					weight: 'Bold',
				},
				description: {
					size: 45,
					lineHeight: 1.25,
					families: ['Roboto'],
					weight: 'Normal',
				},
			},
			fonts: [
				'https://fonts.azion.com/roboto/roboto-bold.ttf',
				'https://fonts.azion.com/roboto/roboto-regular.ttf'
			]
		}
	}
});
