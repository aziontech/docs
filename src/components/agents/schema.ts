import { z } from 'astro/zod'

import { SAFE_HREF } from './inline'

const localized = z.union([z.string(), z.object({ en: z.string(), 'pt-br': z.string().optional() })])

export type Localized = z.infer<typeof localized>

const href = z.string().regex(SAFE_HREF, 'an href starts with https://, / or #')

const localizedHref = z.union([href, z.object({ en: href, 'pt-br': href.optional() })])

const sample = z.object({
	label: localized,
	language: z.string(),
	code: z.string(),
	fileName: z.string().optional()
})

export type Sample = z.infer<typeof sample>

export const MARKS = ['claude', 'cursor', 'copilot', 'windsurf', 'codex', 'gemini', 'opencode'] as const

const agent = z.object({
	slug: z.string(),
	namespace: z.string(),
	name: z.string(),
	vendor: z.string(),
	mark: z.enum(MARKS),
	workflows: z.array(z.string()),
	pricing: z.string(),
	model: z.string(),
	context: z.string(),
	openSource: z.boolean(),
	docsUrl: href,
	contextFile: z.string(),
	description: localized,
	install: z.object({
		body: localized,
		samples: z.array(sample).optional(),
		link: z.object({ label: localized, href }).optional()
	}),
	connect: z.object({ body: localized, samples: z.array(sample).optional(), note: localized.optional() }),
	verify: z.object({ body: localized, samples: z.array(sample).optional() }),
	tips: z.object({ en: z.array(z.string()), 'pt-br': z.array(z.string()) })
})

export type Agent = z.infer<typeof agent>

const card = z.object({ title: localized, icon: z.string(), description: localized })

const entry = z.object({ question: localized, answer: localized, fallbackNote: localized.optional() })

const labelGroup = z.record(z.string(), localized)

export const agentSetup = z.object({
	mcpUrl: href,
	tokensUrl: href,
	agents: z.array(agent).min(1),
	tools: z.array(z.object({ id: z.string(), description: localized })),
	cli: z.array(sample),
	contextPrimer: z.string(),
	docs: z.array(
		z.object({
			title: localized,
			icon: z.string(),
			href: localizedHref,
			target: z.enum(['_self', '_blank']).optional(),
			description: localized
		})
	),
	primer: localized,
	prompts: z.object({ en: z.array(z.string()).min(2), 'pt-br': z.array(z.string()).min(2) }),
	workflows: z.array(card),
	concepts: z.array(card),
	tradeoffs: z.array(card),
	steps: z.object({
		install: localized,
		token: z.object({ title: localized, body: localized, link: localized }),
		connect: localized,
		verify: localized,
		tryIt: localized
	}),
	tooltips: z.record(z.string(), z.object({ headline: z.string(), tip: localized, cta: localized, href: localizedHref })),
	faq: z.array(entry),
	surface: z.object({ terminal: localized, editor: localized }),
	troubleshooting: z.array(entry),
	labels: z.object({
		filters: labelGroup,
		values: labelGroup,
		columns: labelGroup,
		links: labelGroup,
		yes: localized,
		no: localized,
		madeBy: localized,
		plusAzion: localized
	})
})

export type AgentSetup = z.infer<typeof agentSetup>
