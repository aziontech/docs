import raw from '~/data/agent-setup.json';
import { getLastChange, getPageFacts, getPageHref, getTreeHref, type Lang } from '~/nav/index';

import { agents } from './data';
import { agentSetup } from './schema';

// Every agent page renders through a wrapper that imports this module, so a JSON that drifts from the schema fails the build.
agentSetup.parse(raw);

/** Each agent's page, by slug, as the navigation resolves it for `lang`. */
export async function agentHrefs(lang: Lang): Promise<Record<string, string>> {
	const hrefs: Record<string, string> = {};
	for (const agent of agents) {
		const href = await getPageHref(agent.namespace, lang);
		if (href) hrefs[agent.slug] = href;
	}
	return hrefs;
}

export async function agentPageUpdated(pathname: string, lang: Lang): Promise<string | undefined> {
	const dates = [
		(await getPageFacts(pathname, lang))?.updated,
		getLastChange('src/data/agent-setup.json'),
	].filter((date): date is string => Boolean(date));
	if (!dates.length) return undefined;
	return dates
		.sort((a, b) => Date.parse(a) - Date.parse(b))
		.pop()
		?.slice(0, 10);
}

/** The landing pages the agent header links to, as the navigation resolves them for `lang`. */
export async function toolHrefs(lang: Lang): Promise<{ mcp?: string; cli?: string }> {
	return { mcp: await getTreeHref('mcp', lang), cli: await getTreeHref('cli', lang) };
}
