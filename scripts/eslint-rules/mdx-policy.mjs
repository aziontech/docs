// The MDX content policy: a page is prose plus @aziontech/webkit components — nothing else.
//
// Two rules, registered in eslint.config.mjs under the `docs` plugin and applied only to
// `**/*.mdx`. They complement the webkit/* rules (which validate HOW webkit is used);
// these two constrain WHAT an MDX file may reach for at all. The adoption report counts
// both namespaces.

/** Import sources an MDX page may use: direct webkit component subpaths, or a wrapper
 * from the sanctioned wrapper folder — whose own imports docs/webkit-wrapper-imports
 * constrains to webkit, making the guarantee transitive. */
const WEBKIT_IMPORT = /^@aziontech\/webkit\/.+/;
const WRAPPER_IMPORT = /^~\/components\/webkit\/[^/]+\.vue$/;

export const mdxWebkitImportsOnly = {
	meta: {
		type: 'problem',
		docs: {
			description:
				'MDX imports only direct @aziontech/webkit subpaths or ~/components/webkit wrappers',
		},
		schema: [],
		messages: {
			forbidden:
				'MDX content imports only `@aziontech/webkit/<component>` subpaths or `~/components/webkit/<Name>.vue` wrappers; "{{source}}" is neither. Compose the page from prose and webkit components.',
		},
	},
	create(context) {
		return {
			ImportDeclaration(node) {
				const source = node.source.value;
				if (typeof source !== 'string') return;
				if (WEBKIT_IMPORT.test(source) || WRAPPER_IMPORT.test(source)) return;
				context.report({ node: node.source, messageId: 'forbidden', data: { source } });
			},
		};
	},
};

/** What a webkit wrapper (src/components/webkit/*.vue) may import. Anything else means
 * the file is not a wrapper and does not belong in the folder. */
const WRAPPER_ALLOWED = [
	/^vue$/, // the framework
	/^@aziontech\/webkit\/.+/, // the components being wrapped
	/^@aziontech\/icons$/, // the icon font side-effect import
	/^\.\/[^/]+\.vue$/, // a sibling wrapper, relative
	/^~\/components\/webkit\/[^/]+\.vue$/, // a sibling wrapper, aliased
	// The docs search is an Algolia client; the dialog around it is webkit. A functional
	// dependency, not a UI one — the single named exception.
	/^algoliasearch(\/.+)?$/,
];

export const webkitWrapperImports = {
	meta: {
		type: 'problem',
		docs: {
			description:
				'a webkit wrapper imports only vue, @aziontech/webkit/* and sibling wrappers',
		},
		schema: [],
		messages: {
			forbidden:
				'A webkit wrapper imports only `vue`, `@aziontech/webkit/*` and sibling wrappers; "{{source}}" is none of these. If the component needs more, it is not a wrapper — move it out of ~/components/webkit.',
		},
	},
	create(context) {
		return {
			ImportDeclaration(node) {
				// Type-only imports carry no runtime dependency — models from ~/nav/resolve etc.
				if (node.importKind === 'type') return;
				const source = node.source.value;
				if (typeof source !== 'string') return;
				if (WRAPPER_ALLOWED.some((pattern) => pattern.test(source))) return;
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
		'webkit-wrapper-imports': webkitWrapperImports,
	},
};
