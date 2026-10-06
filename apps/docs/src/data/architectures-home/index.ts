import type { Lang } from '~/data/docs-home/types';
import type { HubGroup } from '~/nav/resolve';

import { en } from './en';
import { ptBr } from './pt-br';
import type { ArchitecturesHomeContent } from './types';

export type { ArchitecturesHomeContent } from './types';

export const ARCHITECTURES_HOME_NAMESPACE = 'documentation_architectures';

export const architecturesHome: Record<Lang, ArchitecturesHomeContent> = {
	en,
	'pt-br': ptBr,
};

/** Plain markdown of the page for `/{lang}/{permalink}.md`; the route writes the title line. */
export function architecturesHomeMarkdown(lang: Lang, groups: HubGroup[]): string {
	const { hero, directory } = architecturesHome[lang];
	const entry = (item: HubGroup['items'][number]) =>
		item.description
			? `- [${item.label}](${item.href}): ${item.description}`
			: `- [${item.label}](${item.href})`;
	const footer = directory.footer.links.map((link) => `[${link.label}](${link.href})`).join(', ');

	return [
		hero.description,
		`## ${directory.heading.text}`,
		directory.intro,
		...groups.map((group) => [`### ${group.label}`, '', ...group.items.map(entry)].join('\n')),
		`${directory.footer.prefix} ${footer}`,
	].join('\n\n');
}
