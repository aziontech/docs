import './Card.css'
interface Props {
	data: {
		icon: string,
		title: string,
		description: string,
		link: string
	}
}

const Card = (({ data }: Props) => {
	return (
		<a className="card" href={data.link} title={data.title}>
			<div>
				<i>
					<img width="36" height="36" src={"https://www.azion.com" + data.icon} alt={data.title + "icon"} />
				</i>
				<div className="box-text">
					<h4 className="card-title"> {data.title} </h4>
					<p className="card-description"> {data.description} </p>
				</div>
			</div>
		</a>
	)
})

export default Card
