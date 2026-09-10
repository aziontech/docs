import { LinkCheckerState } from './lib/linkcheck/base/base';
import type { LinkCheckerOptions } from './lib/linkcheck/base/base';
import { CanonicalUrl } from './lib/linkcheck/checks/canonical-url';
import { GoodLabels } from './lib/linkcheck/checks/good-link-label';
import { RelativeUrl } from './lib/linkcheck/checks/relative-url';
import { SameLanguage } from './lib/linkcheck/checks/same-language';
import { TargetExists } from './lib/linkcheck/checks/target-exists';
import { getPagePathnamesFromSitemap, parsePages } from './lib/linkcheck/steps/build-index';
import { addSourceFileAnnotations, findLinkIssues } from './lib/linkcheck/steps/find-issues';
import { handlePossibleAutofix } from './lib/linkcheck/steps/optional-autofix';
import { outputAnnotationsForGitHub, outputIssues } from './lib/linkcheck/steps/output-issues';

/** All link-checking logic. */
class LinkChecker {
	readonly options: LinkCheckerOptions;
	readonly state: LinkCheckerState;

	constructor(options: LinkCheckerOptions) {
		this.options = options;
		this.state = new LinkCheckerState();
	}

	/** Checks every page in the sitemap and reports link issues to the console. */
	run() {
		const options = this.options;
		const state = this.state;

		const pagePathnames = getPagePathnamesFromSitemap(options);

		const allPages = parsePages(pagePathnames, options);

		const linkIssues = findLinkIssues(allPages, options, state);

		process.exitCode = linkIssues.length > 0 ? 1 : 0;

		addSourceFileAnnotations(linkIssues, options);

		outputIssues(linkIssues, state);

		const performedAutofix = handlePossibleAutofix(linkIssues, options, state);
		if (performedAutofix) {
			// Re-run so the user sees only what is left to fix by hand.
			this.run();
			return;
		}

		if (process.env.CI) {
			outputAnnotationsForGitHub(linkIssues);
		}
	}
}

const linkChecker = new LinkChecker({
	baseUrl: 'https://docs.astro.build',
	buildOutputDir: './dist',
	pageSourceDir: './src/content/docs',
	checks: [
		new TargetExists(),
		new SameLanguage({
			ignoredLinkPathnames: ['/lighthouse/'],
		}),
		new CanonicalUrl({
			ignoreMissingCanonicalUrl: ['/lighthouse/'],
		}),
		new RelativeUrl(),
		new GoodLabels(),
	],
	autofix: process.argv.includes('--autofix') || Boolean(process.env.npm_config_autofix),
});

linkChecker.run();
