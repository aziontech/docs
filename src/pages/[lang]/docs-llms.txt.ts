import type { APIRoute, GetStaticPaths } from 'astro';

import { SITE_URL } from '~/consts';
import { LANGS, type Lang } from '~/nav/schema';
import { getMachineIndex, llmsEntry } from '~/util/machineIndex';

/**
 * The full page list, one section per navigation tree. This path predates the
 * per-section files and stays because the agent-setup pages and prompts cite it;
 * /{lang}/{docs}/llms.txt is the conventional entry point and links here.
 */

const TITLE: Record<Lang, string> = {
	en: 'Azion documentation, every page',
	'pt-br': 'Documentação Azion, todas as páginas',
};
const SUMMARY: Record<Lang, string> = {
	en: 'Every page the documentation navigation lists, in sidebar order, linked as Markdown. The section index is at',
	'pt-br':
		'Todas as páginas que a navegação da documentação lista, na ordem do menu, com links em Markdown. O índice de seções está em',
};

export const getStaticPaths = (() =>
	LANGS.map((lang) => ({ params: { lang } }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
	const lang = params.lang as Lang;
	const index = await getMachineIndex(lang);
	const sectionIndex = `${SITE_URL}/${lang}/${index.docsBase}/llms.txt`;
	const lines = [`# ${TITLE[lang]}`, '', `> ${SUMMARY[lang]} ${sectionIndex}`, ''];
	for (const tree of index.trees) {
		lines.push(`## ${tree.title}`, '');
		for (const page of tree.pages)
			lines.push(llmsEntry(page.title, page.markdownUrl, page.description));
		lines.push('');
	}
	return new Response(lines.join('\n'), {
		headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
	});
};
