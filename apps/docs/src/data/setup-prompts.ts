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

export const setupPrompts: Record<SetupPromptKey, Record<Lang, SetupPrompt>> = {
	mcp: {
		en: {
			title: 'Set up the Azion MCP servers with one prompt',
			body: 'One prompt has your coding agent ask for a personal token, add the docs server, and add the build, secure, observe, and storage servers you choose, with a dry_run preview before every write.',
			prompt:
				'Connect this coding agent to the Azion MCP servers. Fetch https://www.azion.com/en/documentation/devtools/mcp/prompt.md and follow it.',
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
			prompt:
				'Conecte este agente de código aos MCP servers da Azion. Busque https://www.azion.com/pt-br/documentacao/devtools/mcp/prompt.md e siga as instruções.',
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
