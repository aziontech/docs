import { isSubPage, isSubMenu } from '~/util/isSubPage';
import { modelSlug } from '~/util';
import ExternalLinkIcon from '~/components/icons/ExternalLinkIcon';
import './SidebarContent.scss'

interface data {
  text: string;
  header?: boolean;
  onlyMobile?: boolean;
  anchor?: boolean;
  type?: string;
  slug?: string;
  key: string;
  isFallback?: boolean;
  children?: Array<data>;
}

interface Props {
	data: data[] | undefined,
	lang: string,
	currentPageMatch: string,
}

const MenuItems = ({data, lang, currentPageMatch}: Props ) => {
	const renderMenuItems = (data: data[] | undefined) => {
		return (
				<ul>
					{data && data.map(({ slug, text, isFallback, children }) => (
						<li key={text} className="nav-link">
						{children ? (
							<details open={isSubMenu(currentPageMatch, lang, children) ? true : false}>
								<summary>
									<h2 className={isSubMenu(currentPageMatch, lang, children) ? 'focus-item' : ''}>
										{text}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 1 16 16"
											width="16"
											height="16"
											aria-hidden="true"
										>
											<path d="M6.22 3.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 010-1.06z" />
										</svg>
									</h2>
								</summary>
								<ul>{renderMenuItems(children)}</ul>
							</details>
						) : (
							<a
								className="nav-item-children"
								rel="noreferrer"
								href={modelSlug(slug, isFallback, lang)} target={slug?.includes('https') ? "_blank" : "_self"}
								aria-current={isSubPage(currentPageMatch, slug, lang) ? "page" : "false"}
								data-current-parent={isSubPage(currentPageMatch, slug, lang) ? "true" : "false"}
							>
								{text}
								{isFallback && <sup className="fallback">EN</sup>}
								{slug?.includes('https') && <ExternalLinkIcon color="var(--theme-text)" />}
							</a>
							)}
						</li>
					))}
			</ul>
		);
	};

return <>{renderMenuItems(data)}</>;
};

export default MenuItems;
