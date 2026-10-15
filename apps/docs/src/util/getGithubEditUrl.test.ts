import type { AstroGlobal } from 'astro';
import { describe, expect, test } from 'vitest';
import { getGithubEditUrl } from './getGithubEditUrl';

const BLOB = 'https://github.com/aziontech/docs/blob/main';

/** The four properties the helper reads, shaped as the layouts pass them. */
const astro = (
	props: Record<string, unknown>,
	pathname: string,
	fallback?: string
): Readonly<AstroGlobal> =>
	({
		props,
		params: fallback ? { fallback } : {},
		url: new URL(`https://www.azion.com${pathname}`),
	} as unknown as Readonly<AstroGlobal>);

describe('getGithubEditUrl', () => {
	test('points at the file inside apps/docs, where the repository keeps it', () => {
		expect(
			getGithubEditUrl(
				astro(
					{ id: 'en/pages/agent-setup/claude-code.mdx' },
					'/en/documentation/agent-setup/claude-code/'
				)
			)
		).toBe(`${BLOB}/apps/docs/src/content/docs/en/pages/agent-setup/claude-code.mdx`);
	});

	test('prefixes a page that passes its own path, such as the docs home', () => {
		expect(
			getGithubEditUrl(
				astro(
					{ id: 'en/documentation', editFilePath: 'src/pages/en/documentation/index.astro' },
					'/en/documentation/'
				)
			)
		).toBe(`${BLOB}/apps/docs/src/pages/en/documentation/index.astro`);
	});

	test('a fallback page edits the English source it falls back to', () => {
		expect(
			getGithubEditUrl(
				astro(
					{ id: 'pt-br/pages/devtools/cli/overview.mdx' },
					'/pt-br/documentacao/devtools/cli/',
					'pt-br'
				)
			)
		).toBe(`${BLOB}/apps/docs/src/content/docs/en/pages/devtools/cli/overview.mdx`);
	});

	test('an explicit githubURL is used verbatim, so it carries its own path', () => {
		expect(
			getGithubEditUrl(
				astro(
					{
						id: 'en/pages/x.mdx',
						content: { githubURL: 'https://github.com/aziontech/other/blob/main/' },
					},
					'/en/documentation/x/'
				)
			)
		).toBe('https://github.com/aziontech/other/blob/main/');
	});
});
