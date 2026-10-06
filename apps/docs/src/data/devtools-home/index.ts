import { docsHome } from '~/data/docs-home';
import type { Lang } from '~/data/docs-home/types';
import type { HubGroup } from '~/nav/resolve';

import { en } from './en';
import { ptBr } from './pt-br';
import type { DevtoolsHomeContent } from './types';

export type { DevtoolsHomeContent, ToolCard } from './types';

export const DEVTOOLS_HOME_NAMESPACE = 'documentation_dev_tools_home';

export const devtoolsHome: Record<Lang, DevtoolsHomeContent> = {
	en,
	'pt-br': ptBr,
};

/** The documentation home's setup prompt and its labels, so both homes copy the same text. */
export function homePrompt(lang: Lang) {
	const { prompt, promptLabel, promptCopiedLabel, promptTooltip, note } = docsHome[lang].hero;
	return {
		prompt,
		label: promptLabel,
		copiedLabel: promptCopiedLabel,
		tooltip: promptTooltip,
		note,
	};
}

/** Plain markdown of the page for `/{lang}/{permalink}.md`; the route writes the title line. */
export function devtoolsHomeMarkdown(lang: Lang, groups: HubGroup[]): string {
	const { hero, promptPreview, tools } = devtoolsHome[lang];
	const { prompt, note } = homePrompt(lang);
	const tool = (item: HubGroup['items'][number]) =>
		item.description
			? `- [${item.label}](${item.href}): ${item.description}`
			: `- [${item.label}](${item.href})`;
	const footer = tools.footer.links.map((link) => `[${link.label}](${link.href})`).join(', ');

	return [
		hero.description,
		`[${hero.buttonLabel}](${hero.buttonLink})`,
		`## ${promptPreview.title}`,
		note,
		['```text', prompt, '```'].join('\n'),
		`## ${tools.heading.text}`,
		tools.intro,
		...groups.map((group) => [`### ${group.label}`, '', ...group.items.map(tool)].join('\n')),
		`${tools.footer.prefix} ${footer}`,
	].join('\n\n');
}
