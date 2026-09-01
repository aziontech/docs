import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import vue from 'eslint-plugin-vue';
import react from 'eslint-plugin-react';
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
			'**/*.jsx',
		],
	},

	js.configs.recommended,

	{
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: { ...globals.node, ...globals.browser },
		},
		settings: {
			react: { pragma: 'h', version: '16.0' },
		},
	},

	// TypeScript (and the <script> blocks Astro/Vue hand over as .ts).
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

	// Preact components authored as .tsx — typed linting needs the project service.
	{
		files: ['**/*.tsx'],
		plugins: { react },
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			...react.configs.flat.recommended.rules,
			...react.configs.flat['jsx-runtime'].rules,
		},
	},

	...astro.configs.recommended,
	...vue.configs['flat/recommended'],

	// Vue SFCs: the design-system rules from the webkit plugin apply here.
	{
		files: ['**/*.vue'],
		languageOptions: {
			parserOptions: {
				parser: tseslint.parser,
				extraFileExtensions: ['.vue'],
			},
		},
		rules: {
			// Docs components are single-word by convention (Footer.vue, Tag.vue).
			'vue/multi-word-component-names': 'off',
			// Formatting is Prettier's job — these rules only fight it.
			'vue/html-indent': 'off',
			'vue/html-quotes': 'off',
			'vue/html-self-closing': 'off',
			'vue/html-closing-bracket-newline': 'off',
			'vue/max-attributes-per-line': 'off',
			'vue/singleline-html-element-content-newline': 'off',
		},
	},

	...webkit.configs.recommended,

	// Node-only tooling: build scripts, plugins and configs.
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
