import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import vue from 'eslint-plugin-vue';
import webkit from '@aziontech/webkit/eslint-plugin';

export default tseslint.config(
	{
		ignores: [
			'dist/**',
			'.astro/**',
			'.edge/**',
			'node_modules/**',
			'.github/**',
			'.changeset/**',
		],
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
