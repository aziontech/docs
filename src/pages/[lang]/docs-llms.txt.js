import { getCollection } from 'astro:content'
// import getLangs from '~/util/getLangs'
import { groupPagesByLang } from '~/util/groupPagesByLang'
import { removeTrailingLeadingSlashs } from '~/util/removeSlashs'
import { SITE_URL } from '~/consts'

function buildLinks(collection, lang) {
  let content = ''
  for (const page of collection[lang]) {
    const permalink = removeTrailingLeadingSlashs(page.data.permalink)
    const link = `- [${page.data.title.trim()}](${SITE_URL}/${lang}/${permalink}.md)`
    content += link.replace('/.md', '.md') + '\n\n'
  }
  return content
}

export async function getStaticPaths() {
  let docs = await getCollection('docs')

  return ['en', 'pt-br'].map((lang) => {
    return {
      params: {
        lang: lang
      },
      props: {
        docs: groupPagesByLang(docs)
      }
    }
  })
}

export async function GET({ params, props }) {
  let content = ''
  const { lang } = params
  const { docs } = props

  content += `## DOCUMENTATION\n\n${buildLinks(docs, lang)}\n\n\n\n`

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8'
    }
  })
}
