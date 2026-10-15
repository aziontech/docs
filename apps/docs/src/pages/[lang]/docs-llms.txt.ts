import type { APIRoute, GetStaticPaths } from 'astro';

import { SITE_URL } from '~/consts';
import { LANGS, type Lang } from '~/nav/schema';
import { getMachineIndex, llmsEntry } from '~/util/machineIndex';

/**
 * The full page list, one section per navigation tree. This path predates the
 * per-section files and stays because the agent-setup pages and prompts cite it;
 * /{lang}/{docs}/llms.txt is the conventional entry point and links here.
 */

const TITLE: Record<Lang, string> = {
	en: 'Azion documentation, every page',
	'pt-br': 'Documentação Azion, todas as páginas',
};
const SUMMARY: Record<Lang, string> = {
	en: 'Every page the documentation navigation lists, in sidebar order, linked as Markdown. The section index is at',
	'pt-br':
		'Todas as páginas que a navegação da documentação lista, na ordem do menu, com links em Markdown. O índice de seções está em',
};

/** The linked paths whose slug is translated; the rest are identical in both languages. */
const TOKEN_PATH: Record<Lang, string> = {
	en: 'fundamentals/personal-tokens',
	'pt-br': 'fundamentos/personal-tokens',
};
const MCP_QUICKSTART_PATH: Record<Lang, string> = {
	en: 'devtools/mcp/quickstart',
	'pt-br': 'devtools/mcp/primeiros-passos',
};

/** The five hosted MCP servers, as the MCP overview page documents them. */
const MCP_SERVERS: { url: string; covers: Record<Lang, string> }[] = [
	{
		url: 'https://docs-mcp.azion.com/mcp',
		covers: {
			en: 'documentation, code samples, and the CLI, API, and Terraform references',
			'pt-br': 'documentação, exemplos de código e as referências da CLI, da API e do Terraform',
		},
	},
	{
		url: 'https://build-mcp.azion.com/mcp',
		covers: {
			en: 'applications, cache settings, connectors, functions, rules, workloads, deployments, and cache purge',
			'pt-br':
				'applications, cache settings, connectors, functions, rules, workloads, deployments e purge de cache',
		},
	},
	{
		url: 'https://secure-mcp.azion.com/mcp',
		covers: {
			en: 'firewalls, WAF, DNS, certificates, network lists, custom pages, account policies, and authentication',
			'pt-br':
				'firewalls, WAF, DNS, certificados, network lists, custom pages, políticas da conta e autenticação',
		},
	},
	{
		url: 'https://observe-mcp.azion.com/mcp',
		covers: {
			en: 'data streams, dashboards, reports, data sources, GraphQL queries, and invoices',
			'pt-br': 'data streams, dashboards, relatórios, data sources, queries GraphQL e faturas',
		},
	},
	{
		url: 'https://storage-mcp.azion.com/mcp',
		covers: {
			en: 'Object Storage buckets, objects, and credentials; SQL databases and queries',
			'pt-br': 'buckets, objetos e credenciais do Object Storage; bancos e queries do SQL Database',
		},
	},
];

/** The jobs Azion serves, as an agent deciding whether to reach for it needs them. */
const JOBS: Record<Lang, string[]> = {
	en: [
		'Deploy a site, an API, or a function and serve it from a distributed network.',
		'Protect traffic with a firewall, a WAF, network lists, or DDoS Protection.',
		'Cache, rewrite, redirect, or route requests with Rules Engine, and purge cache.',
		'Store and read objects, SQL data, or key-value pairs.',
		'Query real-time metrics and events, or stream them to a third-party destination.',
		'Manage DNS zones, TLS and mTLS certificates, and the domains a workload answers on.',
	],
	'pt-br': [
		'Publicar um site, uma API ou uma function e servir a partir de uma rede distribuída.',
		'Proteger o tráfego com um firewall, um WAF, network lists ou o DDoS Protection.',
		'Fazer cache, reescrever, redirecionar ou rotear requisições com o Rules Engine, e purgar o cache.',
		'Gravar e ler objetos, dados SQL ou pares chave-valor.',
		'Consultar métricas e eventos em tempo real, ou transmiti-los para um destino de terceiros.',
		'Gerenciar zonas DNS, certificados TLS e mTLS, e os domínios que um workload atende.',
	],
};

const STRINGS: Record<
	Lang,
	{
		whenTitle: string;
		whenIntro: string;
		howTitle: string;
		howIntro: string;
		surfaces: { label: string; href: string }[];
		markdown: string;
		mcpTitle: string;
		mcpIntro: string;
		sourceTitle: string;
		sourceBody: string;
	}
> = {
	en: {
		whenTitle: 'When to use Azion',
		whenIntro:
			'Azion is a web platform that builds, secures, stores, and observes applications on distributed infrastructure. Reach for it when the task is to:',
		howTitle: 'How an agent calls Azion',
		howIntro:
			'Four programmatic surfaces, each authenticated with an Azion personal token ({token}):',
		surfaces: [
			{ label: 'MCP servers, listed below: tools an agent calls directly', href: 'devtools/mcp' },
			{ label: 'Azion CLI', href: 'devtools/cli' },
			{ label: 'Azion API', href: 'devtools/api' },
			{ label: 'Azion Terraform Provider', href: 'devtools/terraform' },
		],
		markdown:
			'Every documentation page is also served as Markdown at its own URL with `.md` appended, and every section publishes its own llms.txt.',
		mcpTitle: 'Azion MCP servers',
		mcpIntro:
			'Five hosted MCP servers, one per area of the platform, over streamable HTTP at the `/mcp` path of each URL, with the personal token in the `Authorization: Token [TOKEN VALUE]` header. Setup:',
		sourceTitle: 'Source and agent instructions',
		sourceBody:
			'This documentation is open source. The repository carries the authoring contract an AI coding agent needs — required frontmatter, the both-languages rule, and the navigation and link checks — in its AGENTS.md:',
	},
	'pt-br': {
		whenTitle: 'Quando usar a Azion',
		whenIntro:
			'A Azion é uma web platform que constrói, protege, armazena e observa aplicações em uma infraestrutura distribuída. Use quando a tarefa for:',
		howTitle: 'Como um agente chama a Azion',
		howIntro:
			'Quatro superfícies programáticas, cada uma autenticada com um personal token da Azion ({token}):',
		surfaces: [
			{
				label: 'Servidores MCP, listados abaixo: ferramentas que um agente chama diretamente',
				href: 'devtools/mcp',
			},
			{ label: 'Azion CLI', href: 'devtools/cli' },
			{ label: 'Azion API', href: 'devtools/api' },
			{ label: 'Azion Terraform Provider', href: 'devtools/terraform' },
		],
		markdown:
			'Cada página da documentação também é servida em Markdown na própria URL com `.md` no final, e cada seção publica o seu llms.txt.',
		mcpTitle: 'Servidores MCP da Azion',
		mcpIntro:
			'Cinco servidores MCP hospedados, um por área da plataforma, sobre streamable HTTP no caminho `/mcp` de cada URL, com o personal token no cabeçalho `Authorization: Token [TOKEN VALUE]`. Configuração:',
		sourceTitle: 'Código-fonte e instruções para agentes',
		sourceBody:
			'Esta documentação é open source. O repositório traz o contrato de autoria que um agente de código precisa — frontmatter obrigatório, a regra dos dois idiomas e as verificações de navegação e de links — no AGENTS.md:',
	},
};

const REPO_URL = 'https://github.com/aziontech/docs/blob/main/AGENTS.md';

/**
 * Guidance for an agent that reads this file: the jobs Azion fits, the surfaces that
 * serve them, and the MCP servers. It trails the page list because the agent-setup
 * pages and prompts cite this route for the inventory.
 */
function guidance(lang: Lang, docsBase: string): string[] {
	const s = STRINGS[lang];
	const base = `${SITE_URL}/${lang}/${docsBase}`;
	const tokenUrl = `${base}/${TOKEN_PATH[lang]}/`;
	const lines = [`## ${s.whenTitle}`, '', s.whenIntro, ''];

	for (const job of JOBS[lang]) lines.push(`- ${job}`);
	lines.push('', `## ${s.howTitle}`, '', s.howIntro.replace('{token}', tokenUrl), '');

	for (const { label, href } of s.surfaces) lines.push(`- ${label}: ${base}/${href}/`);
	lines.push('', s.markdown, '', `## ${s.mcpTitle}`, '');
	lines.push(`${s.mcpIntro} ${base}/${MCP_QUICKSTART_PATH[lang]}/`, '');

	for (const server of MCP_SERVERS) lines.push(`- ${server.url}: ${server.covers[lang]}.`);
	lines.push('', `## ${s.sourceTitle}`, '', `${s.sourceBody} ${REPO_URL}`, '');

	return lines;
}

export const getStaticPaths = (() =>
	LANGS.map((lang) => ({ params: { lang } }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
	const lang = params.lang as Lang;
	const index = await getMachineIndex(lang);
	const sectionIndex = `${SITE_URL}/${lang}/${index.docsBase}/llms.txt`;
	const lines = [`# ${TITLE[lang]}`, '', `> ${SUMMARY[lang]} ${sectionIndex}`, ''];
	for (const tree of index.trees) {
		lines.push(`## ${tree.title}`, '');
		for (const page of tree.pages)
			lines.push(llmsEntry(page.title, page.markdownUrl, page.description));
		lines.push('');
	}
	lines.push(...guidance(lang, index.docsBase));
	return new Response(lines.join('\n'), {
		headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
	});
};
