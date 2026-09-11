import fs from 'fs';
import path from 'path';
import { dedentMd } from '../../output.mjs';
import { indexOfHref, LinkCheckerState } from '../base/base';
import type { LinkCheckerOptions } from '../base/base';
import type { LinkIssue } from '../base/issue';
import type { AllPagesByPathname, HtmlPage } from '../base/page';

/** Runs every configured check across all indexed pages and returns the link issues. */
export function findLinkIssues(
	allPages: AllPagesByPathname,
	options: LinkCheckerOptions,
	state: LinkCheckerState
) {
	const linkIssues: LinkIssue[] = [];

	Object.values(allPages).forEach((page) => {
		linkIssues.push(...findLinkIssuesOnPage(page, allPages, options, state));
	});

	return linkIssues;
}

function findLinkIssuesOnPage(
	page: HtmlPage,
	allPages: AllPagesByPathname,
	options: LinkCheckerOptions,
	state: LinkCheckerState,
	checkSingleLinkHref?: string
) {
	const linkIssues: LinkIssue[] = [];

	options.checks.forEach((check) => {
		check.checkHtmlPage({
			allPages,
			baseUrl: options.baseUrl,
			page,
			checkSingleLinkHref,
			report: (issueData) => {
				// The build output still shows an issue already autofixed in the source.
				if (state.autofixedCount > 0) {
					const wasAutofixedInSource = state.autofixedPathnameHrefs.has(
						`${page.pathname},${issueData.linkHref}`
					);
					if (wasAutofixedInSource) return;
				}

				// Re-check the page against the suggestion alone: a fix must not add issues.
				if (issueData.autofixHref && !checkSingleLinkHref) {
					const autofixLinkIssues = findLinkIssuesOnPage(
						page,
						allPages,
						options,
						state,
						issueData.autofixHref
					);
					if (autofixLinkIssues.length > 0) {
						issueData.autofixHref = undefined;
					}
				}

				linkIssues.push({
					...issueData,
					page,
					check,
					sourceFileAnnotations: [],
				});
			},
		});
	});

	return linkIssues;
}

/** Annotates each link issue with the source file line and column that caused it. */
export function addSourceFileAnnotations(linkIssues: LinkIssue[], options: LinkCheckerOptions) {
	const pathnames = new Set(linkIssues.map((linkIssue) => linkIssue.page.pathname));

	pathnames.forEach((pathname) => {
		let sourceFilePath = tryFindSourceFileForPathname(pathname, options.pageSourceDir) || '';

		if (!sourceFilePath) return;

		sourceFilePath = sourceFilePath.replace(/\\/g, '/');
		const sourceFileContents = fs.readFileSync(sourceFilePath, 'utf8');
		const lines = sourceFileContents.split(/\r?\n/);

		const linkIssuesOnCurrentPage = linkIssues.filter(
			(linkIssue) => linkIssue.page.pathname === pathname
		);
		lines.forEach((line, idx) => {
			const lineNumber = idx + 1;
			linkIssuesOnCurrentPage.forEach((linkIssue) => {
				const startColumn = indexOfHref(line, linkIssue.linkHref);
				if (startColumn === -1) return;

				let message = dedentMd`${linkIssue.type.formatTitle()}
					in ${sourceFilePath}, line ${lineNumber}:
					${linkIssue.annotationText || linkIssue.linkHref}`;
				if (linkIssue.autofixHref) {
					message += ` Suggested fix: ${linkIssue.autofixHref}`;
				}
				linkIssue.sourceFileAnnotations.push({
					message,
					location: {
						file: sourceFilePath,
						startLine: lineNumber,
						startColumn,
						endColumn: startColumn + linkIssue.linkHref.length,
					},
				});
			});
		});
	});
}

/** First existing `.md` source file for a pathname (`page.md`, then `page/index.md`). */
export function tryFindSourceFileForPathname(pathname: string, pageSourceDir: string) {
	const possibleSourceFilePaths = [
		path.join(pageSourceDir, pathname, '.') + '.md',
		path.join(pageSourceDir, pathname, 'index.md'),
		path.join(pageSourceDir, pathname, '.') + '.mdx',
		path.join(pageSourceDir, pathname, 'index.mdx'),
	];
	return possibleSourceFilePaths.find((possiblePath) => fs.existsSync(possiblePath));
}
