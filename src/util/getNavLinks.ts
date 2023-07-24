import type { AstroGlobal } from 'astro';
import { getLanguageFromURL } from '../util';
import { getNavigationMenu } from './getNav';
import { removeTrailingSlash, removeLeadingSlash } from '../util';

interface NavItem {
  text: string;
  slug: string;
  isFallback?: boolean;
}

interface LinkItem {
  text: string;
  link: string;
}

interface PreviousAndNext {
  previous?: LinkItem;
  next?: LinkItem;
}

export async function getNavLinks(
  Astro: Readonly<AstroGlobal>,
  menuName: string,
): Promise<PreviousAndNext> {
  const links = await getNavigationMenu(Astro, menuName);
  const navLinks = getLinksFromMenu(links);
  return getPreviousAndNext(navLinks, Astro);
}

function getLinksFromMenu(navLinks: any): NavItem[] {
	const links: NavItem[] = [];

	function extractLinks(items: any) {

		for (const item of items) {
			if (item.children && item.children.length > 0) {
				extractLinks(item.children)
			} else if (item.slug && !item.onlyMobile) {
				links.push({ text: item.text, slug: item.slug})
			}
		}
	}

	extractLinks(navLinks)

  return links;
}

export function getPreviousAndNext(links: NavItem[], Astro: Readonly<AstroGlobal>): PreviousAndNext {
  const index = links.findIndex((x) => Astro.url.pathname.replace(/\/$/, '').endsWith(x.slug));
  const lang = getLanguageFromURL(Astro.url.pathname);

  const makeLinkItem = ({ text, slug, isFallback }: NavItem): LinkItem => ({
    text,
    link: slug.includes('https') ? slug : `/${isFallback ? 'en' : lang}/${removeTrailingSlash(removeLeadingSlash(slug))}/`,
  });

  return {
    previous: index > 0 ? makeLinkItem(links[index - 1]) : undefined,
    next: index !== -1 && index < links.length - 1 ? makeLinkItem(links[index + 1]) : undefined,
  };
}
