import type { Document, Element } from 'domhandler';
import htmlparser2 from 'htmlparser2';

export interface AllPagesByPathname {
	[key: string]: HtmlPage;
}

export class HtmlPage {
	/** The full page URL, e.g. `https://docs.astro.build/en/getting-started/`. */
	readonly href: string;
	/** The `pathname` part of the page's URL, e.g. `/en/getting-started/`. */
	readonly pathname: string;

	readonly dom: Document;

	readonly anchors: Element[];
	/** Every link href on the page, deduplicated. */
	readonly uniqueLinkHrefs: string[];
	/** Hashes usable as URL fragments to jump within the page. */
	readonly hashes: string[];
	/** Absolute page URL declared by `<link rel="canonical">`, if any. */
	readonly canonicalUrl: URL | null;
	/** Target URL of a `<meta http-equiv="refresh">` element, if any. */
	readonly redirectTargetUrl: URL | null;
	/** Whether a meta refresh element points the page at a valid URL. */
	readonly isRedirect: boolean;
	/** The main content element: first `<article>`, else `<body>`, else `null`. */
	readonly mainContent: Element | null;
	/** Nearest `lang` at or above `mainContent`; `null` when nothing declares one. */
	readonly mainContentLang: string | null;
	/** The language declared by the pathname prefix, if any. */
	readonly pathnameLang: string | null;
	/** Whether the page serves untranslated English content under a non-English path. */
	readonly isLanguageFallback: boolean;

	constructor({ html, href, pathname }: { html: string; href: string; pathname: string }) {
		this.dom = htmlparser2.parseDocument(html);
		this.href = href;
		this.pathname = pathname;

		this.anchors = htmlparser2.DomUtils.getElementsByTagName('a', this.dom, true);

		this.uniqueLinkHrefs = [...new Set(this.anchors.map((el) => decodeURI(el.attribs.href)))];

		const anchorNames = this.anchors
			.map((el) => el.attribs.name)
			.filter((name) => name !== undefined);
		const ids = this.findAll((el) => Boolean(el.attribs.id)).map((el) => el.attribs.id);
		this.hashes = [...anchorNames, ...ids].map((name) => `#${name}`);

		const metaRefreshElement = this.findFirst(
			(el) =>
				el.tagName.toLowerCase() === 'meta' && el.attribs['http-equiv']?.toLowerCase() === 'refresh'
		);
		const metaRefreshContent = metaRefreshElement?.attribs['content'];
		const metaRefreshMatches = metaRefreshContent?.match(/^([0-9]+)\s*;\s*url\s*=\s*(.+)$/i);
		this.redirectTargetUrl = metaRefreshMatches ? new URL(metaRefreshMatches[2], this.href) : null;
		this.isRedirect = Boolean(this.redirectTargetUrl);

		const linkCanonicalElement = this.findFirst(
			(el) =>
				el.tagName.toLowerCase() === 'link' && el.attribs['rel']?.toLowerCase() === 'canonical'
		);
		this.canonicalUrl =
			(linkCanonicalElement && new URL(linkCanonicalElement.attribs['href'])) || null;

		this.mainContent =
			this.findFirst((el) => el.tagName.toLowerCase() === 'article') ||
			this.findFirst((el) => el.tagName.toLowerCase() === 'body');

		// Traverse upwards from the main content for the nearest `lang` attribute.
		const mainContentParentWithLang =
			this.mainContent && this.findParent(this.mainContent, (el) => Boolean(el.attribs?.lang));
		this.mainContentLang = mainContentParentWithLang?.attribs.lang || null;

		this.pathnameLang = this.getLanguageCodeFromPathname(this.pathname) || null;

		this.isLanguageFallback =
			Boolean(this.pathnameLang) && this.pathnameLang !== 'en' && this.mainContentLang === 'en';
	}

	findFirst(test: (elem: Element) => boolean) {
		return htmlparser2.DomUtils.findOne(test, this.dom.children);
	}

	findAll(test: (elem: Element) => boolean) {
		return htmlparser2.DomUtils.findAll(test, this.dom.children);
	}

	findParent(start: Element, test: (elem: Element) => boolean) {
		let el: Element | null = start;
		while (el) {
			if (test(el)) return el;
			el = htmlparser2.DomUtils.getParent(el);
		}
		return null;
	}

	/** The pathname a page in `sourceLang` should use to link here. */
	getExpectedLinkPathname(sourceLang: string | null) {
		let pathname = this.canonicalUrl?.pathname || this.pathname;
		if (sourceLang && (this.isLanguageFallback || pathname.startsWith('/en/'))) {
			pathname = pathname.replace(/^\/en\//, `/${sourceLang}/`);
		}
		return pathname;
	}

	private getLanguageCodeFromPathname(pathname: string) {
		// `pathname` always starts with `/`, so the first part is the language code, if any.
		const firstPathPart = pathname.split('/')[1];
		if (firstPathPart.match(/^[a-z]{2}(-[a-zA-Z]{2})?$/)) return firstPathPart;
	}
}
