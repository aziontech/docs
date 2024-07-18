import { getCollection } from 'astro:content';
import { groupPagesByLang }  from '~/util/groupPagesByLang';
import { removeTrailingLeadingSlashs } from '~/util/removeSlashs';

const paths = {
  collections: 'src/content'
};
const pages = {
  docs: await getCollection('docs', ({ data }) => data.draft !== true)
};
const docsByLang = groupPagesByLang(pages.docs);

export async function getStaticPaths() {
  return ['en', 'pt-br'].map((lang) => ({
    params: {
      lang: lang
    }, props: {
			docs: docsByLang[lang]
    }
  }));
};

export async function GET({ params, props }) {
  const {
    docs
  } = props;

  const docsData = docs.map(({ data: page, collection, id }) => {
    const docsSlug = {
      en: "documentation",
      "pt-br": "documentacao",
    };
    const lang = id.split('/')[0];
    const slug = docsSlug[lang];

    return {
      url: `https://www.azion.com/${params.lang}/${slug}/${removeTrailingLeadingSlashs(page.permalink)}/`,
      filePath: `${paths.collections}/${collection}/${id}`
    };
  });

  const data = [
    ...docsData
  ]

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
