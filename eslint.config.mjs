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
