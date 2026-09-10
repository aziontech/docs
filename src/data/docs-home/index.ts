import { en } from './en';
import { ptBr } from './pt-br';
import type { DocsHomeContent, Lang, Section } from './types';

export type { Card, DocLink, DocsHomeContent, Heading, Lang, Section } from './types';

export const docsHome: Record<Lang, DocsHomeContent> = {
	en,
	'pt-br': ptBr,
};

export const docsHomeLangs = Object.keys(docsHome) as Lang[];

function cardLines(section: Pick<Section, 'cards'>): string {
	return section.cards
		.map((card) => (card.body ? `- [${card.title}](${card.href}): ${card.body}` : `- [${card.title}](${card.href})`))
		.join('\n');
}

function footerLine(section: Section): string {
	if (!section.footer) return '';
	const links = section.footer.links.map((link) => `[${link.label}](${link.href})`).join(', ');
	return `\n\n${section.footer.prefix} ${links}`;
}

/**
 * Plain-markdown rendering of the page, for `/{lang}/{permalink}.md` and for
 * the body field in `doc-all-data.json`. The MDX body used to be served raw —
 * JSX imports and all — so this is the same content minus the markup noise.
 */
export function docsHomeMarkdown(content: DocsHomeContent): string {
	const { hero, interfaceSection: intro } = content;

	const head = [`${hero.title}`, '', hero.description].join('\n');

	const first = [
		`## ${intro.heading.text}`,
		'',
		intro.intro,
		'',
		`### ${intro.agent.title}`,
		'',
		intro.agent.body,
		'',
		cardLines(intro),
	].join('\n');

	const rest = content.sections
		.map((section) =>
			[`## ${section.heading.text}`, '', section.intro, '', cardLines(section)].join('\n') + footerLine(section),
		)
		.join('\n\n');

	return [head, first, rest].join('\n\n');
}

/** A stand-in for the collection entry the docs home used to be. */
// Every docs endpoint still derives its output from the `docs` collection, so each
// concatenates these entries to keep the home in the search index, llms.txt,
// canonicals, path map and sitemap.
export interface DocsHomeEntry {
	id: string;
	collection: 'docs';
	filePath: string;
	body: string;
	data: DocsHomeContent['meta'];
}

export const docsHomeEntries: DocsHomeEntry[] = docsHomeLangs.map((lang) => ({
	id: docsHome[lang].id,
	collection: 'docs',
	filePath: docsHome[lang].filePath,
	body: docsHomeMarkdown(docsHome[lang]),
	data: docsHome[lang].meta,
}));

/** The same entries keyed by language, for the endpoints that group by lang. */
export const docsHomeEntryByLang = Object.fromEntries(
	docsHomeEntries.map((entry) => [entry.id.split('/')[0] as Lang, entry]),
) as Record<Lang, DocsHomeEntry>;

/**
 * Appends the docs home entries to a list of collection entries already
 * grouped by language, so an endpoint keeps one call site instead of two.
 */
export function withDocsHome<T>(grouped: Record<string, T[]>): Record<string, T[]> {
	const merged: Record<string, T[]> = { ...grouped };
	for (const lang of docsHomeLangs) {
		merged[lang] = [...(merged[lang] ?? []), docsHomeEntryByLang[lang] as unknown as T];
	}
	return merged;
}
