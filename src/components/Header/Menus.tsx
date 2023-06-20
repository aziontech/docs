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
			{data.map((i) => {
				return (
					<ul key={i.title} className="menu-list">
						<li className={'menu-list-item'}>
							<a href={i.href} className={'menu-link'} target={i.target ? i.target : "_self"}>
								{i.title}
							</a>
							{i.dropdown ? (
								<div className={"dropdown-area dev-tools"}>
									<ul className={"dropdown-list"}>
										{i.dropdown.map((y) => {
											return (
												<li key={y.title} className={"dropdown-list-item"}>
													<a href={y.href} target={y.target ? y.target : "_self"}>
														{y.title}
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
