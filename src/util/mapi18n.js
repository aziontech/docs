import { getLanguageName } from "~/i18n/translations";
import { getLangFromSlug } from './getPageLang';
import { removeTrailingLeadingSlashs } from './removeSlashs'

export function mapi18n (data, fx = (data) => `/${data.lang}/${removeTrailingLeadingSlashs(data.permalink)}/`) {
  return data.map(({ data }) => ({
    langPrefix: data.lang,
    lang: getLanguageName(data.lang),
    slug: fx(data),
  }))
}

export const mapi18nByNamespace = (collection, namespace, fx) => {
  return collection.filter(({ data }) => data.namespace === namespace)
    .map((page) => {
      const { data, slug, id } = page
      const lang = slug ? getLangFromSlug(slug) : getLangFromSlug(id)
      return {
        langPrefix: lang,
        lang: getLanguageName(lang),
        slug: fx(data, lang),
      }
    });
};
