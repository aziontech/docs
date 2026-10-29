import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
	const data = {
		url: 'https://context7.com/websites/azion_en',
		public_key: 'pk_StLBseFBJCkzQfu9SbAAN',
	};

	return new Response(JSON.stringify(data), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	});
};
