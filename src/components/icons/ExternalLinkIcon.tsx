interface Props {
	color: string;
}

const ExternalLinkIcon = ({ color }: Props) => {
	return (
		<svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M11.3012 1.2002H8.14541M11.3012 1.2002V4.80765M11.3012 1.2002L6.51492 5.98644M5.73745 1.2002H2.20117C1.92503 1.2002 1.70117 1.42405 1.70117 1.7002V10.3002C1.70117 10.5763 1.92503 10.8002 2.20117 10.8002H10.8012C11.0773 10.8002 11.3012 10.5763 11.3012 10.3002V7.20307" stroke={color} />
		</svg>
	)
}

export default ExternalLinkIcon
