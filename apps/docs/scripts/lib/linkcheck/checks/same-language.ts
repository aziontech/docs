import kleur from 'kleur';
import { dedentMd } from '../../output.mjs';
import { CheckBase } from '../base/check';
import type { CheckHtmlPageContext } from '../base/check';
import { IssueType } from '../base/issue';

export interface SameLanguageOptions {
	/** Link pathnames allowed to point at a language other than the page's own. */
	// Subpaths are ignored too: `/example/` also covers `/example/some-subpath/`.
	ignoredLinkPathnames?: string[];
}

export class SameLanguage extends CheckBase {
	private static readonly UnexpectedLanguageLink = new IssueType({
		title: 'link(s) to unexpected language(s)',
		prefix: kleur.gray(`[${kleur.cyan().bold('lng')}]`),
		sortOrder: 300,
	});

	readonly ignoredLinkPathnames: string[];

	constructor({ ignoredLinkPathnames }: SameLanguageOptions = {}) {
		super();

		this.ignoredLinkPathnames = ignoredLinkPathnames || [];
	}

	checkHtmlPage(context: CheckHtmlPageContext) {
		// A fallback page would report one duplicate per missing translation.
		if (context.page.isLanguageFallback) return;

		if (!context.page.pathnameLang) return;

		this.forEachLocalLink(context, (linkHref, url) => {
			const linkedPage = this.findPageByPathname(context, url.pathname);
			if (!linkedPage) return;

			if (this.ignoredLinkPathnames.some((ignoredPath) => url.pathname.startsWith(ignoredPath)))
				return;

			if (linkedPage.isRedirect) return;

			// Target and source must share the pathname-based language.
			const linkedLang = linkedPage.pathnameLang;
			if (linkedLang !== context.page.pathnameLang) {
				const expectedPathname = linkedPage.getExpectedLinkPathname(context.page.pathnameLang);
				const autofixHref = expectedPathname + decodeURIComponent(url.hash);
				context.report({
					type: SameLanguage.UnexpectedLanguageLink,
					linkHref,
					autofixHref,
					annotationText: dedentMd`Expected link path to start with
						"/${context.page.pathnameLang}/", but found
						${linkedLang ? `"/${linkedLang}/"` : 'no language prefix'}.
						The correct prefix is required to ensure that users stay on their
						selected language version of the docs.`,
				});
			}
		});
	}
}
