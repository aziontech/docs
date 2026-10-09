import type { APIRoute, GetStaticPaths } from 'astro';

import { DOCS_BASE } from '~/nav/resolve';
import { LANGS, type Lang } from '~/nav/schema';
import { guidesCatalog } from '~/util/guidesCatalog';

export const getStaticPaths = (() =>
	LANGS.map((lang) => ({ params: { lang, docs: DOCS_BASE[lang] } }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
	const { rows } = await guidesCatalog(params.lang as Lang);
	return new Response(JSON.stringify(rows), { headers: { 'Content-Type': 'application/json' } });
};
