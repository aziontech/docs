import { describe, expect, test } from 'vitest';

import { includeKey, mdxToMarkdown, type TwinOptions } from './index';

const convert = (body: string, options: Partial<TwinOptions> = {}) =>
	mdxToMarkdown(body, { lang: 'en', ...options });

describe('mdxToMarkdown', () => {
	test('drops frontmatter, imports, and JSX comments, including ones wrapping content', async () => {
		const out = await convert(
			[
				'---',
				'title: Page',
				'---',
				"import DocItem from '@aziontech/webkit/doc-item'",
				'',
				'Intro.',
				'',
				'{/**/}',
				'{/*',
				'## Dead heading',
				'| a | b |',
				'*/}',
				'',
				'Outro.',
			].join('\n')
		);
		expect(out).toBe('Intro.\n\nOutro.\n');
	});

	test('turns DocSteps into an ordered list, with ">" in a title and a fence in a body', async () => {
		const out = await convert(
			[
				'<DocSteps>',
				'  <DocStep title="Go to Main Settings > Modules">',
				'',
				'  Open the page.',
				'',
				'  ```bash',
				'  azion deploy',
				'  ```',
				'',
				'  </DocStep>',
				'  <DocStep title="Select Save" />',
				'</DocSteps>',
			].join('\n')
		);
		expect(out).toBe(
			[
				'1. **Go to Main Settings > Modules**',
				'',
				'   Open the page.',
				'',
				'   ```bash',
				'   azion deploy',
				'   ```',
				'',
				'2. **Select Save**',
				'',
			].join('\n')
		);
	});

	test('keeps four-space-indented prose as prose', async () => {
		expect(await convert('Intro.\n\n    Indented prose.')).toBe('Intro.\n\nIndented prose.\n');
	});

	test('labels each tab panel, drops a strip-only block, and reads labels from the page strip', async () => {
		const out = await convert(
			[
				'<Tabs client:visible sharedStore="interface">',
				'<Fragment slot="tab.console">Console</Fragment>',
				'<Fragment slot="tab.apiv4">API v4 (beta)</Fragment>',
				'</Tabs>',
				'',
				'<Tabs client:visible sharedStore="interface">',
				'',
				'<Fragment slot="panel.console">',
				'',
				'Use the Console.',
				'',
				'</Fragment>',
				'',
				'<Fragment slot="panel.apiv4">',
				'',
				'Use the API.',
				'',
				'</Fragment>',
				'',
				'<Fragment slot="panel.v4">',
				'',
				'Mismatched key.',
				'',
				'</Fragment>',
				'',
				'</Tabs>',
			].join('\n')
		);
		expect(out).toBe(
			[
				'**Console**',
				'',
				'Use the Console.',
				'',
				'**API v4 (beta)**',
				'',
				'Use the API.',
				'',
				'**v4**',
				'',
				'Mismatched key.',
				'',
			].join('\n')
		);
	});

	test('turns asides into quotes headed by their label or their type', async () => {
		const out = await convert(
			[
				':::note',
				'Plain note.',
				':::',
				'',
				':::caution[AWS S3 HMAC compatibility]',
				'Labeled.',
				':::',
				'',
				':::warning',
				'Unsupported type.',
				':::',
			].join('\n'),
			{ lang: 'pt-br' }
		);
		expect(out).toBe(
			[
				'> **Nota**',
				'>',
				'> Plain note.',
				'',
				'> **AWS S3 HMAC compatibility**',
				'>',
				'> Labeled.',
				'',
				'> **Atenção**',
				'>',
				'> Unsupported type.',
				'',
			].join('\n')
		);
	});

	test('keeps a word:word in prose that the directive syntax would read as a directive', async () => {
		expect(await convert('Use the key:value form.')).toBe('Use the key:value form.\n');
	});

	test('lists cards and related items, pointing internal pages at their twin', async () => {
		const out = await convert(
			[
				'<DocCardGroup cols={2}>',
				'  <DocCard title="Quickstart" href="/en/documentation/x/quickstart/" label="Start here." />',
				'  <DocCard title="Section" href="#section">In-page copy.</DocCard>',
				'</DocCardGroup>',
				'',
				'<FrameBox>',
				'<ItemList>',
				'\t<DocItem title="llms.txt" href="/en/docs-llms.txt">The index.</DocItem>',
				'\t<DocItem title="API" href="https://api.azion.com/v4">The API.</DocItem>',
				'</ItemList>',
				'</FrameBox>',
			].join('\n')
		);
		expect(out).toBe(
			[
				'- [Quickstart](/en/documentation/x/quickstart.md): Start here.',
				'- [Section](#section): In-page copy.',
				'',
				'* [llms.txt](/en/docs-llms.txt): The index.',
				'* [API](https://api.azion.com/v4): The API.',
				'',
			].join('\n')
		);
	});

	test('turns Code into a fence, unescaping the template literal and lengthening the fence', async () => {
		const out = await convert(
			[
				'<Code client:visible lang="javascript" code={`',
				'const name = \\`a\\${1}\\`; // \\\\n',
				'\\`\\`\\`',
				'`} />',
			].join('\n')
		);
		expect(out).toBe(
			['````javascript', 'const name = `a${1}`; // \\n', '```', '````', ''].join('\n')
		);
	});

	test('splits one-line components out of their paragraph', async () => {
		const out = await convert(
			[
				'<DocPrompt client:visible title="Any assistant">Load the docs.</DocPrompt>',
				'',
				'<DocCallout kind="tip">Reference `@azion.config.js` in a prompt.</DocCallout>',
				'',
				'<Tag severity="info">Preview</Tag>',
				'',
				'<DocButton label="Open the Console" href="https://console.azion.com" size="medium" />',
			].join('\n')
		);
		expect(out).toBe(
			[
				'**Any assistant**',
				'',
				'```text',
				'Load the docs.',
				'```',
				'',
				'> **Tip**',
				'>',
				'> Reference `@azion.config.js` in a prompt.',
				'',
				'**Preview**',
				'',
				'[Open the Console](https://console.azion.com)',
				'',
			].join('\n')
		);
	});

	test('keeps <br> inside table cells', async () => {
		const out = await convert('| a | b |\n| - | - |\n| one<br />two | three |');
		expect(out).toContain('one<br>two');
	});

	test('converts an MDX include in place', async () => {
		const out = await convert(
			"import Rollout from '~/includes/snippets/rollout.mdx'\n\nBefore.\n\n<Rollout />\n\nAfter.",
			{
				readInclude: (specifier) =>
					specifier === '/src/includes/snippets/rollout.mdx'
						? ':::caution[Important]\nRead the rollout.\n:::'
						: undefined,
			}
		);
		expect(out).toBe('Before.\n\n> **Important**\n>\n> Read the rollout.\n\nAfter.\n');
	});

	test('renders data props: pricing tables and agent samples', async () => {
		const out = await convert(
			[
				'<PricingTable metric="Requests" columns={["Price"]} rows={[{ tier: "First 10M", prices: ["Included"] }]} />',
				'',
				'<AgentSamples samples={[{ "label": "Install", "language": "bash", "code": "npm i -g azion" }]} />',
			].join('\n')
		);
		expect(out).toBe(
			[
				'| Requests  | Price    |',
				'| --------- | -------- |',
				'| First 10M | Included |',
				'',
				'**Install**',
				'',
				'```bash',
				'npm i -g azion',
				'```',
				'',
			].join('\n')
		);
	});

	test('fetches TablePricing rows through the supplied data', async () => {
		const out = await convert(
			'<TablePricing metric="Data" product_slug="cache" metric_slug="data" billing={["USA"]} />',
			{
				data: {
					pricing: async ({ product_slug, lang }) => [
						{ tier: `${product_slug} ${lang ?? 'default'}`, prices: ['$1.00'] },
					],
				},
			}
		);
		expect(out).toContain('| cache default | $1.00 |');
	});

	test('reads labels a paragraph wraps, and shares labels only within a tab store', async () => {
		const out = await convert(
			[
				'<Tabs client:visible sharedStore="interface">',
				'<Fragment slot="tab.api">API</Fragment>',
				'</Tabs>',
				'',
				'<Tabs client:visible>',
				'    <Fragment slot="tab.api">API (GraphQL)</Fragment>',
				'    <Fragment slot="tab.cli">CLI</Fragment>',
				'',
				'<Fragment slot="panel.api">',
				'',
				'Query.',
				'',
				'</Fragment>',
				'</Tabs>',
				'',
				'<Tabs client:visible sharedStore="other">',
				'<Fragment slot="panel.api">',
				'',
				'Other store.',
				'',
				'</Fragment>',
				'</Tabs>',
			].join('\n')
		);
		expect(out).toBe('**API (GraphQL)**\n\nQuery.\n\n**API**\n\nOther store.\n');
	});

	test('resolves a component by its import, whatever the page calls it', async () => {
		const out = await convert(
			[
				"import Card from '@aziontech/webkit/doc-card'",
				"import Snippet from '~/components/webkit/CodeBlock.vue'",
				'',
				'<Card title="X" href="/en/documentation/x/" label="Copy." />',
				'',
				'<Snippet lang="bash" code={`azion deploy`} />',
			].join('\n')
		);
		expect(out).toBe('- [X](/en/documentation/x.md): Copy.\n\n```bash\nazion deploy\n```\n');
	});

	test('converts a .md include, and fails on an include it cannot find', async () => {
		const readInclude = (specifier: string) =>
			specifier === '/src/includes/note.md' ? ':::tip\nA {plain} <md> include.\n:::' : undefined;
		expect(
			await convert("import Note from '~/includes/note.md'\n\n<Note />", { readInclude })
		).toBe('> **Tip**\n>\n> A {plain} <md> include.\n');
		await expect(
			convert("import Gone from '~/includes/gone.mdx'\n\n<Gone />", { readInclude })
		).rejects.toThrow('include ~/includes/gone.mdx not found');
	});

	test('numbers the steps an include holds inside DocSteps', async () => {
		const out = await convert(
			'import Steps from \'~/includes/steps.mdx\'\n\n<DocSteps>\n<Steps />\n<DocStep title="Three" />\n</DocSteps>',
			{ readInclude: () => '<DocStep title="One" />\n<DocStep title="Two" />' }
		);
		expect(out).toBe('1. **One**\n2. **Two**\n3. **Three**\n');
	});

	test('rewrites only the pathname of a link, and only for pages with a twin', async () => {
		const out = await convert(
			[
				'<DocCardGroup>',
				'<DocCard title="Q" href="/en/documentation/x/?tab=api#section" label="Served." />',
				'<DocCard title="R" href="/en/documentation/missing/" label="Not served." />',
				'</DocCardGroup>',
			].join('\n'),
			{ hasTwin: (path) => path === '/en/documentation/x' }
		);
		expect(out).toBe(
			[
				'- [Q](/en/documentation/x.md?tab=api#section): Served.',
				'- [R](/en/documentation/missing/): Not served.',
				'',
			].join('\n')
		);
	});

	test('collects shared tab labels from a renamed Tabs', async () => {
		const out = await convert(
			[
				"import Choice from '~/components/webkit/Tabs.vue'",
				'',
				'<Choice client:visible sharedStore="s">',
				'<Fragment slot="tab.api">GraphQL API</Fragment>',
				'</Choice>',
				'',
				'<Choice client:visible sharedStore="s">',
				'<Fragment slot="panel.api">',
				'',
				'Body.',
				'',
				'</Fragment>',
				'</Choice>',
			].join('\n')
		);
		expect(out).toBe('**GraphQL API**\n\nBody.\n');
	});

	test('reads every form of default import from the ESTree', async () => {
		const out = await convert(
			[
				"import { default as Card } from '@aziontech/webkit/doc-card'",
				"import $Note from '~/includes/./note.mdx'",
				'',
				'<Card title="X" href="https://example.com" label="Copy." />',
				'',
				'<$Note />',
			].join('\n'),
			{ readInclude: (key) => (key === '/src/includes/note.mdx' ? 'Included.' : undefined) }
		);
		expect(out).toBe('- [X](https://example.com): Copy.\n\nIncluded.\n');
	});

	test('normalizes include specifiers to one key, and only inside src/includes', () => {
		expect(includeKey('~/includes/snippets/a/en/./snippet.mdx')).toBe(
			'/src/includes/snippets/a/en/snippet.mdx'
		);
		expect(includeKey('/src/includes/snippets/a.md')).toBe('/src/includes/snippets/a.md');
		expect(includeKey('~/includes/../components/x.mdx')).toBeUndefined();
		expect(includeKey('./local.mdx')).toBeUndefined();
	});

	test('unwraps an unknown component and reports it', async () => {
		const unknown: string[] = [];
		const out = await convert('<Mystery>\n\nKept text.\n\n</Mystery>', {
			onUnknown: (name) => unknown.push(name),
		});
		expect(out).toBe('Kept text.\n');
		expect(unknown).toEqual(['Mystery']);
	});
});
