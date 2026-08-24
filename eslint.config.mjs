import config from '@limbo-works/lint-configs/eslint.config.simple.mjs';
import tsParser from '@typescript-eslint/parser';
import vueParser from 'vue-eslint-parser';

export default [
	...config,
	{
		files: ['**/*.{ts,mts}'],
		languageOptions: {
			parser: tsParser,
		},
	},
	{
		files: ['**/*.vue'],
		languageOptions: {
			parser: vueParser,
			parserOptions: {
				parser: tsParser,
				ecmaVersion: 'latest',
				sourceType: 'module',
				extraFileExtensions: ['.vue'],
			},
		},
	},
];
