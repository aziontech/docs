import type { APIRoute, GetStaticPaths } from 'astro';

import { setupInstructions } from '~/data/setup-instructions';
import { DOCS_BASE } from '~/nav/resolve';
import { LANGS, type Lang } from '~/nav/schema';

/** The instructions the short setup prompt points an agent at. */

export const getStaticPaths = (() =>
	LANGS.map((lang) => ({ params: { lang, docs: DOCS_BASE[lang] } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ params }) =>
	new Response(setupInstructions('mcp', params.lang as Lang), {
		headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
	});
