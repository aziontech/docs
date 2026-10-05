/**
 * One handler per component the docs use: each turns the component, as written in the MDX,
 * into the plain Markdown that carries the same information. The page's own HTML is
 * untouched; these run only for `/{lang}/{permalink}.md`.
 */
import type { Lang } from '../../data/docs-home/types';
import { platformTopology } from '../../data/platform-topology';
import type { TopologyNode } from '../../data/platform-topology';
import { useCaseCatalog } from '../../data/use-cases';
import type { UseCaseSolutionId } from '../../data/use-cases';

import {
	asBlocks,
	attr,
	block,
	blockquote,
	childElements,
	code,
	heading,
	image,
	inlineCode,
	isElement,
	label,
	link,
	list,
	listItem,
	paragraph,
	plainText,
	str,
	strong,
	table,
	text,
	toPhrasing,
	type MdNode,
} from './nodes';

export interface TwinGroup {
	heading: string;
	items: { label: string; href: string; description?: string }[];
}

export interface PricingProps {
	lang?: string;
	coin?: string;
	metric_slug: string;
	product_slug: string;
}

/** Build-time data some components render that is not in the MDX. The route supplies it. */
export interface TwinData {
	/** The guides catalog, grouped as the page shows it. */
	guides?: (lang: Lang) => Promise<TwinGroup[]>;
	/** The rows `TablePricing` renders: one per tier, prices in billing-column order. */
	pricing?: (props: PricingProps) => Promise<{ tier: string; prices: string[] }[]>;
}

export interface Context {
	lang: Lang;
	/** `tab.KEY` labels from every tab strip on the page, keyed `store:KEY` by the strip's
	 * `sharedStore`: a panels-only block reads the labels of the store it shares. */
	tabLabels: Map<string, string>;
	/** Points an internal navigation link at its page's twin. */
	twinHref(href: string): string;
	data: TwinData;
	/** Converts child nodes, components included. */
	transform(nodes: MdNode[]): Promise<MdNode[]>;
	/** Parses a Markdown string carried in a prop into block nodes. */
	markdown(source: string): MdNode[];
}

type Handler = (node: MdNode, ctx: Context) => Promise<MdNode[]> | MdNode[];

const TITLES: Record<Lang, Record<string, string>> = {
	en: {
		note: 'Note',
		tip: 'Tip',
		caution: 'Caution',
		warning: 'Warning',
		danger: 'Danger',
		info: 'Info',
		check: 'Check',
	},
	'pt-br': {
		note: 'Nota',
		tip: 'Dica',
		caution: 'Atenção',
		warning: 'Atenção',
		danger: 'Perigo',
		info: 'Informação',
		check: 'Confirmação',
	},
};

/** The labels the tab strips use, for a panel whose page declares no strip for its key. */
const TAB_LABELS: Record<string, string> = {
	console: 'Console',
	api: 'API',
	cli: 'CLI',
	github: 'GitHub',
	apiv3: 'API v3',
	apiv4: 'API v4',
	nameserver: 'Nameserver',
	cname: 'CNAME',
	marketplace: 'Marketplace',
	consoleworkloads: 'Console - Workloads',
	windows: 'Windows',
};

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

export const calloutTitle = (lang: Lang, kind: string): string =>
	(TITLES[lang] ?? TITLES.en)[kind] ?? capitalize(kind);

/** `:::note[Label]` and `<DocCallout>`: a quote headed by its label. */
export const callout = (title: string, body: MdNode[]): MdNode[] => [
	blockquote([label(title), ...asBlocks(body)]),
];

/** The agent pages' mini-markup: `[[key:text]]` opens a tooltip on `text`; keep the text. */
const withoutTooltips = (value: string) => value.replace(/\[\[[^:\]]+:([^\]]+)\]\]/g, '$1');

const slotOf = (node: MdNode) => (isElement(node) ? str(node, 'slot') : undefined);

const fragments = (node: MdNode) => childElements(node).filter((child) => child.name === 'Fragment');

/** Merges converted children into one list: lists of the same kind give up their items, and
 * any other block joins the item before it (or stays ahead of the list when there is none). */
function mergeLists(nodes: MdNode[], ordered: boolean): MdNode[] {
	const before: MdNode[] = [];
	const items: MdNode[] = [];
	for (const node of asBlocks(nodes)) {
		if (node.type === 'list' && Boolean(node.ordered) === ordered) items.push(...(node.children ?? []));
		else if (items.length > 0) {
			const last = items[items.length - 1];
			last.children = [...(last.children ?? []), node];
			last.spread = true;
		} else before.push(node);
	}
	return items.length > 0 ? [...before, list(ordered, items)] : before;
}

/** A card or item: `[title](href.md): description`, or `**title**: description` without a link. */
async function entry(node: MdNode, ctx: Context): Promise<MdNode[]> {
	const title = str(node, 'title') ?? '';
	const href = str(node, 'href');
	// Named slots (the agent cards' icon) are decoration; the default slot is the copy.
	const copy = toPhrasing(
		await ctx.transform((node.children ?? []).filter((child) => !slotOf(child)))
	);
	const description = copy.length > 0 ? copy : [text(str(node, 'label') ?? '')];
	const head = href ? link(ctx.twinHref(href), [text(title)]) : strong([text(title)]);
	const line = plainText(description) ? [head, text(': '), ...description] : [head];
	return [list(false, [listItem([paragraph(line)])])];
}

/** A container of cards or items: one bullet list, whatever mix of entries and includes it holds. */
async function entries(node: MdNode, ctx: Context): Promise<MdNode[]> {
	return mergeLists(await ctx.transform(node.children ?? []), false);
}

function sample(heading: string, language: string | undefined, value: string): MdNode[] {
	return [label(heading), code(language, value)];
}

interface Sample {
	label?: string;
	fileName?: string;
	language?: string;
	code: string;
}

const samples = (items: Sample[] = []) =>
	items.flatMap((item) => sample(item.fileName ?? item.label ?? '', item.language, item.code));

function topologyNode(node: TopologyNode, referenceLabel: string, ctx: Context): MdNode[] {
	const line: MdNode[] = [strong([text(node.kind)])];
	if (node.tag) line.push(text(` (${node.tag.label})`));
	line.push(text(`: ${node.role}.`));
	if (node.items?.length) {
		line.push(text(' '));
		node.items.forEach((item, index) => {
			if (index > 0) line.push(text(', '));
			line.push(link(ctx.twinHref(item.href), [text(item.label)]));
		});
		line.push(text('.'));
	}
	if (node.examples?.length) line.push(text(` ${node.examples.join(', ')}.`));
	if (node.href) line.push(text(' '), link(ctx.twinHref(node.href), [text(referenceLabel)]), text('.'));
	return [paragraph(line)];
}

const unwrap: Handler = (node, ctx) => ctx.transform(node.children ?? []);

export const handlers: Record<string, Handler> = {
	// --- Steps, tabs, callouts --------------------------------------------------------------
	async DocSteps(node, ctx) {
		// Each DocStep converts to a one-item ordered list, including steps an include holds.
		return mergeLists(await ctx.transform(node.children ?? []), true);
	},
	async DocStep(node, ctx) {
		const body = asBlocks(await ctx.transform(node.children ?? []));
		return [list(true, [listItem([label(str(node, 'title') ?? ''), ...body])])];
	},
	async Tabs(node, ctx) {
		const own = new Map<string, string>();
		for (const fragment of fragments(node)) {
			const slot = str(fragment, 'slot') ?? '';
			if (slot.startsWith('tab.')) own.set(slot.slice(4), plainText(fragment));
		}
		const store = str(node, 'sharedStore');
		const out: MdNode[] = [];
		// A strip with no panels only selects the interface; it carries no content.
		for (const fragment of fragments(node)) {
			const slot = str(fragment, 'slot') ?? '';
			if (!slot.startsWith('panel.')) continue;
			const key = slot.slice(6);
			const shared = store ? ctx.tabLabels.get(`${store}:${key}`) : undefined;
			const title = own.get(key) ?? shared ?? TAB_LABELS[key] ?? key;
			out.push(label(title), ...asBlocks(await ctx.transform(fragment.children ?? [])));
		}
		return out;
	},
	async DocCallout(node, ctx) {
		const body = await ctx.transform(node.children ?? []);
		const fallback = str(node, 'label');
		return callout(
			calloutTitle(ctx.lang, str(node, 'kind') ?? 'note'),
			body.length > 0 ? body : fallback ? [paragraph([text(fallback)])] : []
		);
	},

	// --- Navigation ------------------------------------------------------------------------
	DocCardGroup: entries,
	ItemList: entries,
	FrameBox: unwrap,
	DocCard: entry,
	DocItem: entry,
	DocButton(node) {
		const href = str(node, 'href') ?? '';
		return block(node, [link(href, [text(str(node, 'label') ?? href)])]);
	},
	AgentMark: () => [],

	// --- Code and inline labels ------------------------------------------------------------
	Code(node) {
		const value = String(attr(node, 'code') ?? '');
		// The same normalization CodeBlock.vue applies before rendering.
		return [code(str(node, 'lang'), value.replace(/^\n+/, '').replace(/\s+$/, ''))];
	},
	// `Code` is how pages import CodeBlock.vue.
	CodeBlock(node, ctx) {
		return handlers.Code(node, ctx);
	},
	async DocPrompt(node) {
		const title = str(node, 'title');
		return [...(title ? [label(title)] : []), code('text', plainText(node))];
	},
	async Tag(node, ctx) {
		const value = str(node, 'value');
		const content = value ? [text(value)] : toPhrasing(await ctx.transform(node.children ?? []));
		return block(node, [strong(content)]);
	},

	// --- Media and showcases ---------------------------------------------------------------
	async TemplateShowcase(node, ctx) {
		const out: MdNode[] = [];
		const description = str(node, 'description');
		if (description) out.push(paragraph([text(description)]));
		const src = str(node, 'image');
		if (src) out.push(paragraph([image(src, str(node, 'imageAlt') ?? '')]));
		const buttons = (attr(node, 'buttons') as { label: string; link: string }[] | undefined) ?? [];
		if (buttons.length > 0)
			out.push(
				list(
					false,
					buttons.map((button) => listItem([paragraph([link(button.link, [text(button.label)])])]))
				)
			);
		for (const fragment of fragments(node))
			out.push(...asBlocks(await ctx.transform(fragment.children ?? [])));
		return out;
	},
	Video(node) {
		const src = str(node, 'src') ?? '';
		const id = src.match(/youtube\.com\/embed\/([\w-]+)/)?.[1];
		const url = id ? `https://www.youtube.com/watch?v=${id}` : src;
		const description = str(node, 'description');
		return [
			paragraph([link(url, [text(str(node, 'title') ?? url)])]),
			...(description ? [paragraph([text(description)])] : []),
		];
	},

	// --- Agent setup -----------------------------------------------------------------------
	AgentFaq(node, ctx) {
		const items = (attr(node, 'items') as { question: string; answer: string }[]) ?? [];
		return items.flatMap((item) => [
			label(item.question),
			...ctx.markdown(withoutTooltips(item.answer)),
		]);
	},
	AgentQuickStart(node, ctx) {
		const tryIt = str(node, 'tryIt') ?? 'Try it';
		const steps =
			(attr(node, 'steps') as {
				title: string;
				body?: string;
				samples?: Sample[];
				link?: { label: string; href: string };
				note?: string;
				prompt?: string;
			}[]) ?? [];
		return [
			list(
				true,
				steps.map((step) =>
					listItem([
						label(step.title),
						...(step.body ? ctx.markdown(withoutTooltips(step.body)) : []),
						...samples(step.samples),
						...(step.link ? [paragraph([link(step.link.href, [text(step.link.label)])])] : []),
						...(step.note ? ctx.markdown(withoutTooltips(step.note)) : []),
						...(step.prompt ? sample(tryIt, 'text', step.prompt) : []),
					])
				)
			),
		];
	},
	AgentSamples(node) {
		return samples(attr(node, 'samples') as Sample[]);
	},
	AgentToolsTable(node, ctx) {
		const columns = attr(node, 'columns') as { tool: string; what: string };
		const tools = (attr(node, 'tools') as { id: string; description: string }[]) ?? [];
		return [
			table(
				[[text(columns.tool)], [text(columns.what)]],
				tools.map((tool) => [[inlineCode(tool.id)], toPhrasing(ctx.markdown(tool.description))])
			),
		];
	},
	AgentCompareTable(node, ctx) {
		const columns = attr(node, 'columns') as Record<string, string>;
		const rows = (attr(node, 'rows') as Record<string, unknown>[]) ?? [];
		const yes = str(node, 'yes') ?? 'Yes';
		const no = str(node, 'no') ?? 'No';
		const keys = Object.keys(columns);
		return [
			table(
				keys.map((key) => [text(columns[key])]),
				rows.map((row) =>
					keys.map((key) => {
						if (key === 'agent')
							return [link(ctx.twinHref(String(row.href)), [text(String(row.name))])];
						const value = row[key];
						if (typeof value === 'boolean') return [text(value ? yes : no)];
						return [text(value === undefined ? '' : String(value))];
					})
				)
			),
		];
	},
	AgentPicker(node, ctx) {
		const agents =
			(attr(node, 'agents') as {
				name: string;
				vendor: string;
				href: string;
				description: string;
				workflows: string[];
			}[]) ?? [];
		return [
			list(
				false,
				agents.map((agent) =>
					listItem([
						paragraph([
							link(ctx.twinHref(agent.href), [text(agent.name)]),
							text(` (${[agent.vendor, ...agent.workflows].join(', ')}): ${agent.description}`),
						]),
					])
				)
			),
		];
	},

	// --- Components that render data -------------------------------------------------------
	UseCaseList(node, ctx) {
		const lang = (str(node, 'lang') as Lang | undefined) ?? ctx.lang;
		const solution = str(node, 'solution') as UseCaseSolutionId;
		const featured = attr(node, 'featured') !== false;
		const shown = useCaseCatalog[lang].useCases.filter(
			(useCase) => useCase.solution === solution && (!featured || useCase.featured)
		);
		return [
			list(
				false,
				shown.map((useCase) =>
					listItem([
						paragraph([
							useCase.href
								? link(ctx.twinHref(useCase.href), [text(useCase.title)])
								: text(useCase.title),
						]),
					])
				)
			),
		];
	},
	PlatformTopology(node, ctx) {
		const lang = (str(node, 'lang') as Lang | undefined) ?? ctx.lang;
		const { columns, referenceLabel } = platformTopology[lang];
		return [
			list(
				true,
				columns.map((column) =>
					listItem(column.flatMap((item) => topologyNode(item, referenceLabel, ctx)))
				)
			),
		];
	},
	async GuidesHomeSection(node, ctx) {
		const out = asBlocks(await ctx.transform(node.children ?? []));
		const groups = (await ctx.data.guides?.(ctx.lang)) ?? [];
		for (const group of groups) {
			out.push(heading(2, [text(group.heading)]));
			out.push(
				list(
					false,
					group.items.map((item) =>
						listItem([
							paragraph([
								link(ctx.twinHref(item.href), [text(item.label)]),
								...(item.description ? [text(`: ${item.description}`)] : []),
							]),
						])
					)
				)
			);
		}
		return out;
	},
	PricingTable(node) {
		const columns = (attr(node, 'columns') as string[]) ?? [];
		const rows = (attr(node, 'rows') as { tier: string; prices: string[] }[]) ?? [];
		return [pricingTable(str(node, 'metric') ?? '', columns, rows)];
	},
	async TablePricing(node, ctx) {
		const rows =
			(await ctx.data.pricing?.({
				// Absent props keep pricingRows' own defaults, as on the page.
				lang: str(node, 'lang'),
				coin: str(node, 'coin'),
				metric_slug: str(node, 'metric_slug') ?? '',
				product_slug: str(node, 'product_slug') ?? '',
			})) ?? [];
		const columns = (attr(node, 'billing') as string[]) ?? [];
		return [pricingTable(str(node, 'metric') ?? '', columns, rows)];
	},
	Fragment: unwrap,
};

function pricingTable(
	metric: string,
	columns: string[],
	rows: { tier: string; prices: string[] }[]
): MdNode {
	return table(
		[[text(metric)], ...columns.map((column) => [text(column)])],
		rows.map((row) => [[text(row.tier)], ...row.prices.map((price) => [text(price)])])
	);
}
