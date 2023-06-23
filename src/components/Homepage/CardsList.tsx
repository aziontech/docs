import Card from "./Card"
import './CardList.scss'

interface Props {
	data: Array<{
		title: string,
		cards: Array<{
			icon: string,
			title: string,
			description: string,
			link: string
		}>
	}>;
}

const CardsList = ({ data }: Props) => {
	return (
		<section>
			{data.map((item, index) => {
				return (
					<div key={index}>
						<div className="mb-2">
							<p className="list-title">
								{[item.title]}
							</p>
						</div>
						<ul className="list-container">
							{item.cards.map((c, index) => {
								return (
									<li className="list-item" key={index}>
										<Card icon={c.icon} title={c.title} description={c.description} link={c.link} />
									</li>
								)
							})}
						</ul>
					</div>
				)
			})}
		</section>
	)
}

export default CardsList
