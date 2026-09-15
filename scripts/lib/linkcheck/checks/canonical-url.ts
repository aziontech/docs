import kleur from 'kleur';
import { dedentMd } from '../../output.mjs';
import { CheckBase } from '../base/check';
import type { CheckHtmlPageContext } from '../base/check';
import { IssueType } from '../base/issue';

export interface CanonicalUrlOptions {
	/** Pathnames allowed to ship without a `<link rel="canonical">` element. */
	// Subpaths are ignored too: `/example/` also covers `/example/some-subpath/`.
	ignoreMissingCanonicalUrl?: string[];
}

export class CanonicalUrl extends CheckBase {
	private static readonly LinkToRedirectPage = new IssueType({
		title: 'link(s) to meta refresh page(s)',
		prefix: kleur.gray(`[${kleur.blue().bold('ref')}]`),
		sortOrder: 500,
	});
	private static readonly LinkToNonCanonicalUrl = new IssueType({
		title: 'link(s) not using canonical url(s)',
		prefix: kleur.gray(`[${kleur.blue().bold('can')}]`),
		sortOrder: 501,
	});
	private static readonly MissingCanonicalUrl = new IssueType({
		title: 'page(s) missing canonical url(s)',
		prefix: kleur.gray(`[${kleur.blue().bold('mcu')}]`),
		sortOrder: 502,
	});

	readonly ignoreMissingCanonicalUrl: string[];

	constructor({ ignoreMissingCanonicalUrl }: CanonicalUrlOptions = {}) {
		super();

		this.ignoreMissingCanonicalUrl = ignoreMissingCanonicalUrl || [];
	}

	checkHtmlPage(context: CheckHtmlPageContext) {
		// A fallback page would report one duplicate per missing translation.
		if (context.page.isLanguageFallback) return;

		this.forEachLocalLink(context, (linkHref, url) => {
			const linkedPage = this.findPageByPathname(context, url.pathname);
			if (!linkedPage) return;

			const rawUrl = new URL(linkHref, 'https://example.com/no-pathname/');
			if (rawUrl.pathname === '/no-pathname/') return;

			if (linkedPage.redirectTargetUrl) {
				const redirectTargetPage = this.findPageByPathname(
					context,
					linkedPage.redirectTargetUrl.pathname
				);
				const targetPathname = redirectTargetPage
					? redirectTargetPage.getExpectedLinkPathname(context.page.pathnameLang)
					: null;
				const autofixHref = targetPathname
					? targetPathname + decodeURIComponent(url.hash)
					: undefined;
				context.report({
					type: CanonicalUrl.LinkToRedirectPage,
					linkHref,
					autofixHref,
					annotationText: dedentMd`Please link directly to the target page
						instead of a redirect page that uses meta refresh to forward the user.
						This improves ranking in search engines and avoids unnecessary requests.`,
				});
				return;
			}

			if (!linkedPage.canonicalUrl) {
				const isOnIgnoreList = this.ignoreMissingCanonicalUrl.some((ignoredPath) =>
					url.pathname.startsWith(ignoredPath)
				);
				if (!isOnIgnoreList) {
					context.report({
						type: CanonicalUrl.MissingCanonicalUrl,
						linkHref,
						annotationText: dedentMd`The target page does not have a canonical URL.
							Please consider adding a <link rel="canonical" href="..."> element
							to the page.`,
					});
				}
				return;
			}

			// Skip links that point to the wrong language (those are handled by SameLanguage)
			if (linkedPage.pathnameLang !== context.page.pathnameLang) return;

			// The link must use the target's canonical pathname.
			const expectedPathname = linkedPage.getExpectedLinkPathname(context.page.pathnameLang);
			if (url.pathname !== expectedPathname) {
				const autofixHref = expectedPathname + decodeURIComponent(url.hash);
				context.report({
					type: CanonicalUrl.LinkToNonCanonicalUrl,
					linkHref,
					autofixHref,
					annotationText: dedentMd`Please use the proper canonical URL of the target page.
						This improves ranking in search engines and avoids unnecessary redirects.`,
				});
			}
		});
	}
}
