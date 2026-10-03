import type { APIRoute, GetStaticPaths } from 'astro';

import { getNavData, getNavIndex } from '~/nav';
import { resolveTreeMenus } from '~/nav/resolve';
import { LANGS, type Lang } from '~/nav/schema';

export const getStaticPaths = (() =>
	LANGS.map((lang) => ({ params: { lang } }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
	const lang = params.lang as Lang;
	const [data, index] = await Promise.all([getNavData(), getNavIndex(lang)]);
	return new Response(JSON.stringify(resolveTreeMenus(data, index, lang)), {
		headers: { 'Content-Type': 'application/json' },
	});
};
