import { defineMiddleware } from 'astro/middleware';

import { normalizeCanonicalPath, normalizePathSlashes } from '~/util';

export const onRequest = defineMiddleware((context, next) => {
	const normalizedPathname = context.url.pathname.endsWith('//')
		? normalizeCanonicalPath(context.url.pathname)
		: normalizePathSlashes(context.url.pathname);

	if (normalizedPathname !== context.url.pathname) {
		const redirectURL = new URL(context.url);
		redirectURL.pathname = normalizedPathname;

		return context.redirect(`${redirectURL.pathname}${redirectURL.search}`, 301);
	}

	return next();
});
