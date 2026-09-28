import type { APIRoute, GetStaticPaths } from 'astro';

import { LANGS, type Lang } from '~/nav/schema';
import { getMachineIndex, llmsEntry, type IndexedTree, type MachineIndex } from '~/util/machineIndex';

/** llms.txt at the docs root (one entry per section) and at every section root (every
 * page it lists). The site root belongs to the marketing site, so the docs root is the
 * conventional path here. Entries link the Markdown twin of each page. */

const SUMMARY: Record<Lang, string> = {
	en: 'Documentation for the Azion Web Platform: build, store, secure, and observe applications on Azion\'s distributed infrastructure. Every page is served as Markdown at its URL with .md appended, and every section publishes its own llms.txt.',
	'pt-br':
		'Documentação da Azion Web Platform: construa, armazene, proteja e observe aplicações na infraestrutura distribuída da Azion. Toda página é servida como Markdown na própria URL com .md ao final, e toda seção publica o próprio llms.txt.',
};

const TITLE: Record<Lang, string> = { en: 'Azion documentation', 'pt-br': 'Documentação Azion' };
const INDEX_NOTE: Record<Lang, string> = { en: 'Section index', 'pt-br': 'Índice da seção' };
const PAGES: Record<Lang, string> = { en: 'Pages', 'pt-br': 'Páginas' };

function renderRoot(index: MachineIndex): string {
	const lines = [`# ${TITLE[index.lang]}`, '', `> ${SUMMARY[index.lang]}`, ''];
	for (const group of index.rootGroups) {
		lines.push(`## ${group.label ?? group.listed.join(', ')}`, '');
		for (const tree of group.trees) {
			const root = tree.pages[0];
			const note = [tree.description, `${INDEX_NOTE[index.lang]}: ${tree.llmsUrl}`]
				.filter(Boolean)
				.join('. ');
			lines.push(llmsEntry(tree.title, root ? root.markdownUrl : tree.llmsUrl, note));
		}
		lines.push('');
	}
	return lines.join('\n');
}

function renderTree(index: MachineIndex, tree: IndexedTree): string {
	const lines = [`# ${tree.title}`, ''];
	if (tree.description) lines.push(`> ${tree.description}`, '');
	for (const group of tree.groups) {
		lines.push(`## ${group.label ?? PAGES[index.lang]}`, '');
		for (const page of group.pages) lines.push(llmsEntry(page.title, page.markdownUrl, page.description));
		lines.push('');
	}
	return lines.join('\n');
}

export const getStaticPaths = (async () => {
	const paths: { params: { lang: Lang; path: string }; props: { tree?: string } }[] = [];
	for (const lang of LANGS) {
		const index = await getMachineIndex(lang);
		paths.push({ params: { lang, path: index.docsBase }, props: {} });
		for (const tree of index.trees) {
			paths.push({ params: { lang, path: `${index.docsBase}/${tree.path}` }, props: { tree: tree.id } });
		}
	}
	return paths;
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params, props }) => {
	const index = await getMachineIndex(params.lang as Lang);
	const treeId = (props as { tree?: string }).tree;
	const tree = treeId ? index.trees.find((t) => t.id === treeId) : undefined;
	const body = tree ? renderTree(index, tree) : renderRoot(index);
	return new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
