// THIS PURGE IS FIXED TO AZION DOCS
// Uses AZION_TOKEN from environment (configured in GitHub Actions)

const token = process.env.AZION_TOKEN

if (!token) {
  console.error('AZION_TOKEN is required')
  process.exit(1)
}

const API_HOST = 'api.azionapi.net/v4/workspace'
const PURGE_WILDCARD_URL = `https://${API_HOST}/purge/wildcard`
const PURGE_URL = `https://${API_HOST}/purge/url`

const wildcardUrls = [
  'https://www.azion.com/pt-br/documentacao/*',
  'https://www.azion.com/en/documentation/*',
  'https://www.azion.com/_astro_docs/*'
]

const exactUrls = [
  'https://www.azion.com/en/docs-path-by-url.json',
  'https://www.azion.com/pt-br/docs-path-by-url.json',
  'https://www.azion.com/sitemap.xml'
]

const purge = async (url, urls) => {
  const headers = {
    'content-type': 'application/json',
    Authorization: `Token ${token}`,
    Accept: 'application/json; version=3'
  }
  const body = { urls, method: 'delete' }
  const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Purge failed: ${res.status} ${res.statusText} ${text}`)
  }
  console.log(`Purged ${urls.join(', ')}`)
  return res.json().catch(() => ({}))
}

const main = async () => {
  try {
    console.log('Starting cdn purge for docs')

    const purgedWildcards = wildcardUrls.map((u) => purge(PURGE_WILDCARD_URL, [u]))
    const purgedExactUrls = exactUrls.map((u) => purge(PURGE_URL, [u]))

    await Promise.all([...purgedWildcards, ...purgedExactUrls])

    console.log('Done')
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

main()
