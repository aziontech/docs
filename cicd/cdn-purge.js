// THIS PURGE IS FIXED TO AZION DOCS
// We need the basic_token configured on github actions, when we saved we remove the last 2 chars (==)
// dont forghet concat with the '{{ secrets.MKT_BASIC_TOKEN }}' + '=='

import args from "node:process"
import axios from "axios"

function basicToken() {
	let token = '';

	args.argv.forEach((val) => {
		let t = val.match(/basic_token=(.*)/gi) || [];
		if (t.length) {
			token = t[0]
		}
	});

	return token.replace(`basic_token=`, '') + '==' || null;
}

async function fetchPost(strUri, data, headers) {
	const response = await axios.post(strUri, data, { headers });
	return response;
}

async function fetchToken(strUri) {
	const headers = {
		"content-type": "application/json",
		Authorization: `Basic ${basicToken()}`,
		Accept: "application/json; version=3",
	};

	const response = await fetchPost(strUri, null, headers);

	switch (response.status) {
		case 201:
			console.log("[*] Token Net::HTTPCreated");
			return response.data;
		default:
			console.log(`[*] ${response.statusText}`);
			throw new Error(response.statusText);
	}
}

async function purge(strUri, token, data) {
	console.log("[*] The PURGE is starting");

	const headers = {
		"content-type": "application/json",
		Authorization: `Token ${token}`,
		Accept: "application/json; version=3",
	};

	console.log("[*] POST headers:", headers);
	console.log("[*] POST data:", JSON.stringify(data));

	const response = await fetchPost(strUri, data, headers);
	return response.data;
}

async function docsPagesWildcard(PURGE_WILDCARD_URL, token) {
	console.log(
		await purge(PURGE_WILDCARD_URL, token, {
			urls: ["https://www.azion.com/pt-br/documentacao/*"],
			method: "delete",
		})
	);

	console.log(
		await purge(PURGE_WILDCARD_URL, token, {
			urls: ["https://www.azion.com/en/documentation/*"],
			method: "delete",
		})
	);
}

async function astroDocsWildcard(PURGE_WILDCARD_URL, token) {
	console.log(
		await purge(PURGE_WILDCARD_URL, token, {
			urls: ["https://www.azion.com/_astro_docs/*"],
			method: "delete",
		})
	);
}

async function docsPathData(PURGE_URL, token) {
	console.log(
		await purge(PURGE_URL, token, {
			urls: [
				"https://www.azion.com/en/docs-path-by-url.json",
				"https://www.azion.com/pt-br/docs-path-by-url.json"
			],
			method: "delete",
		})
	)
}

async function sitemap(PURGE_URL, token) {
	console.log(
		await purge(PURGE_URL, token, {
			urls: ["https://www.azion.com/sitemap.xml"],
			method: "delete",
		})
	)
}

(async function main() {
	const API_HOST = 'api.azionapi.net'
	const TOKEN_API_URL = `https://${API_HOST}/tokens`
	const PURGE_WILDCARD_URL = `https://${API_HOST}/purge/wildcard`
	const PURGE_URL = `https://${API_HOST}/purge/url`

	try {
		const tokenRequest = await fetchToken(TOKEN_API_URL)
		const token = tokenRequest.token

		sitemap(PURGE_URL, token)
		docsPathData(PURGE_URL, token)
		astroDocsWildcard(PURGE_WILDCARD_URL, token)
		docsPagesWildcard(PURGE_WILDCARD_URL, token)
	} catch (error) {
		console.error(error)
	}
})();
