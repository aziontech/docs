import { SITE_URL } from '~/consts';
import type { Lang } from '~/data/docs-home/types';
import { DOCS_BASE } from '~/nav/resolve';

/**
 * The instructions a short setup prompt points an agent at (`.../prompt.md`). Each one is complete
 * on its own: the agent may reach no other page, and a summarizing fetch tool must not lose a URL.
 * `setup` serves the documentation and devtools homes; `mcp` serves the MCP overview.
 */
export type SetupInstructionsKey = 'setup' | 'mcp';

const server = (area: string) => `https://${area}-mcp.azion.com/mcp`;

/** The MCP connection steps; `last` closes the numbered list when the steps stand alone. */
function mcpSteps(lang: Lang, last?: string): string[] {
	const agentSetup = `${SITE_URL}/${lang}/${DOCS_BASE[lang]}/agent-setup/`;
	const writeServers = ['build', 'secure', 'observe', 'storage'].map(
		(a) => `   - ${a}: ${server(a)}`
	);
	if (lang === 'pt-br') {
		return [
			'1. Peça ao usuário um personal token da Azion (criado em https://console.azion.com/personal-tokens). Nunca grave o token em um arquivo que vá para um commit: registre os servidores na configuração de usuário do seu cliente, não na do projeto.',
			`2. Adicione o servidor de docs, que só lê: ${server(
				'docs'
			)}, transporte HTTP, cabeçalho \`Authorization: Token <personal token>\`. O esquema \`Bearer\` falha com 401.`,
			'3. Pergunte quais destes o usuário precisa e adicione só esses, da mesma forma. Eles alteram a conta, então faça uma prévia de cada escrita com `dry_run` antes:',
			...writeServers,
			'4. Confirme que cada servidor conecta, usando a verificação do seu próprio cliente. Servidores adicionados durante uma sessão podem só carregar as ferramentas depois de reiniciar o cliente: se for o caso, avise o usuário.',
			...(last ? [`5. ${last}`] : []),
			'',
			'No Claude Code, um comando por servidor:',
			'',
			'```bash',
			`claude mcp add --transport http --scope user azion-docs ${server(
				'docs'
			)} --header "Authorization: Token <personal token>"`,
			'claude mcp list',
			'```',
			'',
			`Outros clientes (Cursor, Codex, Gemini CLI, Windsurf e outros): ${agentSetup}`,
		];
	}
	return [
		'1. Ask the user for an Azion personal token (created at https://console.azion.com/personal-tokens). Never write it to a file that gets committed: register the servers in your client’s user configuration, not the project’s.',
		`2. Add the docs server, which only reads: ${server(
			'docs'
		)}, HTTP transport, header \`Authorization: Token <personal token>\`. The \`Bearer\` scheme fails with 401.`,
		'3. Ask which of these the user needs and add only those, the same way. They change the account, so preview every write with `dry_run` first:',
		...writeServers,
		'4. Confirm that each server connects, using your client’s own check. Servers added during a session may load their tools only after the client restarts: if so, tell the user.',
		...(last ? [`5. ${last}`] : []),
		'',
		'In Claude Code, one command per server:',
		'',
		'```bash',
		`claude mcp add --transport http --scope user azion-docs ${server(
			'docs'
		)} --header "Authorization: Token <personal token>"`,
		'claude mcp list',
		'```',
		'',
		`Other clients (Cursor, Codex, Gemini CLI, Windsurf, and more): ${agentSetup}`,
	];
}

/** The Markdown body served at `/{lang}/{docs}/agent-setup/prompt.md` or `.../devtools/mcp/prompt.md`. */
export function setupInstructions(key: SetupInstructionsKey, lang: Lang): string {
	const pt = lang === 'pt-br';
	if (key === 'mcp') {
		return [
			pt
				? '# Conecte este agente aos MCP servers da Azion'
				: '# Connect this agent to the Azion MCP servers',
			'',
			pt ? 'Siga estes passos em ordem.' : 'Follow these steps in order.',
			'',
			...mcpSteps(
				lang,
				pt
					? 'Pergunte ao usuário o que ele está construindo.'
					: 'Ask the user what they are building.'
			),
			'',
		].join('\n');
	}
	return [
		pt ? '# Configure a Azion neste projeto' : '# Set up Azion in this project',
		'',
		pt
			? 'Siga estas etapas em ordem. Pergunte ao usuário antes de qualquer coisa que altere a conta Azion dele.'
			: 'Follow these stages in order. Ask the user before anything that changes their Azion account.',
		'',
		pt ? '## 1. Instale a Azion CLI' : '## 1. Install the Azion CLI',
		'',
		pt
			? 'Se `azion` ainda não estiver instalado, rode o comando abaixo. Ele instala em `~/.azion/bin`; adicione esse diretório ao `PATH` se preciso.'
			: 'If `azion` is not installed yet, run the command below. It installs to `~/.azion/bin`; add that directory to `PATH` if needed.',
		'',
		'```bash',
		'curl -fsSL https://cli.azion.app/install.sh | bash',
		'```',
		'',
		pt ? '## 2. Conecte os MCP servers da Azion' : '## 2. Connect the Azion MCP servers',
		'',
		...mcpSteps(lang),
		'',
		pt ? '## 3. Vincule o projeto' : '## 3. Link the project',
		'',
		pt
			? 'Verifique se o projeto já está vinculado à Azion (um arquivo `azion/azion.json`). Se não estiver, rode `azion link`. O comando faz perguntas: se você não consegue responder a prompts interativos, consulte `azion link --help` ou peça ao usuário para rodá-lo.'
			: 'Check whether the project is already linked to Azion (an `azion/azion.json` file). If it is not, run `azion link`. The command asks questions: if you cannot answer interactive prompts, check `azion link --help` or ask the user to run it.',
		'',
		pt ? '## 4. Sugira os próximos passos' : '## 4. Suggest next steps',
		'',
		pt
			? 'Sugira os próximos passos mais relevantes para este projeto. Peça confirmação antes de `azion deploy`: ele cria recursos na conta.'
			: 'Suggest the most relevant next steps for this project. Ask before running `azion deploy`: it creates resources in the account.',
		'',
	].join('\n');
}
