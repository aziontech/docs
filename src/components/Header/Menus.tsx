import './Menus.scss';

interface Props {
	data: Array<{
		title: string;
		href: string;
		dropdown?: Array<{
			title: string;
			href: string;
			target?: string;
		}>
		target?: string;
	}>
}



const Navigation = ({ data }: Props) => {
	return (
		<nav className={"menu-navigation"}>
			{data.map(({ title, href, target, dropdown }) => {
				return (
					<ul key={title} className="menu-list">
						<li className={'menu-list-item'}>
							<a href={href} className={'menu-link'} target={target ? target : "_self"}>
								{title}
								{href?.includes('https') &&
									<svg width="12" height="12" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
										<path
											fill="white"
											d="M5.50098 5H17.9552V3H5.00098C4.17255 3 3.50098 3.67157 3.50098 4.5V35.5C3.50098 36.3284 4.17255 37 5.00098 37H36.001C36.8294 37 37.501 36.3284 37.501 35.5V24.0096H35.501V35H5.50098V5ZM34.0868 5H25.9818V3H36.501C37.0533 3 37.501 3.44772 37.501 4V16.0248H35.501V6.41421L21.2539 20.6613L19.8397 19.2471L34.0868 5Z"
										/>
									</svg>
								}
							</a>
							{dropdown ? (
								<div className={"dropdown-area dev-tools"}>
									<ul className={"dropdown-list"}>
										{dropdown.map(({ title, href, target }) => {
											return (
												<li key={title} className={"dropdown-list-item"}>
													<a href={href} target={target ? target : "_self"}>
														{title}
														{href?.includes('https') &&
															<svg width="12" height="12" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
																<path
																	fill="white"
																	d="M5.50098 5H17.9552V3H5.00098C4.17255 3 3.50098 3.67157 3.50098 4.5V35.5C3.50098 36.3284 4.17255 37 5.00098 37H36.001C36.8294 37 37.501 36.3284 37.501 35.5V24.0096H35.501V35H5.50098V5ZM34.0868 5H25.9818V3H36.501C37.0533 3 37.501 3.44772 37.501 4V16.0248H35.501V6.41421L21.2539 20.6613L19.8397 19.2471L34.0868 5Z"
																/>
															</svg>
														}
													</a>
												</li>
											)
										})}
									</ul>
								</div>
							) : ''}

						</li>
					</ul>
				)
			})}
		</nav>
	)
}

export default Navigation
