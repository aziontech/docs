// The MDX content policy: a page is prose plus @aziontech/webkit components — nothing else.
//
// Two rules, registered in eslint.config.mjs under the `docs` plugin and applied only to
// `**/*.mdx`. They complement the webkit/* rules (which validate HOW webkit is used);
// these two constrain WHAT an MDX file may reach for at all. The adoption report counts
// both namespaces.

/** Import sources an MDX page may use: direct webkit component subpaths only. */
const WEBKIT_IMPORT = /^@aziontech\/webkit\/.+/;

export const mdxWebkitImportsOnly = {
	meta: {
		type: 'problem',
		docs: {
			description: 'MDX imports only direct @aziontech/webkit component subpaths',
		},
		schema: [],
		messages: {
			forbidden:
				'MDX content imports only direct `@aziontech/webkit/<component>` subpaths; "{{source}}" is not one. Compose the page from prose and webkit components.',
		},
	},
	create(context) {
		return {
			ImportDeclaration(node) {
				const source = node.source.value;
				if (typeof source !== 'string' || WEBKIT_IMPORT.test(source)) return;
				context.report({ node: node.source, messageId: 'forbidden', data: { source } });
			},
		};
	},
};

export const mdxNoRawHtml = {
	meta: {
		type: 'problem',
		docs: {
			description: 'no raw HTML elements in MDX — prose or a webkit component',
		},
		schema: [],
		messages: {
			rawHtml:
				'Raw <{{tag}}> in MDX. Write it as markdown prose, or use the webkit component that owns this role.',
		},
	},
	create(context) {
		return {
			JSXOpeningElement(node) {
				// A lowercase JSXIdentifier is a raw HTML element; components are capitalized,
				// and member expressions (Table.Row) or namespaced names are components too.
				if (node.name.type !== 'JSXIdentifier') return;
				const tag = node.name.name;
				if (!/^[a-z]/.test(tag)) return;
				context.report({ node: node.name, messageId: 'rawHtml', data: { tag } });
			},
		};
	},
};

export default {
	rules: {
		'mdx-webkit-imports-only': mdxWebkitImportsOnly,
		'mdx-no-raw-html': mdxNoRawHtml,
	},
};
