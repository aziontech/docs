import raw from '~/data/agent-setup.json';
import { text } from '~/nav/resolve';
import type { Lang } from '~/nav/schema';

import type { Agent, AgentSetup, Localized, Sample } from './schema';

export type { Agent, Lang, Localized, Sample };

// server.ts parses this file against `agentSetup` on every build; the islands read it under that type.
export const data = raw as AgentSetup;

export const agents = data.agents;

export function t(value: Localized | undefined, lang: Lang): string {
	if (value === undefined) return '';
	if (typeof value === 'string') return value;
	return text(value, lang) ?? '';
}

export function fill(text: string, vars: Record<string, string>): string {
	return text.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? `{${key}}`);
}

export function agentBySlug(slug: string): Agent | undefined {
	return agents.find((agent) => agent.slug === slug);
}

type LabelGroup = 'filters' | 'values' | 'columns' | 'links';

export function label(group: LabelGroup, key: string, lang: Lang): string {
	return t(data.labels[group][key] ?? key, lang);
}

export function agentTags(agent: Agent, lang: Lang): string[] {
	return [
		...agent.workflows.map((w) => label('filters', w, lang)),
		label('values', agent.pricing, lang),
		label('values', agent.model, lang),
		label('values', agent.context, lang),
		...(agent.openSource ? [label('values', 'Open source', lang)] : []),
	];
}

export interface AgentLink {
	label: string;
	href: string;
}

export function agentLinks(
	agent: Agent,
	lang: Lang,
	hrefs: { mcp?: string; cli?: string }
): AgentLink[] {
	return [
		{ label: label('links', 'mcp', lang), href: hrefs.mcp },
		{ label: label('links', 'cli', lang), href: hrefs.cli },
		{ label: fill(label('links', 'docs', lang), { name: agent.name }), href: agent.docsUrl },
	].filter((link): link is AgentLink => Boolean(link.href));
}

export function tooltip(key: string, lang: Lang) {
	const entry = data.tooltips[key];
	if (!entry) return undefined;
	return {
		headline: entry.headline,
		tip: t(entry.tip, lang),
		cta: t(entry.cta, lang),
		href: t(entry.href, lang),
	};
}
