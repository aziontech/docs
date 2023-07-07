import './Card.css'
import { removeLeadingSlash, removeTrailingSlash } from '~/util'

interface Props {
	icon: string,
	title: string,
	description: string,
	link: string
}

const Card = (({ icon, title, description, link }: Props) => {
	if (typeof link === 'string') {
		link = link.includes('https') ? link : `/${removeLeadingSlash(removeTrailingSlash(link))}/`
	}

	return (
		<a className="card-homepage" href={link} title={title}>
			<div>
				<i>
					<img width="36" height="36" src={"https://www.azion.com" + icon} alt={title + "icon"} />
				</i>
				<div className="box-text">
					<h4 className="card-homepage-title"> {title} </h4>
					<p className="card-homepage-description"> {description} </p>
				</div>
			</div>
		</a>
	)
})

export default Card
