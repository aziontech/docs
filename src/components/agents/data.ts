import raw from '~/data/agent-setup.json'

export type Lang = 'en' | 'pt-br'
export type Localized = string | { en: string; 'pt-br'?: string }

export interface Sample {
	label: Localized
	language: string
	code: string
	fileName?: string
}

export interface Agent {
	slug: string
	name: string
	vendor: string
	mark: 'claude' | 'cursor' | 'copilot' | 'windsurf' | 'codex' | 'gemini' | 'opencode'
	workflows: string[]
	pricing: string
	model: string
	context: string
	openSource: boolean
	docsUrl: string
	contextFile: string
	description: Localized
	install: { body: Localized; samples?: Sample[]; link?: { label: Localized; href: string } }
	connect: { body: Localized; samples?: Sample[]; note?: Localized }
	verify: { body: Localized; samples?: Sample[] }
	tips: { en: string[]; 'pt-br': string[] }
}

export const data = raw as unknown as Omit<typeof raw, 'agents'> & { agents: Agent[] }

export const DOCS_BASE: Record<Lang, string> = { en: 'documentation', 'pt-br': 'documentacao' }

export function t(value: Localized | undefined, lang: Lang): string {
	if (value === undefined) return ''
	if (typeof value === 'string') return value
	return value[lang] ?? value.en
}

export function fill(text: string, vars: Record<string, string>): string {
	return text.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? `{${key}}`)
}

export const agents = data.agents

export function agentBySlug(slug: string): Agent | undefined {
	return agents.find((agent) => agent.slug === slug)
}

export function agentUrl(slug: string, lang: Lang): string {
	return `/${lang}/${DOCS_BASE[lang]}/agent-setup/${slug}/`
}

export function docsUrl(path: string, lang: Lang): string {
	return `/${lang}/${DOCS_BASE[lang]}/${path}`
}

const labels = data.labels as Record<string, Record<string, Localized>>

export function label(group: string, key: string, lang: Lang): string {
	return t(labels[group]?.[key] ?? key, lang)
}

/** The row of tags under an agent's title: workflows, pricing, model, context, and open source when it applies. */
export function agentTags(agent: Agent, lang: Lang): string[] {
	return [
		...agent.workflows.map((w) => label('filters', w, lang)),
		label('values', agent.pricing, lang),
		label('values', agent.model, lang),
		label('values', agent.context, lang),
		...(agent.openSource ? [label('values', 'Open source', lang)] : [])
	]
}

export function agentLinks(agent: Agent, lang: Lang): { label: string; href: string }[] {
	return [
		{ label: label('links', 'mcp', lang), href: docsUrl('devtools/mcp/', lang) },
		{ label: label('links', 'cli', lang), href: docsUrl('devtools/cli/', lang) },
		{ label: fill(label('links', 'docs', lang), { name: agent.name }), href: agent.docsUrl }
	]
}

export function tooltip(key: string, lang: Lang) {
	const entry = (data.tooltips as Record<string, { headline: string; tip: Localized; cta: Localized; href: Localized }>)[key]
	if (!entry) return undefined
	return { headline: entry.headline, tip: t(entry.tip, lang), cta: t(entry.cta, lang), href: t(entry.href, lang) }
}
