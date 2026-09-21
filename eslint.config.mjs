import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import vue from 'eslint-plugin-vue';
import webkit from '@aziontech/webkit/eslint-plugin';
import * as mdxPlugin from 'eslint-plugin-mdx';
import mdxPolicy from './scripts/eslint-rules/mdx-policy.mjs';

export default tseslint.config(
	{
		ignores: [
			'dist/**',
			'.astro/**',
			'.edge/**',
			'node_modules/**',
			'.github/**',
			'.changeset/**',
			// Claude Code worktrees carry their own build output; linting a stale
			// worktree's dist would count compiled webkit code as our violations.
			'.claude/**',
		],
	},

	{
		linterOptions: {
			// A disable comment that no longer suppresses anything is dead weight —
			// surface it so migrations actually remove their exemptions.
			reportUnusedDisableDirectives: 'error',
		},
	},

	js.configs.recommended,

	{
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: { ...globals.node, ...globals.browser },
		},
	},

	...tseslint.configs.recommended.map((config) => ({
		...config,
		files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
	})),
	{
		files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
		rules: {
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ argsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_' },
			],
			'@typescript-eslint/no-non-null-assertion': 'off',
		},
	},
	{
		files: ['**/*.d.ts'],
		rules: { '@typescript-eslint/triple-slash-reference': 'off' },
	},

	...astro.configs.recommended,
	...vue.configs['flat/recommended'],

	{
		files: ['**/*.vue'],
		languageOptions: {
			parserOptions: {
				parser: tseslint.parser,
				extraFileExtensions: ['.vue'],
			},
		},
		rules: {
			'vue/multi-word-component-names': 'off',
			'vue/html-indent': 'off',
			'vue/html-quotes': 'off',
			'vue/html-self-closing': 'off',
			'vue/html-closing-bracket-newline': 'off',
			'vue/max-attributes-per-line': 'off',
			'vue/singleline-html-element-content-newline': 'off',
		},
	},

	...webkit.configs.recommended,

	// The webkit preset only applies to the extensions in its own FILES list, which does
	// not include `.astro` — so our 41 Astro files fall outside every webkit rule. This
	// block applies the AST-based rules to them until the preset itself covers `.astro`.
	// `no-style-override` is deliberately absent: it needs vue-eslint-parser's template
	// visitor, which astro-eslint-parser does not provide.
	{
		files: ['**/*.astro'],
		plugins: { webkit },
		rules: {
			'webkit/valid-import-path': 'error',
			'webkit/no-deep-internal-import': 'error',
			'webkit/no-barrel-import': 'error',
			'webkit/no-whole-icon-set-import': 'error',
			'webkit/no-hardcoded-color': 'error',
			'webkit/no-hardcoded-motion': 'error',
			'webkit/no-deprecated-component': 'error',
			'webkit/prefer-webkit-component': 'error',
			'webkit/prefer-tree-shakeable-root': 'error',
		},
	},

	// Same gap for `.mdx`: the docs content embeds webkit imports and styled JSX, and the
	// preset's FILES list does not reach it. eslint-mdx parses the file into an ESTree the
	// AST-based rules can walk. `no-style-override` is absent for the same reason as the
	// Astro block above: it needs vue-eslint-parser's template visitor.
	{
		files: ['**/*.mdx'],
		plugins: { webkit, docs: mdxPolicy },
		languageOptions: {
			parser: mdxPlugin.flat.languageOptions.parser,
			globals: { ...globals.browser },
		},
		rules: {
			// The content policy: an MDX page is prose, webkit components and other content —
			// imports come only from the allowlist, and no raw HTML elements.
			'docs/mdx-allowed-imports': 'error',
			'docs/mdx-no-raw-html': 'error',
			'webkit/valid-import-path': 'error',
			'webkit/no-deep-internal-import': 'error',
			'webkit/no-barrel-import': 'error',
			'webkit/no-whole-icon-set-import': 'error',
			'webkit/no-hardcoded-color': 'error',
			'webkit/no-hardcoded-motion': 'error',
			'webkit/no-deprecated-component': 'error',
			'webkit/prefer-webkit-component': 'error',
			'webkit/prefer-tree-shakeable-root': 'error',
			// Core rules misread MDX: imports are "unused" because their uses live in the
			// markdown body, and prose trips the whitespace/escape checks. Only the webkit
			// rules above are what MDX is linted for.
			'no-unused-vars': 'off',
			'no-irregular-whitespace': 'off',
			'no-useless-escape': 'off',
		},
	},

	// The wrapper folder closes the transitive guarantee: MDX may import these wrappers,
	// so the wrappers themselves may only reach vue, webkit and each other.
	{
		files: ['src/components/webkit/**/*.vue'],
		plugins: { docs: mdxPolicy },
		rules: {
			'docs/webkit-wrapper-imports': 'error',
		},
	},

	{
		files: [
			'*.{js,mjs,cjs,ts}',
			'scripts/**',
			'plugins/**',
			'integrations/**',
			'backend/**',
			'cicd/**',
		],
		languageOptions: { globals: globals.node },
	}
);
