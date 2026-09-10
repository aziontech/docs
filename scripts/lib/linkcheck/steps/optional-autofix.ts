import fs from 'fs';
import kleur from 'kleur';
import { dedentMd, formatCount } from '../../output.mjs';
import { LinkCheckerState, replaceHrefs } from '../base/base';
import type { LinkCheckerOptions } from '../base/base';
import type { LinkIssue } from '../base/issue';

/** Every autofix task; returns `true` when a second `run()` pass is needed. */
// Without `--autofix` it only advertises the option. With it, it fixes and asks for the
// second pass, which is where the user is told what the fix changed.
export function handlePossibleAutofix(
	linkIssues: LinkIssue[],
	options: LinkCheckerOptions,
	state: LinkCheckerState
): boolean {
	// The second pass reports what the autofix changed.
	if (state.autofixedCount > 0) {
		const todos =
			linkIssues.length > 0
				? `Any remaining issues above must be fixed manually.`
				: `There's nothing left to do!`;
		outputAutofixMessage(
			'Autofix complete',
			`${formatCount(state.autofixedCount, 'issue was|issues were')} autofixed. ${todos}`
		);
		return false;
	}

	if (!linkIssues.length) return false;

	const autofixCount = linkIssues.reduce(
		(prev, linkIssue) =>
			prev + (linkIssue.autofixHref ? linkIssue.sourceFileAnnotations.length : 0),
		0
	);

	if (!options.autofix) {
		if (autofixCount > 0) {
			outputAutofixMessage(
				'Autofix available',
				dedentMd`${formatCount(autofixCount, 'issue(s)')}
					can be fixed automatically with "--autofix".`
			);
		}
		return false;
	}

	if (!autofixCount) {
		outputAutofixMessage(
			'Autofix unavailable',
			'Autofix was requested, but there are no autofixable issues.'
		);
		return false;
	}

	const sourceFilesWithAutofixes = new Set(
		linkIssues.flatMap(
			(linkIssue) =>
				linkIssue.autofixHref &&
				linkIssue.sourceFileAnnotations.map((annotation) => annotation.location.file)
		)
	);

	outputAutofixMessage(
		'Starting autofix',
		dedentMd`Autofixing ${formatCount(autofixCount, 'issue(s)')}
			in ${formatCount(sourceFilesWithAutofixes.size, 'source file(s)')}...`
	);

	sourceFilesWithAutofixes.forEach((sourceFilePath) => {
		if (!sourceFilePath) return;
		autofixIssuesInSourceFile(sourceFilePath, linkIssues, state);
	});

	state.autofixedCount = autofixCount;

	outputAutofixMessage('Checking result', 'Scanning for remaining issues after autofix...');

	return true;
}

function autofixIssuesInSourceFile(
	sourceFilePath: string,
	linkIssues: LinkIssue[],
	state: LinkCheckerState
) {
	const sourceFileContents = fs.readFileSync(sourceFilePath, 'utf8');

	// Capturing the separators lets the file be reassembled with its newlines intact.
	const linesAndNewlines = sourceFileContents.split(/(\r?\n)/);

	linkIssues.forEach((linkIssue) => {
		if (!linkIssue.autofixHref) return;

		linkIssue.sourceFileAnnotations.forEach((annotation) => {
			if (annotation.location.file !== sourceFilePath) return;
			if (annotation.location.startLine === undefined) return;

			state.autofixedPathnameHrefs.add(`${linkIssue.page.pathname},${linkIssue.linkHref}`);

			const lineIndex = (annotation.location.startLine - 1) * 2;

			linesAndNewlines[lineIndex] = replaceHrefs(
				linesAndNewlines[lineIndex],
				linkIssue.linkHref,
				linkIssue.autofixHref!
			);
		});
	});

	const autofixedSourceFileContents = linesAndNewlines.join('');
	if (sourceFileContents === autofixedSourceFileContents)
		throw new Error(`Failed to autofix "${sourceFilePath}": File contents did not change`);
	fs.writeFileSync(sourceFilePath, autofixedSourceFileContents);
}

function outputAutofixMessage(title: string, message: string) {
	console.log(kleur.magenta().bold(kleur.inverse(` ${title} `) + ' ' + message));
	console.log();
}
