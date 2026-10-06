import type { CheckBase } from './check';

export interface LinkCheckerOptions {
	baseUrl: string;
	buildOutputDir: string;
	pageSourceDir: string;
	checks: CheckBase[];
	autofix?: boolean;
}

export class LinkCheckerState {
	autofixedCount = 0;
	readonly autofixedPathnameHrefs = new Set<string>();
}

/** Index of link `href` inside `input`, or -1. */
// The characters around a match must be ones that cannot appear in a Markdown URL, so
// `/en/install` does not match inside `/en/install/auto`.
export function indexOfHref(input: string, href: string, startIndex?: number) {
	let i = input.indexOf(href, startIndex);
	while (i !== -1) {
		const charBefore = input[i - 1] || '';
		const charAfter = input[i + href.length] || '';
		if ((charBefore + charAfter).match(/^[\s"'()[\],.]*$/)) return i;
		i = input.indexOf(href, i + 1);
	}
	return -1;
}

/** Replaces every whole-href occurrence of `findHref` with `replaceWithHref`. */
export function replaceHrefs(input: string, findHref: string, replaceWithHref: string) {
	let i = indexOfHref(input, findHref);
	while (i !== -1) {
		input = input.slice(0, i) + replaceWithHref + input.slice(i + findHref.length);
		i = indexOfHref(input, findHref, i + 1 + replaceWithHref.length);
	}
	return input;
}
