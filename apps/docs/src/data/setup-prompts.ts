import type { Lang } from './docs-home/types';

/** A setup prompt a page offers: the block's copy, the prompt, and the labels of its controls. */
export interface SetupPrompt {
	title: string;
	body: string;
	prompt: string;
	label: string;
	copiedLabel: string;
	tooltip: string;
	preview: {
		label: string;
		hideLabel: string;
		title: string;
		copyLabel: string;
		copiedLabel: string;
	};
	guided: {
		label: string;
		href: string;
	};
}

/** Keys a page passes to `SetupPromptBlock`. */
export type SetupPromptKey = 'mcp';

const SERVERS =
	'build (https://build-mcp.azion.com/mcp), secure (https://secure-mcp.azion.com/mcp), observe (https://observe-mcp.azion.com/mcp), storage (https://storage-mcp.azion.com/mcp)';

export const setupPrompts: Record<SetupPromptKey, Record<Lang, SetupPrompt>> = {
	mcp: {
		en: {
			title: 'Set up the Azion MCP servers with one prompt',
			body: 'One prompt has your coding agent ask for a personal token, add the docs server, and add the build, secure, observe, and storage servers you choose, with a dry_run preview before every write.',
			prompt: `Connect this coding agent to the Azion MCP servers. Do the following: 1. Ask me for an Azion personal token (created in Azion Console > Account > Personal Token). Never write it to a file I commit. 2. Add the docs server https://docs-mcp.azion.com/mcp over HTTP, with the header Authorization: Token <personal token>. Per-client setup: https://www.azion.com/en/documentation/agent-setup/ 3. Ask which of these I need and add them the same way: ${SERVERS}. These four change my account, so preview every write with dry_run first. 4. List the tools of each connected server to confirm the connection, then ask me what I am building.`,
			label: 'Copy prompt',
			copiedLabel: 'Prompt copied!',
			tooltip: 'Copies a prompt that connects your coding agent to the Azion MCP servers',
			preview: {
				label: 'Show prompt',
				hideLabel: 'Hide prompt',
				title: 'Setup prompt',
				copyLabel: 'Copy prompt',
				copiedLabel: 'Prompt copied',
			},
			guided: {
				label: 'Agent setup',
				href: '/en/documentation/agent-setup/',
			},
		},
		'pt-br': {
			title: 'Configure os MCP servers da Azion com um prompt',
			body: 'Um prompt faz seu agente de código pedir um personal token, adicionar o servidor de docs e adicionar os servidores de build, secure, observe e storage que você escolher, com uma prévia de dry_run antes de cada escrita.',
			prompt: `Conecte este agente de código aos MCP servers da Azion. Faça o seguinte: 1. Peça meu personal token da Azion (criado no Azion Console > Account > Personal Token). Nunca grave o token em um arquivo que eu faça commit. 2. Adicione o servidor de docs https://docs-mcp.azion.com/mcp por HTTP, com o cabeçalho Authorization: Token <personal token>. Configuração por cliente: https://www.azion.com/pt-br/documentacao/agent-setup/ 3. Pergunte quais destes eu preciso e adicione-os da mesma forma: ${SERVERS}. Esses quatro alteram minha conta, então faça uma prévia de cada escrita com dry_run antes. 4. Liste as ferramentas de cada servidor conectado para confirmar a conexão e, depois, pergunte o que estou construindo.`,
			label: 'Copiar prompt',
			copiedLabel: 'Prompt copiado!',
			tooltip: 'Copia um prompt que conecta seu agente de código aos MCP servers da Azion',
			preview: {
				label: 'Ver prompt',
				hideLabel: 'Ocultar prompt',
				title: 'Prompt de configuração',
				copyLabel: 'Copiar prompt',
				copiedLabel: 'Prompt copiado',
			},
			guided: {
				label: 'Configurar agente',
				href: '/pt-br/documentacao/agent-setup/',
			},
		},
	},
};
