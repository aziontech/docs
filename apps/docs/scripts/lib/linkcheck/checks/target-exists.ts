import fs from 'node:fs';
import path from 'node:path';
import kleur from 'kleur';
import { dedentMd } from '../../output.mjs';
import { CheckBase } from '../base/check';
import type { CheckHtmlPageContext } from '../base/check';
import { IssueType } from '../base/issue';

export class TargetExists extends CheckBase {
	private static readonly BrokenPageLink = new IssueType({
		title: 'broken page link(s)',
		prefix: kleur.gray(`[${kleur.red().bold('404')}]`),
		sortOrder: 100,
	});
	private static readonly BrokenFragmentLink = new IssueType({
		title: 'broken fragment link(s)',
		prefix: kleur.gray(`[${kleur.yellow().bold(' # ')}]`),
		sortOrder: 101,
	});

	/** Build output directory, where files that are not HTML pages (`.md` twins, `.txt`) live. */
	private readonly staticFilesDir?: string;

	/** Exact pathnames served by another site on the same domain, so absent from this build. */
	private readonly externalSitePathnames: Set<string>;

	constructor(options: { staticFilesDir?: string; externalSitePathnames?: string[] } = {}) {
		super();
		this.staticFilesDir = options.staticFilesDir;
		this.externalSitePathnames = new Set(options.externalSitePathnames);
	}

	private isStaticFile(pathname: string) {
		if (!this.staticFilesDir || !/\.[a-z0-9]+$/i.test(pathname)) return false;
		return fs.existsSync(path.join(this.staticFilesDir, decodeURIComponent(pathname)));
	}

	checkHtmlPage(context: CheckHtmlPageContext) {
		this.forEachLocalLink(context, (linkHref, url) => {
			const linkedPage = this.findPageByPathname(context, url.pathname);

			// Links to emitted files that are not pages (the Markdown twin, llms text) exist
			if (!linkedPage && this.isStaticFile(url.pathname)) return;

			// Links to the marketing site's pages are out of this build's reach
			if (!linkedPage && this.externalSitePathnames.has(url.pathname)) return;

			// Report links to missing pages
			if (!linkedPage) {
				context.report({
					type: TargetExists.BrokenPageLink,
					linkHref,
				});
				return;
			}

			// Skip hash validation on redirect pages
			if (linkedPage.isRedirect) return;

			// Report links to missing page fragments (unknown URL hashes)
			const decodedHash = url.hash && decodeURIComponent(url.hash);
			if (decodedHash && !linkedPage.hashes.includes(decodedHash)) {
				context.report({
					type: TargetExists.BrokenFragmentLink,
					linkHref,
					annotationText: dedentMd`The linked page does not contain a fragment with
						the name "${decodedHash}".
						Available fragments: ${linkedPage.hashes.length ? linkedPage.hashes.join(', ') : 'none'}`,
				});
			}
		});
	}
}
