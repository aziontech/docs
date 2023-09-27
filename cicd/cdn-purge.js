'use strict';

const axios = require("axios");

const BASIC_TOKEN = "bWFya2V0aW5nQGF6aW9uLmNvbTo0anIwJjYzazIlNEFEZnYhCg==";
const TOKEN_API_URL = "https://api.azionapi.net/tokens";
const PURGE_WILDCARD_URL = "https://api.azionapi.net/purge/wildcard";

async function fetchGet(uriStr, limit = 10) {
  if (limit === 0) {
    throw new Error("[!] Too many HTTP redirects");
  }

  const response = await axios.get(uriStr);

  switch (response.status) {
    case 200:
      console.log("[*] Net::HTTPSuccess");
      return response;
    case 302:
      console.warn(`[*] Redirected to ${response.headers.location}`);
      return fetchGet(response.headers.location, limit - 1);
    default:
      console.log(`[*] ${response.statusText}`);
      throw new Error(response.statusText);
  }
}

async function fetchPost(strUri, data, headers) {
  const response = await axios.post(strUri, data, { headers });
  return response;
}

async function fetchToken(strUri) {
  const headers = {
    "content-type": "application/json",
    Authorization: `Basic ${BASIC_TOKEN}`,
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

async function performPurge() {
  try {
    const tokenRequest = await fetchToken(TOKEN_API_URL);
    const token = tokenRequest.token;

    console.log(
      await purge(PURGE_WILDCARD_URL, token, {
        urls: ["https://www.azion.com/en/documentation/*"],
        method: "delete",
      })
    );
    console.log(
      await purge(PURGE_WILDCARD_URL, token, {
        urls: ["https://www.azion.com/pt-br/documentacao/*"],
        method: "delete",
      })
    );
  } catch (error) {
    console.error(error);
  }
}

performPurge();
