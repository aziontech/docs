import './Card.css'
import { removeLeadingSlash, removeTrailingSlash, isURL } from '~/util'

interface Props {
	icon: string,
	title: string,
	description: string,
	link: string
}

const Card = (({ icon, title, description, link }: Props) => {
	if (typeof link === 'string') {
		link = isURL(link) ? link : `/${removeLeadingSlash(removeTrailingSlash(link))}/`
	}

	return (
		<a className="card-homepage" rel="noreferrer" href={link} target={isURL(link) ? "_blank" : "_self"} title={title}>
			<div>
				<i>
					<img width="36" height="36" src={icon} alt={title + "icon"} />
				</i>
				<div className="box-text">
					<h2 className="card-homepage-title"> {title} </h2>
					<p className="card-homepage-description"> {description} </p>
				</div>
			</div>
		</a>
	)
})

export default Card
