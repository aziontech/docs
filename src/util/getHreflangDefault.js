/**
 *
 * @param  {List} pageLangs [{
      langPrefix: 'en',
      lang: 'English',
      slug: '/en/blog/how-edge-computing-improves-api-security/'
    },
    {
      langPrefix: 'es',
      lang: 'Español',
      slug: '/es/blog/como-edge-computing-mejora-la-seguridad-de-las-api/'
    },
    {
      langPrefix: 'pt-br',
      lang: 'Português',
      slug: '/pt-br/blog/como-edge-computing-melhora-a-seguranca-das-apis/'
    }
  }]
 * @returns {Object} The default hreflang object
 *
 */

	export function getHreflangDefault (pageLangs) {
		return pageLangs?.find((item) => item.langPrefix === 'en') ||
			pageLangs?.find((item) => item.langPrefix === 'pt-br') ||
			pageLangs?.find((item) => item.langPrefix === 'es')
	}
	