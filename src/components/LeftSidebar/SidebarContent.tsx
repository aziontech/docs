import { isSubPage } from '~/util/isSubPage';
import { modelSlug } from '~/util';
import ExternalLinkIcon from '~/components/icons/ExternalLinkIcon';
import './SidebarContent.scss'
import type { NavDict } from '~/i18n/translation-checkers';

interface Props {
	data: NavDict | undefined,
	lang: string,
	currentPageMatch: string,
}

const MenuItems = ({ data, lang, currentPageMatch }: Props) => {
	const createListItems = (data: NavDict) => {
		return (
			<ul className="list-border-left">
				{data.map(({ slug, text, isFallback }) => (
					<li data-current-page={isSubPage(currentPageMatch, slug, lang) ? "true" : "false"} key={text} className="nav-link">
						<a className="nav-item-children"
							rel="noreferrer"
							href={modelSlug(slug, isFallback, lang)} target={slug?.includes('https') ? "_blank" : "_self"}
							aria-current={isSubPage(currentPageMatch, slug, lang) ? "page" : "false"}
							data-current-parent={isSubPage(currentPageMatch, slug, lang) ? "true" : "false"}
						>
							{text}
							{isFallback && <sup className="fallback">EN</sup>}
							{slug?.includes('https') && <ExternalLinkIcon color="var(--theme-text)" />}
						</a>
					</li>
				))}
			</ul>
		);
	}
	const renderMenuItems = (data: NavDict) => {
		let hasHighlight = false
		const mappedData = data.reduce((array, item) => {
			if ('isProduct' in item) {
				hasHighlight = true
				array.push({ ...item, children: [] })
			} else if (array.length > 0 && 'children' in array[array.length - 1]) {
				array[array.length - 1].children?.push(item)
			} else {
				array.push(item)
			}

			return array
		}, [] as NavDict)

		if (hasHighlight) {
			return (
				<ul>
					{mappedData.map(item => (
						<li key={item.text}>
							<a 
								className="nav-link-highlight"
								rel="noreferrer"
								href={modelSlug(item.slug, item.isFallback, lang)} 
								target={item.slug?.includes('https') ? "_blank" : "_self"}
								aria-current={isSubPage(currentPageMatch, item.slug, lang) ? "page" : "false"}
								data-current-parent={isSubPage(currentPageMatch, item.slug, lang) ? "true" : "false"}
							>
								{item.text}
								{item.isFallback && <sup className="fallback">EN</sup>}
								{item.slug?.includes('https') && <ExternalLinkIcon color="var(--theme-text)" />}
							</a>
							{item.children && createListItems(item.children)}
						</li>
					))}
				</ul>
			)
		}

		return <>{createListItems(mappedData)}</>
	};

	if (!data) return null

	return <>{renderMenuItems(data)}</>;
};

export default MenuItems;
