const BASE_URL = 'https://anp9wamula0.map.azionedge.net';

export default function ogImage(title: string, description: string, type: string = 'dotGrid') {
	return `${BASE_URL}?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(
		description
	)}&type=${type}`;
}
