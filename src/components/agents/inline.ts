export type InlineToken =
	| { type: 'text'; value: string }
	| { type: 'code'; value: string }
	| { type: 'strong'; value: string }
	| { type: 'link'; value: string; href: string }
	| { type: 'tooltip'; value: string; key: string };

/** An href the docs will render as a link: same-site path, in-page anchor or http(s). */
export const SAFE_HREF = /^(https?:\/\/|\/(?!\/)|#)/;

const PATTERN = /\[\[(\w+):([^\]]+)\]\]|`([^`]+)`|\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

export function tokenize(text: string): InlineToken[] {
	const tokens: InlineToken[] = [];
	let last = 0;
	for (const match of text.matchAll(PATTERN)) {
		const index = match.index ?? 0;
		if (index > last) tokens.push({ type: 'text', value: text.slice(last, index) });
		const [, tipKey, tipText, code, strong, linkText, href] = match;
		if (tipKey) tokens.push({ type: 'tooltip', key: tipKey, value: tipText });
		else if (code !== undefined) tokens.push({ type: 'code', value: code });
		else if (strong !== undefined) tokens.push({ type: 'strong', value: strong });
		else if (linkText !== undefined) {
			tokens.push(
				SAFE_HREF.test(href)
					? { type: 'link', value: linkText, href }
					: { type: 'text', value: linkText }
			);
		}
		last = index + match[0].length;
	}
	if (last < text.length) tokens.push({ type: 'text', value: text.slice(last) });
	return tokens;
}
