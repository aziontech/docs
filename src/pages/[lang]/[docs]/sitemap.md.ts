import type { APIRoute, GetStaticPaths } from 'astro';

import { DOCS_BASE } from '~/nav/resolve';
import { LANGS, type Lang } from '~/nav/schema';
import { getMachineIndex } from '~/util/machineIndex';

/** sitemap.md at the docs root: one entry per page with the metadata an agent filters
 * on before fetching (type, section, topics, last change, summary), all of it already
 * held by the nav and the frontmatter. */

const LABELS: Record<Lang, Record<string, string>> = {
	en: {
		title: 'Azion documentation sitemap',
		summary:
			'Every documentation page in navigation order. Each entry carries the page type, its section, the products it covers, the date of its last change, and its summary. The URL serves HTML; append .md for Markdown.',
		type: 'type',
		section: 'section',
		topics: 'topics',
		updated: 'updated',
		summaryKey: 'summary',
		markdown: 'markdown',
	},
	'pt-br': {
		title: 'Mapa da documentação Azion',
		summary:
			'Todas as páginas da documentação na ordem da navegação. Cada entrada traz o tipo da página, a seção, os produtos que ela cobre, a data da última alteração e o resumo. A URL serve HTML; acrescente .md para Markdown.',
		type: 'tipo',
		section: 'seção',
		topics: 'tópicos',
		updated: 'atualizado',
		summaryKey: 'resumo',
		markdown: 'markdown',
	},
};

export const getStaticPaths = (() =>
	LANGS.map((lang) => ({ params: { lang, docs: DOCS_BASE[lang] } }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
	const lang = params.lang as Lang;
	const index = await getMachineIndex(lang);
	const l = LABELS[lang];
	const lines = [`# ${l.title}`, '', `> ${l.summary}`, ''];
	for (const tree of index.trees) {
		lines.push(`## ${tree.title}`, '');
		for (const page of tree.pages) {
			lines.push(`- [${page.title.trim()}](${page.url})`);
			if (page.kind) lines.push(`  - ${l.type}: ${page.kind}`);
			lines.push(`  - ${l.section}: ${page.section.join(' > ')}`);
			if (page.topics.length) lines.push(`  - ${l.topics}: ${page.topics.join(', ')}`);
			if (page.updated) lines.push(`  - ${l.updated}: ${page.updated}`);
			if (page.description) lines.push(`  - ${l.summaryKey}: ${page.description.replace(/\s+/g, ' ').trim()}`);
			lines.push(`  - ${l.markdown}: ${page.markdownUrl}`);
		}
		lines.push('');
	}
	return new Response(lines.join('\n'), {
		headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
	});
};
