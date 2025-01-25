import { getCollection } from 'astro:content'
import { SITE_URL } from '~/consts'
import { groupPagesByLang } from '~/util/groupPagesByLang.ts'
import { removeTrailingLeadingSlashs } from '~/util/removeSlashs'
import { mapi18nByNamespace } from '~/util/mapi18n'
import { getHreflangDefault } from '~/util/getHreflangDefault'

const collections = {
  docs: await getCollection('docs', ({ data }) => data.draft !== true)
};

function getAlternateFromUrl(i18nPages) {
  const data = []
  const xdefault = getHreflangDefault(i18nPages)

  i18nPages.forEach((item) => {
    if(item.langPrefix === 'pt-br') {
      data.push({
        href: `${SITE_URL}/${removeTrailingLeadingSlashs(item.slug)}/`,
        hreflang: 'pt'
      })
    }

    data.push({
      href: `${SITE_URL}/${removeTrailingLeadingSlashs(item.slug)}/`,
      hreflang: item.langPrefix
    })
  })

  data.push({
    href: `${SITE_URL}/${removeTrailingLeadingSlashs(xdefault.slug)}/`,
    hreflang: 'x-default'
  })

  return data
}

function getCanonicalCollectionData(collectionName, collectionPages, lang) {
  const pagesGroupedByLang = groupPagesByLang(collectionPages)
  const pagesByLang = pagesGroupedByLang[lang]

  return pagesByLang.map(({ data: page }) => {
    const permalink = `/${removeTrailingLeadingSlashs(page.permalink)}/`
    const namespace = page.namespace
    const mapi18nPages = {
      docs: () =>
        mapi18nByNamespace(collectionPages, namespace, (data, lang) =>
          `/${lang}/${removeTrailingLeadingSlashs(data.permalink)}/`),
    }
		
		return {
      canonical: `${SITE_URL}/${lang}/${removeTrailingLeadingSlashs(permalink)}/`,
      alternate: getAlternateFromUrl(mapi18nPages[collectionName]())
    }
  });
};

export async function getStaticPaths() {
  return ['en', 'pt-br'].map((lang) => ({
    params: {
      lang: lang
    },
    props: {
      docs: collections.docs
    }
  }))
}

export async function GET({ params, props }) {
  const lang = params.lang
  return new Response(JSON.stringify([
    ...getCanonicalCollectionData('docs', props.docs, lang),
  ]), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
